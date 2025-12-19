import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { IndexedEntity, Entity } from "./core-utils";
import type { Lead, ComparisonSnapshot, ComparisonResult, PricingModel, FeatureMatrix, PricingOverride } from "@shared/types";
import { calculateTCO, calculateScores } from "../src/lib/calculator";
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
class PricingOverrideEntity extends Entity<PricingOverride> {
  static readonly entityName = "pricing-override";
  static readonly initialState: PricingOverride = {
    vendorId: "", basePricePerMonth: 0, isQuoteOnly: false, updatedAt: 0
  };
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.post('/api/submit', async (c) => {
    try {
      const input = await c.req.json();
      const leadId = crypto.randomUUID();
      const lead: Lead = { ...input, id: leadId, createdAt: Date.now() };
      await LeadEntity.create(c.env, lead);
      const seats = lead.seats;
      const allVendorResults = await Promise.all(vendors.map(async (v) => {
        const overrideInst = new PricingOverrideEntity(c.env, v.id);
        const override = await overrideInst.exists() ? await overrideInst.getState() : null;
        const basePricing = pricing.find(p => p.vendorId === v.id) as PricingModel;
        const currentPricing: PricingModel = {
          ...basePricing,
          basePricePerMonth: (override && override.basePricePerMonth > 0) ? override.basePricePerMonth : basePricing.basePricePerMonth,
          isQuoteOnly: override ? override.isQuoteOnly : basePricing.isQuoteOnly
        };
        const vendorFeatures = features.find(f => f.vendorId === v.id) as FeatureMatrix;
        return {
          id: v.id,
          name: v.name,
          pricing: currentPricing,
          features: vendorFeatures,
          tco: calculateTCO(seats, currentPricing)
        };
      }));
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
      console.error(e);
      return bad(c, 'Failed to process infrastructure analysis');
    }
  });
  app.get('/api/comparison/:id', async (c) => {
    const id = c.req.param('id');
    try {
      const comp = new ComparisonEntity(c.env, id);
      if (!await comp.exists()) return notFound(c, 'Snapshot expired or not found');
      return ok(c, await comp.getState());
    } catch (e) {
      return bad(c, 'System retrieval error');
    }
  });
  app.get('/api/admin/leads', async (c) => {
    try {
      const leads = await LeadEntity.list(c.env, null, 1000);
      return ok(c, leads.items.sort((a, b) => b.createdAt - a.createdAt));
    } catch (e) {
      return bad(c, 'Lead database inaccessible');
    }
  });
  app.get('/api/admin/pricing', async (c) => {
    try {
      const data = await Promise.all(vendors.map(async (v) => {
        const inst = new PricingOverrideEntity(c.env, v.id);
        if (await inst.exists()) return inst.getState();
        const base = pricing.find(p => p.vendorId === v.id);
        return { 
          vendorId: v.id, 
          basePricePerMonth: base?.basePricePerMonth || 0, 
          isQuoteOnly: base?.isQuoteOnly || false, 
          updatedAt: 0 
        };
      }));
      return ok(c, data);
    } catch (e) {
      return bad(c, 'Override catalog offline');
    }
  });
  app.post('/api/admin/pricing', async (c) => {
    try {
      const update = await c.req.json<PricingOverride>();
      const inst = new PricingOverrideEntity(c.env, update.vendorId);
      await inst.save({ ...update, updatedAt: Date.now() });
      return ok(c, { success: true });
    } catch (e) {
      return bad(c, 'Failed to persist market override');
    }
  });
}