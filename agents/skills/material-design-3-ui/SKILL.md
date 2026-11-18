---
name: material-design-3-ui
description: Design or review interfaces using Material Design 3 semantics, adaptive layouts, component behavior, accessibility, and motion. Use only when the brief explicitly requests Material 3 or when an M3-based product already exists.
---

# Material Design 3 UI

## Purpose
Implement Material Design 3 as a semantic and adaptive system, not as a visual shortcut made of rounded cards, pastel colors, and shadows.

## Scope and activation
Use when the user requests Material 3 / Material You, or when the existing product already uses M3. Do not impose Material on NorDa's own brand by default. NorDa's established visual identity takes precedence unless the user explicitly chooses M3.

## Decision sequence
1. Identify platform, user goal, primary action, content hierarchy, input methods, and window sizes.
2. Define semantic color roles, typography, shape, elevation, and spacing tokens before styling screens.
3. Select components by their behavior and semantics, not by appearance.
4. Design adaptive layouts for the actual available window. Wider layouts should improve context rather than stretch mobile UI.
5. Specify relevant states: default, hover, focus, pressed, selected, disabled, loading, error, empty, and success.
6. Add motion only when it communicates state, hierarchy, or spatial continuity.
7. Audit accessibility before approval.

## Non-negotiable rules
- Prefer official current guidance at https://m3.material.io/ and Android implementation guidance at https://developer.android.com/.
- Keep Material 2 and Material 3 guidance distinct.
- Use semantic tokens; avoid scattered raw color values.
- Do not put every row or section in a card.
- Do not use FABs for minor, destructive, or ambiguous actions.
- Do not use chips as generic buttons or primary navigation.
- Never communicate state by color alone.
- Preserve text scaling, keyboard access, visible focus, target size, contrast, and reduced motion.
- Treat M3 Expressive as optional; use it only when it improves clarity or recognition.
- Verify API stability and package versions before generating implementation details.

## Web implementation
Material 3 may guide web interfaces, but do not claim that an Android component or API is officially available on the web. Reproduce semantic roles and interaction behavior while respecting native web conventions and semantic HTML.

## Android implementation
Prefer stable `androidx.compose.material3` APIs for production. Verify current Android guidance for edge-to-edge, system insets, keyboards, foldables, and adaptive navigation. Do not hardcode unverified dependency versions.

## Final review
Score applicable areas from 0–2: task clarity, information hierarchy, component semantics, token consistency, adaptive behavior, states/feedback, accessibility, and expressive restraint. A zero in component semantics, states, or accessibility blocks approval.

## Handoff
Report design intent, adaptive layout, semantic theme roles, component choices, important states, accessibility behavior, motion rationale, implementation caveats, and unresolved issues.
