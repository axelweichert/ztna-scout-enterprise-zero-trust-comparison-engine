import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { IndexedEntity } from "./core-utils";
import type { Lead, ComparisonSnapshot, ComparisonResult, PricingModel, FeatureMatrix } from "@shared/types";
import { calculateTCO, calculateScores } from "../src/lib/calculator";
// Data Imports (In a real worker we would fetch these or bundle them)
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
    try {
      const input = await c.req.json();
      // 1. Create Lead in DO
      const leadId = crypto.randomUUID();
      const lead: Lead = {
        ...input,
        id: leadId,
        createdAt: Date.now()
      };
      await LeadEntity.create(c.env, lead);
      // 2. Run Calculations
      const seats = lead.seats;
      // First, get all TCOs to find min/max for normalization
      const allVendorResults = vendors.map(v => {
        const vendorPricing = pricing.find(p => p.vendorId === v.id) as PricingModel;
        const vendorFeatures = features.find(f => f.vendorId === v.id) as FeatureMatrix;
        return { 
          id: v.id, 
          name: v.name, 
          pricing: vendorPricing, 
          features: vendorFeatures,
          tco: calculateTCO(seats, vendorPricing)
        };
      });
      const tcos = allVendorResults.map(r => r.tco);
      const maxTco = Math.max(...tcos);
      const minTco = Math.min(...tcos);
      const results: ComparisonResult[] = allVendorResults.map(r => ({
        vendorId: r.id,
        vendorName: r.name,
        tcoYear1: r.tco,
        scores: calculateScores(r.features, r.tco, maxTco, minTco),
        features: r.features
      }));
      // 3. Store Comparison Snapshot
      const comparisonId = crypto.randomUUID();
      const snapshot: ComparisonSnapshot = {
        id: comparisonId,
        leadId: leadId,
        results,
        inputs: { seats: lead.seats, vpnStatus: lead.vpnStatus },
        createdAt: Date.now()
      };
      await ComparisonEntity.create(c.env, snapshot);
      return ok(c, { id: comparisonId });
    } catch (e) {
      console.error('Submit Error:', e);
      return bad(c, 'Failed to process lead');
    }
  });
  app.get('/api/comparison/:id', async (c) => {
    const id = c.req.param('id');
    try {
      const comp = new ComparisonEntity(c.env, id);
      if (!await comp.exists()) {
        return notFound(c, 'Comparison not found');
      }
      const data = await comp.getState();
      return ok(c, data);
    } catch (e) {
      return bad(c, 'Error retrieving comparison');
    }
  });
}