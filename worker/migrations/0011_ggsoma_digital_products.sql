-- GGSoma Partner API mapping and private digital delivery.
ALTER TABLE norda_products ADD COLUMN ggsoma_slug TEXT;
ALTER TABLE norda_products ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD';
CREATE INDEX IF NOT EXISTS norda_products_ggsoma_slug_idx ON norda_products(ggsoma_slug);
ALTER TABLE norda_orders ADD COLUMN digital_access_hash TEXT;
ALTER TABLE norda_orders ADD COLUMN ggsoma_product_slug TEXT;
ALTER TABLE norda_orders ADD COLUMN partner_order_code TEXT;
ALTER TABLE norda_orders ADD COLUMN partner_status TEXT;
ALTER TABLE norda_orders ADD COLUMN partner_error TEXT NOT NULL DEFAULT '';
ALTER TABLE norda_orders ADD COLUMN delivery_type TEXT;
ALTER TABLE norda_orders ADD COLUMN delivery_iv TEXT;
ALTER TABLE norda_orders ADD COLUMN delivery_ciphertext TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS norda_orders_partner_code_idx ON norda_orders(partner_order_code) WHERE partner_order_code IS NOT NULL;
