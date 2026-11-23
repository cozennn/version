NorDa — self-hosted fonts
=========================

Place the following .woff2 files in THIS directory:

  Tajawal-Regular.woff2       (400)
  Tajawal-Medium.woff2        (500)
  Tajawal-Bold.woff2          (700)

  Manrope-Regular.woff2       (400)
  Manrope-Medium.woff2        (500)
  Manrope-SemiBold.woff2      (600)
  Manrope-Bold.woff2          (700)
  Manrope-ExtraBold.woff2     (800)

Sources (both are SIL Open Font License):
  • Tajawal    — https://fonts.google.com/specimen/Tajawal
  • Manrope    — https://fonts.google.com/specimen/Manrope

Convert to woff2 with https://github.com/google/woff2 or any font tool.

The app works WITHOUT these files — the CSS in
`src/styles/fonts.css` provides a robust system fallback
(Arabic: "Noto Sans Arabic", "Segoe UI", "Tahoma";
English: "system-ui", "-apple-system", "Segoe UI", "Inter").
When the .woff2 files are added, the browser upgrades automatically
via font-display: swap. No code changes required.

This placeholder exists so the project compiles and runs from a
clean checkout — per the alpha build specification, we do not
ship third-party binary assets in the source tree.