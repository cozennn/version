---
name: premium-web-design
description: Create or refine premium, high-craft websites with a distinctive visual identity, disciplined hierarchy, deliberate typography, purposeful motion, and strong performance. Use for premium positioning, landing pages, and high-end brand experiences.
---

# Premium Web Design

## Core principle
Premium quality comes from restraint, intention, and execution. It does not mean copying Apple, using a luxury serif, adding large whitespace, or applying a dark palette. The design must fit the actual brand, audience, content, and product.

## Before designing
Inspect the existing site, assets, content, routes, and components. Identify the audience, the page's main job, the brand's visual language, and the required conversion action. Preserve working functionality and real content. Do not invent clients, testimonials, metrics, awards, or product claims.

## Visual direction
- Choose one memorable visual idea and keep supporting elements disciplined.
- Build a compact token system for color, type, spacing, layout, borders, radii, shadows, and motion.
- Choose typography for the brand and language coverage; test Arabic shaping and RTL when relevant.
- Use asymmetric or editorial composition only when it improves hierarchy.
- Avoid generic centered text over gradients, identical cards for every section, decorative eyebrow labels everywhere, and arbitrary UI chrome.
- Use real product imagery or purposeful custom visuals; never substitute generic stock imagery for evidence.
- Keep primary actions obvious and secondary actions visually quieter.
- Use copy that is concrete, concise, and truthful.

## Layout and content rhythm
Give each section one clear purpose. Vary composition according to content rather than forcing every section into the same grid. Avoid stacking dense sections without a visual or informational pause. Keep readable line lengths and responsive type using fluid sizing where appropriate.

## Motion
Motion must clarify a change, guide attention, or support a product story. Prefer transform and opacity; profile other animated properties. Avoid scroll-jacking, excessive parallax, repeated entrance animations, and animation that blocks reading or input. Respect `prefers-reduced-motion` and provide a usable static state.

## Performance and accessibility
- Protect Core Web Vitals: LCP, INP, and CLS.
- Do not lazy-load the primary LCP image; reserve image dimensions and use responsive formats.
- Load only necessary fonts and weights.
- Preserve semantic HTML, keyboard operation, visible focus, meaningful alt text, sufficient contrast, zoom, and reduced motion.
- Premium polish never overrides accessibility or speed.

## Implementation workflow
1. Audit the existing implementation and constraints.
2. Propose a short, subject-specific visual direction and token set.
3. Compare it against the brand and reject generic defaults.
4. Implement consistently across all relevant states and breakpoints.
5. Inspect screenshots at desktop and mobile sizes when tooling allows.
6. Verify navigation, forms, buttons, loading/error/empty states, keyboard use, and responsive overflow.
7. Report exactly what changed and what was verified.

## NorDa boundary
NorDa's established palette, typography, bilingual/trilingual requirements, pricing/payment behavior, and existing site structure are constraints. Do not replace them with a generic luxury aesthetic. Premium means making NorDa's own identity feel more deliberate and trustworthy.
