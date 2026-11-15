---
name: security-review
description: Review NorDa for application security issues involving authentication, authorization, sessions, uploads, API endpoints, secrets, and user data.
---

# Security Review

- Treat all client input, uploaded files, external API responses, and stored content as untrusted.
- Verify authorization on the server for every user-specific resource and action.
- Enforce ticket ownership and role permissions; do not rely on hidden UI controls.
- Protect sessions and tokens; never expose secrets in frontend code, commits, or logs.
- Validate upload size, type, filename, and storage access; do not trust MIME headers alone.
- Use parameterized database queries and safe output rendering.
- Apply rate limits or abuse controls to sensitive endpoints where appropriate.
- Report findings by severity with file/route references and practical fixes.
- Do not claim the system is secure based only on a build passing.
