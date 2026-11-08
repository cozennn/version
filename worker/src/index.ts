import { DurableObject } from "cloudflare:workers";

interface Env {
  DB: D1Database;
  REPLIES: KVNamespace;
  TICKETS: DurableObjectNamespace<TicketsDurableObject>;
  ALLOWED_ORIGINS?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TELEGRAM_WEBHOOK_SECRET?: string;
  NORDA_AI_URL?: string;
  NORDA_AI_TOKEN?: string;
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

function isTicketId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function readJsonBody(request: Request, maxBytes: number): Promise<{ body: JsonObject; error?: string }> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return { body: {}, error: "unsupported_media_type" };
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return { body: {}, error: "payload_too_large" };
  }
  if (!request.body) return { body: {}, error: "invalid_json" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        return { body: {}, error: "payload_too_large" };
      }
      chunks.push(value);
    }
  } catch {
    return { body: {}, error: "invalid_json" };
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return { body: parseBody(JSON.parse(new TextDecoder().decode(bytes))) };
  } catch {
    return { body: {}, error: "invalid_json" };
  }
}

function bodyErrorResponse(error: string): Response {
  const status = error === "payload_too_large" ? 413 : error === "unsupported_media_type" ? 415 : 400;
  return json({ ok: false, error }, status);
}

function messageRow(row: Record<string, unknown>) {
  return {
    from: row.sender_type === "visitor" ? "user" : row.sender_type === "admin" ? "admin" : "unknown",
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
    const result = parseBody(await response.json().catch(() => ({})));
    if (!response.ok || result.ok !== true) {
      console.error("[telegram] sendMessage failed", {
        status: response.status,
        description: text(result.description, 300) || "Telegram API returned an unsuccessful response"
      });
      return false;
    }
    return true;
  } catch (error) {
    console.error("[telegram] sendMessage request failed", error instanceof Error ? error.message : "unknown error");
    return false;
  }
}

async function notifyTicketMessage(env: Env, ticketId: string, userName: string, message: string): Promise<boolean> {
  return notifyTelegram(env, `NORDA Support Ticket\nTicket ID: ${ticketId}\nVisitor: ${userName}\n\n${message}\n\n↩ Reply directly to this message to answer the visitor.`);
}

async function requestNordaAI(env: Env, message: string, history: Array<{ from: string; text: string }> = []): Promise<string | null> {
  if (!env.NORDA_AI_URL || !env.NORDA_AI_TOKEN) return null;
  const instructions = "NorDa support assistant. Reply in the visitor's language (Arabic, English, French). Be concise; never invent prices, policies, delivery dates or private order details. NORDA designs websites and delivers files; hosting, domains and publishing are client-managed. No complex e-commerce, admin dashboards or integrated payments. If unsure or a human decision/custom quote is needed, say so and suggest the human-agent button. Do not claim a handoff.";
  const maxContext = Math.max(0, 3900 - instructions.length - message.length - 40);
  const contextText = history.slice(-8).map(item =>
    (item.from === "user" ? "Visitor: " : "Support: ") + String(item.text ?? "").slice(0, 500)
  ).join("\n");
  const context = maxContext > 0 ? contextText.slice(-maxContext) : "";
  const prompt = instructions + (context ? "\n\nRecent conversation:\n" + context : "") + "\n\nVisitor: " + message;
  try {
    const response = await fetch(env.NORDA_AI_URL.replace(/\/+$/, "") + "/chat", {
      method: "POST",
      headers: { "content-type": "application/json", "authorization": "Bearer " + env.NORDA_AI_TOKEN },
      body: JSON.stringify({ message: prompt }),
      signal: AbortSignal.timeout(25000)
    });
    if (!response.ok) {
      console.error("[norda-ai] bridge returned", response.status);
      return null;
    }
    const result = parseBody(await response.json().catch(() => ({})));
    const reply = text(result.reply, 3500);
    if (!reply || reply.includes("[[NORDA_HANDOFF]]")) return null;
    return reply;
  } catch (error) {
    console.error("[norda-ai] request failed", error instanceof Error ? error.message : "unknown error");
    return null;
  }
}

