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
    const rows=await env.DB.prepare(`SELECT * FROM norda_products ${where} ORDER BY updated_at DESC LIMIT ? OFFSET ?`).bind(...binds,perPage,offset).all<Record<string,unknown>>();
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
    const merged={...current,...b,id};
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
  if(method==="GET"&&path==="/admin/tickets"){
    const {perPage,offset}=pageParams(url), q=clean(url.searchParams.get("q"),120);
    const where=q ? "WHERE public_id LIKE ? OR user_name LIKE ? OR status LIKE ? OR support_mode LIKE ?" : "";
    const binds=q ? [`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`] : [];
    const order=orderClause(url,{id:"id",public_id:"public_id",user_name:"user_name",status:"status",support_mode:"support_mode",created_at:"created_at",closed_at:"closed_at"},"created_at");
    const rows=await env.DB.prepare(`SELECT id,public_id,user_name,status,support_mode,handoff_status,created_at,closed_at FROM tickets ${where} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...binds,perPage,offset).all<Record<string,unknown>>();
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
  return adminJson({error:"not_found"},404);
}
