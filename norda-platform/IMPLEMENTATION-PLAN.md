# NorDa Platform — Execution Blueprint

> Status: execution baseline for `feature/norda-independent-platform`
> Scope: everything in this document applies only to `norda-platform/` in `cozennn/version`.
> Safety: do not merge to `main`, do not change the existing public site, and do not connect to production Workers, D1, KV, R2, customer records, orders, tickets, or secrets.

## 1. Verified starting point

The repository already contains a working B1 frontend foundation; this is not an empty scaffold.

- Repository: `cozennn/version`
- Working branch: `feature/norda-independent-platform`
- Application root: `norda-platform/`
- Frontend: React 18, Vite, TypeScript, React Router, Tailwind CSS
- Shared package: `packages/shared`
- Frontend entry: `apps/web/src/main.tsx`
- Routes currently include Home, Services, Work, Store, About, Contact, and Not Found.
- The public shell already provides shared header/footer, theme provider, skip link, and toast provider.
- Arabic/English localization and RTL/LTR support are present.
- The latest inspected Pages deployment succeeded on 2026-11-23.

The current Cloudflare Pages project is `norda-preview` at `https://norda-preview.pages.dev`. Its verified configuration uses repository `cozennn/version`, root directory `norda-platform`, output `apps/web/dist`, preview branch allowlist `feature/norda-independent-platform`, path filter `norda-platform/*`, and disabled production deployments. Keep these guardrails unchanged.

## 2. Product decisions (authoritative)

1. NorDa is one coherent platform with three public pillars: professional services, creative portfolio, and digital products.
2. The brand color is `#5A46D6`. The visual direction is distinctive, editorial, calm, feminine without being childish, and professional.
3. Arabic is a first-class RTL language; English is LTR. Use CSS logical properties and test both directions on every major page.
4. The only customer payment methods are:
   - PayPal, priced and charged in USD.
   - BaridiMob (بريدي موب), paid manually in DZD with proof-of-payment review.
5. Default display conversion for BaridiMob is 1 USD = 250 DZD, configurable later in a protected admin setting. Never silently change historical order amounts when the rate changes.
6. Do not add Stripe, crypto, or other payment methods unless the owner explicitly changes this product decision.
7. Demo data must be clearly labeled. Never invent testimonials, customer counts, sales, ratings, partner badges, awards, or performance metrics.
8. Do not reuse production secrets, production APIs, or production data. Any future provider integration (including GGSoma) must use a separate credential scoped to this independent platform and remain server-side.

## 3. Architecture direction

Keep the current Vite/React frontend and shared package. Avoid a needless framework migration or a full rewrite.

For the first real backend milestone, prefer a separate Cloudflare Worker API and a newly provisioned, dedicated D1 database for this platform. The database must have a distinct name and ID and must never bind to the existing `norda-db`. Use separate preview secrets and bindings. Provisioning any new Cloudflare resource is a deliberate later step, not part of frontend-only work.

Suggested boundaries:

- `apps/web`: public storefront, portfolio, services, customer account, and later admin UI.
- `apps/api`: separate Worker API, validation, authentication, payment adapters, and business rules.
- `packages/shared`: Zod schemas, DTOs, enums, currency helpers, and shared contracts.
- Dedicated D1: independent platform users, listings, orders, payment submissions, and audit events.
- Optional R2: private digital assets and proof-of-payment uploads, with signed/authorized delivery.
- GGSoma adapter: server-only, optional, disabled by default until separate credentials and terms are confirmed.

Do not create a second database abstraction or add Supabase/Firebase by default. Reassess only if a concrete requirement cannot be met safely with the Cloudflare stack.

## 4. Execution batches and acceptance criteria

### B1.5 — Design research and product specification

- Inventory every existing route, component, token, translation key, and responsive state before changing design foundations.
- Create a page/component matrix for: homepage, services index/detail, portfolio index/detail, store index/product detail, cart, checkout, payment instructions, order status, sign-in/up, buyer account, creator workspace, and admin.
- Define reusable patterns for navigation, search/filtering, product cards, service cards, project cards, pricing, forms, empty/error/loading states, dialogs, tables, toasts, and mobile navigation.
- Compare references by page type and interaction pattern, not by copying a whole brand or template.
- Produce a design QA checklist for Arabic and English, desktop and mobile, keyboard use, contrast, reduced motion, and empty/loading/error states.

Acceptance: an approved design inventory and a stable token/component contract; no production files or secrets changed.

### B2 — Backend foundation (separate environment only)

