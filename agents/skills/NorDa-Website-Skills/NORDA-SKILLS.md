# NorDa Skills Router

## Purpose
Build websites that feel intentionally designed for their specific brand, audience, content, and business goal. Avoid generic AI-template aesthetics. Each project must have its own visual direction; do not impose one shared palette, typography, layout, or component style across unrelated clients.

## Priority rules
1. Inspect the existing project before changing it. Preserve working functionality, content, brand identity, and established conventions unless the task explicitly asks to change them.
2. Use the project's existing framework, components, tokens, and dependencies. Do not introduce a new framework or dependency without a clear need.
3. Choose skills by task. Do not load every skill automatically.
4. Treat bundled skill guidance as guidance, not absolute law. Resolve conflicts in favor of the project brief, user constraints, accessibility, security, and working functionality.
5. Do not invent business facts, testimonials, statistics, prices, policies, or product details.
6. Do not force 3D, parallax, gradients, glassmorphism, animation, dark mode, or a particular design system. Use them only when justified by the brand and brief.
7. Before reporting completion, run the most relevant checks and state exactly what was and was not verified.

## Skill routing

### Visual direction and UX
- `frontend-design` — primary art direction and distinctive visual design. Source pending.
- `premium-web-design` — premium/editorial/agency-quality visual treatment when requested or appropriate. Source pending.
- `ui-ux-pro-max` — explore UI/UX styles, palettes, typography, and stack-specific patterns. Source pending.
- `material-design-3-ui` — only when Material Design 3 is explicitly chosen or clearly appropriate. Source pending.
- `scroll-experience` — only for story-led, scroll-driven or cinematic pages. Source pending.

### Design systems and implementation
- `design-system-starter` — create tokens, component architecture, theming, and documentation when a project needs a reusable system.
- `senior-frontend` — default engineering discipline for UI implementation, responsive states, accessibility, and browser verification. Source pending.
- `react-best-practices` — only for React/Next.js projects or code.
- `tailwind-patterns` — only when the project uses Tailwind CSS v4.

### Verification and quality
- `webapp-testing` — browser-based functional checks and Playwright testing.
- `web-performance-optimization` — loading speed, Core Web Vitals, bundle size, caching, and runtime performance.
- `accessibility-auditor` — deeper WCAG/accessibility audits when needed.

### Content and conversion
- `copywriting` — page and product marketing copy.
- `seo-optimizer` — technical and on-page SEO.
- `page-cro` — optimize a complete marketing page for conversion.
- `form-cro` — optimize contact, lead, quote, application, survey, or checkout forms; not signup/registration flows.

### Specialized project type
- `interactive-portfolio` — portfolio projects only.

## Workflow
1. Identify project type, audience, primary action, content, framework, and constraints.
2. Inspect repository structure, existing pages, styles, components, assets, and scripts.
3. Select a visual direction based on the actual subject and audience. Record palette, typography, layout logic, image direction, interaction style, and rationale.
4. Implement the smallest coherent set of changes. Keep the design distinctive without sacrificing clarity or usability.
5. Cover real UI states: loading, empty, error, success, disabled, validation, long content, and responsive navigation where applicable.
6. Verify keyboard behavior, semantic HTML, focus visibility, contrast, reduced motion, and mobile layouts.
7. Run available lint, typecheck, tests, and build scripts. Use browser testing for meaningful UI changes.
8. Check performance and SEO when relevant.
9. Report changed files, behavior, checks run, failures, and anything not verified.

## Conflict resolution
- `frontend-design` / `premium-web-design` / `ui-ux-pro-max` guide visual decisions; they must not override the actual brand brief.
- `design-system-starter` supports consistency inside one project; it must not make different client websites look alike.
- `senior-frontend` and `react-best-practices` guide implementation; project architecture and verified compatibility take precedence.
- `webapp-testing`, `accessibility-auditor`, and `web-performance-optimization` are complementary checks, not interchangeable.
- `copywriting`, `seo-optimizer`, `page-cro`, and `form-cro` must not invent claims or make deceptive promises.
- Motion is progressive enhancement. Respect `prefers-reduced-motion` and keep essential information accessible without animation.

## Source status
Skills containing `SOURCE_PENDING.md` are placeholders, not complete skills. Obtain the original source files and bundled references before activating them.
