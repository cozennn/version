---
name: opendesign
description: Create or substantially redesign HTML design artifacts, prototypes, decks, UI kits, and brand systems. Establish context, select a design specialist, and carry artifacts through preview and verified delivery. Existing product code stays in its project; review-only requests belong to ui-ux-review.
---

# OpenDesign

Turn the brief into an intentional, usable artifact. Own the result through verification, including delegated work. Use HTML for standalone artifacts; preserve the existing stack and files when editing a product.

## Context and direction

1. Read the brief, actual content, implementation and references. Identify audience, primary action, deliverable and constraints. Existing code and assets can establish a design system without a file called `DESIGN.md`.
2. For standalone artifacts, check `./opendesign/design-systems/*/`. A folder is valid with `SKILL.md`, `colors_and_type.css`, or `tokens/colors_and_type.css`. Read the matching system and announce it. With several systems, choose from the task; ask only when alternatives materially change the result. Never silently blend brands.
3. With no system, use the provided brand or reference. Import or create a reusable system when reuse is part of the task. For an authorized one-off, state a compact direction and proceed; a missing system does not require a setup questionnaire.
4. Ask only for missing information that changes audience, scope, facts or direction. Reuse existing answers. A clear brief needs no question round. When essential facts are missing, ask the smallest useful question and continue independent work; do not invent claims or accept silence as approval.
5. Distinguish **refinement** (preserve identity, content, behavior and scope) from **redesign** (replace visual direction, preserve product facts and required functions). Clarify a genuinely unresolved replacement decision before changing identity.

Choose the surface's job before its look:

| Surface | Priority | Execution |
|---|---|---|
| Marketing / persuasion | Understand the offer and act; one memorable idea | Existing brand first; otherwise select one of @frontend or @taste |
| Product / operations | Complete a task with clear state and low effort | Existing components/system; @prototype for explicitly requested simulation |
| Reading / explanation | Understand structure and content | Legible type, meaningful navigation, restrained motion |
| Showcase / presentation | Inspect the work or follow an argument | @deck for decks, @wireframe for rough alternatives; content leads |

Resolve aliases in [ALIASES.md](ALIASES.md). Load only the selected specialist, not competing aesthetic rulebooks. For ambiguous direction or a substantial redesign, read [design-decisions.md](references/design-decisions.md). A small adjustment needs no new concept exercise.

## Build

- State a brief plan: primary task, visual direction, constraints and completion evidence. Keep type, color, density and states consistent with the direction.
- Reuse existing components, assets and dependencies. A suggested stack, font, icon set or animation engine does not authorize a dependency installation or stack migration.
- Preserve factual content. Label sample data and unavailable assets; never invent customers, metrics, endorsements or capabilities to fill a layout.
- Use real assets or simple native/CSS treatments. If essential imagery is unavailable, use a labeled placeholder and disclose the gap. Do not claim finished artwork while required assets remain missing.
- When alternatives are requested, vary structure or interaction meaningfully. Use the requested count; otherwise choose a small set proportional to the decision rather than mandatory color-only variants.
- Place standalone mockups under `./opendesign/mockups/<task-slug>/`. Respect an explicit output location. Product edits stay in the actual project.
- For OpenDesign artifacts, use @setup if `./opendesign/index.html` is absent; follow [delivery.md](references/delivery.md) to refresh the full manifest and launch @preview. Delegate setup/server work only when useful and available, and pass the delivery contract explicitly so conflicting helper examples do not override it; otherwise do it directly.

## Quality and completion

Batch observations and fixes. Repeat checks for new failures, changed behavior or unresolved acceptance criteria, not to polish endlessly.

1. Open the result. Inspect relevant desktop/mobile views and changed states. Verify the main action, keyboard focus, long content and reduced-motion behavior where applicable. For a deck, check navigation and readability rather than every web-form criterion.
2. Use @ui-review for interactive products or substantial web interfaces; it distinguishes runtime evidence from screenshot/code review. Use @visual-match only with a reference image and a fresh matching capture. Use @critique for requested static visual scoring. Without a reference, review against the brief, not a fictional reference.
3. For substantial work, use an independent reviewer when available. Supply the brief, result path/URL, viewports/states and acceptance criteria. Request evidence, actionable defects and remaining gaps. The author may capture/test beforehand; independent review adds another perspective.
4. **Wait for the result.** Fix verified in-scope defects, then recheck the affected flow with the same content, viewport, theme and state. Delegation, preview reachability, silence or a high aesthetic score is not a pass.
5. If a reviewer/tool is unavailable, perform applicable checks directly and state the limitation. If runtime checks cannot run, deliver a labeled draft/code review with unverified behavior; do not claim functional completion.

Stop when acceptance is met and no known blocking issue remains in the checked scope. If recovery is impossible, report the exact blocker and usable partial result. Do not abandon a failure because a fixed pass count elapsed.

## Taste and file discipline

- Brand and user intent outrank style preferences. Purple, cards, system fonts, serif type, white backgrounds and centered layouts are valid when they serve the brief.
- Choose a clear hierarchy and one focal idea. Decoration, labels, numbers, texture and motion should communicate something rather than repeat mechanically.
- Chinese typography requires glyph coverage, readable line height, sensible wrapping and locale-appropriate punctuation. Do not impose English word counts, uppercase labels or letter spacing on Chinese.
- Support focus, readable contrast, text resizing and appropriate touch targets. Treat 44 CSS px as a useful mobile target, not a universal compliance certificate.
- Copy used assets into the deliverable or use stable project-relative references. Avoid another project's private paths. Keep filenames descriptive, HTML valid and versions in project history.

End with what changed, what was checked, where to open it and material gaps. Report collected evidence; an agent's confidence does not establish user preference or measured usability.
