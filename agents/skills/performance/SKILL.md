---
name: performance
description: Improve NorDa loading speed, rendering performance, bundle size, and API/database efficiency. Use when investigating slow pages or expensive operations.
---

# Performance

- Measure or identify the actual bottleneck before optimizing.
- Avoid unnecessary dependencies, large assets, repeated requests, and duplicate data fetching.
- Use pagination or bounded queries for potentially large ticket/message lists.
- Avoid expensive work during every render; follow the framework's established patterns.
- Optimize images and fonts without harming visual quality or language coverage.
- Preserve correctness and accessibility while optimizing.
- Report measurable results when tooling provides them; do not invent performance gains.
