# NORDA Admin

React-admin application for managing NORDA's existing Cloudflare Worker and D1 data.

## Local development

```cmd
cd admin
npm install
npm run dev
```

The development server runs at `http://localhost:5174`. The Worker must allow this origin and be deployed with the admin API routes.

## Worker setup

1. Apply the additive D1 migration: `npx wrangler d1 migrations apply norda-db --remote`.
2. Set the one-time owner bootstrap secret as a Worker secret named `NORDA_ADMIN_SETUP_TOKEN`.
3. Deploy the Worker.
4. Send one POST request to `/admin/auth/setup` with JSON fields `setupToken`, `username`, and `password`. Use a password with at least 12 characters. Setup is permanently closed after the first owner is created.
5. Open the admin app and sign in.

Never put the bootstrap token or admin password in source control. The Worker stores only a PBKDF2 password hash and a SHA-256 hash of each session token. Admin sessions expire after eight hours.

## Current modules

- Products: existing eight catalog items are seeded by migration 0007; create, edit and archive are backed by D1.
- Inquiries: reads real contact submissions.
- Support tickets: reads real ticket records; reply and ticket actions are not yet part of this first implementation.
- Activity: records admin authentication and product changes.

The public site uses the D1-managed catalog when available and retains its bundled catalog as a fallback.
