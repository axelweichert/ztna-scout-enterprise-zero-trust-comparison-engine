import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { IndexedEntity, Entity } from "./core-utils";
import type {
  Lead, ComparisonSnapshot, ComparisonResult,
  PricingModel, FeatureMatrix, PricingOverride,
  VerificationToken, OptOutToken, AdminStats, TimeSeriesData,
  EmailEvent
} from "@shared/types";
// Static data imports from local directory
import vendors from "../data/vendors.json";
import features from "../data/features.json";
import pricing from "../data/pricing.json";
/**
 * DETERMINISTIC CALCULATION ENGINE (Self-Contained)
 * Logic migrated from src/lib/calculator.ts to ensure worker isolation.
 */
function calculateTCO(seats: number, model: PricingModel): number {
  const safeSeats = Math.max(1, seats);
  const annualSubscription = safeSeats * (model.basePricePerMonth || 0) * 12;
  return Number((annualSubscription + (model.installationFee || 0)).toFixed(2));
}
function calculateScores(features: FeatureMatrix, tco: number, maxTco: number, minTco: number) {
  // 1. Feature Score (40%)
  const featureList = ['hasZTNA', 'hasSWG', 'hasCASB', 'hasDLP', 'hasFWaaS', 'hasRBI'] as const;
  const featurePoints = featureList.reduce((acc, key) => acc + (features[key] ? 1 : 0), 0);
  const featureScore = Math.round((featurePoints / featureList.length) * 100);
  // 2. Price Score (40%) - Lower TCO is better
  let priceScore = 70; // Default fallback for single vendor or identical TCOs
  if (maxTco > minTco) {
    priceScore = Math.round(100 - (((tco - minTco) / (maxTco - minTco)) * 100));
  } else if (tco > 0) {
    // If all prices are the same, give a baseline score based on relative affordability
    // compared to an arbitrary "expensive" benchmark of 100 EUR/user
    const relativePrice = tco / 1200; 
    priceScore = Math.max(0, Math.min(100, Math.round(100 - (relativePrice * 10))));
  }
  // 3. Compliance Score (20%)
  const complianceScore = features.isBSIQualified ? 100 : 40;
  // Weighted Average
  const totalScore = Math.round((featureScore * 0.4) + (priceScore * 0.4) + (complianceScore * 0.2));
  return { featureScore, priceScore, complianceScore, totalScore };
}
/**
 * ENTITY DEFINITIONS
 */
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
class EmailEventEntity extends IndexedEntity<EmailEvent> {
  static readonly entityName = "email-event";
  static readonly indexName = "email-events";
  static readonly initialState: EmailEvent = {
    id: "", leadId: "", recipient: "", status: 'failed', createdAt: 0
  };
}
/**
 * UTILITY HELPERS
 */
