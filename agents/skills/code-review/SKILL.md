---
name: code-review
description: Review NorDa code changes for correctness, regressions, security, maintainability, and consistency across the public site, admin panel, and API.
---

# Code Review

- Review the actual diff and trace affected call paths before judging a change.
- Prioritize concrete bugs, regressions, data loss, authorization gaps, and broken integrations.
- Check that public-site, admin, and Worker request/response contracts still match.
- Look for stale field names, mismatched status values, inconsistent routes, and duplicated logic.
- Verify error handling and edge cases, not only the happy path.
- Do not report stylistic preferences as blockers unless they violate repository conventions.
- Give findings first, ordered by severity, with file and line references when available.
- If no issues are found, state what was checked and what remains unverified.
