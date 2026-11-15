# Skill aliases

Resolve these exact catalog identities in the active environment. If absent, use the entrypoint fallback; do not invent tools or install replacements automatically.

| Alias | Catalog identity | Use |
|---|---|---|
| @frontend | `frontend-design` in the OpenDesign family | Unbranded exploration |
| @taste | `design-taste-frontend` | Marketing/portfolio |
| @prototype | `interactive-prototype` | Explicit clickable simulation |
| @deck | `make-a-deck` | HTML slides |
| @wireframe | `wireframe` | Rough alternatives |
| @setup | `setup-opendesign` | Viewer/folder setup |
| @preview | `run-opendesign` | Preview server |
| @ui-review | `ui-ux-review` | Evidence-backed UI/flow review |
| @visual-match | `visual-verdict` | Screenshot/reference comparison |
| @critique | `critique` | Requested static visual scoring |

`example-skills:frontend-design` is the separate Anthropic plugin skill. It may be chosen as an alternative; do not load both frontend skills for the same aesthetic decision. Resolve by identity and description, not a substring such as `design`.

## Availability in this distribution

@frontend, @taste and @ui-review are included under the sibling skill directories. The other catalog entries are optional and are not bundled. Resolve an available tool/skill before calling it.

Without @setup/@preview, follow references/delivery.md using the bundled viewer and an already installed local HTTP runtime. Without a creation specialist, implement the requested HTML artifact directly in the existing stack. Without a specialist reviewer, collect the applicable browser/code evidence directly through the bundled UI review workflow and state untested limits. Missing optional helpers do not authorize installing packages, inventing tools, or claiming checks ran.
