-- NORDA CRM: customers and manually managed orders. Additive only.
CREATE TABLE IF NOT EXISTS norda_customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'manual',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  archived_at TEXT
);
CREATE INDEX IF NOT EXISTS norda_customers_name_idx ON norda_customers(name);
CREATE INDEX IF NOT EXISTS norda_customers_email_idx ON norda_customers(email);
CREATE TABLE IF NOT EXISTS norda_orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL REFERENCES norda_customers(id),
  product_id TEXT REFERENCES norda_products(id),
  product_name TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity > 0),
  unit_price REAL NOT NULL DEFAULT 0 CHECK(unit_price >= 0),
  currency TEXT NOT NULL DEFAULT 'EUR' CHECK(currency IN ('EUR','USD','DZD')),
  total_amount REAL NOT NULL DEFAULT 0 CHECK(total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('draft','pending','confirmed','in_progress','completed','cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK(payment_status IN ('unpaid','pending','paid','refunded')),
  payment_method TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS norda_orders_customer_idx ON norda_orders(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS norda_orders_status_idx ON norda_orders(status, created_at DESC);
