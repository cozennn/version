-- Store an optional PayPal Payment Link per product. Existing products remain on the current manual/contact flow.
ALTER TABLE norda_products ADD COLUMN paypal_url TEXT NOT NULL DEFAULT '';
