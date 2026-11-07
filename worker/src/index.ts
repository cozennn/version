import { DurableObject } from "cloudflare:workers";

interface Env {
  DB: D1Database;
  REPLIES: KVNamespace;
  TICKETS: DurableObjectNamespace<TicketsDurableObject>;
  ALLOWED_ORIGINS?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TELEGRAM_WEBHOOK_SECRET?: string;
}

type JsonObject = Record<string, unknown>;

const json = (data: JsonObject, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });

const text = (value: unknown, max = 4000): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

function parseBody(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {};
}

function messageRow(row: Record<string, unknown>) {
  return {
    from: row.sender_type === "visitor" ? "user" : "admin",
    text: String(row.message_text ?? ""),
    time: String(row.created_at ?? ""),
    file: null
  };
}

async function notifyTelegram(env: Env, message: string): Promise<boolean> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false;
  try {
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: message, disable_web_page_preview: true })
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function notifyTicketMessage(env: Env, ticketId: string, userName: string, message: string): Promise<boolean> {
  return notifyTelegram(env, `NORDA Support Ticket\nTicket ID: ${ticketId}\nVisitor: ${userName}\n\n${message}\n\n↩ Reply directly to this message to answer the visitor.`);
}

async function handleTelegramWebhook(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID || !env.TELEGRAM_WEBHOOK_SECRET) {
    return json({ ok: false, error: "telegram_webhook_not_configured" }, 503);
  }
  if (request.headers.get("x-telegram-bot-api-secret-token") !== env.TELEGRAM_WEBHOOK_SECRET) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  const update = parseBody(await request.json().catch(() => ({})));
  const updateId = typeof update.update_id === "number" ? update.update_id : null;
  if (updateId === null) return json({ ok: true, ignored: true });
  const seenKey = `telegram:update:${updateId}`;
  if (await env.REPLIES.get(seenKey)) return json({ ok: true, duplicate: true });

  const message = parseBody(update.message);
  const chat = parseBody(message.chat);
  const sender = parseBody(message.from);
  // Support replies are accepted only from the configured private Telegram account.
  // This deliberately rejects group chats, where other members could reply to tickets.
  if (
    String(chat.id ?? "") !== String(env.TELEGRAM_CHAT_ID) ||
    chat.type !== "private" ||
    String(sender.id ?? "") !== String(env.TELEGRAM_CHAT_ID)
  ) {
    await env.REPLIES.put(seenKey, "ignored", { expirationTtl: 86400 });
    return json({ ok: true, ignored: true });
  }

  const replyTo = parseBody(message.reply_to_message);
  const replySender = parseBody(replyTo.from);
  if (replySender.is_bot !== true) {
    await env.REPLIES.put(seenKey, "ignored", { expirationTtl: 86400 });
    return json({ ok: true, ignored: true, reason: "reply_must_target_bot_notification" });
  }
  const repliedText = text(replyTo.text, 5000);
  const ticketMatch = repliedText.match(/Ticket ID:\s*([0-9a-f-]{20,64})/i);
  const replyText = text(message.text, 4000);
  if (!ticketMatch || !replyText) {
    await env.REPLIES.put(seenKey, "ignored", { expirationTtl: 86400 });
    return json({ ok: true, ignored: true, reason: "reply_to_a_ticket_notification_required" });
  }

  const ticketId = ticketMatch[1];
  const ticket = await env.DB.prepare(
    "SELECT id, public_id FROM tickets WHERE public_id = ? LIMIT 1"
  ).bind(ticketId).first<{ id: number; public_id: string }>();
  if (!ticket) {
    await env.REPLIES.put(seenKey, "ignored", { expirationTtl: 86400 });
    return json({ ok: true, ignored: true, reason: "ticket_not_found" });
  }

  await env.DB.prepare(
    "INSERT INTO messages (ticket_id, sender_type, message_text, created_at) VALUES (?, 'admin', ?, ?)"
  ).bind(ticket.id, replyText, new Date().toISOString()).run();
  await env.REPLIES.put(seenKey, "processed", { expirationTtl: 86400 });
  return json({ ok: true, ticketId });
}

