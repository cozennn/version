---
name: senior-frontend
description: Plan, implement, review, and optimize production frontend code. Use for React, Next.js, TypeScript, component architecture, rendering, bundle size, accessibility, and frontend quality reviews.
---

# Senior Frontend Engineer

## Mission
Deliver maintainable, accessible, measurable frontend work that fits the repository's actual framework and architecture. Do not scaffold a new app when the task is to improve the existing one.

## Start with repository evidence
Inspect package.json, lockfiles, framework configuration, routes, components, styling system, tests, and deployment constraints. Identify the actual stack and version. Do not assume Next.js, React, Tailwind, or a particular router until confirmed.

## Architecture
- Prefer the smallest change that solves the problem.
- Reuse existing components and conventions before adding abstractions.
- Keep component responsibilities narrow and state ownership explicit.
- Use semantic HTML and native browser behavior.
- Avoid premature global state, unnecessary dependencies, and speculative refactors.
- Preserve API, database, authentication, and deployment contracts unless the task explicitly changes them.
- Do not introduce server/client boundaries or hydration complexity without a demonstrated need.

## React
- Keep render logic pure; effects synchronize with external systems rather than derive ordinary state.
- Use stable keys based on entity identity.
- Avoid redundant state and duplicated sources of truth.
- Memoize only after identifying meaningful repeated work or referential requirements.
- Keep event handlers and async flows resilient to pending, error, cancellation, and unmount cases.
- Use composition before building deeply configurable components.
- Add error boundaries where recovery from render failures is appropriate.

## Next.js (only if detected)
- Prefer Server Components for non-interactive server-rendered content.
- Use Client Components only for state, event handlers, effects, or browser APIs.
- Keep client boundaries narrow.
- Verify current framework behavior before using caching, revalidation, route handlers, or experimental APIs.
- Use the framework image/font tooling where it fits the project and configure remote assets narrowly.

## CSS and responsive UI
- Follow the repository's existing styling approach.
- Use design tokens and avoid one-off overrides that fight existing cascade layers.
- Check narrow phones, tablets, laptop, and wide desktop.
- Prevent horizontal overflow; do not disable zoom.
- Respect RTL, localization, long labels, and text expansion.

## Performance
- Establish a baseline before optimizing.
- Measure LCP, INP, CLS, route bundle size, and expensive runtime work when tooling permits.
- Reduce unnecessary JavaScript and dependencies; split heavy features at meaningful boundaries.
- Reserve media dimensions, optimize responsive images, and avoid lazy-loading the LCP image.
- Do not claim a performance improvement without a measurement or a clearly identified code-level reduction.

## Accessibility and tests
- Keyboard access, visible focus, semantic names, labels, error associations, contrast, reduced motion, and zoom are release requirements.
- Test user-visible behavior, not implementation details.
- Add or update focused tests for changed behavior.
- Run the repository's actual lint, typecheck, test, and build commands when available.
- Do not invent passing checks; report unavailable tools or failed commands honestly.

## Decision questions
Before architecture-changing work, establish:
1. Primary device and network.
2. Measurable LCP/INP/CLS target.
3. SEO-dependent public surface or authenticated app.
4. Per-route JavaScript budget where relevant.
5. Existing design-system source of truth.
6. Accessibility target and test ownership.

If an answer can be inferred safely from the repo, state the inference and proceed. Ask only when it changes the architecture materially.

## NorDa-specific boundaries
Preserve the current Cloudflare Pages/Worker/D1 architecture and API contracts. Do not silently migrate hosting, database, framework, payment flow, or support-ticket behavior. NorDa is a production project: inspect before changing, back up data before risky schema changes, and run focused checks for the changed feature.
