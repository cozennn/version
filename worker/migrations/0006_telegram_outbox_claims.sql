-- Add recoverable atomic claims for Telegram outbox delivery.
-- Additive only: existing pending and sent notifications remain intact.
ALTER TABLE notification_outbox ADD COLUMN claimed_at TEXT;
ALTER TABLE notification_outbox ADD COLUMN claim_token TEXT;

CREATE INDEX IF NOT EXISTS notification_outbox_claim_idx
  ON notification_outbox (status, claimed_at, next_attempt_at);
