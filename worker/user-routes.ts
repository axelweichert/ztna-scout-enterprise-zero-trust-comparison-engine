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
import { calculateTCO, calculateScores } from "../src/lib/calculator";
import vendors from "../data/vendors.json";
import features from "../data/features.json";
import pricing from "../data/pricing.json";
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
    console.error('[TURNSTILE] verification request failed:', err);
    return false;
  }
}
async function sendVerificationEmail(env: any, lead: Lead, token: string, optOutToken: string) {
  let baseUrl = env.PUBLIC_BASE_URL || 'https://ztna-scout.pages.dev';
  if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
  const verifyUrl = `${baseUrl}/verify/${token}`;
  const optOutUrl = `${baseUrl}/opt-out?token=${optOutToken}`;
  const fromEmail = env.EMAIL_FROM || 'security@vonbusch.digital';
  const subject = lead.vpnStatus === 'none' ? "ZTNA Scout: Your Security Analysis" : "ZTNA Scout: Verify your analysis request";
  const body = `Hello ${lead.contactName},\n\nThank you for using ZTNA Scout. To ensure data integrity and provide you with the results, please verify your request by clicking the link below:\n\n${verifyUrl}\n\nProject: ${lead.companyName} (${lead.seats} seats)\n\nIf you wish to object to further contact from our security architects, please use this link: ${optOutUrl}\n\nBest regards,\nThe ZTNA Scout Team`;
  if (!env.RESEND_API_KEY) {
    console.warn('[EMAIL] Skipping dispatch: RESEND_API_KEY is not configured.');
    return { success: false, error: 'Email service not configured' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `ZTNA Scout <${fromEmail}>`,
        to: lead.email,
        subject,
        text: body
      })
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[EMAIL] Resend API error (${res.status}):`, errorText);
      throw new Error(`Email provider error: ${res.status}`);
    }
    return { success: true };
  } catch (e) {
    console.error('[EMAIL] Delivery exception:', e);
    return { success: false, error: e instanceof Error ? e.message : 'Unknown delivery error' };
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
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.post('/api/submit', async (c) => {
    try {
      const input = await c.req.json();
      const { turnstileToken, ...formData } = input;
      const env = c.env as any;
      const secret = env.TURNSTILE_SECRET_KEY || env.PUBLIC_TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";
      const isHuman = await verifyTurnstile(turnstileToken, secret);
      if (!isHuman) return bad(c, 'Bot verification failed.');
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
        timing: formData.timing || 'planning',
        budgetRange: formData.budgetRange || 'med',
        consentRecord: {
          ipHash: btoa(ip).slice(0, 12),
          userAgent: c.req.header('user-agent') || 'unknown',
          timestamp: Date.now(),
          acceptedTextVersion: "v2.2024",
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
      await EmailEventEntity.create(c.env, {
        id: crypto.randomUUID(),
        leadId,
        recipient: lead.email,
        status: emailStatus,
        errorMessage: emailRes.error,
        createdAt: Date.now()
      });
      return ok(c, { leadId, requiresVerification: true });
    } catch (e) {
      console.error('[API] Submit failed:', e);
      return bad(c, 'Submission failed.');
    }
  });
  app.get('/api/sample-comparison', async (c) => {
    const sampleSeats = 250;
    const allVendorResults = await Promise.all(vendors.map(async (v) => {
      const mergedPricing = await getMergedPricing(c.env, v.id);
      const vendorFeatures = features.find(f => f.vendorId === v.id) || { vendorId: v.id, hasZTNA: true, hasSWG: false, hasCASB: false, hasDLP: false, hasFWaaS: false, hasRBI: false, isBSIQualified: false };
      return { id: v.id, name: v.name, pricing: mergedPricing, features: vendorFeatures, tco: calculateTCO(sampleSeats, mergedPricing) };
    }));
    const tcos = allVendorResults.map(r => r.tco);
    const maxTco = Math.max(...tcos, 1);
    const minTco = Math.min(...tcos, 1);
    const results: ComparisonResult[] = allVendorResults.map(r => ({
      vendorId: r.id, vendorName: r.name, tcoYear1: Number(r.tco.toFixed(2)),
      scores: calculateScores(r.features, r.tco, maxTco, minTco),
      features: r.features
    }));
    return ok(c, { id: 'sample', leadId: 'demo', results, inputs: { seats: sampleSeats, vpnStatus: 'active', budgetRange: 'med' }, createdAt: Date.now(), isSample: true });
  });
  app.get('/api/verify/:token', async (c) => {
    const token = c.req.param('token');
    const tokenEntity = new VerificationTokenEntity(c.env, token);
    if (!await tokenEntity.exists()) return notFound(c, 'Link invalid.');
    const tokenData = await tokenEntity.getState();
    const leadEntity = new LeadEntity(c.env, tokenData.leadId);
    if (!await leadEntity.exists()) return notFound(c, 'Lead not found.');
    const leadState = await leadEntity.getState();
    if (leadState.status === 'confirmed' && leadState.comparisonId) {
      return ok(c, { comparisonId: leadState.comparisonId });
    }
    if (tokenData.expiresAt < Date.now()) return bad(c, 'Link expired.');
    const allVendorResults = await Promise.all(vendors.map(async (v) => {
        const mergedPricing = await getMergedPricing(c.env, v.id);
        const vendorFeatures = features.find(f => f.vendorId === v.id) || { vendorId: v.id, hasZTNA: true, hasSWG: false, hasCASB: false, hasDLP: false, hasFWaaS: false, hasRBI: false, isBSIQualified: false };
        return { id: v.id, name: v.name, pricing: mergedPricing, features: vendorFeatures, tco: calculateTCO(leadState.seats, mergedPricing) };
    }));
    const tcos = allVendorResults.map(r => r.tco);
    const maxTco = Math.max(...tcos, 1);
    const minTco = Math.min(...tcos, 1);
    const results: ComparisonResult[] = allVendorResults.map(r => ({
      vendorId: r.id, vendorName: r.name, tcoYear1: Number(r.tco.toFixed(2)),
      scores: calculateScores(r.features, r.tco, maxTco, minTco),
      features: r.features
    }));
    const snapshotId = crypto.randomUUID();
    await ComparisonEntity.create(c.env, { id: snapshotId, leadId: leadState.id, results, inputs: { seats: leadState.seats, vpnStatus: leadState.vpnStatus, budgetRange: leadState.budgetRange }, createdAt: Date.now() });
    await leadEntity.patch({ status: 'confirmed', confirmedAt: Date.now(), comparisonId: snapshotId });
    await tokenEntity.patch({ usedAt: Date.now() });
    return ok(c, { comparisonId: snapshotId });
  });
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
    const deleted = await LeadEntity.delete(c.env, id);
    return ok(c, { success: deleted });
  });
  app.get('/api/admin/stats', async (c) => {
    const leadRes = await LeadEntity.list(c.env, null, 2000);
    const leads = leadRes.items;
    const confirmedLeads = leads.filter(l => l.status === 'confirmed').length;
    const vpnMap: Record<string, number> = {};
    const dayMap: Record<string, { pending: number; confirmed: number }> = {};
    // Process last 14 days
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dayMap[dateStr] = { pending: 0, confirmed: 0 };
    }
    leads.forEach(l => { 
      vpnMap[l.vpnStatus] = (vpnMap[l.vpnStatus] || 0) + 1;
      const dateStr = new Date(l.createdAt).toISOString().split('T')[0];
      if (dayMap[dateStr]) {
        if (l.status === 'confirmed') dayMap[dateStr].confirmed++;
        else dayMap[dateStr].pending++;
      }
    });
    const dailyLeads: TimeSeriesData[] = Object.entries(dayMap)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => a.date.localeCompare(b.date));
    let mostCommonVpn = 'none';
    let maxCount = 0;
    Object.entries(vpnMap).forEach(([status, count]) => { if (count > maxCount) { maxCount = count; mostCommonVpn = status; } });
    return ok(c, {
      totalLeads: leads.length,
      pendingLeads: leads.length - confirmedLeads,
      confirmedLeads,
      conversionRate: leads.length > 0 ? Math.round((confirmedLeads / leads.length) * 100) : 0,
      avgSeats: leads.length > 0 ? Math.round(leads.reduce((acc, curr) => acc + (curr.seats || 0), 0) / leads.length) : 0,
      mostCommonVpn,
      dailyLeads
    });
  });
  app.post('/api/admin/pricing', async (c) => {
    const update = await c.req.json<PricingOverride>();
    await new PricingOverrideEntity(c.env, update.vendorId).save({ ...update, basePricePerMonth: Number(update.basePricePerMonth.toFixed(2)), updatedAt: Date.now() });
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
  app.get('/api/comparison/:id', async (c) => {
    const comp = new ComparisonEntity(c.env, c.req.param('id'));
    if (!await comp.exists()) return notFound(c, 'Report not found.');
    return ok(c, await comp.getState());
  });
  app.post('/api/opt-out', async (c) => {
    const { token } = await c.req.json();
    const optOutEntity = new OptOutTokenEntity(c.env, token);
    if (!await optOutEntity.exists()) return bad(c, 'Invalid token');
    const tokenData = await optOutEntity.getState();
    await new LeadEntity(c.env, tokenData.leadId).patch({ contactAllowed: false, optedOutAt: Date.now() });
    return ok(c, { success: true });
  });
  app.get('/api/config', (c) => {
    const env = c.env as any;
    return ok(c, { turnstileSiteKey: env.TURNSTILE_SITE_KEY || env.PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA" });
  });
}