async function ticketOwner(env: Env, ticketId: string, userId: string) {
  return env.DB.prepare(
    "SELECT id, public_id, visitor_id, user_name, status, created_at, closed_at FROM tickets WHERE public_id = ? LIMIT 1"
  ).bind(ticketId).first<Record<string, unknown>>();
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method.toUpperCase();

  if (path === "/telegram/webhook") return handleTelegramWebhook(request, env);

  if (method === "GET" && path === "/health") {
    return json({ ok: true, service: "norda-api", status: "ready" });
  }

  if (method === "POST" && path === "/contact") {
    const body = parseBody(await request.json().catch(() => ({})));
    const name = text(body.name, 100);
    const email = text(body.email, 180);
    const subject = text(body.subject, 180);
    const message = text(body.message, 3000);
    if (text(body.website, 200)) return json({ ok: true });
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || body.privacyConsent !== true) {
      return json({ ok: false, error: "invalid_contact_data" }, 400);
    }
    const sent = await notifyTelegram(env, `NORDA contact\nName: ${name}\nEmail: ${email}\nSubject: ${subject || "No subject"}\n\n${message}`);
    if (!sent) return json({ ok: false, error: "contact_delivery_not_configured" }, 503);
    return json({ ok: true });
  }

  if (method === "POST" && path === "/ticket/new") {
    const body = parseBody(await request.json().catch(() => ({})));
    const userId = text(body.userId, 128);
    const userName = text(body.userName, 100) || "Visitor";
    if (!userId) return json({ ok: false, error: "userId_required" }, 400);

    const existing = await env.DB.prepare(
      "SELECT public_id FROM tickets WHERE visitor_id = ? AND status = 'open' ORDER BY id DESC LIMIT 1"
    ).bind(userId).first<{ public_id: string }>();

    const ticketId = existing?.public_id ?? crypto.randomUUID();
    if (!existing) {
      await env.DB.prepare(
        "INSERT INTO tickets (public_id, visitor_id, user_name, status, created_at) VALUES (?, ?, ?, 'open', ?)"
      ).bind(ticketId, userId, userName, new Date().toISOString()).run();
    }

    const rows = await env.DB.prepare(
      "SELECT sender_type, message_text, created_at FROM messages WHERE ticket_id = (SELECT id FROM tickets WHERE public_id = ?) ORDER BY id ASC"
    ).bind(ticketId).all<Record<string, unknown>>();

    return json({ ok: true, existing: Boolean(existing), ticket: { ticketId, messages: (rows.results ?? []).map(messageRow) } });
  }

  const messageMatch = path.match(/^\/ticket\/([^/]+)\/message$/);
  if (method === "POST" && messageMatch) {
    const ticketId = decodeURIComponent(messageMatch[1]);
    const userId = text(url.searchParams.get("userId"), 128);
    const body = parseBody(await request.json().catch(() => ({})));
    const message = text(body.text, 4000);
    if (!userId || !message) return json({ ok: false, error: "userId_and_text_required" }, 400);
    if (body.file || body.fileName) return json({ ok: false, error: "attachments_not_enabled_until_R2_is_configured" }, 501);

    const ticket = await ticketOwner(env, ticketId, userId);
    if (!ticket || ticket.visitor_id !== userId) return json({ ok: false, error: "ticket_not_found" }, 404);
    if (ticket.status !== "open") return json({ ok: false, error: "ticket_closed" }, 409);

    await env.DB.prepare(
      "INSERT INTO messages (ticket_id, sender_type, message_text, created_at) VALUES (?, 'visitor', ?, ?)"
    ).bind(ticket.id, message, new Date().toISOString()).run();
    const notificationSent = await notifyTicketMessage(env, ticketId, String(ticket.user_name ?? "Visitor"), message);
    return json({ ok: true, notificationSent });
  }

  const messagesMatch = path.match(/^\/ticket\/([^/]+)\/messages$/);
  if (method === "GET" && messagesMatch) {
    const ticketId = decodeURIComponent(messagesMatch[1]);
    const userId = text(url.searchParams.get("userId"), 128);
    if (!userId) return json({ ok: false, error: "userId_required" }, 400);
    const ticket = await ticketOwner(env, ticketId, userId);
    if (!ticket || ticket.visitor_id !== userId) return json({ ok: false, error: "ticket_not_found" }, 404);

    const rows = await env.DB.prepare(
      "SELECT sender_type, message_text, created_at FROM messages WHERE ticket_id = ? ORDER BY id ASC"
    ).bind(ticket.id).all<Record<string, unknown>>();
    return json({ ok: true, ticketId, status: ticket.status, messages: (rows.results ?? []).map(messageRow) });
  }

  const closeMatch = path.match(/^\/ticket\/([^/]+)\/close$/);
  if (method === "POST" && closeMatch) {
    const ticketId = decodeURIComponent(closeMatch[1]);
    const userId = text(url.searchParams.get("userId"), 128);
    const ticket = await ticketOwner(env, ticketId, userId);
    if (!ticket || ticket.visitor_id !== userId) return json({ ok: false, error: "ticket_not_found" }, 404);
    await env.DB.prepare(
      "UPDATE tickets SET status = 'closed', closed_at = ? WHERE id = ? AND status = 'open'"
    ).bind(new Date().toISOString(), ticket.id).run();
    return json({ ok: true });
  }

  if (method === "GET" && path === "/ticket/closed/closed") {
    const userId = text(url.searchParams.get("userId"), 128);
    if (!userId) return json({ ok: false, error: "userId_required" }, 400);
    const rows = await env.DB.prepare(
      "SELECT public_id AS ticketId, user_name AS userName, status, created_at AS createdAt, closed_at AS closedAt FROM tickets WHERE visitor_id = ? AND status = 'closed' ORDER BY id DESC LIMIT 50"
    ).bind(userId).all<Record<string, unknown>>();
    return json({ ok: true, tickets: rows.results ?? [] });
  }



  return json({ ok: false, error: "not_found" }, 404);
}

export class TicketsDurableObject extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const key = `rate:${ip}`;
    const now = Date.now();
    const current = await this.ctx.storage.get<{ start: number; count: number }>(key);
    const windowState = !current || now - current.start > 60_000 ? { start: now, count: 0 } : current;
    if (windowState.count >= 90) return json({ ok: false, error: "rate_limited" }, 429);
    windowState.count += 1;
    await this.ctx.storage.put(key, windowState);
    return handleApi(request, this.env);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("origin") ?? "";
    const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map(value => value.trim()).filter(Boolean);
    const headers = new Headers({
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "content-type, authorization",
      "vary": "Origin"
    });
    if (origin && allowed.includes(origin)) headers.set("access-control-allow-origin", origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (origin && !allowed.includes(origin)) return json({ ok: false, error: "origin_not_allowed" }, 403);

    try {
      const id = env.TICKETS.idFromName("norda-api-global");
      const response = await env.TICKETS.get(id).fetch(request);
      const resultHeaders = new Headers(response.headers);
      headers.forEach((value, key) => resultHeaders.set(key, value));
      return new Response(response.body, { status: response.status, headers: resultHeaders });
    } catch {
      return json({ ok: false, error: "internal_error" }, 500);
    }
  }
};
