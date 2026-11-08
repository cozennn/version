-- Add an atomic lease to each pending Telegram outbox delivery.
-- This prevents concurrent Worker requests and cron retries from sending the same row simultaneously.
ALTER TABLE notification_outbox ADD COLUMN claimed_at TEXT;
ALTER TABLE notification_outbox ADD COLUMN claim_token TEXT;

CREATE INDEX IF NOT EXISTS notification_outbox_claim_idx
  ON notification_outbox (status, next_attempt_at, claimed_at, created_at);
