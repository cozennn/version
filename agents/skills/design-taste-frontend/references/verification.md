# Evidence-based completion

This is an applicability checklist, not a requirement to add missing features. Use the coordinating workflow's review report when one exists. Do not duplicate its full audit.

For each relevant check record `Pass`, `Fail`, `Not tested`, or `Not applicable`, followed by evidence or a reason. A checkbox reflects an executed observation; source inspection alone is not a rendered or interaction test.

## Core checks

| Area | Evidence to collect |
|---|---|
| Brief and brand | Output serves the named audience/action and follows supplied identity |
| Content truth | Real claims have a source; prototype samples are identifiable; no invented endorsements |
| Hierarchy | Screenshot shows a clear primary message/action without unrelated decoration competing |
| Layout | Representative wide/narrow and short viewports; no accidental clipping, overlap, page overflow, or unreachable controls |
| Type | Real target-language strings, long labels, fallback fonts, zoom, and display descenders inspected |
| Actions | Primary buttons and links lead to the intended result; repeated action names stay consistent |
| Forms | Labels, keyboard operation, validation, entered-data preservation, and recovery checked where present |
| States | Required empty/loading/error/success/disabled states tested; no state claimed only from a default screenshot |
| Accessibility | Semantic controls, names, focus visibility/order, contrast, and reduced-motion fallback checked |
| Themes | Every requested or existing theme tested; unrequested themes marked not applicable |
| Assets | Images load, have appropriate alt handling, preserve layout space, and do not imply false claims |
| Motion | Purpose is clear; preferences/resize/touch/fallback/cleanup checked for effects actually used |
| Regression | Protected routes, content, events, and product flows remain correct within the changed surface |
| Performance | Actual measurement and conditions if run; otherwise not tested, never “plausibly passed” |

## Contrast units and states

For WCAG 2.2 text contrast, use at least 4.5:1 for ordinary text. The 3:1 large-text exception applies at 18pt regular (24 CSS px) or 14pt bold (about 18.67 CSS px), with equivalent sizing considerations for CJK fonts. Do not treat 18px ordinary text as large text. If eligibility is uncertain, use 4.5:1.

Measure the actual foreground/background combination, including overlays and images. Distinguish text contrast from non-text component/focus requirements; the same number is not appropriate for every element. Do not apply active-control thresholds mechanically to exempt incidental or inactive content, and do not use exemptions to make essential instructions illegible.

Primary references:
- [W3C contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [W3C focus visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)

## Visual iteration

1. Inspect a real render against the brief or the requested visual reference.
2. Identify a concrete issue and the element causing it.
3. Make a bounded change; preserve working behavior and content.
4. Re-render the affected sizes/states and compare with the previous evidence.

When an independent reviewer is available, give it the brief, paths, screenshots, and runnable interaction context. Await findings, fix applicable failures, and obtain retest evidence. The creator's own review and the independent review are different evidence types.

## Honest completion

A material known failure keeps the affected work incomplete until fixed or explicitly accepted by the user. If a required check cannot run, describe the verification limit without calling it a pass. Do not hide unavailable browser, screenshot, performance, or field-data evidence behind a claim that all checks passed.

A small routing test can show that the skill respects boundaries. It does not demonstrate that produced designs are better. Visual-effect claims need comparable outputs, the same brief and resources, and independent or user review; report uncertainty and sample size.
