# NORDA API Worker

This Worker is deployed independently from the static website. It uses the existing Cloudflare resources:

- D1 binding: `DB` -> `norda-db`
- KV binding: `REPLIES` (reserved for future reply/cache workflows)
- Durable Object binding: `TICKETS` -> `TicketsDurableObject` (SQLite-backed)

## Deploy from Windows CMD

From the repository root:

```cmd
cd worker
npm install
npx wrangler login
npx wrangler deploy
```

Then configure secrets:

```cmd
npx wrangler secret put ADMIN_TOKEN
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
```

Use a long random value for `ADMIN_TOKEN`. Telegram secrets are optional for ticket storage, but the contact form returns a configuration error until both Telegram secrets are set.

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
- `POST /admin/ticket/:ticketId/message` with `Authorization: Bearer ADMIN_TOKEN`

## Important limitations before production

- File attachments are deliberately rejected with HTTP 501. The current Cloudflare account configuration supplied for this work did not include a confirmed R2 bucket/binding. Configure R2 before enabling attachment persistence; do not store Base64 files in D1 or KV.
- Admin replies can be written through the protected admin endpoint, but the existing admin dashboard must be wired to this endpoint separately.
- Visitor ownership currently uses the `userId` supplied by the existing browser client. It prevents accidental cross-ticket access but is not strong authentication because a client can spoof its own identifier. A signed visitor session is a required security improvement before treating tickets as private.
- Telegram notifications are optional for ticket messages. The contact form requires Telegram configuration.
- The Worker uses the existing `tickets` and `messages` D1 tables; it does not create, migrate, or delete database tables.

Check the Worker after deployment:

```cmd
curl https://norda-api.houda2004houdaa.workers.dev/health
```
