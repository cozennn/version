# NorDa Frontend Audit — Initial Source Review

Date: 2026-11-24
Repository: cozennn/version
Branch: feature/norda-independent-platform
Scope: source-level review of norda-platform/apps/web only. This is not a screenshot-based visual QA or accessibility certification.

## Overall assessment

The project has a solid visual foundation and a coherent brand direction, but most secondary routes are still presentation-only. The main gap is product depth and real user journeys, not a missing framework or a need to rewrite the app.

## What is already in place

- React 18, Vite, TypeScript, React Router, Tailwind CSS.
- Shared app shell with header, footer, theme provider, skip link, and toast provider.
- Arabic/English translations with document-level lang/dir switching.
- Semantic color tokens for NorDa purple (#5A46D6), rose accent, warm neutrals, focus, status, motion, and dark theme.
- Reduced-motion token handling and visible focus styling.
- Responsive navigation with a mobile menu and language/theme controls.
- Homepage composition with hero, service pillars, portfolio teasers, and calls to action.

## Findings by area

### Homepage — good foundation, needs content depth

- The hero and editorial layout establish a recognizable identity.
- The floral SVG mark is consistent with the NorDa name, but should remain a restrained accent rather than the dominant visual language.
- Portfolio teasers are abstract CSS/SVG compositions, not actual project previews. Keep them clearly labeled as studies until real work is supplied.
- Add a more explicit bridge between the three pillars: services, portfolio, and digital products.
- Validate that directional arrows and hover transforms behave correctly in RTL.

### Services — currently a static overview

- The page maps three service categories to translated copy.
- There are no service detail routes, package comparison, deliverables, pricing, lead qualification, or request submission.
- Next: create service detail patterns and a functional inquiry form in demo mode, with clear success/error states.

### Portfolio — currently sample studies

- Two abstract studies are displayed with a demo badge and disclaimer.
- There is no project detail page, filtering, case-study structure, role/scope/timeline, or real asset handling.
- Next: create reusable project data and detail route; never present demo studies as completed client work.

### Store — explicitly empty

- The current route renders an empty-state panel only.
- There is no product catalog, categories, search/filter, product detail, cart, checkout, or download authorization.
- Next: build a clearly marked demo catalog and product detail/cart UI. Do not connect live payment or real GGSoma credentials in this slice.

### Contact — no contact form yet

- The page currently contains explanatory copy only.
- Next: add accessible name/email/topic/message fields, validation, loading, success, and failure states. Until an API exists, label submission as a local demo and do not imply a message was delivered.

### About — static brand statement

- The page contains a brand statement and three values.
- This is acceptable for an initial content page, but should eventually link the brand promise to concrete work and service process.

### Shared shell and localization

- The header/footer are reusable and have language/theme controls.
- Verify focus management when the mobile menu opens/closes, and close behavior on route changes.
- Verify translated labels exist for all keys and test mixed Arabic/Latin content, numerals, prices, and directional icons.
- The current font CSS references local Tajawal and Manrope WOFF2 files. Confirm that the actual files exist under the public fonts directory; otherwise browser fallback fonts will be used.

## Engineering and release gaps

- The web package currently has placeholder lint and test scripts; these are not real checks.
- No screenshot evidence was captured in this source review, so visual appearance, responsive overflow, browser console errors, and actual keyboard behavior remain unverified.
- The existing preview deployment must complete and be inspected before accepting a visual batch.
- Do not introduce real checkout, authentication, or account claims until the isolated backend and security model are implemented.

## Priority order

1. Complete the real content structure and interactions for Store, Services, Portfolio, and Contact using clearly labeled demo data.
2. Add reusable listing/detail patterns, form validation, empty/loading/error states, and Arabic/English QA.
3. Add actual linting and meaningful component/flow tests.
4. Only then define backend contracts for orders, payments, authentication, and creator/admin workflows.

## Safety constraints

- Keep all changes under norda-platform/.
- Work only on feature/norda-independent-platform.
- Keep the norda-preview Pages project isolated and its current branch/path restrictions unchanged.
- Do not access or bind to production Worker, D1, KV, R2, secrets, customers, tickets, or orders.
- Supported checkout methods remain PayPal (USD) and BaridiMob (DZD); the reference report's Stripe suggestion is not adopted.