async function verifyTurnstile(token: string, secret: string) {
  if (!token) return false;
  try {
    const formData = new FormData();
    formData.append('secret', secret);
    formData.append('response', token);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });
    const outcome = await res.json() as { success: boolean };
    return outcome.success;
  } catch (err) {
    console.error('[TURNSTILE] verification failed:', err);
    return false;
  }
}
async function getMergedPricing(env: Env, vendorId: string): Promise<PricingModel> {
  const base = pricing.find(p => p.vendorId === vendorId) || { vendorId, basePricePerMonth: 25, isQuoteOnly: true, installationFee: 4000 };
  const overrideInst = new PricingOverrideEntity(env, vendorId);
  try {
    const override = await overrideInst.getState();
    if (override && override.basePricePerMonth > 0) {
      return {
        ...base,
        basePricePerMonth: Number(override.basePricePerMonth.toFixed(2)),
        isQuoteOnly: override.isQuoteOnly
      };
    }
  } catch (e) { /* Fallback */ }
  return {
    ...base,
    basePricePerMonth: Number(base.basePricePerMonth.toFixed(2))
  };
}
async function sendVerificationEmail(env: any, lead: Lead, token: string, optOutToken: string) {
  let baseUrl = env.PUBLIC_BASE_URL || 'https://ztna-scout.pages.dev';
  if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
  const verifyUrl = `${baseUrl}/verify/${token}`;
  const optOutUrl = `${baseUrl}/opt-out?token=${optOutToken}`;
  const fromEmail = env.EMAIL_FROM || 'security@vonbusch.digital';
  const subject = lead.vpnStatus === 'none' ? "ZTNA Scout: Your Security Analysis" : "ZTNA Scout: Verify your analysis request";
  const body = `Hello ${lead.contactName},\n\nThank you for using ZTNA Scout. To provide you with your report, please verify your request:\n\n${verifyUrl}\n\nProject: ${lead.companyName} (${lead.seats} seats)\n\nOpt-out: ${optOutUrl}`;
  if (!env.RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY missing, skipping mail send');
    return { success: false, error: 'Email service not configured' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: `ZTNA Scout <${fromEmail}>`, to: lead.email, subject, text: body })
    });
    return { success: res.ok };
  } catch (e) {
    return { success: false, error: 'Delivery exception' };
  }
}
/**
 * ROUTE HANDLERS
 */
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Public Config
  app.get('/api/config', (c) => {
    const env = c.env as any;
    return ok(c, { turnstileSiteKey: env.TURNSTILE_SITE_KEY || env.PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA" });
  });
  // Lead Submission
  app.post('/api/submit', async (c) => {
    try {
      const input = await c.req.json();
      const { turnstileToken, ...formData } = input;
      const env = c.env as any;
      const secret = env.TURNSTILE_SECRET_KEY || env.PUBLIC_TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";
      if (!(await verifyTurnstile(turnstileToken, secret))) {
        return bad(c, 'Bot verification failed.');
      }
      const leadId = crypto.randomUUID();
      const ip = c.req.header('cf-connecting-ip') || 'unknown';
      const lead: Lead = {
        ...formData,
        id: leadId,
        createdAt: Date.now(),
        status: 'pending',
        contactAllowed: true,
        consentGiven: true,
        emailStatus: 'pending',
        consentRecord: {
          ipHash: btoa(ip).slice(0, 12),
          userAgent: c.req.header('user-agent') || 'unknown',
          timestamp: Date.now(),
          acceptedTextVersion: "v36.2024",
          disclaimerAccepted: true
        }
      };
      await LeadEntity.create(c.env, lead);
      const vToken = crypto.randomUUID();
      await new VerificationTokenEntity(c.env, vToken).save({ hash: vToken, leadId, expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) });
      const oToken = crypto.randomUUID();
      await new OptOutTokenEntity(c.env, oToken).save({ hash: oToken, leadId, createdAt: Date.now() });
      const emailRes = await sendVerificationEmail(c.env, lead, vToken, oToken);
      const emailStatus = emailRes.success ? 'sent' : 'failed';
      await new LeadEntity(c.env, leadId).patch({ emailStatus, emailError: emailRes.error });
      return ok(c, { leadId, requiresVerification: true });
    } catch (e) {
      console.error('[SUBMIT] error:', e);
      return bad(c, 'Submission failed.');
    }
  });
  // Sample Comparison Generator
  app.get('/api/sample-comparison', async (c) => {
    const sampleSeats = 250;
    if (!vendors || vendors.length === 0) return bad(c, 'No vendor data available');
    const results = await Promise.all(vendors.map(async (v) => {
      const model = await getMergedPricing(c.env, v.id);
      const feat = features.find(f => f.vendorId === v.id) as FeatureMatrix;
      const tco = calculateTCO(sampleSeats, model);
      return { v, feat, tco };
    }));
    const tcos = results.map(r => r.tco);
    const maxTco = Math.max(...tcos);
    const minTco = Math.min(...tcos);
    const snapshotResults: ComparisonResult[] = results.map(r => ({
      vendorId: r.v.id,
      vendorName: r.v.name,
      tcoYear1: Number(r.tco.toFixed(2)),
      scores: calculateScores(r.feat, r.tco, maxTco, minTco),
      features: r.feat
    }));
    return ok(c, {
      id: 'sample',
      leadId: 'demo',
      results: snapshotResults,
      inputs: { seats: sampleSeats, vpnStatus: 'active', budgetRange: 'med' },
      createdAt: Date.now(),
      isSample: true
    });
  });
  // Verification & Processing
  app.get('/api/verify/:token', async (c) => {
    const token = c.req.param('token');
    const tokenEntity = new VerificationTokenEntity(c.env, token);
    if (!(await tokenEntity.exists())) return notFound(c, 'Link invalid.');
    const tokenData = await tokenEntity.getState();
    const leadEntity = new LeadEntity(c.env, tokenData.leadId);
    const leadState = await leadEntity.getState();
    if (leadState.status === 'confirmed' && leadState.comparisonId) {
      return ok(c, { comparisonId: leadState.comparisonId });
    }
    const processedResults = await Promise.all(vendors.map(async (v) => {
      const model = await getMergedPricing(c.env, v.id);
      const feat = features.find(f => f.vendorId === v.id) as FeatureMatrix;
      const tco = calculateTCO(leadState.seats, model);
      return { v, feat, tco };
    }));
    const tcos = processedResults.map(r => r.tco);
    const maxTco = tcos.length > 0 ? Math.max(...tcos) : 1;
    const minTco = tcos.length > 0 ? Math.min(...tcos) : 0;
    const snapshotResults: ComparisonResult[] = processedResults.map(r => ({
      vendorId: r.v.id,
      vendorName: r.v.name,
      tcoYear1: Number(r.tco.toFixed(2)),
      scores: calculateScores(r.feat, r.tco, maxTco, minTco),
      features: r.feat
    }));
    const snapshotId = crypto.randomUUID();
    await ComparisonEntity.create(c.env, {
      id: snapshotId,
      leadId: leadState.id,
      results: snapshotResults,
      inputs: { seats: leadState.seats, vpnStatus: leadState.vpnStatus, budgetRange: leadState.budgetRange },
      createdAt: Date.now()
    });
    await leadEntity.patch({ status: 'confirmed', confirmedAt: Date.now(), comparisonId: snapshotId });
    return ok(c, { comparisonId: snapshotId });
  });
  // Report Access
  app.get('/api/comparison/:id', async (c) => {
    const comp = new ComparisonEntity(c.env, c.req.param('id'));
    if (!(await comp.exists())) return notFound(c, 'Report not found.');
    return ok(c, await comp.getState());
  });
  // Opt-Out Handling
  app.post('/api/opt-out', async (c) => {
    const { token } = await c.req.json();
    const optOutEntity = new OptOutTokenEntity(c.env, token);
    if (!(await optOutEntity.exists())) return bad(c, 'Invalid token');
    const tokenData = await optOutEntity.getState();
    await new LeadEntity(c.env, tokenData.leadId).patch({ contactAllowed: false, optedOutAt: Date.now() });
    return ok(c, { success: true });
  });
  // Admin Routes
  app.get('/api/admin/leads', async (c) => {
    const leads = await LeadEntity.list(c.env, null, 1000);
    return ok(c, leads.items.sort((a, b) => b.createdAt - a.createdAt));
  });
  app.delete('/api/admin/leads/:id', async (c) => {
    const id = c.req.param('id');
    const leadInst = new LeadEntity(c.env, id);
    if (await leadInst.exists()) {
      const state = await leadInst.getState();
      if (state.comparisonId) await ComparisonEntity.delete(c.env, state.comparisonId);
    }
    await LeadEntity.delete(c.env, id);
    return ok(c, { success: true });
  });
  app.get('/api/admin/stats', async (c) => {
    const leadRes = await LeadEntity.list(c.env, null, 2000);
    const leads = leadRes.items;
    const confirmedLeads = leads.filter(l => l.status === 'confirmed').length;
    return ok(c, {
      totalLeads: leads.length,
      pendingLeads: leads.length - confirmedLeads,
      confirmedLeads,
      conversionRate: leads.length > 0 ? Math.round((confirmedLeads / leads.length) * 100) : 0,
      avgSeats: leads.length > 0 ? Math.round(leads.reduce((acc, curr) => acc + (curr.seats || 0), 0) / leads.length) : 0,
      mostCommonVpn: "active",
      dailyLeads: []
    });
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
    await new PricingOverrideEntity(c.env, update.vendorId).save({ ...update, updatedAt: Date.now() });
    return ok(c, { success: true });
  });
}