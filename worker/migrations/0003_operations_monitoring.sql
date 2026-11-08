-- Operational visibility and bounded retention for webhook idempotency.
CREATE INDEX IF NOT EXISTS telegram_updates_processed_at_idx
  ON telegram_updates (processed_at);

CREATE TABLE IF NOT EXISTS telegram_delivery_failures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL CHECK (event_type IN ('contact', 'ticket_message')),
  reference_id TEXT,
  failed_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS telegram_delivery_failures_failed_at_idx
  ON telegram_delivery_failures (failed_at);
