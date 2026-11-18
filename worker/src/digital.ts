interface DigitalEnv { DB: D1Database; GGSOMA_API_KEY?: string; }

const API = "https://ggsoma.store/api/partner/v1";
const json = (data: Record<string, unknown>, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const clean = (v: unknown, max = 500) => typeof v === "string" ? v.trim().slice(0, max) : "";
const stamp = () => new Date().toISOString();

async function partnerFetch(env: DigitalEnv, path: string, init: RequestInit = {}) {
  if (!env.GGSOMA_API_KEY || !env.GGSOMA_API_KEY.startsWith("sk_live_")) throw new Error("ggsoma_api_key_not_configured");
  const headers = new Headers(init.headers);
  headers.set("authorization", `Bearer ${env.GGSOMA_API_KEY}`);
  headers.set("accept", "application/json");
  if (init.body) headers.set("content-type", "application/json");
  const response = await fetch(API + path, { ...init, headers, signal: AbortSignal.timeout(20000) });
  const body = await response.json().catch(() => ({})) as Record<string, any>;
  if (!response.ok || body.ok === false) {
    const error = body.error && typeof body.error === "object" ? body.error : {};
    const e = new Error(clean(error.code, 80) || `partner_http_${response.status}`);
    (e as any).requestId = clean(error.requestId, 100);
    throw e;
  }
  return body;
}

async function deliveryKey(env: DigitalEnv): Promise<CryptoKey> {
  if (!env.GGSOMA_API_KEY) throw new Error("ggsoma_api_key_not_configured");
  const material = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("NORDA-DIGITAL-DELIVERY-V1:" + env.GGSOMA_API_KEY));
  return crypto.subtle.importKey("raw", material, "AES-GCM", false, ["encrypt", "decrypt"]);
}
function b64(bytes: Uint8Array) { let s = ""; for (const b of bytes) s += String.fromCharCode(b); return btoa(s); }
function unb64(value: string) { return Uint8Array.from(atob(value), c => c.charCodeAt(0)); }
async function encryptDelivery(env: DigitalEnv, value: unknown) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(value));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await deliveryKey(env), data);
  return { iv: b64(iv), ciphertext: b64(new Uint8Array(encrypted)) };
}
async function decryptDelivery(env: DigitalEnv, iv: string, ciphertext: string) {
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(iv) }, await deliveryKey(env), unb64(ciphertext));
  return JSON.parse(new TextDecoder().decode(plain));
}
async function hash(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}
function randomToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, "0")).join("");
}

