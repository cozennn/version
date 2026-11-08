-- Server-issued visitor sessions.
-- Existing tickets and messages are preserved; legacy browser IDs are exchanged once for a server token.
CREATE TABLE IF NOT EXISTS visitor_sessions (
  visitor_id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);

CREATE INDEX IF NOT EXISTS visitor_sessions_expires_at_idx
  ON visitor_sessions (expires_at);
