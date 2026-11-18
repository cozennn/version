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

### Visual direction
- `frontend-design`: primary art direction and distinctive visual design (already present in this repository).
- `premium-web-design`: premium/editorial visual treatment when appropriate.
- `ui-ux-pro-max`: UI/UX patterns, palettes, typography, and stack-specific references.
- `material-design-3-ui`: only when Material Design 3 is selected.
- `scroll-experience`: only for story-led, scroll-driven pages.

### Systems and implementation
- `design-system-starter`: tokens, component architecture, theming, documentation.
- Existing `frontend-development` and `responsive-design` remain the NorDa-specific implementation skills.
- `react-best-practices`: React/Next.js only.
- `tailwind-patterns`: Tailwind CSS v4 only.

### Quality
- Existing `accessibility` and `performance` skills remain primary for NorDa.
- `webapp-testing`: Playwright/browser functional checks.
- `web-performance-optimization`: deeper Core Web Vitals, bundles, caching, and runtime optimization.
- Existing `code-review` remains the cross-project review skill.

### Content and conversion
- `copywriting`: website and product marketing copy.
- `seo-optimizer`: technical and on-page SEO.
- `page-cro`: landing and marketing page conversion.
- `form-cro`: contact, lead, quote, application, survey, and checkout forms; not signup flows.

### Specialized
- `interactive-portfolio`: portfolio projects only.

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
- Existing NorDa-specific skills take precedence for the public site, admin panel, Worker API, and database.
- Testing, accessibility, and performance skills complement one another.
- Marketing skills must not create deceptive claims.
- Motion is progressive enhancement; respect `prefers-reduced-motion`.

## Important
The names above are routing guidance, not proof that every skill is installed. Read only skill files that actually exist under `agents/skills/`. Do not create empty placeholders and treat them as complete.