async function readTicketMessages(env: Env, ticketDbId: number) {
  const rows = await env.DB.prepare(
    "SELECT sender_type, message_text, created_at FROM messages WHERE ticket_id = ? ORDER BY id ASC"
  ).bind(ticketDbId).all<Record<string, unknown>>();
  return (rows.results ?? []).map(messageRow);
}

async function recordNotificationFailure(env: Env, eventType: "contact" | "ticket_message", referenceId: string | null): Promise<void> {
  try {
    await env.DB.prepare(
      "INSERT INTO telegram_delivery_failures (event_type, reference_id, failed_at) VALUES (?, ?, ?)"
    ).bind(eventType, referenceId, new Date().toISOString()).run();
  } catch (error) {
    console.error("[telegram] could not persist notification failure", error instanceof Error ? error.message : "unknown error");
  }
}


async function telegramBotId(env: Env): Promise<string | null> {
  const cacheKey = "telegram:bot:id";
  const cached = await env.REPLIES.get(cacheKey);
  if (cached) return cached;
  try {
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getMe`);
    if (!response.ok) return null;
    const result = parseBody(await response.json());
    const data = parseBody(result.result);
    if (result.ok !== true || (typeof data.id !== "number" && typeof data.id !== "string")) return null;
    const id = String(data.id);
    await env.REPLIES.put(cacheKey, id, { expirationTtl: 3600 });
    return id;
  } catch {
    return null;
  }
}

async function handleTelegramWebhook(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID || !env.TELEGRAM_WEBHOOK_SECRET) {
    return json({ ok: false, error: "telegram_webhook_not_configured" }, 503);
  }
  if (!constantTimeEqual(request.headers.get("x-telegram-bot-api-secret-token") ?? "", env.TELEGRAM_WEBHOOK_SECRET)) {
    console.warn("[telegram] webhook rejected: secret mismatch");
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  const parsed = await readJsonBody(request, 64 * 1024);
  if (parsed.error) return bodyErrorResponse(parsed.error);
  const update = parsed.body;
  console.log("[telegram] webhook update received", { hasMessage: Boolean(update.message), hasEditedMessage: Boolean(update.edited_message) });
  const updateId = typeof update.update_id === "number" && Number.isSafeInteger(update.update_id) && update.update_id >= 0
    ? update.update_id
    : null;
  if (updateId === null) {
    console.warn("[telegram] ignored: missing or invalid update_id");
    return json({ ok: true, ignored: true });
  }
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
    console.warn("[telegram] ignored: sender/chat does not match configured private support account");
    await env.REPLIES.put(seenKey, "ignored", { expirationTtl: 86400 });
    return json({ ok: true, ignored: true });
  }

  const replyTo = parseBody(message.reply_to_message);
  const replySender = parseBody(replyTo.from);
  const expectedBotId = await telegramBotId(env);
  if (!expectedBotId) {
    console.error("[telegram] could not verify support bot identity");
    return json({ ok: false, error: "telegram_bot_identity_unavailable" }, 503);
  }
  if (replySender.is_bot !== true || String(replySender.id ?? "") !== expectedBotId) {
    console.warn("[telegram] ignored: reply does not target this support bot");
    await env.REPLIES.put(seenKey, "ignored", { expirationTtl: 86400 });
    return json({ ok: true, ignored: true, reason: "reply_must_target_support_bot_notification" });
  }
  const repliedText = text(replyTo.text, 5000);
  const ticketMatch = repliedText.match(/Ticket ID:\s*([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/i);
  const replyText = text(message.text, 4000);
  if (!ticketMatch || !replyText) {
    console.warn("[telegram] ignored: replied message has no ticket ID or reply text");
    await env.REPLIES.put(seenKey, "ignored", { expirationTtl: 86400 });
    return json({ ok: true, ignored: true, reason: "reply_to_a_ticket_notification_required" });
  }

  const ticketId = ticketMatch[1];
  const ticket = await env.DB.prepare(
    "SELECT id, public_id, status, support_mode FROM tickets WHERE public_id = ? LIMIT 1"
  ).bind(ticketId).first<{ id: number; public_id: string; status: string; support_mode: string }>();
  if (!ticket || ticket.status !== "open" || ticket.support_mode !== "human") {
    console.warn("[telegram] ignored: ticket ID not found in D1");
    await env.REPLIES.put(seenKey, "ignored", { expirationTtl: 86400 });
    return json({ ok: true, ignored: true, reason: "ticket_not_found" });
  }

  // D1 batch is transactional: the unique update_id claim and message insert
  // either both commit or both roll back, preventing duplicate replies on retries.
  const batch = await env.DB.batch([
    env.DB.prepare(
      "INSERT OR IGNORE INTO telegram_updates (update_id, processed_at) VALUES (?, ?)"
    ).bind(updateId, new Date().toISOString()),
    env.DB.prepare(
      "INSERT INTO messages (ticket_id, sender_type, message_text, created_at) SELECT ?, 'admin', ?, ? WHERE changes() = 1"
    ).bind(ticket.id, replyText, new Date().toISOString())
  ]);
  const claimed = Number(batch[0]?.meta?.changes ?? 0) === 1;
  if (!claimed) {
    await env.REPLIES.put(seenKey, "processed", { expirationTtl: 86400 });
    return json({ ok: true, duplicate: true });
  }
  await env.REPLIES.put(seenKey, "processed", { expirationTtl: 86400 }).catch(error => {
    console.error("[telegram] KV cache write failed; D1 idempotency remains active", error instanceof Error ? error.message : "unknown error");
  });
  console.log("[telegram] support reply saved to ticket", { ticketId });
  return json({ ok: true, ticketId });
}

const SESSION_TTL_DAYS = 365;

function createSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, value => value.toString(16).padStart(2, "0")).join("");
}

async function hashSessionToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, "0")).join("");
}

async function getVisitorSession(request: Request, env: Env): Promise<{ visitor_id: string } | null> {
  const authorization = request.headers.get("authorization") ?? "";
  const match = authorization.match(/^Bearer ([a-f0-9]{64})$/i);
  if (!match) return null;
  const tokenHash = await hashSessionToken(match[1]);
  return env.DB.prepare(
    "SELECT visitor_id FROM visitor_auth_sessions WHERE token_hash = ? AND expires_at > ? AND revoked_at IS NULL LIMIT 1"
  ).bind(tokenHash, new Date().toISOString()).first<{ visitor_id: string }>();
}

async function saveVisitorSession(env: Env, visitorId: string, token: string, renewExpired = false): Promise<boolean> {
  const now = new Date();
  const createdAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const tokenHash = await hashSessionToken(token);
  const statement = renewExpired
    ? env.DB.prepare(
        "INSERT INTO visitor_auth_sessions (visitor_id, token_hash, created_at, expires_at, revoked_at) VALUES (?, ?, ?, ?, NULL) ON CONFLICT(visitor_id) DO UPDATE SET token_hash = excluded.token_hash, created_at = excluded.created_at, expires_at = excluded.expires_at, revoked_at = NULL WHERE visitor_auth_sessions.expires_at <= excluded.created_at OR visitor_auth_sessions.revoked_at IS NOT NULL"
      ).bind(visitorId, tokenHash, createdAt, expiresAt)
    : env.DB.prepare(
        "INSERT INTO visitor_auth_sessions (visitor_id, token_hash, created_at, expires_at, revoked_at) VALUES (?, ?, ?, ?, NULL)"
      ).bind(visitorId, tokenHash, createdAt, expiresAt);
  const result = await statement.run();
  return Number(result.meta?.changes ?? 0) === 1;
}

async function ticketOwner(env: Env, ticketId: string, visitorId: string) {
  if (!visitorId) return null;
  return env.DB.prepare(
    "SELECT id, public_id, visitor_id, user_name, status, support_mode, created_at, closed_at FROM tickets WHERE public_id = ? AND visitor_id = ? LIMIT 1"
  ).bind(ticketId, visitorId).first<Record<string, unknown>>();
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method.toUpperCase();

  if (path === "/telegram/webhook") return handleTelegramWebhook(request, env);

  if (method === "GET" && path === "/health") {
    try {
      await env.DB.prepare("SELECT 1 AS ok FROM visitor_auth_sessions LIMIT 1").first<{ ok: number }>();
      await env.DB.prepare("SELECT support_mode FROM tickets LIMIT 1").first();
      const latestFailure = await env.DB.prepare(
        "SELECT failed_at FROM telegram_delivery_failures ORDER BY id DESC LIMIT 1"
      ).first<{ failed_at: string }>();
      return json({
        ok: true,
        service: "norda-api",
        status: "ready",
        database: "connected",
        lastNotificationFailureAt: latestFailure?.failed_at ?? null
      });
    } catch (error) {
      console.error("[health] dependency check failed", error instanceof Error ? error.message : "unknown error");
      return json({ ok: false, service: "norda-api", status: "degraded", error: "database_unavailable_or_migrations_pending" }, 503);
    }
  }

  if (method === "POST" && path === "/contact") {
    const parsed = await readJsonBody(request, 8 * 1024);
    if (parsed.error) return bodyErrorResponse(parsed.error);
    const body = parsed.body;
    const name = text(body.name, 100);
    const email = text(body.email, 180);
    const subject = text(body.subject, 180);
    const message = text(body.message, 3000);
    if (text(body.website, 200)) return json({ ok: true });
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || body.privacyConsent !== true) {
      return json({ ok: false, error: "invalid_contact_data" }, 400);
    }
    const sent = await notifyTelegram(env, `NORDA contact\nName: ${name}\nEmail: ${email}\nSubject: ${subject || "No subject"}\n\n${message}`);
    if (!sent) {
      await recordNotificationFailure(env, "contact", null);
      return json({ ok: false, error: "contact_delivery_not_configured" }, 503);
    }
    return json({ ok: true });
  }

  if (method === "POST" && path === "/session/upgrade") {
    const parsed = await readJsonBody(request, 2 * 1024);
    if (parsed.error) return bodyErrorResponse(parsed.error);
    const body = parsed.body;
    const legacyUserId = text(body.userId, 128);
    if (!/^u_[A-Za-z0-9_-]{16,64}$/.test(legacyUserId)) {
      return json({ ok: false, error: "invalid_legacy_session" }, 400);
    }
    const legacyTicket = await env.DB.prepare(
      "SELECT 1 AS found FROM tickets WHERE visitor_id = ? LIMIT 1"
    ).bind(legacyUserId).first<{ found: number }>();
    if (!legacyTicket) return json({ ok: false, error: "legacy_session_not_found" }, 404);

    const sessionToken = createSessionToken();
    const saved = await saveVisitorSession(env, legacyUserId, sessionToken, true);
    if (!saved) return json({ ok: false, error: "legacy_session_already_claimed" }, 409);
    return json({ ok: true, sessionToken, expiresInDays: SESSION_TTL_DAYS });
  }

  if (method === "POST" && path === "/ticket/new") {
    const parsed = await readJsonBody(request, 2 * 1024);
    if (parsed.error) return bodyErrorResponse(parsed.error);
    const body = parsed.body;
    const userName = text(body.userName, 100) || "Visitor";
    const authorization = request.headers.get("authorization");
    let visitorId: string;
    let sessionToken: string | null = null;

    if (authorization) {
      const session = await getVisitorSession(request, env);
      if (!session) return json({ ok: false, error: "invalid_or_expired_session" }, 401);
      visitorId = session.visitor_id;
    } else {
      const suppliedVisitorId = text(body.userId, 128);
      visitorId = /^u_[A-Za-z0-9_-]{16,64}$/.test(suppliedVisitorId)
        ? suppliedVisitorId
        : crypto.randomUUID();
      sessionToken = createSessionToken();
    }

    const existing = await env.DB.prepare(
      "SELECT public_id, support_mode FROM tickets WHERE visitor_id = ? AND status = 'open' ORDER BY id DESC LIMIT 1"
    ).bind(visitorId).first<{ public_id: string; support_mode: string }>();

    const ticketId = existing?.public_id ?? crypto.randomUUID();
    if (!existing) {
      await env.DB.prepare(
        "INSERT INTO tickets (public_id, visitor_id, user_name, status, created_at, support_mode) VALUES (?, ?, ?, 'open', ?, 'ai')"
      ).bind(ticketId, visitorId, userName, new Date().toISOString()).run();
    }

    if (sessionToken) {
      const saved = await saveVisitorSession(env, visitorId, sessionToken, true);
      if (!saved) return json({ ok: false, error: "visitor_session_already_active" }, 409);
    }

    const rows = await env.DB.prepare(
      "SELECT sender_type, message_text, created_at FROM messages WHERE ticket_id = (SELECT id FROM tickets WHERE public_id = ?) ORDER BY id ASC"
    ).bind(ticketId).all<Record<string, unknown>>();

    return json({
      ok: true,
      existing: Boolean(existing),
      ...(sessionToken ? { sessionToken, expiresInDays: SESSION_TTL_DAYS } : {}),
      ticket: { ticketId, supportMode: existing?.support_mode === "human" ? "human" : "ai", messages: (rows.results ?? []).map(messageRow) }
    });
  }

  const messageMatch = path.match(/^\/ticket\/([^/]+)\/message$/);
  if (method === "POST" && messageMatch) {
    const ticketId = messageMatch[1];
    if (!isTicketId(ticketId)) return json({ ok: false, error: "ticket_not_found" }, 404);
    const session = await getVisitorSession(request, env);
    if (!session) return json({ ok: false, error: "unauthorized" }, 401);
    const visitorId = session.visitor_id;
    const parsed = await readJsonBody(request, 16 * 1024);
    if (parsed.error) return bodyErrorResponse(parsed.error);
    const body = parsed.body;
    const message = typeof body.text === "string" ? body.text.trim() : "";
    if (!message) return json({ ok: false, error: "text_required" }, 400);
    if (message.length > 3500) return json({ ok: false, error: "message_too_long", maxLength: 3500 }, 413);
    if (body.file || body.fileName) return json({ ok: false, error: "attachments_not_enabled_until_R2_is_configured" }, 501);

    const ticket = await ticketOwner(env, ticketId, visitorId);
    if (!ticket) return json({ ok: false, error: "ticket_not_found" }, 404);
    if (ticket.status !== "open") return json({ ok: false, error: "ticket_closed" }, 409);

    await env.DB.prepare(
      "INSERT INTO messages (ticket_id, sender_type, message_text, created_at) VALUES (?, 'visitor', ?, ?)"
    ).bind(ticket.id, message, new Date().toISOString()).run();

    const supportMode = ticket.support_mode === "human" ? "human" : "ai";
    if (supportMode === "human") {
      const notificationSent = await notifyTicketMessage(env, ticketId, String(ticket.user_name ?? "Visitor"), message);
      if (!notificationSent) await recordNotificationFailure(env, "ticket_message", ticketId);
      return json({ ok: true, supportMode: "human", notificationSent, messages: await readTicketMessages(env, Number(ticket.id)) });
    }

    const latestBeforeAI = await env.DB.prepare(
      "SELECT support_mode FROM tickets WHERE id = ? LIMIT 1"
    ).bind(ticket.id).first<{ support_mode: string }>();
    if (latestBeforeAI?.support_mode === "human") {
      const notificationSent = await notifyTicketMessage(env, ticketId, String(ticket.user_name ?? "Visitor"), message);
      if (!notificationSent) await recordNotificationFailure(env, "ticket_message", ticketId);
      return json({ ok: true, supportMode: "human", notificationSent, messages: await readTicketMessages(env, Number(ticket.id)) });
    }

    const conversation = await readTicketMessages(env, Number(ticket.id));
    const aiReply = await requestNordaAI(env, message, conversation.slice(0, -1));
    if (aiReply) {
      await env.DB.prepare(
        "INSERT INTO messages (ticket_id, sender_type, message_text, created_at) SELECT ?, 'admin', ?, ? WHERE EXISTS (SELECT 1 FROM tickets WHERE id = ? AND status = 'open' AND support_mode = 'ai')"
      ).bind(ticket.id, aiReply, new Date().toISOString(), ticket.id).run();
    }
    const latest = await env.DB.prepare(
      "SELECT support_mode FROM tickets WHERE id = ? LIMIT 1"
    ).bind(ticket.id).first<{ support_mode: string }>();
    const finalMode = latest?.support_mode === "human" ? "human" : "ai";
    return json({
      ok: true,
      supportMode: finalMode,
      aiUnavailable: !aiReply && finalMode === "ai",
      handoffAvailable: finalMode === "ai",
      messages: await readTicketMessages(env, Number(ticket.id))
    });
  }

  const handoffMatch = path.match(/^\/ticket\/([^/]+)\/handoff$/);
  if (method === "POST" && handoffMatch) {
    const ticketId = handoffMatch[1];
    if (!isTicketId(ticketId)) return json({ ok: false, error: "ticket_not_found" }, 404);
    const session = await getVisitorSession(request, env);
    if (!session) return json({ ok: false, error: "unauthorized" }, 401);
    const ticket = await ticketOwner(env, ticketId, session.visitor_id);
    if (!ticket) return json({ ok: false, error: "ticket_not_found" }, 404);
    if (ticket.status !== "open") return json({ ok: false, error: "ticket_closed" }, 409);

    const changed = await env.DB.prepare(
      "UPDATE tickets SET support_mode = 'human' WHERE id = ? AND status = 'open' AND support_mode = 'ai'"
    ).bind(ticket.id).run();
    if (Number(changed.meta?.changes ?? 0) === 0) {
      return json({ ok: true, supportMode: ticket.support_mode === "human" ? "human" : "ai", alreadyHuman: ticket.support_mode === "human" });
    }

    const sent = await notifyTelegram(
      env,
      "NORDA HUMAN AGENT REQUESTED\nTicket ID: " + ticketId +
      "\nVisitor: " + String(ticket.user_name ?? "Visitor") +
      "\n\nThe visitor requested a human support agent. Please reply directly to this message to answer in the website chat."
    );
    if (!sent) await recordNotificationFailure(env, "ticket_message", ticketId);
    return json({ ok: true, supportMode: "human", notificationSent: sent });
  }

  const messagesMatch = path.match(/^\/ticket\/([^/]+)\/messages$/);
  if (method === "GET" && messagesMatch) {
    const ticketId = messagesMatch[1];
    if (!isTicketId(ticketId)) return json({ ok: false, error: "ticket_not_found" }, 404);
    const session = await getVisitorSession(request, env);
    if (!session) return json({ ok: false, error: "unauthorized" }, 401);
    const ticket = await ticketOwner(env, ticketId, session.visitor_id);
    if (!ticket) return json({ ok: false, error: "ticket_not_found" }, 404);

    const rows = await env.DB.prepare(
      "SELECT sender_type, message_text, created_at FROM messages WHERE ticket_id = ? ORDER BY id ASC"
    ).bind(ticket.id).all<Record<string, unknown>>();
    return json({ ok: true, ticketId, status: ticket.status, supportMode: ticket.support_mode === "human" ? "human" : "ai", messages: (rows.results ?? []).map(messageRow) });
  }

  const closeMatch = path.match(/^\/ticket\/([^/]+)\/close$/);
  if (method === "POST" && closeMatch) {
    const ticketId = closeMatch[1];
    if (!isTicketId(ticketId)) return json({ ok: false, error: "ticket_not_found" }, 404);
    const session = await getVisitorSession(request, env);
    if (!session) return json({ ok: false, error: "unauthorized" }, 401);
    const ticket = await ticketOwner(env, ticketId, session.visitor_id);
    if (!ticket) return json({ ok: false, error: "ticket_not_found" }, 404);
    await env.DB.prepare(
      "UPDATE tickets SET status = 'closed', closed_at = ? WHERE id = ? AND status = 'open'"
    ).bind(new Date().toISOString(), ticket.id).run();
    return json({ ok: true });
  }

  if (method === "GET" && path === "/ticket/closed/closed") {
    const session = await getVisitorSession(request, env);
    if (!session) return json({ ok: false, error: "unauthorized" }, 401);
    const rows = await env.DB.prepare(
      "SELECT public_id AS ticketId, user_name AS userName, status, created_at AS createdAt, closed_at AS closedAt FROM tickets WHERE visitor_id = ? AND status = 'closed' ORDER BY id DESC LIMIT 50"
    ).bind(session.visitor_id).all<Record<string, unknown>>();
    return json({ ok: true, tickets: rows.results ?? [] });
  }



  return json({ ok: false, error: "not_found" }, 404);
}

export class TicketsDurableObject extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const bypassRateLimit = path === "/health";

    if (!bypassRateLimit) {
      const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
      const rule = path === "/telegram/webhook"
        ? { bucket: "webhook", limit: 120 }
        : path === "/contact"
          ? { bucket: "contact", limit: 5 }
          : path === "/ticket/new"
            ? { bucket: "ticket_new", limit: 5 }
            : path === "/session/upgrade"
              ? { bucket: "session_upgrade", limit: 10 }
              : path.endsWith("/message") && request.method === "POST"
                ? { bucket: "ticket_message", limit: 30 }
                : path.endsWith("/handoff") && request.method === "POST"
                  ? { bucket: "ticket_handoff", limit: 5 }
                : { bucket: "general", limit: 90 };
      const key = `rate:${rule.bucket}:${ip}`;
      const now = Date.now();
      const allowed = await this.ctx.storage.transaction(async transaction => {
        const current = await transaction.get<{ start: number; count: number }>(key);
        const state = !current || now - current.start >= 60_000 ? { start: now, count: 0 } : current;
        if (state.count >= rule.limit) return false;
        state.count += 1;
        await transaction.put(key, state);
        return true;
      });
      if (!allowed) return json({ ok: false, error: "rate_limited" }, 429);

      if (await this.ctx.storage.getAlarm() === null) {
        await this.ctx.storage.setAlarm(now + 60 * 60 * 1000);
      }
    }

    if (
      (url.pathname === "/ticket/new" && request.method === "POST") ||
      (url.pathname.endsWith("/message") && request.method === "POST") ||
      (url.pathname.endsWith("/handoff") && request.method === "POST")
    ) {
      return this.ctx.blockConcurrencyWhile(() => handleApi(request, this.env));
    }
    return handleApi(request, this.env);
  }

  async alarm(): Promise<void> {
    const now = Date.now();
    const entries = await this.ctx.storage.list<{ start: number; count: number }>({ prefix: "rate:" });
    const stale: string[] = [];
    for (const [key, value] of entries) {
      if (!value || now - value.start > 2 * 60 * 60 * 1000) stale.push(key);
    }
    if (stale.length) await this.ctx.storage.delete(stale);
    if (entries.size > stale.length) {
      await this.ctx.storage.setAlarm(now + 60 * 60 * 1000);
    }
  }
}

export default {
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil((async () => {
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const [updates, failures, sessions] = await Promise.all([
        env.DB.prepare("DELETE FROM telegram_updates WHERE processed_at < ?").bind(cutoff).run(),
        env.DB.prepare("DELETE FROM telegram_delivery_failures WHERE failed_at < ?").bind(cutoff).run(),
        env.DB.prepare("DELETE FROM visitor_auth_sessions WHERE expires_at < ? OR (revoked_at IS NOT NULL AND created_at < ?)").bind(cutoff, cutoff).run()
      ]);
      console.log("[cleanup] expired records removed", {
        telegramUpdates: Number(updates.meta?.changes ?? 0),
        notificationFailures: Number(failures.meta?.changes ?? 0),
        visitorSessions: Number(sessions.meta?.changes ?? 0)
      });
    })().catch(error => {
      console.error("[cleanup] scheduled retention job failed", error instanceof Error ? error.message : "unknown error");
    }));
  },

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
    } catch (error) {
      console.error("[worker] unhandled request error", error instanceof Error ? error.message : "unknown error");
      headers.set("content-type", "application/json; charset=utf-8");
      headers.set("cache-control", "no-store");
      return new Response(JSON.stringify({ ok: false, error: "internal_error" }), { status: 500, headers });
    }
  }
};