- Define data contracts and migrations for users, profiles, services, products, portfolio projects, orders, order items, payment submissions, and audit events.
- Create a dedicated Worker API and dedicated D1 only after confirming the resource names and bindings are separate from production.
- Add schema validation, request IDs, safe error handling, rate limits, authorization boundaries, and audit logging.
- Keep seed data synthetic and explicitly marked as demo.
- Implement health/status and read-only catalog endpoints first.

Acceptance: migrations apply only to the new database; API integration tests pass; no production resource appears in the binding list.

### B3 — Services and inquiry/booking

- Build service listing and detail pages, package options, inquiry form, and booking/request workflow.
- Distinguish fixed-price packages from custom quotes.
- Add customer-visible status and confirmation states.

Acceptance: a demo user can submit an inquiry or request a fixed package and see its status without a real payment being implied.

### B4 — Digital products and checkout

- Build product catalog, detail page, cart, checkout, order confirmation, and authorized download flow.
- PayPal adapter: USD and server-created checkout orders.
- BaridiMob adapter: DZD amount calculation, transfer instructions, proof upload, pending-review status, and admin approval/rejection.
- Store exchange-rate snapshots on each order.
- Protect downloads with expiring authorization; never expose private storage URLs permanently.

Acceptance: test/sandbox PayPal flow and manual BaridiMob demo flow are clearly distinguished from live collection; downloads require a valid paid/approved order.

### B5 — Authentication and customer account

- Add secure sessions, password hashing, CSRF protections where applicable, session rotation, logout, and recovery flow.
- Buyer account shows orders, payment status, and downloads.
- Do not permit public self-registration as an admin.

Acceptance: authorization tests prove users cannot read another user's orders or downloads.

### B6 — Creator workspace

- Add creator profile, service/product/project management, safe uploads, draft/published states, and order communication.
- Add moderation states before public listing.
- Keep earnings calculations separate from confirmed payouts.

Acceptance: creator can manage own listings only; pending items do not appear publicly until approved.

### B7 — Admin and support

- Add protected admin roles and permissions, listing moderation, order/payment review, user support, and audit history.
- No hidden-URL-only security; enforce server-side authorization.
- Keep admin UI visually consistent with the public platform.

Acceptance: role tests cover owner/admin/staff/customer/creator boundaries; sensitive actions are audited.

### B8 — Release hardening

- Complete Arabic/English copy and RTL/LTR QA.
- Check responsive layouts, keyboard access, focus states, contrast, reduced motion, image optimization, metadata, sitemap, and error pages.
- Run lint, typecheck, tests, and production build.
- Review the deployed preview URL before any release decision.

Acceptance: all checks pass; no critical accessibility or security issues; production remains untouched until a separate explicit release decision.

## 5. Design quality rules

- Do not use generic dashboard/card grids as the default composition. Use hierarchy, editorial layouts, varied section rhythm, and purposeful whitespace.
- Avoid excessive gradients, glass effects, oversized rounded cards, emoji-based headings, and decorative motion that competes with content.
- Use one consistent icon family and one consistent illustration/art direction.
- Motion must be subtle, purposeful, and respect `prefers-reduced-motion`.
- Use real portfolio assets only when supplied or licensed; otherwise use clearly labeled abstract/demo artwork.
- Every component must have hover, focus-visible, disabled, loading, and error behavior where relevant.
- Use semantic HTML, accessible labels, keyboard-operable controls, and meaningful alt text.

## 6. Working and deployment rules

- Commit only under `norda-platform/` on `feature/norda-independent-platform`.
- Never force-push, rewrite history, or merge to `main` as part of these batches.
- Keep the Pages project allowlist, path filter, root directory, and disabled production deployments unchanged.
- A successful deployment is not visual QA. Inspect the preview in a real browser before accepting a UI batch.
- Do not add secrets to GitHub files, build output, screenshots, or client-side environment variables.
- Do not run destructive database reset/seed commands against any remote environment.
- Keep each batch small, reviewable, and reversible.

## 7. Immediate next implementation slice

Start with B1.5, then complete the frontend route-by-route before introducing payment or account complexity:

1. Audit existing pages and shared components against the page/component matrix.
2. Fix the design tokens and reusable patterns only where the audit shows a real gap.
3. Complete service, portfolio, and product discovery/detail experiences.
4. Add cart and checkout UI in demo mode with the two approved payment methods only.
5. Run build/type checks and inspect the isolated preview before beginning B2.

This sequence reduces rework: the product experience and design contracts become stable before backend schemas and payment workflows are locked in.
