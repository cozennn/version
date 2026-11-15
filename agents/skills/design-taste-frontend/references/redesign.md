# Redesign without accidental product change

## Identify the requested mode

- Targeted improvement: preserve identity and behavior, fix the observed problem.
- Visual overhaul: build a new visual language within the user's authorized scope.
- New build: no established experience to preserve.

Use context before asking. If an unresolved choice between preservation and overhaul materially changes the task, clarify that choice. An already authorized action does not need repeated permission.

## Capture the baseline

Record the current brand tokens, typography, logo use, component patterns, primary navigation, conversion path, important content, and representative desktop/mobile screenshots where available. Record current problems separately from stylistic preferences.

Identify working states and behavior to protect: keyboard access, errors, empty/loading states, route slugs, anchor IDs, form field identities, analytics events, SEO metadata, and consent/legal text. Use existing tests and a bounded click-through baseline appropriate to the change.

## Change the smallest useful surface

Choose the observed problem first: hierarchy, reading rhythm, contrast, responsive layout, affordance, content clarity, or broken behavior. Adjust the related tokens/components and inspect the result. Typography and spacing can be effective, but they are not automatically safe if they change fitting, overflow, or click targets.

Keep existing brand colors even if they resemble a common design trend. Do not raise motion, lower saturation, enlarge spacing, or rewrite copy merely because this is a redesign.

Preserve existing information architecture and business behavior outside the authorized request. When the request requires changing a route, label, field, logo, event, or legal text, make the change traceable and test its downstream effects. Do not infer that a visual refresh authorizes those changes.

## Verify the difference

Compare before/after at the same content, states, viewport, and theme. Verify that the targeted issue improved and that relevant protected behavior still works. Recheck overflow, anchors, keyboard focus, long translations, and reduced-motion rendering affected by the change.

Explain the improvement using evidence: what a visitor can now read, find, or do more clearly. Avoid unsupported percentage claims about aesthetic quality or migration risk.
