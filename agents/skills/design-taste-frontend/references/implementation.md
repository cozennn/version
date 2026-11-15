# Implementation guidance

Read the repository first. This reference does not authorize new dependencies, a framework migration, or a larger feature scope.

## Existing foundation first

Inspect the package manifest, build configuration, components, tokens, and supported browsers. Reuse the existing framework and design system. A brief saying “Microsoft-like” or “Apple-like” describes a reference, not permission to install a new SDK or claim official affiliation.

If the user has explicitly requested a new design system, compare it against project constraints and consult its current official documentation before use. Keep one coherent token and component policy; planned interoperability is possible, accidental duplication is the problem.

Useful primary documentation when that system is already selected:

- [Material](https://m3.material.io/develop/web)
- [Fluent](https://fluent2.microsoft.design/)
- [Carbon](https://carbondesignsystem.com/)
- [Primer](https://primer.style/)
- [GOV.UK](https://design-system.service.gov.uk/)
- [USWDS](https://designsystem.digital.gov/)
- [Radix](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind](https://tailwindcss.com/docs)

Do not assume a package exists because the skill mentions it. Check installed versions and the repository's import convention. If a package is missing and new dependencies are not authorized, use existing code or native capabilities and explain any material limit.

## Components and state

Use the framework already in the project. In a Next.js project using React Server Components, isolate browser state, event handlers, and animation code in the appropriate client components; keep static parts server-rendered where that architecture already applies. Do not add client directives to framework-independent HTML or unrelated React environments.

Keep isolated UI state local. Add shared state only for a demonstrated shared-data need. Avoid storing high-frequency pointer or scroll coordinates in React state when this causes whole-tree rerenders; prefer native CSS, existing animation primitives, refs, or a properly scheduled implementation.

Use semantic buttons and links with correct behavior. Connect form labels to inputs; placeholders supplement labels. Make errors understandable and associated with their fields. Preserve user input through recoverable failures. Present an appropriate loading indicator for the operation; a skeleton is useful for content layout but not mandatory for every task.

Follow the product's actual async model for disabled, pending, success, and retry states. Do not introduce a pretend server request solely to demonstrate loading UI.

## Responsive layout

Reuse project breakpoints and container widths. Prefer Grid for two-dimensional layouts and Flexbox for one-dimensional alignment. Avoid brittle percentage arithmetic when a simpler layout primitive works, but do not rewrite working Flexbox on principle.

Use viewport units according to the requirement: `svh` can provide stable small-viewport sizing; `dvh` tracks the changing viewport. Choose after considering mobile browser chrome and content overflow. Avoid fixed hero heights that clip long text or zoomed content.

At narrow widths, make each section readable and operable. A single column is often appropriate, but comparison tables, carousels, and split controls may need their own explicit behavior. Any intentional horizontal region should remain discoverable, labeled, and usable without causing page-wide overflow.

Use shared spacing, elevation, radius, and layer tokens. Keep overlays above their content, ensure focus is visible, and check sticky elements do not cover anchors, errors, or controls. Add new layer constants only when the project needs them.

## Fonts and assets

Use the repository's established font loading policy and licensed font files. Prefer available local/system fonts where appropriate. If using Next.js, its font tooling may fit; a native page does not need that framework. Account for language coverage, fallback metrics, and layout shift rather than forcing one loading API everywhere.

Reserve image and embed space, use appropriate sizes, and prioritize genuinely above-the-fold critical media. Lazy-load noncritical heavy content when supported. Do not lazily load the likely LCP image by accident. Test failed-image behavior and meaningful alt text.

## Motion

Before adding motion, state its purpose: attention, explanation, feedback, or continuity. Use existing/native capabilities for simple transitions. Bring in another animation library only when explicitly authorized and the need warrants it.

For reveal-on-entry, IntersectionObserver, CSS animation features with appropriate support, or the project's animation library can work. For sticky stacks and horizontal narratives, verify start/end positions, available distance, touch scrolling, resize behavior, and reading order. These effects are optional and often unnecessary.

Avoid two engines controlling the same property or competing for scroll behavior. Mixing libraries in a project is not itself a correctness failure; inspect ownership and measurement cost. Clean up listeners, observers, animation instances, and frames when components unmount or preferences change.

Prefer transform and opacity for frequent visual motion. If a layout property must animate, measure the cost and check the content remains usable. Set `will-change` only when justified, rather than permanently on every element. A native passive scroll listener with suitable scheduling is not categorically forbidden; measure actual impact.

Respect `prefers-reduced-motion` for applicable animations regardless of any dial value. Remove unnecessary parallax, automatic loops, magnetic pointer effects, and scroll hijacking. Ensure the fallback exposes all content and controls; a static fallback must not leave slides off-screen or hidden behind `overflow`.

See current [MDN reduced-motion guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) and the selected library's documentation when implementation details are uncertain.

## Theme and material

Implement the themes requested or already supported. If both themes are in scope, use the existing semantic-token strategy and validate both; preserve the established default and preference behavior. A fixed brand theme can be intentional.

For glass effects, ensure usable contrast with no blur, no transparency, or missing browser support. Apple-inspired web glass is an approximation; do not present it as an official Apple web package. Expensive filters and noise require measurement on relevant hardware, especially on scrolling surfaces.

## Performance evidence

Reserve layout space, minimize unnecessary code, and test interactions before adding polish. Treat LCP, CLS, and INP as metrics with collection conditions, not visual impressions. Where budgets are specified, compare results to those budgets; otherwise report observations without inventing a requirement.

If collecting a lab report, record tool, device/network settings, route, time, and whether caches were warm. Lighthouse cannot substitute for real-user INP data. A short local test cannot establish the site's field Core Web Vitals; label lab and field observations separately.
