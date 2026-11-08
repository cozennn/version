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

The migrations are additive: `0001` creates the `telegram_updates` idempotency table and `0002` creates `visitor_sessions` for hashed, server-issued bearer tokens. They do not delete or rewrite existing tickets or messages. Apply all pending migrations successfully before deploying the updated Worker.

Then configure secrets:

```cmd
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
```

Telegram secrets are required for notifications and contact delivery. `TELEGRAM_WEBHOOK_SECRET` must be a random 32-64 character value using only letters, numbers, underscores, or hyphens; use the exact same value when registering the Telegram webhook.

## Configure the website origin

The current `ALLOWED_ORIGINS` is `https://version-3y3.pages.dev`. If the website uses another production domain, update the variable in `wrangler.jsonc` before deploying. For multiple origins, separate them with commas.

## Routes

- `GET /health`
- `POST /session/upgrade` (one-time exchange of a legacy browser ID for a server-issued session)
- `POST /ticket/new` (creates a server-side visitor session when no bearer token is supplied)
- `POST /ticket/:ticketId/message` (requires `Authorization: Bearer <session-token>`)
- `GET /ticket/:ticketId/messages` (requires a bearer session)
- `POST /ticket/:ticketId/close` (requires a bearer session)
- `GET /ticket/closed/closed` (requires a bearer session)
- `POST /contact`
- `POST /telegram/webhook` (secure Telegram replies to the exact notification message)

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
