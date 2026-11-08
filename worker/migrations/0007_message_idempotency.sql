-- Prevent duplicate visitor messages when a client retries the same request.
-- Existing messages remain unchanged; NULL keys are allowed for legacy rows.
ALTER TABLE messages ADD COLUMN client_message_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS messages_client_idempotency_idx
  ON messages (ticket_id, client_message_id)
  WHERE client_message_id IS NOT NULL;
