import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { IndexedEntity, Entity } from "./core-utils";
import { calculateTCO, calculateScores } from "./calculator";
import type {
  Lead, ComparisonSnapshot, ComparisonResult,
  PricingModel, FeatureMatrix, PricingOverride,
  VerificationToken, OptOutToken, AdminStats
} from "./shared-types";
const VENDORS = [
  { "id": "cloudflare", "name": "Cloudflare", "website": "https://www.cloudflare.com" },
  { "id": "zscaler", "name": "Zscaler", "website": "https://www.zscaler.com" },
  { "id": "akamai", "name": "Akamai", "website": "https://www.akamai.com" },
  { "id": "paloalto", "name": "Palo Alto Networks", "website": "https://www.paloaltonetworks.com" },
  { "id": "netskope", "name": "Netskope", "website": "https://www.netskope.com" },
  { "id": "fortinet", "name": "Fortinet", "website": "https://www.fortinet.com" },
  { "id": "cisco", "name": "Cisco", "website": "https://www.cisco.com" },
  { "id": "broadcom", "name": "Broadcom (Symantec)", "website": "https://www.broadcom.com" },
  { "id": "forcepoint", "name": "Forcepoint", "website": "https://www.forcepoint.com" },
  { "id": "iboss", "name": "iboss", "website": "https://www.iboss.com" },
  { "id": "checkpoint", "name": "Check Point", "website": "https://www.checkpoint.com" },
  { "id": "perimeter81", "name": "Perimeter 81 (Checkpoint)", "website": "https://www.perimeter81.com" },
  { "id": "barracuda", "name": "Barracuda", "website": "https://www.barracuda.com" }
];
const FEATURES = [
  { "vendorId": "cloudflare", "hasZTNA": true, "hasSWG": true, "hasCASB": true, "hasDLP": true, "hasFWaaS": true, "hasRBI": true, "isBSIQualified": true },
  { "vendorId": "zscaler", "hasZTNA": true, "hasSWG": true, "hasCASB": true, "hasDLP": true, "hasFWaaS": true, "hasRBI": true, "isBSIQualified": false },
  { "vendorId": "akamai", "hasZTNA": true, "hasSWG": true, "hasCASB": true, "hasDLP": false, "hasFWaaS": false, "hasRBI": true, "isBSIQualified": false },
  { "vendorId": "paloalto", "hasZTNA": true, "hasSWG": true, "hasCASB": true, "hasDLP": true, "hasFWaaS": true, "hasRBI": true, "isBSIQualified": false },
  { "vendorId": "netskope", "hasZTNA": true, "hasSWG": true, "hasCASB": true, "hasDLP": true, "hasFWaaS": true, "hasRBI": true, "isBSIQualified": false },
  { "vendorId": "fortinet", "hasZTNA": true, "hasSWG": true, "hasCASB": false, "hasDLP": false, "hasFWaaS": true, "hasRBI": false, "isBSIQualified": false },
  { "vendorId": "cisco", "hasZTNA": true, "hasSWG": true, "hasCASB": true, "hasDLP": true, "hasFWaaS": true, "hasRBI": true, "isBSIQualified": false },
  { "vendorId": "broadcom", "hasZTNA": true, "hasSWG": true, "hasCASB": true, "hasDLP": true, "hasFWaaS": true, "hasRBI": true, "isBSIQualified": false },
  { "vendorId": "forcepoint", "hasZTNA": true, "hasSWG": true, "hasCASB": true, "hasDLP": true, "hasFWaaS": false, "hasRBI": true, "isBSIQualified": false },
  { "vendorId": "iboss", "hasZTNA": true, "hasSWG": true, "hasCASB": true, "hasDLP": true, "hasFWaaS": true, "hasRBI": true, "isBSIQualified": false },
  { "vendorId": "checkpoint", "hasZTNA": true, "hasSWG": true, "hasCASB": true, "hasDLP": true, "hasFWaaS": true, "hasRBI": true, "isBSIQualified": false },
  { "vendorId": "perimeter81", "hasZTNA": true, "hasSWG": false, "hasCASB": false, "hasDLP": false, "hasFWaaS": true, "hasRBI": false, "isBSIQualified": false },
  { "vendorId": "barracuda", "hasZTNA": true, "hasSWG": true, "hasCASB": false, "hasDLP": false, "hasFWaaS": true, "hasRBI": false, "isBSIQualified": false }
];
const PRICING = [
  { "vendorId": "cloudflare", "basePricePerMonth": 12.50, "isQuoteOnly": false, "installationFee": 4000 },
  { "vendorId": "zscaler", "basePricePerMonth": 35.00, "isQuoteOnly": true, "installationFee": 4000 },
  { "vendorId": "akamai", "basePricePerMonth": 28.00, "isQuoteOnly": true, "installationFee": 4000 },
  { "vendorId": "paloalto", "basePricePerMonth": 45.00, "isQuoteOnly": true, "installationFee": 4000 },
  { "vendorId": "netskope", "basePricePerMonth": 32.00, "isQuoteOnly": true, "installationFee": 4000 },
  { "vendorId": "fortinet", "basePricePerMonth": 18.00, "isQuoteOnly": false, "installationFee": 4000 },
  { "vendorId": "cisco", "basePricePerMonth": 30.00, "isQuoteOnly": true, "installationFee": 4000 },
  { "vendorId": "broadcom", "basePricePerMonth": 40.00, "isQuoteOnly": true, "installationFee": 4000 },
  { "vendorId": "forcepoint", "basePricePerMonth": 25.00, "isQuoteOnly": true, "installationFee": 4000 },
  { "vendorId": "iboss", "basePricePerMonth": 22.00, "isQuoteOnly": true, "installationFee": 4000 },
  { "vendorId": "checkpoint", "basePricePerMonth": 24.00, "isQuoteOnly": true, "installationFee": 4000 },
  { "vendorId": "perimeter81", "basePricePerMonth": 15.00, "isQuoteOnly": false, "installationFee": 2000 },
  { "vendorId": "barracuda", "basePricePerMonth": 14.00, "isQuoteOnly": false, "installationFee": 3000 }
];
class LeadEntity extends IndexedEntity<Lead> {
  static readonly entityName = "lead";
  static readonly indexName = "leads";
  static readonly initialState: Lead = {
    id: "", companyName: "", contactName: "", email: "", phone: "",
    seats: 0, vpnStatus: 'none', budgetRange: "med",
    timing: 'planning', consentGiven: false, createdAt: 0,
    status: 'pending', contactAllowed: true, emailStatus: 'pending'
  };
}
class ComparisonEntity extends IndexedEntity<ComparisonSnapshot> {
  static readonly entityName = "comparison";
  static readonly indexName = "comparisons";
  static readonly initialState: ComparisonSnapshot = {
    id: "", leadId: "", results: [], inputs: { seats: 0, vpnStatus: 'none' }, createdAt: 0
  };
}
class VerificationTokenEntity extends Entity<VerificationToken> {
  static readonly entityName = "v-token";
  static readonly initialState: VerificationToken = { hash: "", leadId: "", expiresAt: 0 };
}
class OptOutTokenEntity extends Entity<OptOutToken> {
  static readonly entityName = "opt-out-token";
  static readonly initialState: OptOutToken = { hash: "", leadId: "", createdAt: 0 };
}
class PricingOverrideEntity extends Entity<PricingOverride> {
  static readonly entityName = "pricing-override";
  static readonly initialState: PricingOverride = {
    vendorId: "", basePricePerMonth: 0, isQuoteOnly: false, updatedAt: 0
  };
}
async function getMergedPricing(env: Env, vendorId: string): Promise<PricingModel> {
  const base = PRICING.find(p => p.vendorId === vendorId) || { vendorId, basePricePerMonth: 25, isQuoteOnly: true, installationFee: 4000 };
  const overrideInst = new PricingOverrideEntity(env, vendorId);
  try {
    if (await overrideInst.exists()) {
      const override = await overrideInst.getState();
      if (override && typeof override.basePricePerMonth === 'number' && override.basePricePerMonth > 0) {
        return {
          ...base,
          basePricePerMonth: Number(override.basePricePerMonth.toFixed(2)),
          isQuoteOnly: !!override.isQuoteOnly
        };
      }
    }
  } catch (e) {
    console.error(`[WORKER] Override fetch failed for ${vendorId}:`, e);
  }
  return { ...base, basePricePerMonth: Number(base.basePricePerMonth.toFixed(2)) };
}
async function buildComparison(env: Env, leadId: string, seats: number, inputs: any): Promise<ComparisonSnapshot> {
  const processedResults = await Promise.all(VENDORS.map(async (v) => {
    const model = await getMergedPricing(env, v.id);
    const feat = FEATURES.find(f => f.vendorId === v.id) as FeatureMatrix;
    const tco = calculateTCO(seats, model);
    return { v, feat, tco };
  }));
  const tcos = processedResults.map(r => r.tco);
  const maxTco = Math.max(...tcos, 1);
  const minTco = Math.min(...tcos, 0);
  const snapshotResults: ComparisonResult[] = processedResults.map(r => ({
    vendorId: r.v.id,
    vendorName: r.v.name,
    tcoYear1: Number(r.tco.toFixed(2)),
    scores: calculateScores(r.feat, r.tco, maxTco, minTco),
    features: r.feat
  }));
  return {
    id: crypto.randomUUID(),
    leadId,
    results: snapshotResults,
    inputs,
    createdAt: Date.now()
  };
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/config', (c) => {
    const env = c.env as any;
    const siteKey = env.TURNSTILE_SITE_KEY || env.PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
    return ok(c, { turnstileSiteKey: siteKey });
  });
  app.post('/api/submit', async (c) => {
    try {
      const input = await c.req.json();
      if (!input.email || !input.companyName) return bad(c, 'Required fields missing');
      const leadId = `${Date.now().toString(36)}-${crypto.randomUUID()}`;
      const lead: Lead = {
        ...input,
        id: leadId,
        createdAt: Date.now(),
        status: 'pending',
        contactAllowed: true,
        consentGiven: true,
        emailStatus: 'pending'
      };
      await LeadEntity.create(c.env, lead);
      const vToken = crypto.randomUUID();
      await new VerificationTokenEntity(c.env, vToken).save({ hash: vToken, leadId, expiresAt: Date.now() + 604800000 });
      const optOutToken = crypto.randomUUID();
      await new OptOutTokenEntity(c.env, optOutToken).save({ hash: optOutToken, leadId, createdAt: Date.now() });
      return ok(c, { leadId, requiresVerification: true, verificationToken: vToken });
    } catch (e) {
      return bad(c, 'Submission failed.');
    }
  });
  app.post('/api/opt-out', async (c) => {
    try {
      const { token } = await c.req.json();
      const entity = new OptOutTokenEntity(c.env, token);
      if (!(await entity.exists())) return bad(c, 'Invalid token');
      const tokenData = await entity.getState();
      const lead = new LeadEntity(c.env, tokenData.leadId);
      if (!(await lead.exists())) return notFound(c, 'Lead not found');
      await lead.patch({ contactAllowed: false, optedOutAt: Date.now() });
      return ok(c, { success: true });
    } catch (e) {
      return bad(c, 'Opt-out failed');
    }
  });
  app.get('/api/sample-comparison', async (c) => {
    try {
      const seats = 250;
      const snapshot = await buildComparison(c.env, 'demo', seats, { seats, vpnStatus: 'active', budgetRange: 'med' });
      return ok(c, { ...snapshot, id: 'sample', isSample: true });
    } catch (e) {
      return bad(c, 'Failed to generate sample');
    }
  });
  app.get('/api/verify/:token', async (c) => {
    try {
      const token = c.req.param('token');
      const tokenEntity = new VerificationTokenEntity(c.env, token);
      if (!(await tokenEntity.exists())) return notFound(c, 'Link invalid.');
      const tokenData = await tokenEntity.getState();
      const leadEntity = new LeadEntity(c.env, tokenData.leadId);
      const leadState = await leadEntity.getState();
      if (leadState.status === 'confirmed' && leadState.comparisonId) {
        return ok(c, { comparisonId: leadState.comparisonId });
      }
      const snapshot = await buildComparison(c.env, leadState.id, leadState.seats || 50, {
        seats: leadState.seats,
        vpnStatus: leadState.vpnStatus,
        budgetRange: leadState.budgetRange
      });
      await ComparisonEntity.create(c.env, snapshot);
      await leadEntity.patch({ status: 'confirmed', confirmedAt: Date.now(), comparisonId: snapshot.id });
      return ok(c, { comparisonId: snapshot.id });
    } catch (e) {
      return bad(c, 'Verification failed');
    }
  });
  app.get('/api/comparison/:id', async (c) => {
    try {
      const comp = new ComparisonEntity(c.env, c.req.param('id'));
      if (!(await comp.exists())) return notFound(c, 'Report not found.');
      return ok(c, await comp.getState());
    } catch (e) {
      return bad(c, 'Error fetching report');
    }
  });
  app.get('/api/admin/stats', async (c) => {
    try {
      const leads = await LeadEntity.list(c.env, null, 1000);
      const items = leads.items || [];
      const confirmedItems = items.filter(l => l.status === 'confirmed');
      const vpnCounts: Record<string, number> = {};
      items.forEach(l => {
        const v = l.vpnStatus || 'none';
        vpnCounts[v] = (vpnCounts[v] || 0) + 1;
      });
      let mostCommon = 'none';
      let maxCount = 0;
      Object.entries(vpnCounts).forEach(([vpn, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostCommon = vpn;
        }
      });
      const stats: AdminStats = {
        totalLeads: items.length,
        pendingLeads: items.length - confirmedItems.length,
        confirmedLeads: confirmedItems.length,
        conversionRate: items.length > 0 ? Math.round((confirmedItems.length / items.length) * 100) : 0,
        avgSeats: confirmedItems.length > 0 ? Math.round(confirmedItems.reduce((acc, l) => acc + (l.seats || 0), 0) / confirmedItems.length) : 0,
        mostCommonVpn: mostCommon,
        dailyLeads: [] // Time-series data would require D1 date grouping
      };
      return ok(c, stats);
    } catch (e) {
      return bad(c, 'Stats failed');
    }
  });
  app.get('/api/admin/leads', async (c) => {
    const leads = await LeadEntity.list(c.env, null, 1000);
    return ok(c, (leads.items || []).sort((a, b) => b.createdAt - a.createdAt));
  });
  app.delete('/api/admin/leads/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const leadInst = new LeadEntity(c.env, id);
      const leadState = await leadInst.getState();
      if (leadState.comparisonId) {
        await ComparisonEntity.delete(c.env, leadState.comparisonId);
      }
      await LeadEntity.delete(c.env, id);
      return ok(c, { success: true });
    } catch (e) {
      return bad(c, 'Failed to purge lead');
    }
  });
  app.get('/api/admin/pricing', async (c) => {
    const data = await Promise.all(VENDORS.map(async (v) => {
      const inst = new PricingOverrideEntity(c.env, v.id);
      const base = PRICING.find(p => p.vendorId === v.id);
      if (await inst.exists()) return inst.getState();
      return { vendorId: v.id, basePricePerMonth: base?.basePricePerMonth || 0, isQuoteOnly: !!base?.isQuoteOnly, updatedAt: 0 };
    }));
    return ok(c, data);
  });
  app.post('/api/admin/pricing', async (c) => {
    const update = await c.req.json<PricingOverride>();
    await new PricingOverrideEntity(c.env, update.vendorId).save({ ...update, updatedAt: Date.now() });
    return ok(c, { success: true });
  });
}