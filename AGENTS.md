# NorDa project instructions

## Using project skills
Before making a change, inspect the relevant code and read the matching skill file(s) under `agents/skills/`.
Use only skills relevant to the current task; do not load every skill for a small change.

Available skills:
- `ui-ux-design`: visual design and interface behavior
- `frontend-development`: frontend implementation
- `responsive-design`: mobile and responsive behavior
- `accessibility`: accessible markup and interaction
- `cloudflare-worker-api`: Worker routes, API, and integrations
- `database-d1-sqlite`: D1 schema, SQL, and migrations
- `security-review`: authentication, authorization, uploads, and data protection
- `code-review`: review diffs and cross-project contracts
- `performance`: speed and efficiency
- `localization-i18n`: Arabic, English, French, and RTL
- `design-system-starter`: design tokens, component systems, and theming
- `accessibility-auditor`: WCAG and inclusive web accessibility audits
- `web-performance-optimization`: web performance and Core Web Vitals
- `react-best-practices`: React/Next.js implementation guidance
- `tailwind-patterns`: Tailwind CSS utility patterns
- `webapp-testing`: browser-based functional testing
- `copywriting`, `seo-optimizer`, `page-cro`, `form-cro`, `interactive-portfolio`: content, search, conversion, and portfolio specialists

## NorDa working rules
- Inspect the existing implementation before editing; preserve established architecture and visual identity.
- Prefer focused changes over rewrites and avoid unnecessary dependencies.
- Keep public site, admin panel, Worker API, and database contracts consistent.
- Never expose secrets or invent environment values.
- Back up production data before risky database changes.
- Run a focused check for the changed feature and report the actual result.
- Do not claim that repository skill files are automatically loaded by every AI tool. If the active coding environment does not support Agent Skills or `AGENTS.md`, provide the relevant skill text to that environment or configure its own rules mechanism.

## Website design skill routing
Read `NORDA-SKILLS.md` for the broader website-design workflow and for deciding which optional skills apply to a task. Do not duplicate the existing NorDa-specific skills listed above. Optional skills become available only after their complete `SKILL.md` files are copied into `agents/skills/<skill-name>/`.
