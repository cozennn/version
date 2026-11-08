-- Persist whether a ticket is handled by NorDa AI or a human agent.
-- Existing tickets remain in AI mode; their messages and IDs are unchanged.
ALTER TABLE tickets ADD COLUMN support_mode TEXT NOT NULL DEFAULT 'ai'
  CHECK (support_mode IN ('ai', 'human'));
