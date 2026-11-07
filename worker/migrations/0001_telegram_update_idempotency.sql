-- Durable idempotency for Telegram webhook updates.
-- Applying this migration does not modify or delete existing tickets or messages.
CREATE TABLE IF NOT EXISTS telegram_updates (
  update_id INTEGER PRIMARY KEY,
  processed_at TEXT NOT NULL
);
