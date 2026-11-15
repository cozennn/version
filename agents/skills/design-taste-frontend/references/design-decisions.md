# Design decisions

Use these as context-sensitive design tools for marketing, portfolio, and editorial pages. Existing brand choices and the accepted brief take precedence. Distinctiveness comes from the subject and its content, not from satisfying a blacklist.

## Direction and composition

Choose what the visitor should understand or do first. A product demonstration, a strong typographic statement, a relevant photo, or an interactive example can each lead a page. The hero does not need an image when the message or working component is the useful visual.

Use a memorable compositional idea and keep supporting material disciplined. Choose symmetry when it helps comparison, asymmetry when it creates a useful focal point, and repeated patterns when content benefits from scanning. Vary sections when their purposes differ; do not force an arbitrary number of layout families.

Plan headline size, image size, and CTA placement together. At representative desktop and mobile sizes, the primary message and action should be easy to find. Check short screens, zoom, and long translations instead of imposing English word counts or a universal two-line title limit.

Avoid accidental blank grid cells, clipping, and navigation wrapping. An intentionally empty area can serve composition; it needs a reason. Switch navigation to a suitable compact pattern when it no longer fits without reducing readable text to a tiny size.

Use cards when they communicate grouping, containment, or interaction. Use spacing, headings, and rules when elevation adds no information. Repeated rows, cards, and tables can be the clearest choice for comparable material; do not replace useful structure with a carousel merely to look unusual.

Before adding eyebrow labels, numbering, status dots, or captions, identify the information each conveys. Number real sequences. Give labels to categories visitors need. Remove decoration that impersonates metadata, progress, or system state.

## Typography

Choose fonts for the brand, language coverage, licensing, rendering quality, and available delivery method. Inter, serif families, system fonts, and pure typographic designs are all valid when they fit. Reuse an existing brand font unless changing it is part of the request.

Use one coherent family or a deliberate pairing with distinct roles. Establish a scale through size, weight, line height, and spacing. For Chinese and mixed-language pages, inspect actual CJK glyphs, numerals, punctuation, fallback fonts, and line breaks; an attractive Latin family is insufficient evidence.

A moderate reading width is a starting point, not a universal character cap. Shorten very long lines when scanning becomes difficult; allow tables, code, and data comparisons the width they need. Avoid tight letter spacing and Latin capitalization conventions that do not fit the script.

Check italic descenders and large display text for clipping in the actual font at supported sizes. Adjust line height, container overflow, and padding based on the rendered result. A fixed 1.1 line-height does not guarantee safety across all fonts.

Emphasis should communicate meaning. Use weight, style, color, or composition deliberately. Preserve supplied copy, quotations, punctuation, and language conventions unless editing is authorized; do not rewrite them to meet an arbitrary glyph ban.

## Palette and shape

Define semantic roles such as surface, text, border, brand action, focus, success, warning, and error. Keep token usage consistent across sections and states. Brand accent, semantic status colors, and chart series have different jobs and may legitimately differ.

Begin with a restrained palette when there is no brand system, then justify additional colors through content and hierarchy. Purple, warm neutrals, saturated accents, pure black, and pure white are available choices, not defects. Check contrast and visual meaning rather than whether a hex value appears on an informal list.

Choose a radius and elevation system with a clear component rule. Buttons, inputs, cards, and pills need not share the same shape; their roles should explain the differences. Test contrast over photographic and translucent backgrounds, including when blur is unavailable.

A page can mix light and dark sections for a deliberate narrative. Check navigation, continuity, contrast, focus, and anchors at the transition. Do not add a global theme switch unless requested or already part of the product.

## Assets and product truth

Use assets in this order of decision, not as a mandatory tool sequence:

1. Check existing brand assets, product screenshots, content, and license constraints.
2. Identify whether an additional photo, illustration, diagram, real component preview, or typographic treatment improves comprehension.
3. Use an available creation or licensed sourcing method appropriate to that gap. Follow its tool instructions and scope constraints.
4. If a necessary asset is unavailable, use an explicit placeholder and report the missing material.

Do not require a fixed image count. Avoid random stock photos whose subject contradicts the section. Use useful alt text for meaningful images and empty alt text for decoration. Reserve image dimensions and supply suitable responsive sizes.

A generated concept image or mocked product preview must be recognizable as illustrative when it could imply a real feature. Never use invented customer logos, quotes, or fabricated usage metrics as social proof. Real company logos do not establish a real customer relationship by themselves.

Distinguish external logo rights from permission to use a third-party icon library. Reuse a suitable installed icon family. A small native SVG or CSS shape can be appropriate; do not install a second package to obey an aesthetic preference.

## Content and actions

Write from the visitor's perspective using concrete names and verbs. Keep the same action label for the same outcome unless context clearly changes its meaning. Multiple placements of a primary CTA are legitimate; do not confuse repeated access with duplicate or conflicting intent.

Keep supporting copy concise while retaining facts visitors need to decide. Use the user's language naturally. Preserve accurate quotations and attribution; do not cut a quote in a way that changes its meaning.

Show source-backed numbers when available. For prototype data, label samples visibly when confusion is possible. Irregular numbers are not more truthful than round numbers. If a metric, testimonial, availability count, or engineering specification lacks a source, omit it or identify it as a sample.

For long content, choose grouping, a table, search, tabs, an accordion, or a separate page according to the information task. Do not hide mandatory details merely to make a marketing page shorter.

## Optional visual vocabulary

These names help discuss a direction; none is a required feature or an implemented library:

- Split hero, editorial manifesto, real product demo, kinetic type.
- Asymmetric grid, bento, masonry, full-width story, consistent comparison rows.
- Sticky stack, reveal sequence, horizontal narrative, scroll-snap gallery.
- Image masking, restrained glass treatment, shared-element transition.

Select an effect only when it communicates hierarchy, feedback, change, or narrative. No effect is mandatory because a library or image tool happens to be installed.
