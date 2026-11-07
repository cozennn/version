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

The migration creates only the `telegram_updates` idempotency table. It does not delete or rewrite existing tickets or messages. Do not deploy the updated Worker until the migration has completed successfully.

Then configure secrets:

```cmd
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
```

Telegram secrets are required for notifications and contact delivery. `TELEGRAM_WEBHOOK_SECRET` must be a random 32-64 character value using only letters, numbers, underscores, or hyphens; use the exact same value when registering the Telegram webhook.

## Configure the website origin

The default `ALLOWED_ORIGINS` is `https://norda-site.pages.dev`. If the website uses a different production domain, update the variable in `wrangler.jsonc` before deploying. For multiple origins, separate them with commas.

## Routes

- `GET /health`
- `POST /ticket/new`
- `POST /ticket/:ticketId/message?userId=...`
- `GET /ticket/:ticketId/messages?userId=...`
- `POST /ticket/:ticketId/close?userId=...`
- `GET /ticket/closed/closed?userId=...`
- `POST /contact`
- `POST /telegram/webhook` (secure Telegram replies to the exact notification message)

## Important limitations before production

- File attachments are deliberately rejected with HTTP 501. The current Cloudflare account configuration supplied for this work did not include a confirmed R2 bucket/binding. Configure R2 before enabling attachment persistence; do not store Base64 files in D1 or KV.
- Every visitor message is saved in D1 and a Telegram notification is attempted. The API reports `notificationSent: false` if Telegram delivery fails, and the website tells the visitor that the message was saved but the notification failed. Reply directly to the bot's notification; the webhook validates Telegram’s secret header, requires the configured private chat and matching account ID, and accepts replies only to a bot-authored ticket notification. Group chats are intentionally rejected. The reply is saved as an admin message in D1 and appears through the existing messages endpoint. No admin dashboard is required.
- Visitor ownership currently uses the `userId` supplied by the existing browser client. It prevents accidental cross-ticket access but is not strong authentication because a client can spoof its own identifier. A signed visitor session is a required security improvement before treating tickets as private.
- Telegram notifications are optional for ticket messages. The contact form requires Telegram configuration.
- The Worker uses the existing `tickets` and `messages` D1 tables plus the `telegram_updates` table created by the included D1 migration. The migration is additive and preserves existing tickets and messages.

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
