# NorDa — Design System

## Philosophy

NorDa is not a SaaS dashboard. It is a digital brand that combines a
store, a portfolio, and a services studio. The design must feel
**editorial**, **premium**, and **distinct** — closer to a well-designed
print magazine than to a component-library demo.

Every visual decision below is a *deliberate* constraint. If a future
batch wants to break one of these rules, it must record why here.

## Color

- **Primary brand:** `#5A46D6` (`--brand`). Used on primary buttons,
  active tab underlines, focus rings, and the "N" monogram.
- **Rose accent:** `#C2648A` (`--rose`). Used *sparingly* — portfolio
  pull-quotes, the "wardah" (rose) flourish, never on commerce CTAs.
- **Paper base:** `#FBFAF7`. Never pure white. The warmth signals craft.
- **Ink:** `#141225`. Slightly violet-tinted near-black. Text hierarchy
  runs ink → ink-muted (`#4B4A5E`) → ink-faint (`#807F90`).
- **Semantic:** success `#2E7D5B`, warning `#B8791C`, danger `#B23A3A`,
  info `#2D5B8C`. Each has a matching `-soft` tint for backgrounds.

**Forbidden:** purple gradients, glassmorphism as a default surface, more
than one brand color on a single screen element.

## Typography

- **Arabic:** Tajawal (fallback: Noto Sans Arabic → system Arabic →
  Tahoma). Line-height 1.75.
- **English:** Manrope (fallback: system-ui → Inter). Line-height 1.6.
- **Display** headings use `--font-display` (Tajawal in AR, Manrope in EN).
- **Scale** in `tailwind.config.ts`. Headings from 3xl upward carry
  negative letter-spacing for tightness; body stays neutral.

## Spacing

- 4-based scale. Sections use `py-20`/`py-28` (desktop) with `py-14`/`py-20`
  (mobile). Never pack two primary CTAs into one viewport without an
  intervening rule or whitespace.

## Radius

- `xs` (4px) for inputs.
- `sm` (6px) for small chips.
- `md` (8px) for buttons, cards.
- `lg` (12px) for modals, large surfaces.
- `full` only for tags/pills — **not** for card containers.

## Shadows

- Three soft tiers. Light source is top-start.
- No glow, no neon, no inner shadows except 1px inputs rings.

## Motion

- `fast` 120ms, `base` 240ms, `slow` 400ms. Easing `cubic-bezier(0.2,0.8,0.2,1)`.
- Reduced-motion collapses all durations to `0ms` via `tokens.css`.
- Animations are used to *reveal* structure (fade/rise), never to distract.

## Layout

- Container widths: `prose` (68ch), `content` (1120px), `wide` (1320px),
  `bleed` (1600px). Default is `content`.
- Breakpoints: xs 380 / sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536.
- **Directional properties everywhere** (`padding-inline`, `inset-inline`,
  `ms-*`, `me-*` in Tailwind). Physical `left`/`right` are forbidden in
  components except in `rtl.css` where a mirror is unavoidable.

## Component architecture

- Primitives in `src/components/primitives/`. Each is a single-purpose
  building block, no data fetching, no routing, no business logic.
- Layout primitives in `src/components/layout/`. Each composes without
  imposing content structure.
- Composed pages (Store, Portfolio, Admin) live in `src/pages/` and are
  built from primitives + layout. They are added in later batches.
- **No page uses the same layout as another.** Store is discovery-led,
  Portfolio is editorial, Services is typographic, Admin is dense
  operational. Shared brand = shared tokens + typography + component
  primitives, *not* shared page templates.

## Accessibility (WCAG 2.2 AA)

- Every interactive element has a visible focus ring (2px brand + 2px offset).
- Color contrast: ink-on-paper `#141225` / `#FBFAF7` = 15.1:1. ink-muted
  on paper = 8.2:1. Brand on paper = 6.5:1 (AA for body text).
- All primitives use native elements or Radix headless components — never
  divs as buttons.
- Skip-link to `#main-content`.
- Reduced-motion respected globally.
- Form fields always have `<label>` via `Field` or `Label`.

## RTL

- `<html dir>` toggled by i18n. Tailwind logical utilities (`ms-*`, `ps-*`,
  `start-*`, `end-*`) used in every component.
- `rtl.css` contains only: shadow light-source mirror (currently a no-op
  since we use symmetric shadows), `.directional-icon` mirroring, and
  Arabic-specific line-height.
- Right/left *never* appear in component Tailwind classes.