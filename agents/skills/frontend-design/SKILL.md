---
name: frontend-design
description: Explore and implement a distinctive visual direction for an unbranded HTML artifact when selected by OpenDesign or explicitly requested. Focuses on typography, color and composition; preserve existing brands for product refinements and use ui-ux-review for review-only requests.
---

# Frontend direction

OpenDesign's visual exploration helper. Work from the brief and subject, not an obligatory extreme style. This is distinct from the Anthropic plugin's `example-skills:frontend-design`; choose one aesthetic helper for a task.

## Decide before building

State three compact choices:
- **Purpose:** the user's main job on this surface.
- **Tone:** character appropriate to the audience and subject.
- **Focal idea:** one feature of the design worth remembering.

Honor specified brand colors, typography, content and output constraints. Preserve brand identity unless its replacement is explicitly authorized; a visual redesign request alone does not authorize replacing the logo, brand palette or factual content. Reuse the established stack and dependencies; a guide's suggestion does not authorize installing fonts, packages, icons or motion engines.

## Compose

- Create hierarchy through size, weight, space and alignment. Deliberate simplicity is as valid as bold treatment. Focus expression where it improves recognition or understanding.
- Choose fonts with needed glyph coverage. A system Chinese font stack can be correct. Inspect mixed Chinese/Latin text, line height, punctuation and wrapping; avoid Latin-only fonts for Chinese headings.
- Use a coherent palette with checked text/background contrast. Brand and semantic status colors take precedence over an arbitrary accent limit.
- Choose layout from the task. Asymmetry, centered headings, repeated grids and generous space each need a reason; none is universally required or banned.
- Use imagery and textures when the subject benefits. Plain surfaces are valid. Do not invent screenshots, customers, metrics or decorative facts to fill space.
- Use motion for hierarchy, feedback or state changes. Prefer existing CSS/native capabilities for simple effects; support reduced motion and keep content reachable.
- Vary concepts when alternatives are requested. Preserve continuity within a brand; do not force rotation across related work.

## Deliver

Standalone OpenDesign artifacts go in `./opendesign/mockups/<task-slug>/` unless the user gives a destination. Product edits stay in their project.

Check actual renders at relevant widths and any primary action. Disclose unfinished assets or untested behavior. Follow OpenDesign's completion process: collect review results, fix defects and verify them. Source inspection alone does not prove functional or visual completion.
