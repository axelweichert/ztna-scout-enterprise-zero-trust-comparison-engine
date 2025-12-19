import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { IndexedEntity } from "./core-utils";
import type { Lead, ComparisonSnapshot, ComparisonResult, PricingModel, FeatureMatrix } from "@shared/types";
import { calculateTCO, calculateScores } from "../src/lib/calculator";
// Mock static data within worker since we can't easily import JSON from relative data/ paths in this build environment 
// without specific configuration. We'll define the core logic here.
import vendors from "../data/vendors.json";
import features from "../data/features.json";
import pricing from "../data/pricing.json";
class LeadEntity extends IndexedEntity<Lead> {
  static readonly entityName = "lead";
  static readonly indexName = "leads";
  static readonly initialState: Lead = { 
    id: "", companyName: "", contactName: "", email: "", 
    seats: 0, vpnStatus: 'none', budgetRange: "", 
    timing: 'planning', consentGiven: false, createdAt: 0 
  };
}
class ComparisonEntity extends IndexedEntity<ComparisonSnapshot> {
  static readonly entityName = "comparison";
  static readonly indexName = "comparisons";
  static readonly initialState: ComparisonSnapshot = {
    id: "", leadId: "", results: [], inputs: { seats: 0, vpnStatus: 'none' }, createdAt: 0
  };
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.post('/api/submit', async (c) => {
    const input = await c.req.json();
    // 1. Create Lead
    const leadId = crypto.randomUUID();
    const lead: Lead = {
      ...input,
      id: leadId,
      createdAt: Date.now()
    };
    await LeadEntity.create(c.env, lead);
    // 2. Run Calculations
    const results: ComparisonResult[] = vendors.map(v => {
      const vendorPricing = pricing.find(p => p.vendorId === v.id) as PricingModel;
      const vendorFeatures = features.find(f => f.vendorId === v.id) as FeatureMatrix;
      const tco = calculateTCO(lead.seats, vendorPricing);
      // Calculate min/max for normalization
      const allTcos = pricing.map(p => calculateTCO(lead.seats, p as PricingModel));
      const maxTco = Math.max(...allTcos);
      const minTco = Math.min(...allTcos);
      const scores = calculateScores(vendorFeatures, tco, maxTco, minTco);
      return {
        vendorId: v.id,
        vendorName: v.name,
        tcoYear1: tco,
        scores,
        features: vendorFeatures
      };
    });
    // 3. Create Comparison Snapshot
    const comparisonId = crypto.randomUUID();
    const snapshot: ComparisonSnapshot = {
      id: comparisonId,
      leadId: lead.id,
      results,
      inputs: { seats: lead.seats, vpnStatus: lead.vpnStatus },
      createdAt: Date.now()
    };
    await ComparisonEntity.create(c.env, snapshot);
    return ok(c, { id: comparisonId });
  });
  app.get('/api/comparison/:id', async (c) => {
    const id = c.req.param('id');
    const comp = new ComparisonEntity(c.env, id);
    if (!await comp.exists()) return notFound(c);
    return ok(c, await comp.getState());
  });
}