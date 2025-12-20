-- Schema for ZTNA Scout
-- Table: leads
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
  email_status TEXT DEFAULT 'pending', -- 'pending' | 'sent' | 'failed'
  email_error TEXT DEFAULT NULL,
  created_at INTEGER NOT NULL
);
-- Table: comparisons
CREATE TABLE IF NOT EXISTS comparisons (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  input_snapshot TEXT NOT NULL, -- JSON string
  result_snapshot TEXT NOT NULL, -- JSON string
  created_at INTEGER NOT NULL
);
-- Table: pricing_overrides
CREATE TABLE IF NOT EXISTS pricing_overrides (
  vendor_id TEXT PRIMARY KEY,
  base_price_eur DECIMAL(10, 2),
  is_quote_only BOOLEAN DEFAULT FALSE,
  updated_at INTEGER NOT NULL
);
-- Table: email_events
-- Purpose: Tracking system for lead notification status
CREATE TABLE IF NOT EXISTS email_events (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  recipient TEXT NOT NULL,
  status TEXT NOT NULL, -- 'sent' | 'failed'
  error_message TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_comparisons_lead_id ON comparisons(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_events_lead_id ON email_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_events_status ON email_events(status);