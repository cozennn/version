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

## NorDa working rules
- Inspect the existing implementation before editing; preserve established architecture and visual identity.
- Prefer focused changes over rewrites and avoid unnecessary dependencies.
- Keep public site, admin panel, Worker API, and database contracts consistent.
- Never expose secrets or invent environment values.
- Back up production data before risky database changes.
- Run a focused check for the changed feature and report the actual result.
- Do not claim that repository skill files are automatically loaded by every AI tool. If the active coding environment does not support Agent Skills or `AGENTS.md`, provide the relevant skill text to that environment or configure its own rules mechanism.
