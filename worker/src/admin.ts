interface AdminEnv { DB: D1Database; NORDA_ADMIN_SETUP_TOKEN?: string; }

const adminJson = (data: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

const clean = (value: unknown, max = 3000) => typeof value === "string" ? value.trim().slice(0, max) : "";
const nowIso = () => new Date().toISOString();

async function bodyOf(request: Request): Promise<Record<string, unknown>> {
  try {
    const value = await request.json();
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  } catch { return {}; }
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}
async function sha256(value: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, "0")).join("");
}
async function passwordHash(password: string, saltHex: string) {
  const salt = Uint8Array.from(saltHex.match(/.{2}/g) || [], x => parseInt(x, 16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 }, key, 256);
  return Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, "0")).join("");
}
async function adminSession(request: Request, env: AdminEnv) {
  const token = (request.headers.get("authorization") || "").replace(/^Bearer /i, "");
  if (!/^[a-f0-9]{64}$/i.test(token)) return null;
  const hash = await sha256(token);
  return env.DB.prepare("SELECT u.id,u.username,u.role,s.id AS session_id FROM norda_admin_sessions s JOIN norda_admin_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND s.revoked_at IS NULL AND u.disabled_at IS NULL LIMIT 1")
    .bind(hash, nowIso()).first<{id:string;username:string;role:string;session_id:string}>();
}
async function audit(env: AdminEnv, userId: string, action: string, resource: string, resourceId: string | null = null) {
  await env.DB.prepare("INSERT INTO norda_admin_audit_log(user_id,action,resource,resource_id,created_at) VALUES(?,?,?,?,?)")
    .bind(userId, action, resource, resourceId, nowIso()).run();
}
function pageParams(url: URL) {
  const page = Math.max(1, Math.min(10000, Number(url.searchParams.get("page") || 1)));
  const perPage = Math.max(1, Math.min(100, Number(url.searchParams.get("perPage") || 25)));
  return { page, perPage, offset: (page - 1) * perPage };
}
function orderClause(url: URL, allowed: Record<string, string>, fallback: string) {
  const field = allowed[url.searchParams.get("sort") || ""] || fallback;
  const direction = url.searchParams.get("order")?.toLowerCase() === "asc" ? "ASC" : "DESC";
  return field + " " + direction;
}
function jsonArray(value: unknown) {
  try { const parsed = JSON.parse(String(value || "[]")); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
}

export async function handleAdminApi(request: Request, env: AdminEnv): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method.toUpperCase();
  if (!path.startsWith("/admin/") && path !== "/products/public") return null;

  if (method === "GET" && path === "/products/public") {
    const rows = await env.DB.prepare("SELECT id,type,name,tagline,price,category,image,tags_json,description,includes_json,featured,status,subscription,interval FROM norda_products WHERE status != 'archived' ORDER BY name").all<Record<string, unknown>>();
    return adminJson({ ok: true, products: (rows.results || []).map(p => ({ ...p, tags: jsonArray(p.tags_json), includes: jsonArray(p.includes_json), featured: Boolean(p.featured), subscription: Boolean(p.subscription) })) });
  }

  if (method === "POST" && path === "/admin/auth/setup") {
    const setup = await env.DB.prepare("SELECT COUNT(*) AS count FROM norda_admin_users").first<{count:number}>();
    if (Number(setup?.count || 0) > 0) return adminJson({ error: "setup_already_completed" }, 409);
    const body = await bodyOf(request);
    const supplied = clean(body.setupToken, 256);
    if (!env.NORDA_ADMIN_SETUP_TOKEN || supplied.length < 20 || supplied !== env.NORDA_ADMIN_SETUP_TOKEN) return adminJson({ error: "invalid_setup_token" }, 403);
    const username = clean(body.username, 40);
    const password = clean(body.password, 200);
    if (!/^[A-Za-z0-9._-]{3,40}$/.test(username) || password.length < 12) return adminJson({ error: "username_or_password_policy" }, 400);
    const id = crypto.randomUUID(), salt = randomToken().slice(0, 32), stamp = nowIso();
    const hash = await passwordHash(password, salt);
    await env.DB.prepare("INSERT INTO norda_admin_users(id,username,password_hash,password_salt,role,created_at,updated_at) VALUES(?,?,?,?,'owner',?,?)")
      .bind(id, username, hash, salt, stamp, stamp).run();
    await audit(env, id, "create_owner", "admin_user", id);
    return adminJson({ ok: true, created: true }, 201);
  }

  if (method === "POST" && path === "/admin/auth/login") {
    const body = await bodyOf(request);
    const username = clean(body.username, 40), password = clean(body.password, 200);
    const user = await env.DB.prepare("SELECT id,username,password_hash,password_salt,role FROM norda_admin_users WHERE username=? COLLATE NOCASE AND disabled_at IS NULL LIMIT 1")
      .bind(username).first<{id:string;username:string;password_hash:string;password_salt:string;role:string}>();
    if (!user || !password) return adminJson({ error: "invalid_credentials" }, 401);
    const candidate = await passwordHash(password, user.password_salt);
    if (candidate !== user.password_hash) return adminJson({ error: "invalid_credentials" }, 401);
    const token = randomToken(), stamp = nowIso(), expires = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
    await env.DB.prepare("INSERT INTO norda_admin_sessions(id,user_id,token_hash,created_at,expires_at) VALUES(?,?,?,?,?)")
      .bind(crypto.randomUUID(), user.id, await sha256(token), stamp, expires).run();
    await audit(env, user.id, "login", "session");
    return adminJson({ token, expiresAt: expires, user: { id: user.id, username: user.username, role: user.role } });
  }

  if (path.startsWith("/admin/auth/")) {
    const session = await adminSession(request, env);
    if (!session) return adminJson({ error: "unauthorized" }, 401);
    if (method === "GET" && path === "/admin/auth/me") return adminJson({ user: { id: session.id, username: session.username, role: session.role } });
    if (method === "POST" && path === "/admin/auth/logout") {
      await env.DB.prepare("UPDATE norda_admin_sessions SET revoked_at=? WHERE id=?").bind(nowIso(), session.session_id).run();
      return adminJson({ ok: true });
    }
  }

  if (!path.startsWith("/admin/")) return null;
  const session = await adminSession(request, env);
  if (!session) return adminJson({ error: "unauthorized" }, 401);

  const productDetail = path.match(/^\/admin\/products\/([^/]+)$/);
  if (method === "GET" && productDetail) {
    const id = decodeURIComponent(productDetail[1]);
    const row = await env.DB.prepare("SELECT * FROM norda_products WHERE id=?").bind(id).first<Record<string,unknown>>();
    if (!row) return adminJson({error:"not_found"},404);
    return adminJson({data:{...row,tags:jsonArray(row.tags_json),includes:jsonArray(row.includes_json),featured:Boolean(row.featured),subscription:Boolean(row.subscription)}});
  }
  if (method === "GET" && path === "/admin/products") {
    const {page,perPage,offset}=pageParams(url), q=clean(url.searchParams.get("q"),100);
    const where=q ? "WHERE name LIKE ? OR id LIKE ?" : "";
    const binds=q ? [`%${q}%`,`%${q}%`] : [];
    const order=orderClause(url,{id:"id",name:"name",type:"type",price:"price",category:"category",status:"status",updated_at:"updated_at"},"updated_at");
    const rows=await env.DB.prepare(`SELECT * FROM norda_products ${where} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...binds,perPage,offset).all<Record<string,unknown>>();
    const count=await env.DB.prepare(`SELECT COUNT(*) AS total FROM norda_products ${where}`).bind(...binds).first<{total:number}>();
    const data=(rows.results||[]).map(p=>({...p,tags:jsonArray(p.tags_json),includes:jsonArray(p.includes_json),featured:Boolean(p.featured),subscription:Boolean(p.subscription)}));
    return adminJson({data,total:Number(count?.total||0)});
  }
  if (method === "POST" && path === "/admin/products") {
    const b=await bodyOf(request), id=clean(b.id,80)||crypto.randomUUID(), name=clean(b.name,120), type=clean(b.type,20);
    const price=Number(b.price);
    if(!name||!["template","digital"].includes(type)||!Number.isFinite(price)||price<0) return adminJson({error:"invalid_product"},400);
    await env.DB.prepare("INSERT INTO norda_products(id,type,name,tagline,price,category,image,tags_json,description,includes_json,featured,status,subscription,interval,updated_at,updated_by) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET type=excluded.type,name=excluded.name,tagline=excluded.tagline,price=excluded.price,category=excluded.category,image=excluded.image,tags_json=excluded.tags_json,description=excluded.description,includes_json=excluded.includes_json,featured=excluded.featured,status=excluded.status,subscription=excluded.subscription,interval=excluded.interval,updated_at=excluded.updated_at,updated_by=excluded.updated_by")
      .bind(id,type,name,clean(b.tagline,240),price,clean(b.category,80),clean(b.image,1000),JSON.stringify(Array.isArray(b.tags)?b.tags:[]),clean(b.description,4000),JSON.stringify(Array.isArray(b.includes)?b.includes:[]),b.featured?1:0,clean(b.status,30)||"active",b.subscription?1:0,clean(b.interval,20)||"month",nowIso(),session.id).run();
    await audit(env,session.id,"upsert","product",id);
    const row=await env.DB.prepare("SELECT * FROM norda_products WHERE id=?").bind(id).first<Record<string,unknown>>();
    return adminJson({data:row},201);
  }
  const productDelete=path.match(/^\/admin\/products\/([^/]+)\/delete$/);
  if(method==="POST"&&productDelete){
    const id=decodeURIComponent(productDelete[1]);
    await env.DB.prepare("UPDATE norda_products SET status='archived',updated_at=?,updated_by=? WHERE id=?").bind(nowIso(),session.id,id).run();
    await audit(env,session.id,"archive","product",id);
    return adminJson({data:{id}});
  }
  const productUpdate=path.match(/^\/admin\/products\/([^/]+)$/);
  if(method==="POST"&&productUpdate){
    const id=decodeURIComponent(productUpdate[1]), b=await bodyOf(request);
    const current=await env.DB.prepare("SELECT * FROM norda_products WHERE id=?").bind(id).first<Record<string,unknown>>();
    if(!current)return adminJson({error:"not_found"},404);
    const merged: Record<string, unknown> = {...current,...b,id};
    const type=clean(merged.type,20),name=clean(merged.name,120),price=Number(merged.price);
    if(!name||!["template","digital"].includes(type)||!Number.isFinite(price)||price<0)return adminJson({error:"invalid_product"},400);
    await env.DB.prepare("UPDATE norda_products SET type=?,name=?,tagline=?,price=?,category=?,image=?,tags_json=?,description=?,includes_json=?,featured=?,status=?,subscription=?,interval=?,updated_at=?,updated_by=? WHERE id=?")
      .bind(type,name,clean(merged.tagline,240),price,clean(merged.category,80),clean(merged.image,1000),JSON.stringify(Array.isArray(merged.tags)?merged.tags:jsonArray(current.tags_json)),clean(merged.description,4000),JSON.stringify(Array.isArray(merged.includes)?merged.includes:jsonArray(current.includes_json)),merged.featured?1:0,clean(merged.status,30)||"active",merged.subscription?1:0,clean(merged.interval,20)||"month",nowIso(),session.id,id).run();
    await audit(env,session.id,"update","product",id);
    const row=await env.DB.prepare("SELECT * FROM norda_products WHERE id=?").bind(id).first<Record<string,unknown>>();
    return adminJson({data:row});
  }
  if(method==="GET"&&path==="/admin/inquiries"){
    const {perPage,offset}=pageParams(url), q=clean(url.searchParams.get("q"),120);
    const where=q ? "WHERE name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?" : "";
    const binds=q ? [`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`] : [];
    const order=orderClause(url,{id:"id",name:"name",email:"email",subject:"subject",created_at:"created_at",delivery_status:"delivery_status"},"created_at");
    const rows=await env.DB.prepare(`SELECT id,name,email,subject,message,created_at,delivery_status FROM contact_submissions ${where} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...binds,perPage,offset).all<Record<string,unknown>>();
    const count=await env.DB.prepare(`SELECT COUNT(*) AS total FROM contact_submissions ${where}`).bind(...binds).first<{total:number}>();
    return adminJson({data:rows.results||[],total:Number(count?.total||0)});
  }
  const ticketMessages = path.match(/^\\/admin\\/tickets\\/([^/]+)\\/messages$/);
  if (method === "GET" && ticketMessages) {
    const publicId = decodeURIComponent(ticketMessages[1]);
    const ticket = await env.DB.prepare("SELECT id FROM tickets WHERE public_id=? LIMIT 1").bind(publicId).first<{id:number}>();
    if (!ticket) return adminJson({error:"not_found"},404);
    const rows = await env.DB.prepare("SELECT id,sender_type,message_text,created_at FROM messages WHERE ticket_id=? ORDER BY id ASC")
      .bind(ticket.id).all<Record<string,unknown>>();
    return adminJson({data:rows.results||[]});
  }
  const ticketReply = path.match(/^\\/admin\\/tickets\\/([^/]+)\\/reply$/);
  if (method === "POST" && ticketReply) {
    const publicId = decodeURIComponent(ticketReply[1]);
    const message = clean((await bodyOf(request)).message,4000);
    if (!message) return adminJson({error:"message_required"},400);
    const ticket = await env.DB.prepare("SELECT id,status FROM tickets WHERE public_id=? LIMIT 1")
      .bind(publicId).first<{id:number;status:string}>();
    if (!ticket) return adminJson({error:"not_found"},404);
    if (ticket.status !== "open") return adminJson({error:"ticket_closed"},409);
    const stamp = nowIso();
    await env.DB.batch([
      env.DB.prepare("UPDATE tickets SET support_mode='human',handoff_status='sent' WHERE id=? AND status='open'").bind(ticket.id),
      env.DB.prepare("INSERT INTO messages(ticket_id,sender_type,message_text,created_at) SELECT id,'admin',?,? FROM tickets WHERE id=? AND status='open' AND support_mode='human'").bind(message,stamp,ticket.id)
    ]);
    await audit(env,session.id,"reply","ticket",publicId);
    const rows = await env.DB.prepare("SELECT id,sender_type,message_text,created_at FROM messages WHERE ticket_id=? ORDER BY id ASC")
      .bind(ticket.id).all<Record<string,unknown>>();
    return adminJson({ok:true,support_mode:"human",data:rows.results||[]});
  }
  const ticketClose = path.match(/^\\/admin\\/tickets\\/([^/]+)\\/close$/);
  if (method === "POST" && ticketClose) {
    const publicId = decodeURIComponent(ticketClose[1]);
    const ticket = await env.DB.prepare("SELECT id,status FROM tickets WHERE public_id=? LIMIT 1")
      .bind(publicId).first<{id:number;status:string}>();
    if (!ticket) return adminJson({error:"not_found"},404);
    if (ticket.status === "open") {
      await env.DB.prepare("UPDATE tickets SET status='closed',closed_at=? WHERE id=? AND status='open'")
        .bind(nowIso(),ticket.id).run();
      await audit(env,session.id,"close","ticket",publicId);
    }
    return adminJson({ok:true,id:publicId,status:"closed"});
  }
  const ticketDetail = path.match(/^\\/admin\\/tickets\\/([^/]+)$/);
  if (method === "GET" && ticketDetail) {
    const publicId = decodeURIComponent(ticketDetail[1]);
    const row = await env.DB.prepare("SELECT public_id AS id,public_id,user_name,status,support_mode,handoff_status,created_at,closed_at FROM tickets WHERE public_id=? LIMIT 1")
      .bind(publicId).first<Record<string,unknown>>();
    return row ? adminJson({data:row}) : adminJson({error:"not_found"},404);
  }
  if(method==="GET"&&path==="/admin/tickets"){
    const {perPage,offset}=pageParams(url), q=clean(url.searchParams.get("q"),120);
    const where=q ? "WHERE public_id LIKE ? OR user_name LIKE ? OR status LIKE ? OR support_mode LIKE ?" : "";
    const binds=q ? [`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`] : [];
    const order=orderClause(url,{id:"public_id",public_id:"public_id",user_name:"user_name",status:"status",support_mode:"support_mode",created_at:"created_at",closed_at:"closed_at"},"created_at");
    const rows=await env.DB.prepare(`SELECT public_id AS id,public_id,user_name,status,support_mode,handoff_status,created_at,closed_at FROM tickets ${where} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...binds,perPage,offset).all<Record<string,unknown>>();
    const count=await env.DB.prepare(`SELECT COUNT(*) AS total FROM tickets ${where}`).bind(...binds).first<{total:number}>();
    return adminJson({data:rows.results||[],total:Number(count?.total||0)});
  }
  if(method==="GET"&&path==="/admin/activity"){
    const {perPage,offset}=pageParams(url), q=clean(url.searchParams.get("q"),120);
    const where=q ? "WHERE u.username LIKE ? OR l.action LIKE ? OR l.resource LIKE ? OR l.resource_id LIKE ?" : "";
    const binds=q ? [`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`] : [];
    const order=orderClause(url,{id:"l.id",username:"u.username",action:"l.action",resource:"l.resource",resource_id:"l.resource_id",created_at:"l.created_at"},"l.id");
    const rows=await env.DB.prepare(`SELECT l.id,l.user_id,u.username,l.action,l.resource,l.resource_id,l.created_at FROM norda_admin_audit_log l LEFT JOIN norda_admin_users u ON u.id=l.user_id ${where} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...binds,perPage,offset).all<Record<string,unknown>>();
    const count=await env.DB.prepare(`SELECT COUNT(*) AS total FROM norda_admin_audit_log l LEFT JOIN norda_admin_users u ON u.id=l.user_id ${where}`).bind(...binds).first<{total:number}>();
    return adminJson({data:rows.results||[],total:Number(count?.total||0)});
  }

  const customerDetail = path.match(/^\/admin\/customers\/([^/]+)$/);
  if (method === "GET" && customerDetail) {
    const id = decodeURIComponent(customerDetail[1]);
    const row = await env.DB.prepare("SELECT * FROM norda_customers WHERE id=? AND archived_at IS NULL").bind(id).first<Record<string,unknown>>();
    return row ? adminJson({data:row}) : adminJson({error:"not_found"},404);
  }
  if (method === "GET" && path === "/admin/customers") {
    const {perPage,offset}=pageParams(url), q=clean(url.searchParams.get("q"),120);
    const where=q ? "WHERE archived_at IS NULL AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ? OR country LIKE ?)" : "WHERE archived_at IS NULL";
    const binds=q ? Array(5).fill(`%${q}%`) : [];
    const order=orderClause(url,{id:"id",name:"name",email:"email",phone:"phone",company:"company",country:"country",created_at:"created_at",updated_at:"updated_at"},"created_at");
    const rows=await env.DB.prepare(`SELECT * FROM norda_customers ${where} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...binds,perPage,offset).all<Record<string,unknown>>();
    const count=await env.DB.prepare(`SELECT COUNT(*) AS total FROM norda_customers ${where}`).bind(...binds).first<{total:number}>();
    return adminJson({data:rows.results||[],total:Number(count?.total||0)});
  }
  if (method === "POST" && path === "/admin/customers") {
    const b=await bodyOf(request), id=crypto.randomUUID(), name=clean(b.name,160);
    if(!name) return adminJson({error:"customer_name_required"},400);
    const stamp=nowIso();
    await env.DB.prepare("INSERT INTO norda_customers(id,name,email,phone,company,country,source,notes,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)")
      .bind(id,name,clean(b.email,180),clean(b.phone,60),clean(b.company,160),clean(b.country,100),clean(b.source,80)||"manual",clean(b.notes,4000),stamp,stamp).run();
    await audit(env,session.id,"create","customer",id);
    const row=await env.DB.prepare("SELECT * FROM norda_customers WHERE id=?").bind(id).first<Record<string,unknown>>();
    return adminJson({data:row},201);
  }
  const customerUpdate=path.match(/^\/admin\/customers\/([^/]+)$/);
  if(method==="POST"&&customerUpdate){
    const id=decodeURIComponent(customerUpdate[1]),b=await bodyOf(request);
    const current=await env.DB.prepare("SELECT * FROM norda_customers WHERE id=? AND archived_at IS NULL").bind(id).first<Record<string,unknown>>();
    if(!current)return adminJson({error:"not_found"},404);
    const merged={...current,...b},name=clean(merged.name,160);
    if(!name)return adminJson({error:"customer_name_required"},400);
    await env.DB.prepare("UPDATE norda_customers SET name=?,email=?,phone=?,company=?,country=?,source=?,notes=?,updated_at=? WHERE id=?")
      .bind(name,clean(merged.email,180),clean(merged.phone,60),clean(merged.company,160),clean(merged.country,100),clean(merged.source,80)||"manual",clean(merged.notes,4000),nowIso(),id).run();
    await audit(env,session.id,"update","customer",id);
    const row=await env.DB.prepare("SELECT * FROM norda_customers WHERE id=?").bind(id).first<Record<string,unknown>>();
    return adminJson({data:row});
  }
  const customerArchive=path.match(/^\/admin\/customers\/([^/]+)\/delete$/);
  if(method==="POST"&&customerArchive){
    const id=decodeURIComponent(customerArchive[1]);
    await env.DB.prepare("UPDATE norda_customers SET archived_at=?,updated_at=? WHERE id=? AND archived_at IS NULL").bind(nowIso(),nowIso(),id).run();
    await audit(env,session.id,"archive","customer",id);
    return adminJson({data:{id}});
  }

  const orderDetail=path.match(/^\/admin\/orders\/([^/]+)$/);
  if(method==="GET"&&orderDetail){
    const id=decodeURIComponent(orderDetail[1]);
    const row=await env.DB.prepare("SELECT o.*,c.name AS customer_name,c.email AS customer_email FROM norda_orders o JOIN norda_customers c ON c.id=o.customer_id WHERE o.id=?").bind(id).first<Record<string,unknown>>();
    return row?adminJson({data:row}):adminJson({error:"not_found"},404);
  }
  if(method==="GET"&&path==="/admin/orders"){
    const {perPage,offset}=pageParams(url),q=clean(url.searchParams.get("q"),120);
    const where=q?"WHERE o.order_number LIKE ? OR c.name LIKE ? OR c.email LIKE ? OR o.product_name LIKE ? OR o.status LIKE ? OR o.payment_status LIKE ?":"";
    const binds=q?Array(6).fill(`%${q}%`):[];
    const order=orderClause(url,{id:"o.id",order_number:"o.order_number",customer_name:"c.name",product_name:"o.product_name",total_amount:"o.total_amount",status:"o.status",payment_status:"o.payment_status",created_at:"o.created_at"},"o.created_at");
    const rows=await env.DB.prepare(`SELECT o.*,c.name AS customer_name,c.email AS customer_email FROM norda_orders o JOIN norda_customers c ON c.id=o.customer_id ${where} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...binds,perPage,offset).all<Record<string,unknown>>();
    const count=await env.DB.prepare(`SELECT COUNT(*) AS total FROM norda_orders o JOIN norda_customers c ON c.id=o.customer_id ${where}`).bind(...binds).first<{total:number}>();
    return adminJson({data:rows.results||[],total:Number(count?.total||0)});
  }
  if(method==="POST"&&path==="/admin/orders"){
    const b=await bodyOf(request),customerId=clean(b.customer_id,80),productId=clean(b.product_id,80)||null;
    const customer=await env.DB.prepare("SELECT id FROM norda_customers WHERE id=? AND archived_at IS NULL").bind(customerId).first();
    if(!customer)return adminJson({error:"valid_customer_required"},400);
    const product=productId?await env.DB.prepare("SELECT id,name,price FROM norda_products WHERE id=? AND status!='archived'").bind(productId).first<{id:string;name:string;price:number}>():null;
    if(productId&&!product)return adminJson({error:"product_not_found"},400);
    const quantity=Math.max(1,Math.min(10000,Math.floor(Number(b.quantity)||1)));
    const unitPrice=Number(b.unit_price??product?.price??0),currency=clean(b.currency,3)||"EUR";
    const status=clean(b.status,30)||"pending",payment=clean(b.payment_status,30)||"unpaid";
    if(!Number.isFinite(unitPrice)||unitPrice<0||!["EUR","USD","DZD"].includes(currency)||!["draft","pending","confirmed","in_progress","completed","cancelled"].includes(status)||!["unpaid","pending","paid","refunded"].includes(payment))return adminJson({error:"invalid_order"},400);
    const id=crypto.randomUUID(),stamp=nowIso(),orderNumber="ND-"+Date.now().toString(36).toUpperCase()+"-"+crypto.randomUUID().slice(0,5).toUpperCase();
    const productName=clean(b.product_name,180)||product?.name||"Custom service";
    await env.DB.prepare("INSERT INTO norda_orders(id,order_number,customer_id,product_id,product_name,quantity,unit_price,currency,total_amount,status,payment_status,payment_method,notes,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
      .bind(id,orderNumber,customerId,productId,productName,quantity,unitPrice,currency,quantity*unitPrice,status,payment,clean(b.payment_method,100),clean(b.notes,4000),stamp,stamp).run();
    await audit(env,session.id,"create","order",id);
    const row=await env.DB.prepare("SELECT o.*,c.name AS customer_name,c.email AS customer_email FROM norda_orders o JOIN norda_customers c ON c.id=o.customer_id WHERE o.id=?").bind(id).first<Record<string,unknown>>();
    return adminJson({data:row},201);
  }
  if(method==="POST"&&orderDetail){
    const id=decodeURIComponent(orderDetail[1]),b=await bodyOf(request);
    const current=await env.DB.prepare("SELECT * FROM norda_orders WHERE id=?").bind(id).first<Record<string,unknown>>();
    if(!current)return adminJson({error:"not_found"},404);
    const merged={...current,...b},customerId=clean(merged.customer_id,80),productId=clean(merged.product_id,80)||null;
    const customer=await env.DB.prepare("SELECT id FROM norda_customers WHERE id=? AND archived_at IS NULL").bind(customerId).first();
    if(!customer)return adminJson({error:"valid_customer_required"},400);
    const product=productId?await env.DB.prepare("SELECT id,name,price FROM norda_products WHERE id=? AND status!='archived'").bind(productId).first<{id:string;name:string;price:number}>():null;
    if(productId&&!product)return adminJson({error:"product_not_found"},400);
    const quantity=Math.max(1,Math.min(10000,Math.floor(Number(merged.quantity)||1)));
    const unitPrice=Number(merged.unit_price??0),currency=clean(merged.currency,3)||"EUR";
    const status=clean(merged.status,30),payment=clean(merged.payment_status,30);
    if(!Number.isFinite(unitPrice)||unitPrice<0||!["EUR","USD","DZD"].includes(currency)||!["draft","pending","confirmed","in_progress","completed","cancelled"].includes(status)||!["unpaid","pending","paid","refunded"].includes(payment))return adminJson({error:"invalid_order"},400);
    const productName=clean(merged.product_name,180)||product?.name||"Custom service";
    await env.DB.prepare("UPDATE norda_orders SET customer_id=?,product_id=?,product_name=?,quantity=?,unit_price=?,currency=?,total_amount=?,status=?,payment_status=?,payment_method=?,notes=?,updated_at=? WHERE id=?")
      .bind(customerId,productId,productName,quantity,unitPrice,currency,quantity*unitPrice,status,payment,clean(merged.payment_method,100),clean(merged.notes,4000),nowIso(),id).run();
    await audit(env,session.id,"update","order",id);
    const row=await env.DB.prepare("SELECT o.*,c.name AS customer_name,c.email AS customer_email FROM norda_orders o JOIN norda_customers c ON c.id=o.customer_id WHERE o.id=?").bind(id).first<Record<string,unknown>>();
    return adminJson({data:row});
  }
  return adminJson({error:"not_found"},404);
}
