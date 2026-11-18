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
- `frontend-design`: primary art direction and distinctive visual design; retain the existing complete NorDa skill.
- `design-system-starter`: tokens, component architecture, theming, and documentation when its complete skill file is installed.
- `premium-web-design`, `ui-ux-pro-max`, `material-design-3-ui`, and `scroll-experience`: optional specialist skills; do not use their pending placeholders as instructions.

### Frontend implementation
- Existing `frontend-development` remains the primary NorDa-specific implementation skill.
- Existing `responsive-design` remains active until a complete replacement is installed.
- `react-best-practices`: React/Next.js only.
- `tailwind-patterns`: Tailwind CSS v4 only.

### Accessibility and performance
- Existing `accessibility` remains active until the complete `accessibility-auditor` skill is installed.
- Existing `performance` remains active until the complete `web-performance-optimization` skill is installed.
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
6. Check keyboard use, semantic HTML, focus, contrast, reduced motion, and mobile layouts.
7. Run available tests, lint, typecheck, build, and browser checks relevant to the change.
8. Check SEO and performance when relevant.
9. Report changed files, checks, failures, and anything not verified.

## Conflict handling
- Visual skills must not override the actual brand brief.
- A design system creates consistency within one project, not across all NorDa client sites.
- Existing NorDa-specific platform skills take precedence for the public site, admin panel, Worker API, and database.
- Testing, accessibility, and performance skills complement one another.
- Marketing skills must not create deceptive claims.
- Motion is progressive enhancement; respect `prefers-reduced-motion`.

## Installation and replacement safety
- Only complete `SKILL.md` files count as installed skills. A `SOURCE_PENDING.md` file is not a skill.
- Do not delete `ui-ux-design`, `frontend-development`, `responsive-design`, `accessibility`, or `performance` until their complete replacements have been added and checked.
- Preserve `cloudflare-worker-api`, `database-d1-sqlite`, `security-review`, `localization-i18n`, and `code-review`.
- Never remove backend or platform-specific skills as part of a website-design refresh.
