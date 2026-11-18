# NorDa Website Skills

A curated, modular skill collection for building distinctive, professional websites.

## Important status

This is an organized starter package, not a claim that every selected skill is fully installed.
- 11 skills include their extracted `SKILL.md` source content.
- 6 selected skills are placeholders because their original full source files were not present in the uploaded files.
- `web-quality-audit` was excluded because its audit scope substantially overlaps the more focused testing, accessibility, performance, and SEO skills.
- `web-design-guidelines` was not selected for the core set because it overlaps with `senior-frontend`; it can be reconsidered later.

## Folder structure

- `NORDA-SKILLS.md`: the main routing and behavior instructions.
- `skills/<skill-name>/SKILL.md`: full source for skills available in this package.
- `skills/<skill-name>/SOURCE.json`: source metadata where supplied.
- `skills/<skill-name>/SOURCE_PENDING.md`: placeholder only; not an executable skill.

## How to use

Place this folder in the project or agent environment that supports the Skills format. Read `NORDA-SKILLS.md` first, then load only the relevant skill(s) for the current task. Do not load every skill for every request.

Before using any pending skill, replace its placeholder with the original, complete source files and bundled references.
