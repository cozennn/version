-- Add stable six-digit visitor-facing ticket references without changing internal UUIDs.
ALTER TABLE tickets ADD COLUMN public_ref TEXT;

-- Existing rows receive deterministic six-digit references; ticket IDs are monotonic.
UPDATE tickets
SET public_ref = printf('%06d', id % 1000000)
WHERE public_ref IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS tickets_public_ref_unique
  ON tickets (public_ref);
