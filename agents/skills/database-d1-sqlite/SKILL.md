---
name: database-d1-sqlite
description: Design, query, migrate, and troubleshoot NorDa's Cloudflare D1 SQLite database. Use for schema changes, SQL, indexes, data integrity, and migrations.
---

# Database Engineering

- Inspect the current schema and migration history before proposing changes.
- Write migrations that are ordered, repeatable where feasible, and compatible with deployed code.
- Prefer additive migrations; avoid destructive table or column changes without an explicit need.
- Consider indexes for frequently filtered or joined columns.
- Use parameterized queries; never concatenate untrusted input into SQL.
- Preserve relationships, ownership rules, and ticket/message history.
- Before risky production migrations, create and verify a backup.
- Check migration status and perform a focused query or feature check after applying changes.
