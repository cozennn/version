---
name: cloudflare-worker-api
description: Build, debug, and maintain NorDa's Cloudflare Worker API and integrations. Use for routes, request handling, CORS, notifications, Telegram integration, and deployment configuration.
---

# Cloudflare Worker API

- Inspect the current Worker entry points, bindings, routes, and configuration before editing.
- Preserve existing production bindings and environment variable names unless a deliberate migration is required.
- Validate methods, paths, payloads, and authentication at the server boundary.
- Apply strict CORS allowlists; never use permissive origins with credentials.
- Keep secrets out of source control, logs, and client bundles.
- Make notification and external-service failures observable without exposing private data.
- Respect existing ticket ownership, ticket state, and human-agent handoff behavior.
- Avoid destructive production changes. Back up affected data before risky database or schema operations.
- After changes, run focused checks and verify the specific route or behavior changed.
