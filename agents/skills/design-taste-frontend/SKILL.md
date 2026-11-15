---
name: design-taste-frontend
description: Anti-slop frontend skill for landing pages, portfolios, and redesigns. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. Real design systems when applicable, audit-first on redesigns, strict pre-flight check.
---

# Taste: Intentional Frontend Design

Design marketing pages, portfolios, and editorial surfaces around their audience and purpose. For dashboards, dense tables, multi-step forms, native apps, or real-time collaboration, use the product's existing design system and an appropriate product-UI workflow. Apply this skill only to their separate marketing surfaces.

This is a design execution skill. When OpenDesign is coordinating the task, use its accepted brief and review process; do not start a second interview or add a competing workflow. References resolve through `ALIASES.md` and are loaded only for the current decision.

## 1. Read the brief

Inspect the existing project and supplied material before changing the page. Identify:

- Page kind, audience, primary action, and the result the visitor needs.
- Brand assets, typography, content, visual references, language, and accessibility needs.
- Existing framework, components, tokens, routes, analytics, and constraints.
- Whether the request is a new design, a targeted improvement, or an authorized visual overhaul.

State a short design read in the user's language: page, audience, purpose, and intended visual character. Infer from supplied evidence; ask only when a missing answer materially changes the direction and cannot be resolved from context. Do not invent business facts to fill the gap.

For redesigns, read @redesign before editing. Preserve unrelated behavior and content.

## 2. Set a direction

The accepted brief, brand, product behavior, and project constraints take precedence over aesthetic suggestions. Fonts, colors, grids, card shapes, and punctuation are choices, not universal quality bans.

Use @design for typography, composition, color, content, and assets. Describe a compact palette with semantic roles, a type hierarchy, a layout idea, and one memorable element that serves this subject. If a design system already exists, use its tokens and components before creating alternatives.

The three dials are optional shorthand, not scores or quality gates:

| Dial | Meaning | How to choose |
|---|---|---|
| `DESIGN_VARIANCE` | Familiar structure to expressive composition | Based on brand, comprehension, and the page's job |
| `MOTION_INTENSITY` | Static to choreographed motion | Based on feedback/storytelling needs and motion preferences |
| `VISUAL_DENSITY` | Spacious to information-rich | Based on what visitors need to compare or act on |

Use words or 1–10 values if they help explain a choice. Do not default every request to 8/6/4, raise motion automatically on a redesign, or add effects to justify a dial. Keep decorative motion off when it has no clear purpose.

Review the direction against the brief before implementation. Revise choices that are merely habitual; preserve choices the user has already made.

## 3. Build within scope

Read @implementation for applicable engineering guidance.

- Reuse the project stack and dependencies. Do not install packages, replace frameworks, add themes, or generate images just because this skill lists them as options. New dependencies require explicit user authorization under the workspace contract.
- Use real supplied content. Label sample data visibly when visitors could mistake it for a real claim. Do not invent customer endorsements, testimonials, performance numbers, prices, scarcity, or product capabilities.
- Choose images only when they serve the content. Text-first design, real component previews, diagrams, and restrained CSS can be appropriate. Generated concept images are not evidence of a working product.
- Implement required loading, empty, error, success, focus, and disabled states. Keep names for the same action consistent across buttons, feedback, and navigation.
- Support the requested and existing themes; do not create a second theme by default.
- Test responsive behavior, keyboard access, and reduced-motion behavior for the controls and effects actually present.

## 4. Verify and refine

Read @verification. Use real rendered evidence and interactions where available. Apply only relevant checks and distinguish `Pass`, `Fail`, `Not tested`, and `Not applicable` with reasons. A missing tool or screenshot is not a pass.

Fix observed functional, accessibility, layout, or content failures and retest affected paths. For visual refinement, identify a specific issue in a rendered page, change the relevant choice, and inspect again. Do not add another library or unrelated decoration to compensate for an unclear hierarchy.

When an independent reviewer is assigned, wait for its findings, resolve applicable failures, and collect retest evidence before claiming completion. Use the coordinating workflow's UI/UX review rather than duplicating its full procedure here.

Report what changed, the preview/output, checks actually run, and remaining limits. Report measured performance with conditions; do not claim Core Web Vitals pass from intuition or claim a percentage improvement in design quality without a defined study.

## Reference map

- @design: composition, typography, palette, assets, and content choices.
- @implementation: stack-aware UI, responsive layouts, motion, themes, and performance.
- @redesign: preserve-first audit and change boundaries.
- @verification: applicable checks, evidence, and completion conditions.
- @sources: upstream version, attribution, and local changes.
