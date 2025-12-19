-- Schema for ZTNA Scout
-- Table: leads
-- Purpose: Stores contact information and basic requirements.
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  seats INTEGER NOT NULL,
  vpn_status TEXT NOT NULL, -- 'active' | 'replacing' | 'none'
  budget_range TEXT,
  timing TEXT, -- 'immediate' | '3_months' | '6_months' | 'planning'
  consent_given BOOLEAN NOT NULL,
  contact_allowed INTEGER DEFAULT 1,
  opted_out_at INTEGER DEFAULT NULL,
  created_at INTEGER NOT NULL
);
-- Table: comparisons
-- Purpose: Stores the deterministic snapshot of the calculation results.
CREATE TABLE IF NOT EXISTS comparisons (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  input_snapshot TEXT NOT NULL, -- JSON string
  result_snapshot TEXT NOT NULL, -- JSON string
  created_at INTEGER NOT NULL
);
-- Table: pricing_overrides
-- Purpose: Admin-managed overrides for vendor pricing.
CREATE TABLE IF NOT EXISTS pricing_overrides (
  vendor_id TEXT PRIMARY KEY,
  base_price_eur DECIMAL(10, 2),
  is_quote_only BOOLEAN DEFAULT FALSE,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_comparisons_lead_id ON comparisons(lead_id);