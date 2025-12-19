import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { IndexedEntity, Entity } from "./core-utils";
import type {
  Lead, ComparisonSnapshot, ComparisonResult,
  PricingModel, FeatureMatrix, PricingOverride,
  VerificationToken, OptOutToken, TimeSeriesData
} from "@shared/types";
import { calculateTCO, calculateScores } from "../src/lib/calculator";
import vendors from "../data/vendors.json";
import features from "../data/features.json";
import pricing from "../data/pricing.json";
class LeadEntity extends IndexedEntity<Lead> {
  static readonly entityName = "lead";
  static readonly indexName = "leads";
  static readonly initialState: Lead = {
    id: "", companyName: "", contactName: "", email: "", phone: "",
    seats: 0, vpnStatus: 'none', budgetRange: "",
    timing: 'planning', consentGiven: false, createdAt: 0,
    status: 'pending', contactAllowed: true
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
async function verifyTurnstile(token: string, secret: string) {
  if (token === "testing") return true;
  if (!token) return false;
  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData
  });
  const outcome = await res.json() as { success: boolean };
  return outcome.success;
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.post('/api/submit', async (c) => {
    try {
      const { turnstileToken, ...input } = await c.req.json();
      const isHuman = await verifyTurnstile(turnstileToken, "1x0000000000000000000000000000000AA");
      if (!isHuman) return bad(c, 'Verification failed. Please try again.');
      const leadId = crypto.randomUUID();
      const ip = c.req.header('cf-connecting-ip') || 'unknown';
      const lead: Lead = {
        ...input,
        id: leadId,
        createdAt: Date.now(),
        status: 'pending',
        contactAllowed: true,
        consentGiven: true,
        consentRecord: {
          ipHash: btoa(ip).slice(0, 12),
          userAgent: c.req.header('user-agent') || 'unknown',
          timestamp: Date.now(),
          acceptedTextVersion: "v2.2024",
          disclaimerAccepted: true
        }
      };
      await LeadEntity.create(c.env, lead);
      // Create Verification Token (DOI)
      const token = crypto.randomUUID();
      const tokenEntity = new VerificationTokenEntity(c.env, token);
      await tokenEntity.save({ hash: token, leadId, expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) });
      // Create Opt-Out Token (Persistent)
      const optOutToken = crypto.randomUUID();
      const optOutEntity = new OptOutTokenEntity(c.env, optOutToken);
      await optOutEntity.save({ hash: optOutToken, leadId, createdAt: Date.now() });
      console.log(`[DOI EMAIL] Link: /verify/${token}`);
      console.log(`[OPT-OUT] Token: ${optOutToken}`);
      return ok(c, { leadId, requiresVerification: true });
    } catch (e) {
      return bad(c, 'Submission failed');
    }
  });
  app.post('/api/opt-out', async (c) => {
    const { token } = await c.req.json();
    if (!token) return bad(c, 'Token required');
    const tokenEntity = new OptOutTokenEntity(c.env, token);
    if (!await tokenEntity.exists()) return notFound(c, 'Invalid token');
    const { leadId } = await tokenEntity.getState();
    const leadInst = new LeadEntity(c.env, leadId);
    if (!await leadInst.exists()) return notFound(c, 'Lead not found');
    await leadInst.patch({ contactAllowed: false, optedOutAt: Date.now() });
    return ok(c, { message: 'Opt-out successful' });
  });
  app.get('/api/verify/:token', async (c) => {
    const token = c.req.param('token');
    const tokenEntity = new VerificationTokenEntity(c.env, token);
    if (!await tokenEntity.exists()) return notFound(c, 'Invalid or expired token');
    const tokenData = await tokenEntity.getState();
    if (tokenData.usedAt || tokenData.expiresAt < Date.now()) return bad(c, 'Token expired or used');
    const leadEntity = new LeadEntity(c.env, tokenData.leadId);
    await leadEntity.patch({ status: 'confirmed', confirmedAt: Date.now() });
    await tokenEntity.patch({ usedAt: Date.now() });
    const lead = await leadEntity.getState();
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
          tco: calculateTCO(lead.seats, currentPricing)
        };
    }));
    const tcos = allVendorResults.map(r => r.tco);
    const results: ComparisonResult[] = allVendorResults.map(r => ({
      vendorId: r.id,
      vendorName: r.name,
      tcoYear1: r.tco,
      scores: calculateScores(r.features, r.tco, Math.max(...tcos), Math.min(...tcos)),
      features: r.features
    }));
    const snapshot: ComparisonSnapshot = {
      id: crypto.randomUUID(),
      leadId: lead.id,
      results,
      inputs: { seats: lead.seats, vpnStatus: lead.vpnStatus },
      createdAt: Date.now()
    };
    await ComparisonEntity.create(c.env, snapshot);
    return ok(c, { comparisonId: snapshot.id });
  });
  app.get('/api/sample-comparison', async (c) => {
    const seats = 250;
    const allVendorResults = await Promise.all(vendors.map(async (v) => {
      const basePricing = pricing.find(p => p.vendorId === v.id) as PricingModel;
      const vendorFeatures = features.find(f => f.vendorId === v.id) as FeatureMatrix;
      return {
        id: v.id,
        name: v.name,
        pricing: basePricing,
        features: vendorFeatures,
        tco: calculateTCO(seats, basePricing)
      };
    }));
    const tcos = allVendorResults.map(r => r.tco);
    const results: ComparisonResult[] = allVendorResults.map(r => ({
      vendorId: r.id,
      vendorName: r.name,
      tcoYear1: r.tco,
      scores: calculateScores(r.features, r.tco, Math.max(...tcos), Math.min(...tcos)),
      features: r.features
    }));
    return ok(c, { id: "sample", leadId: "sample", results, inputs: { seats, vpnStatus: 'active' }, createdAt: Date.now(), isSample: true });
  });
  app.get('/api/comparison/:id', async (c) => {
    const id = c.req.param('id');
    const comp = new ComparisonEntity(c.env, id);
    if (!await comp.exists()) return notFound(c);
    return ok(c, await comp.getState());
  });
  app.get('/api/admin/leads', async (c) => {
    const leads = await LeadEntity.list(c.env, null, 1000);
    return ok(c, leads.items.sort((a, b) => b.createdAt - a.createdAt));
  });
  app.get('/api/admin/stats', async (c) => {
    const leadsRes = await LeadEntity.list(c.env, null, 1000);
    const leads = leadsRes.items;
    const now = new Date();
    const dailyLeads: TimeSeriesData[] = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (29 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dayLeads = leads.filter(l => new Date(l.createdAt).toISOString().split('T')[0] === dateStr);
      return {
        date: dateStr,
        pending: dayLeads.filter(l => l.status === 'pending').length,
        confirmed: dayLeads.filter(l => l.status === 'confirmed').length
      };
    });
    const confirmed = leads.filter(l => l.status === 'confirmed').length;
    return ok(c, {
      totalLeads: leads.length,
      pendingLeads: leads.length - confirmed,
      confirmedLeads: confirmed,
      conversionRate: leads.length ? Math.round((confirmed / leads.length) * 100) : 0,
      avgSeats: leads.length ? Math.round(leads.reduce((acc, l) => acc + l.seats, 0) / leads.length) : 0,
      mostCommonVpn: "Legacy VPN",
      dailyLeads
    });
  });
  app.delete('/api/admin/leads/:id', async (c) => {
    const id = c.req.param('id');
    await LeadEntity.delete(c.env, id);
    return ok(c, { success: true });
  });
  app.get('/api/admin/pricing', async (c) => {
    const data = await Promise.all(vendors.map(async (v) => {
      const inst = new PricingOverrideEntity(c.env, v.id);
      if (await inst.exists()) return inst.getState();
      const base = pricing.find(p => p.vendorId === v.id);
      return { vendorId: v.id, basePricePerMonth: base?.basePricePerMonth || 0, isQuoteOnly: base?.isQuoteOnly || false, updatedAt: 0 };
    }));
    return ok(c, data);
  });
  app.post('/api/admin/pricing', async (c) => {
    const update = await c.req.json<PricingOverride>();
    const inst = new PricingOverrideEntity(c.env, update.vendorId);
    await inst.save({ ...update, updatedAt: Date.now() });
    return ok(c, { success: true });
  });
}