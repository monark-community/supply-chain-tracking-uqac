-- database/schema.sql
-- Schéma minimal pour ChainProof

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  address VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('producer','transporter','retailer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  origin TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'created' CHECK (status IN ('created','in_transit','delivered')),
  created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transfers (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  from_user BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  to_user BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  location TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transfers_product_id ON transfers(product_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to_user ON transfers(to_user);
