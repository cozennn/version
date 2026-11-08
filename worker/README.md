# NORDA API Worker

This Worker is deployed independently from the static website. It uses the existing Cloudflare resources:

- D1 binding: `DB` -> `norda-db`
- KV binding: `REPLIES` (Telegram webhook update deduplication)
- Durable Object binding: `TICKETS` -> `TicketsDurableObject` (SQLite-backed)

## Deploy from Windows CMD

From the repository root, pull the latest `main` branch, then apply the new D1 migration before deploying the Worker:

```cmd
git pull origin main
cd worker
npm install
npx wrangler login
npx wrangler d1 migrations apply norda-db --remote
npx wrangler deploy
```

The migrations are additive: `0001` creates the `telegram_updates` idempotency table, `0002` creates `visitor_sessions` for hashed server-issued bearer tokens, `0003` adds Telegram delivery-failure monitoring and retention indexes, and `0004` adds a default-`ai` `support_mode` to existing tickets. Existing tickets and messages are preserved. They do not delete or rewrite existing tickets or messages. Apply all pending migrations successfully before deploying the updated Worker.

Then configure secrets and the private NorDa AI bridge connection:

```cmd
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
npx wrangler secret put NORDA_AI_URL
npx wrangler secret put NORDA_AI_TOKEN
```

For `NORDA_AI_URL`, enter the base URL of the running Cloudflare Tunnel (without `/chat`). The bridge token is stored locally in `C:\\norda-ai\\bridge-token.txt`; paste it only into Wrangler's secure prompt, never into chat or website files. A Quick Tunnel URL changes when the tunnel restarts, so update this secret whenever its URL changes. Keep Ollama and the bridge running on the computer hosting the model.

The AI integration is server-to-server: the browser never receives the bridge URL or token. If the bridge is unavailable, visitors can still request a human agent.


Telegram secrets are required for notifications and contact delivery. `TELEGRAM_WEBHOOK_SECRET` must be a random 32-64 character value using only letters, numbers, underscores, or hyphens; use the exact same value when registering the Telegram webhook.

## Configure the website origin

The current `ALLOWED_ORIGINS` is `https://version-3y3.pages.dev`. If the website uses another production domain, update the variable in `wrangler.jsonc` before deploying. For multiple origins, separate them with commas.

## Routes

- `GET /health` (checks D1 migration dependencies and reports the latest Telegram delivery failure timestamp)
- `POST /session/upgrade` (one-time exchange of a legacy browser ID for a server-issued session)
- `POST /ticket/new` (creates a server-side visitor session when no bearer token is supplied)
- `POST /ticket/:ticketId/message` (requires `Authorization: Bearer <session-token>`; routes to AI or Telegram according to the persisted support mode)
- `POST /ticket/:ticketId/handoff` (permanently switches an open ticket to human support and sends a Telegram alert)
- `GET /ticket/:ticketId/messages` (requires a bearer session)
- `POST /ticket/:ticketId/close` (requires a bearer session)
- `GET /ticket/closed/closed` (requires a bearer session)
- `POST /contact`
- `POST /telegram/webhook` (secure Telegram replies to the exact notification message)

## API safeguards and retention

- JSON request bodies are streamed and capped by route: 64 KiB for Telegram updates, 16 KiB for visitor messages, 8 KiB for contact, and 2 KiB for session upgrades and ticket creation.
- Rate limits are applied per Cloudflare client IP: contact 5/minute, ticket creation 5/minute, legacy session upgrade 10/minute, visitor messages 30/minute, Telegram webhook 120/minute, and 90/minute for other API routes. Health checks are exempt.
- A daily 03:00 UTC Cron removes Telegram update IDs and notification-failure records older than 30 days, plus expired/revoked visitor sessions after the retention window. Existing ticket and message history is not removed.

## Important limitations before production

- File attachments are deliberately rejected with HTTP 501. The current Cloudflare account configuration supplied for this work did not include a confirmed R2 bucket/binding. Configure R2 before enabling attachment persistence; do not store Base64 files in D1 or KV.
- Every visitor message is saved in D1 and a Telegram notification is attempted. The API reports `notificationSent: false` if Telegram delivery fails, logs the Telegram API failure, and the website tells the visitor that the message was saved but the notification failed. Visitor messages are limited to 3,500 characters to leave room for the ticket metadata in Telegram. Reply directly to the bot's notification; the webhook validates Telegram’s secret header, requires the configured private chat and matching account ID, verifies the exact support bot identity, and accepts replies only to that bot's notification. Group chats are intentionally rejected. Replies are saved with D1-backed update-id idempotency, so Telegram retries cannot insert the same reply twice. No admin dashboard is required.
- Ticket ownership is now checked against a server-issued 256-bit bearer token. Only the SHA-256 hash is stored in D1; the token is returned once and kept in the visitor's browser storage. Sessions expire after 365 days. Existing browser IDs are exchanged once through `/session/upgrade` so existing tickets remain associated with their original visitor; the legacy ID is not accepted by ticket read/write routes after the Worker update. If browser storage is cleared, the visitor must start a new ticket because the raw session token cannot be recovered.
- Telegram notifications are optional for ticket messages. The contact form requires Telegram configuration.
- The Worker uses the existing `tickets` and `messages` D1 tables plus `telegram_updates` and `visitor_sessions`, created by additive migrations. Existing ticket and message rows are preserved.

Check the Worker after deployment:

```cmd
curl https://norda-api.houda2004houdaa.workers.dev/health
```

## Register the Telegram webhook (after deployment)

In Windows CMD, enter the same bot token and webhook secret that you saved with Wrangler:

```cmd
set /p TELEGRAM_BOT_TOKEN=Telegram bot token:
set /p TELEGRAM_WEBHOOK_SECRET=Webhook secret:
curl -X POST "https://api.telegram.org/bot%TELEGRAM_BOT_TOKEN%/setWebhook" -d "url=https://norda-api.houda2004houdaa.workers.dev/telegram/webhook&secret_token=%TELEGRAM_WEBHOOK_SECRET%"
```

Telegram should return `"ok":true`. The bot must be able to post in the support chat. To answer a visitor, use Telegram's **Reply** action on the specific NORDA ticket notification, not a new standalone message.

## Post-deploy verification

Run these checks only after applying all D1 migrations and deploying the Worker:

1. Open `/health`; expect HTTP 200 with `ok: true` and `database: "connected"`.
2. Open the website in a normal browser, create a test ticket, and send a short message. Confirm the message appears in the configured Telegram support chat.
3. Reply using Telegram's **Reply** action on that exact notification. Confirm the response appears in the same website ticket.
4. Open a private/incognito browser session and create a different ticket. Confirm that its session cannot read the first ticket.
5. Close the first ticket, open the closed-ticket view, and confirm its saved message history remains visible after refreshing the page.
6. Submit the contact form with consent enabled and verify Telegram delivery. Confirm the form blocks submission when consent is not checked.
7. Replay a previously processed Telegram update in a staging environment and confirm D1 does not insert a duplicate reply.

Do not test rate limits by flooding the production Worker. A successful static-site build does not replace these live Worker, D1, and Telegram checks.
