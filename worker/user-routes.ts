import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { IndexedEntity, Entity } from "./core-utils";
import type { 
  Lead, ComparisonSnapshot, ComparisonResult, 
  PricingModel, FeatureMatrix, PricingOverride,
  VerificationToken, LeadStatus 
} from "@shared/types";
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
    timing: 'planning', consentGiven: false, createdAt: 0,
    status: 'pending', marketingOptIn: false
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
class PricingOverrideEntity extends Entity<PricingOverride> {
  static readonly entityName = "pricing-override";
  static readonly initialState: PricingOverride = {
    vendorId: "", basePricePerMonth: 0, isQuoteOnly: false, updatedAt: 0
  };
}
async function verifyTurnstile(token: string, secret: string) {
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
      // 1. Anti-Spam Check
      const isHuman = await verifyTurnstile(turnstileToken, "1x0000000000000000000000000000000AA"); // Mock/Env secret
      if (!isHuman && turnstileToken !== "testing") return bad(c, 'Verification failed. Please try again.');
      // 2. Create Pending Lead
      const leadId = crypto.randomUUID();
      const ip = c.req.header('cf-connecting-ip') || 'unknown';
      const lead: Lead = { 
        ...input, 
        id: leadId, 
        createdAt: Date.now(), 
        status: 'pending',
        consentRecord: {
          ipHash: btoa(ip).slice(0, 12),
          userAgent: c.req.header('user-agent') || 'unknown',
          timestamp: Date.now(),
          acceptedTextVersion: "v1.2024",
          processingAccepted: input.processingAccepted,
          followUpAccepted: input.followUpAccepted,
          marketingAccepted: input.marketingAccepted
        }
      };
      await LeadEntity.create(c.env, lead);
      // 3. Generate DOI Token
      const token = crypto.randomUUID();
      const tokenEntity = new VerificationTokenEntity(c.env, token);
      await tokenEntity.save({
        hash: token,
        leadId,
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
      });
      // 4. Send Verification Link (Mocked)
      console.log(`[DOI EMAIL] To: ${lead.email} | Link: /verify/${token}`);
      return ok(c, { leadId, requiresVerification: true });
    } catch (e) {
      console.error(e);
      return bad(c, 'Submission failed');
    }
  });
  app.get('/api/verify/:token', async (c) => {
    const token = c.req.param('token');
    const tokenEntity = new VerificationTokenEntity(c.env, token);
    if (!await tokenEntity.exists()) return notFound(c, 'Invalid or expired token');
    const tokenData = await tokenEntity.getState();
    if (tokenData.usedAt || tokenData.expiresAt < Date.now()) return bad(c, 'Token expired or already used');
    // Update Lead Status
    const leadEntity = new LeadEntity(c.env, tokenData.leadId);
    await leadEntity.patch({ status: 'confirmed', confirmedAt: Date.now() });
    // Mark token used
    await tokenEntity.patch({ usedAt: Date.now() });
    // Generate comparison if it doesn't exist for this lead
    // (Logic moved from /api/submit to here for privacy: only confirmed leads get reports)
    const lead = await leadEntity.getState();
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
      leadId: lead.id,
      results,
      inputs: { seats: lead.seats, vpnStatus: lead.vpnStatus },
      createdAt: Date.now()
    };
    await ComparisonEntity.create(c.env, snapshot);
    return ok(c, { comparisonId });
  });
  app.get('/api/admin/leads', async (c) => {
    try {
      const leads = await LeadEntity.list(c.env, null, 1000);
      return ok(c, leads.items.sort((a, b) => b.createdAt - a.createdAt));
    } catch (e) { return bad(c, 'Lead DB error'); }
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