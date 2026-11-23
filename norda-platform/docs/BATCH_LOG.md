# NorDa — Batch Log

Each batch is a self-contained unit delivered with a manifest of files,
features, and follow-ups. Batches are cumulative; nothing is deleted
between batches except the B1 preview route (removed in B4).

| Batch | Title | Status |
|---|---|---|
| B0 | Foundations (workspace, shared package, packaging scripts, env) | ✅ Delivered |
| B1 | Design System & Internationalization | 🟡 Integrated — build verification pending |
| B2 | Backend core (Fastify, Drizzle, migrations, seed) | ⏳ Next |
| B3 | Auth + Catalog API | ⏳ |
| B4 | Storefront (Home, Store index, Product, Cart, Checkout) | ⏳ |
| B5 | Payments (PayPal demo, BaridiMob manual proof, admin review) | ⏳ |
| B6 | Portfolio (public + admin) | ⏳ |
| B7 | Services + Inquiries (public + admin) | ⏳ |
| B8 | Support (rule-based AI + human handoff) | ⏳ |
| B9 | Admin shell and all admin modules | ⏳ |
| B10 | Static pages, SEO, accessibility sweep | ⏳ |
| B11 | GGSoma integration adapter | ⏳ |
| B12 | Tests, docs, packaging | ⏳ |

## B0 recap

Delivered: monorepo, `@norda/shared` package with Zod schemas and domain
types, `.env.example` with all integration placeholders (defaults safe for
local demo), packaging scripts producing `NorDa-Complete-Platform.zip`,
README with demo-mode disclosure.

## B1 recap

Integrated: `apps/web` (Vite + React 18 + TS + Tailwind), complete design
tokens and typography, i18n (ar + en with RTL/LTR and localStorage
persistence), primitive component library (including Chip, Divider, Breadcrumbs), layout primitives (including Grid and Cluster),
`SiteHeader`/`SiteFooter`/`LanguageSwitcher`/`ThemeProvider`/`AppShell`, a design-system
preview page at `/`, and this log.

The preview page is intentionally temporary and will be removed in B4. Font binaries are not included; see `apps/web/public/fonts/README.txt`. Typecheck/build and browser validation remain pending.