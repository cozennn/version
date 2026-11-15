# Source and local revision

## Source snapshot

This is a local adaptation of Leonxlnx's Taste Skill, retaining the original `design-taste-frontend` skill name and description. The upstream project is not the author of this local revision.

- Upstream: [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
- Audited file: [skills/taste-skill/SKILL.md](https://github.com/Leonxlnx/taste-skill/blob/3c7017d636c3a4aad378433ea6d0cfa6c921da4a/skills/taste-skill/SKILL.md)
- Last file-change commit: `3c7017d636c3a4aad378433ea6d0cfa6c921da4a`, 2026-05-26.
- Retrieved: 2026-10-02, approximately 05:18 UTC.
- Original file: 1206 lines; SHA-256 `aa194351b246b8b4799099d4ed7b033d29eab6e6e3d58d8d2172978be7b3ec89`.
- The installed file supplied for audit was byte-identical to this source snapshot; the fixed-commit raw URL was also verified against it.
- License: MIT, Copyright (c) 2026 Leonxlnx. The upstream LICENSE was retrieved from the repository on the same date and is retained in this package's LICENSE.

## Local modifications, 2026-10-02

The local revision reorganizes and edits the source guidance. It is not an upstream update or a claim of an official Taste release.

| Source sections | Local treatment |
|---|---|
| 0, 1, 13 | Preserve brief inference and marketing/portfolio scope; optional dials without automatic high-motion defaults |
| 2, 3, appendices | Keep stack-awareness and official-reference principle; remove automatic installation and framework requirements |
| 4, 9, 10 | Keep hierarchy, typography, token consistency, and content/asset decisions; remove absolute font/color/punctuation/layout bans |
| 4.5, 4.6, 6 | Keep states, semantics, mobile and reduced-motion checks; correct point/pixel contrast threshold |
| 4.8, 4.9, 9.D | Use appropriate assets without forced image generation; require truth or identifiable sample data, removing fabricated-number incentives |
| 5, 7 | Keep motivated motion, cleanup, and fallback; remove blanket API bans and dial-driven effect requirements |
| 6.C, 8 | Scope theme work to requested or existing modes |
| 6.D, 14 | Replace plausible-performance claims and unconditional checklist with applicability, execution evidence, and verification limits |
| 11 | Preserve audit-first redesign, brand/content/behavior protection, and change-impact verification |
| 12 | Do not advertise the upstream proposed block schema as an implemented component library |

Long reference material is loaded by decision through `ALIASES.md`; the old monolithic source is a baseline audit artifact, not an active mandatory reference. No new framework or animation package is bundled.

## Independent cross-checks

Anthropic's current frontend-design skill was reviewed separately and was also byte-identical to its installed plugin copy. Its brief-led, restrained-design principles support choosing one direction rather than combining contradictory aesthetic blacklists. No Anthropic source text or code is vendored in this package.

- [Anthropic frontend-design audit version](https://github.com/anthropics/skills/blob/41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f/skills/frontend-design/SKILL.md)
- [W3C contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), checked for the 18pt / 14pt-bold correction.

The first revision aims to reduce contradictory instructions and scope expansion. It does not itself establish that design output improved, that any interface passed an accessibility audit, or that a percentage quality gain has been measured. Those claims require evaluation of actual outputs.
