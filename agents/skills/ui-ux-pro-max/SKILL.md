---
name: ui-ux-pro-max
description: Research and reason about interface styles, product patterns, color, typography, layout, accessibility, motion, and frontend stack choices. Use for UI/UX design decisions, audits, and cohesive design systems.
---

# UI/UX Pro Max

## Purpose
Make evidence-informed interface decisions across product structure, visual identity, interaction, accessibility, and implementation. This is a decision-support skill, not permission to redesign a product without respecting its existing identity.

## When to use
- New pages or product surfaces.
- Choosing or reviewing visual direction, palettes, typography, spacing, and layout.
- Improving navigation, forms, tables, cards, dialogs, and interaction states.
- UX/accessibility audits and responsive behavior reviews.
- Selecting implementation patterns for the stack already present in the repository.

Skip for backend-only, database-only, infrastructure, or non-visual tasks.

## Required workflow
1. **Understand the product:** identify user, task, product category, content, platform, business goal, and primary action.
2. **Inspect the codebase:** detect the real framework, CSS system, component library, and existing design tokens.
3. **Choose direction:** define a product-appropriate visual concept. Explain why it fits; do not pick a style because it is fashionable.
4. **Define the system:** color roles, typography roles, spacing scale, layout widths, radii, borders, shadows, iconography, and motion.
5. **Design behavior:** specify navigation, feedback, validation, loading, empty, error, success, disabled, and selected states.
6. **Apply stack guidance:** use the actual stack's idioms and keep dependencies minimal.
7. **Audit:** responsive, keyboard, contrast, semantics, reduced motion, performance, and content clarity.
8. **Deliver:** list decisions, changed files, verification, and unresolved tradeoffs.

## Priority order
1. Accessibility and task completion.
2. Interaction clarity and touch/keyboard behavior.
3. Responsive layout and content hierarchy.
4. Performance and perceived speed.
5. Typography, color, spacing, and visual style.
6. Motion and decorative expression.
7. Charts and data visualization.

## Product-style selection
Choose a style based on product type, audience, content density, trust needs, and brand. Possible directions include editorial, minimal, brutalist, technical, warm, playful, luxury, utilitarian, or expressive. These are vocabulary, not templates. Never apply the same visual recipe to every project.

## Design system rules
- Use semantic tokens rather than raw values scattered through components.
- Define roles before choosing exact values.
- Maintain hierarchy across headings, body, labels, controls, and metadata.
- Ensure color contrast and do not communicate meaning by color alone.
- Use consistent spacing with intentional exceptions.
- Icons should be consistent and understandable; do not use emoji as interface icons.
- Use cards only when grouping or containment is meaningful.
- Preserve content density where it supports the user's task.

## UX rules
- Prefer visible labels over placeholder-only labels.
- Keep errors near the affected control and explain recovery.
- Provide loading feedback for async actions.
- Confirm destructive actions when the consequence is significant.
- Do not rely on hover for essential information.
- Support keyboard, touch, browser zoom, and assistive technology.
- Make focus visible and ensure dialogs manage focus correctly.
- Keep navigation predictable and avoid overloading top-level destinations.

## RTL and localization
For Arabic and other RTL languages, set direction at the correct document or component boundary. Verify mixed-direction numbers, prices, email addresses, icons, carousels, charts, and motion. Do not mirror logos or directional symbols blindly. Test long translated labels and text expansion.

## Motion
Use motion to communicate state, relationship, or hierarchy. Keep it brief and interruptible. Respect `prefers-reduced-motion`; no content or action may depend on animation.

## Stack-specific decisions
Detect the stack from repository files. Do not assume React/Tailwind. When React exists, follow `react-best-practices`; for Tailwind v4, follow `tailwind-patterns`; for detailed engineering, follow `senior-frontend`. Avoid duplicate or conflicting rules by treating this skill as the product-design decision layer.

## NorDa identity
Do not impose Material, Apple-like luxury, generic SaaS cards, purple gradients, or a trendy design system on NorDa. Use the approved NorDa palette and typography unless the user asks to change them. Preserve ar/fr/en behavior, currency selection, templates, digital products, cart, checkout, and support workflows.

## Final quality gate
A design is not ready if a primary task is unclear, a control is semantically wrong, keyboard operation fails, important content is hidden, mobile layout overflows, or reduced-motion mode breaks the experience.