export async function handleDigitalApi(request: Request, env: DigitalEnv): Promise<Response | null> {
  const url = new URL(request.url), path = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method.toUpperCase();
  if (path === "/digital/catalog" && method === "GET") {
    try {
      const remote = await partnerFetch(env, "/catalog/products");
      const products = (Array.isArray(remote.data) ? remote.data : [])
        .filter((p: any) => clean(p.slug, 160) && clean(p.name, 200))
        .map((p: any) => {
          const slug = clean(p.slug, 160);
          const provider = clean(p.provider?.name, 100);
          const stock = p.stock && typeof p.stock === "object" ? p.stock : {};
          const price = Number(p.catalogPrice ?? p.pricing?.catalogPrice ?? p.yourPrice ?? p.pricing?.yourUnitPrice ?? 0);
          const rawCurrency = clean(p.currency, 3).toUpperCase();
          const currency = rawCurrency === "USDT" ? "USD" : rawCurrency || "USD";
          const duration = Number(p.durationDays);
          const deliveryType = clean(p.deliveryType, 40);
          const maxQuantity = Math.max(0, Math.floor(Number(stock.maxQuantity ?? 0)));
          const available = stock.inStock === true && maxQuantity > 0 && Number.isFinite(price) && price > 0;
          return {
            id: slug,
            name: clean(p.name, 200),
            tagline: [provider, Number.isFinite(duration) && duration > 0 ? (duration % 30 === 0 ? (duration / 30) + " month" + (duration / 30 === 1 ? "" : "s") : duration + " days") : ""].filter(Boolean).join(" · "),
            price: Number.isFinite(price) ? price : 0,
            currency,
            category: provider.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "digital",
            image: "",
            icon: clean(p.emoji?.normal, 16) || "✦",
            description: [provider, deliveryType ? "Delivery: " + deliveryType.replace(/_/g, " ") : "", Number.isFinite(duration) && duration > 0 ? "Duration: " + duration + " days" : "", p.warranty?.enabled ? "Warranty: " + Number(p.warranty.days || 0) + " days" : ""].filter(Boolean).join(" · "),
            includes: [deliveryType ? "Delivery: " + deliveryType.replace(/_/g, " ") : "", Number.isFinite(duration) && duration > 0 ? duration + " days" : "", p.warranty?.enabled ? "Warranty: " + Number(p.warranty.days || 0) + " days" : ""].filter(Boolean),
            provider,
            slug,
            deliveryType,
            stock: { inStock: stock.inStock === true, count: Math.max(0, Number(stock.count || 0)) },
            maxQuantity,
            available,
            supplierPrice: Number(p.yourPrice ?? p.pricing?.yourUnitPrice ?? price)
          };
        });
      return json({ ok: true, products });
    } catch (error) {
      console.error("[digital-catalog]", error instanceof Error ? error.message : "request_failed");
      return json({ ok: false, error: "catalog_temporarily_unavailable" }, 503);
    }
  }

  if (path === "/digital/orders" && method === "POST") {
    let body: Record<string, any>;
    if (!request.body) return json({ ok: false, error: "invalid_json" }, 400);
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > 16 * 1024) {
          await reader.cancel();
          return json({ ok: false, error: "payload_too_large" }, 413);
        }
        chunks.push(value);
      }
      const bytes = new Uint8Array(total);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
      }
      const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return json({ ok: false, error: "invalid_json" }, 400);
      body = parsed as Record<string, any>;
    } catch {
      return json({ ok: false, error: "invalid_json" }, 400);
    } finally {
      reader.releaseLock();
    }
    const name = clean(body.name, 100), email = clean(body.email, 180).toLowerCase();
    const productId = clean(body.productId, 160), paymentMethod = clean(body.paymentMethod, 20);
    const quantity = Math.floor(Number(body.quantity || 1));
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !productId || !["paypal", "manual"].includes(paymentMethod) || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) return json({ ok: false, error: "invalid_order_details" }, 400);
    if (paymentMethod === "paypal") return json({ ok: false, error: "paypal_not_configured_for_supplier_products" }, 400);
    let supplierProduct: Record<string, any>;
    try {
      const response = await partnerFetch(env, "/catalog/products/" + encodeURIComponent(productId));
      supplierProduct = response.data && !Array.isArray(response.data) && typeof response.data === "object"
        ? response.data
        : response.product && typeof response.product === "object" ? response.product : response;
    } catch (error) {
      console.error("[digital-order-precheck]", error instanceof Error ? error.message : "request_failed");
      return json({ ok: false, error: "supplier_precheck_unavailable" }, 503);
    }
    const productSlug = clean(supplierProduct.slug, 160) || productId;
    const productName = clean(supplierProduct.name, 200);
    const stock = supplierProduct.stock && typeof supplierProduct.stock === "object" ? supplierProduct.stock : {};
    const maxQuantity = Math.max(0, Math.floor(Number(stock.maxQuantity ?? 0)));
    if (!productName) return json({ ok: false, error: "product_unavailable" }, 404);
    if (stock.inStock !== true || maxQuantity < 1 || quantity > maxQuantity) return json({ ok: false, error: "product_out_of_stock" }, 409);
    const unitPrice = Number(supplierProduct.catalogPrice ?? supplierProduct.pricing?.catalogPrice ?? supplierProduct.yourPrice ?? supplierProduct.pricing?.yourUnitPrice);
    const supplierPrice = Number(supplierProduct.yourPrice ?? supplierProduct.pricing?.yourUnitPrice ?? unitPrice);
    const rawCurrency = clean(supplierProduct.currency, 3).toUpperCase();
    const currency = rawCurrency === "USDT" ? "USD" : rawCurrency || "USD";
    if (!Number.isFinite(unitPrice) || unitPrice <= 0 || !Number.isFinite(supplierPrice) || unitPrice < supplierPrice) return json({ ok: false, error: "invalid_product_price" }, 409);
    const customer = await env.DB.prepare("SELECT id FROM norda_customers WHERE email=? AND archived_at IS NULL ORDER BY created_at DESC LIMIT 1").bind(email).first<{id:string}>();
    const customerId = customer?.id || crypto.randomUUID(), now = stamp();
    if (!customer) await env.DB.prepare("INSERT INTO norda_customers(id,name,email,source,created_at,updated_at) VALUES(?,?,?,'digital-store',?,?)").bind(customerId, name, email, now, now).run();
    const id = crypto.randomUUID(), orderNumber = "ND-" + Date.now().toString(36).toUpperCase() + "-" + crypto.randomUUID().slice(0, 6).toUpperCase();
    const accessToken = randomToken(), accessHash = await hash(accessToken);
    await env.DB.prepare("INSERT INTO norda_orders(id,order_number,customer_id,product_id,product_name,quantity,unit_price,currency,total_amount,status,payment_status,payment_method,notes,created_at,updated_at,digital_access_hash,ggsoma_product_slug) VALUES(?,?,?,NULL,?,?,?,?,?,'pending','pending',?,'Digital Products checkout',?,?,?,?)")
      .bind(id, orderNumber, customerId, productName, quantity, unitPrice, currency, quantity * unitPrice, paymentMethod, now, now, accessHash, productSlug).run();
    return json({ ok: true, orderNumber, accessToken, paymentMethod, paymentUrl: null, total: quantity * unitPrice, currency, message: "Submit your payment, then contact NorDa with this order number for confirmation." }, 201);
  }

  const match = path.match(/^\/digital\/orders\/([A-Za-z0-9-]+)$/);
  if (match && method === "GET") {
    const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (!/^[a-f0-9]{64}$/i.test(token)) return json({ ok: false, error: "unauthorized" }, 401);
    const row = await env.DB.prepare("SELECT o.order_number,o.product_name,o.quantity,o.currency,o.total_amount,o.status,o.payment_status,o.partner_order_code,o.delivery_type,o.delivery_iv,o.delivery_ciphertext,o.partner_status FROM norda_orders o WHERE o.order_number=? AND o.digital_access_hash=? LIMIT 1").bind(match[1], await hash(token)).first<Record<string, any>>();
    if (!row) return json({ ok: false, error: "order_not_found" }, 404);
    let delivery = null;
    if (row.delivery_ciphertext && row.delivery_iv) {
      try { delivery = await decryptDelivery(env, row.delivery_iv, row.delivery_ciphertext); } catch { return json({ ok: false, error: "delivery_temporarily_unavailable" }, 503); }
    }
    return json({ ok: true, order: { orderNumber: row.order_number, product: row.product_name, quantity: row.quantity, currency: row.currency, total: row.total_amount, status: row.status, paymentStatus: row.payment_status, supplierStatus: row.partner_status, supplierOrderCode: row.partner_order_code, deliveryType: row.delivery_type, delivery } });
  }
  return null;
}

