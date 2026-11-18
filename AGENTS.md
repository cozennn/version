# NorDa project instructions

## Using project skills
Before making a change, inspect the relevant code and read the matching skill file(s) under `agents/skills/`. Use only skills relevant to the current task; do not load every skill for a small change.

### Existing NorDa-specific skills
- `ui-ux-design`
- `frontend-development`
- `responsive-design`
- `accessibility`
- `cloudflare-worker-api`
- `database-d1-sqlite`
- `security-review`
- `code-review`
- `performance`
- `localization-i18n`

### Website specialist skills
- `frontend-design`: primary visual art direction
- `design-system-starter`: design tokens and reusable systems
- `material-design-3-ui`: Material 3 only when explicitly requested or already used
- `premium-web-design`: premium visual craft without imposing a generic luxury look
- `ui-ux-pro-max`: product UX, visual systems, interaction, and UI review
- `scroll-experience`: scroll-led storytelling only when requested
- `senior-frontend`: frontend engineering and review
- `accessibility-auditor`: WCAG and inclusive design audits
- `web-performance-optimization`: Core Web Vitals and web performance
- `react-best-practices`: React/Next.js only
- `tailwind-patterns`: Tailwind CSS v4 only
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
Read `NORDA-SKILLS.md` for the broader website-design workflow and conflict rules. Load only skills relevant to the current task. NorDa-specific platform skills take precedence for Cloudflare, D1, security, localization, and existing application contracts.
