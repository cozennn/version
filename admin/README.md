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

1. Apply the additive D1 migration only if it has not already been applied: `npx wrangler d1 migrations apply norda-db --remote`.
2. Set the one-time owner bootstrap secret as a Worker secret named `NORDA_ADMIN_SETUP_TOKEN`.
3. Deploy the Worker.
4. Send one POST request to `/admin/auth/setup` with JSON fields `setupToken`, `username`, and `password`. Use a password with at least 12 characters. Setup is permanently closed after the first owner is created.
5. Open the admin app and sign in.
6. After the first owner has been created, remove the bootstrap secret. It is no longer needed.

Never put the bootstrap token or admin password in source control. The Worker stores only a PBKDF2 password hash and a SHA-256 hash of each session token. Admin sessions expire after eight hours.

## Current modules

- Dashboard: live counts for products, inquiries, tickets, and admin activity.
- Products: the existing catalog items are managed in D1; create, edit, and archive are backed by the Worker API.
- Inquiries: reads real contact submissions, with server-side search and sorting.
- Support tickets: reads real ticket records, with server-side search and sorting. Conversation replies and ticket actions are planned for the support phase.
- Activity: reads the admin audit log, with server-side search and sorting.

## Cloudflare Pages deployment

Deploy this as a separate Pages project. Do not reuse the existing `version-3y3` project because that project serves the public NorDa website.

Recommended Git-integrated Pages settings:

- Project name: `norda-admin` (if available).
- Production branch: `main`.
- Root directory: `admin`.
- Build command: `npm run build`.
- Build output directory: `dist`.
- Build environment variable: `VITE_API_URL=https://norda-api.houda2004houdaa.workers.dev`.

For a CLI preview deployment after creating the Pages project:

```cmd
cd /d "%USERPROFILE%\OneDrive\سطح المكتب\version-admin\admin"
npm install
npm run build
npx wrangler pages deploy dist --project-name norda-admin --branch feature/norda-admin-react-admin
```

The Pages project must exist before the deploy command. A production deployment should use the configured production branch, not the feature branch.

After Cloudflare assigns the production hostname, add that exact HTTPS origin to the Worker `ALLOWED_ORIGINS` variable and deploy the Worker. The current allowlist includes the public site and local development origin only, so the new admin hostname will otherwise receive a CORS rejection. Add preview hostnames separately only when preview access is required.

Before final release, verify the bootstrap secret is absent with `npx wrangler secret list`. If it remains, remove it with `npx wrangler secret delete NORDA_ADMIN_SETUP_TOKEN`.