export async function fulfillPaidDigitalOrder(env: DigitalEnv, orderId: string): Promise<{ ok: boolean; error?: string }> {
  const row = await env.DB.prepare("SELECT o.id,o.order_number,o.quantity,o.payment_status,o.status,o.partner_order_code,o.ggsoma_product_slug FROM norda_orders o WHERE o.id=? LIMIT 1").bind(orderId).first<Record<string, any>>();
  if (!row) return { ok: false, error: "order_not_found" };
  if (row.payment_status !== "paid") return { ok: false, error: "payment_not_confirmed" };
  if (row.status === "cancelled") return { ok: false, error: "order_cancelled" };
  if (row.partner_order_code) return { ok: true };
  if (!row.ggsoma_product_slug) return { ok: false, error: "not_a_partner_product" };
  try {
    const result = await partnerFetch(env, "/orders", { method: "POST", body: JSON.stringify({ productSlug: row.ggsoma_product_slug, quantity: Number(row.quantity), externalOrderId: row.order_number }) });
    if (!result.orderCode) throw new Error("partner_order_code_missing");
    const encrypted = result.delivery || result.lines ? await encryptDelivery(env, { delivery: result.delivery || null, lines: result.lines || null }) : { iv: "", ciphertext: "" };
    await env.DB.prepare("UPDATE norda_orders SET partner_order_code=?,partner_status=?,delivery_type=?,delivery_iv=?,delivery_ciphertext=?,partner_error='',status='completed',updated_at=? WHERE id=? AND payment_status='paid' AND partner_order_code IS NULL")
      .bind(clean(result.orderCode, 100), clean(result.status, 40), clean(result.deliveryType, 40), encrypted.iv, encrypted.ciphertext, stamp(), orderId).run();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "partner_request_failed";
    await env.DB.prepare("UPDATE norda_orders SET partner_error=?,updated_at=? WHERE id=?").bind(message.slice(0, 120), stamp(), orderId).run();
    console.error("[digital-fulfillment]", { orderId, error: message });
    return { ok: false, error: message };
  }
}
