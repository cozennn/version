# NorDa Website Skills

## Purpose
Build websites that feel intentionally designed for their specific brand, audience, content, and business goal. Avoid generic AI-template aesthetics. Each project must have its own visual direction; do not impose one shared palette, typography, layout, or component style across unrelated clients.

## Rules
1. Inspect the project before editing and preserve working functionality.
2. Reuse the existing framework, components, tokens, and dependencies unless a change is necessary.
3. Load only skills relevant to the current task.
4. Skill instructions are guidance, not absolute law. The project brief, user constraints, accessibility, security, and working functionality take precedence.
5. Never invent business facts, testimonials, statistics, prices, policies, or product details.
6. Never force 3D, parallax, gradients, glassmorphism, animation, dark mode, or a design system.
7. Verify changes and report exactly what was and was not tested.

## Skill routing

### Visual direction and design systems
- `frontend-design`: primary art direction and distinctive visual design.
- `design-system-starter`: tokens, component architecture, theming, and documentation.
- `premium-web-design`: high-craft premium execution; never impose a generic luxury aesthetic.
- `ui-ux-pro-max`: product UX decisions, design systems, interaction, and interface audits.
- `material-design-3-ui`: only when Material 3 is requested or already used.
- `scroll-experience`: only for explicit scroll-led storytelling or product demonstrations.

### Frontend implementation
- Existing `frontend-development` remains the primary NorDa-specific implementation skill.
- `senior-frontend`: engineering architecture, React patterns, performance, and code review.
- Existing `responsive-design` remains active.
- `react-best-practices`: React/Next.js only.
- `tailwind-patterns`: Tailwind CSS v4 only.

### Accessibility and performance
- Existing `accessibility` remains active alongside `accessibility-auditor`.
- Existing `performance` remains active alongside `web-performance-optimization`.
- `webapp-testing`: Playwright/browser functional checks.

### Content and conversion
- `copywriting`: website and product marketing copy.
- `seo-optimizer`: technical and on-page SEO.
- `page-cro`: landing and marketing page conversion.
- `form-cro`: contact, lead, quote, application, survey, and checkout forms; not signup flows.

### Specialized
- `interactive-portfolio`: portfolio projects only.

### NorDa platform skills to preserve
- `cloudflare-worker-api`: Worker API and integrations.
- `database-d1-sqlite`: Cloudflare D1 and SQLite.
- `security-review`: authentication, authorization, uploads, and application security.
- `localization-i18n`: Arabic, English, French, and RTL.
- `code-review`: cross-project correctness and regression review.

## Workflow
1. Identify the site type, audience, primary action, content, framework, and constraints.
2. Inspect repository structure, pages, styles, components, assets, and scripts.
3. Choose a subject-grounded visual direction and record its rationale.
4. Implement coherent changes without breaking existing behavior.
5. Cover loading, empty, error, success, disabled, validation, and responsive states as applicable.
6. Check keyboard use, semantic HTML, focus, contrast, reduced motion, RTL, and mobile layouts.
7. Run available tests, lint, typecheck, build, and browser checks relevant to the change.
8. Check SEO and performance when relevant.
9. Report changed files, checks, failures, and anything not verified.

## Conflict handling
- Visual skills must not override the actual brand brief.
- A design system creates consistency within one project, not across all NorDa client sites.
- Material 3 applies only when requested or already present.
- Premium styling must not replace NorDa's approved identity.
- Scroll motion is progressive enhancement; native scroll and reduced-motion behavior must remain intact.
- Existing NorDa-specific platform skills take precedence for the public site, admin panel, Worker API, and database.
- Testing, accessibility, and performance skills complement one another.
- Marketing skills must not create deceptive claims.

## Installation and source integrity
- Only complete `SKILL.md` files count as installed skills.
- Each installed skill has a `SOURCE.json` provenance record.
- Some skills are NorDa-focused adaptations, not verbatim copies of upstream packages. Their `SOURCE.json` files state what was adapted or omitted.
- Do not claim bundled datasets, scripts, or upstream reference packs are present unless they exist in the repository.
- Preserve platform-specific skills; never delete backend skills during a website-design refresh.
