-- Schema for ZTNA Scout
-- Note: In this template environment, we utilize GlobalDurableObject for persistence.
-- This SQL file serves as the logical blueprint for the data structures stored within the DO.
-- Table: leads
-- Purpose: Stores contact information and basic requirements of the potential customer.
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  seats INTEGER NOT NULL,
  vpn_status TEXT, -- e.g., 'active', 'replacing', 'none'
  budget_range TEXT,
  timing TEXT,
  consent_given BOOLEAN NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Table: comparisons
-- Purpose: Stores the deterministic snapshot of the calculation results.
CREATE TABLE comparisons (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  input_snapshot TEXT NOT NULL, -- JSON of user inputs
  result_snapshot TEXT NOT NULL, -- JSON of calculated TCO and scores
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);
-- Table: pricing_overrides
-- Purpose: Admin-managed overrides for vendor pricing.
CREATE TABLE pricing_overrides (
  vendor_id TEXT PRIMARY KEY,
  base_price_eur DECIMAL(10, 2),
  is_quote_only BOOLEAN DEFAULT FALSE,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_comparisons_lead_id ON comparisons(lead_id);