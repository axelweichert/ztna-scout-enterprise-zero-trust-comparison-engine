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
async function sendVerificationEmail(env: any, lead: Lead, token: string, optOutToken: string) {
  const baseUrl = env.PUBLIC_BASE_URL || 'https://ztna-scout.pages.dev';
  const verifyUrl = `${baseUrl}/verify/${token}`;
  const optOutUrl = `${baseUrl}/opt-out?token=${optOutToken}`;
  const fromEmail = env.EMAIL_FROM || 'security@vonbusch.digital';
  const subject = lead.vpnStatus === 'none' ? "ZTNA Scout: Your Security Analysis" : "ZTNA Scout: Verify your analysis request";
  const body = `Hello ${lead.contactName},\n\nThank you for using ZTNA Scout. To ensure data integrity, please verify your request by clicking the link below:\n\n${verifyUrl}\n\nThis analysis is for ${lead.seats} seats at ${lead.companyName}.\n\nIf you wish to object to further contact from our security architects, please use this link: ${optOutUrl}\n\nBest regards,\nThe ZTNA Scout Team`;
  try {
    if (env.RESEND_API_KEY) {
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
      if (!res.ok) throw new Error(await res.text());
    } else {
      console.warn('RESEND_API_KEY missing - Email not sent. Verify URL:', verifyUrl);
    }
    return { success: true };
  } catch (e) {
    console.error('Email delivery failed:', e);
    return { success: false, error: e instanceof Error ? e.message : String(e) };
  }
}
export function userRoutes(app: Hono<{ Bindings: Env & { TURNSTILE_SECRET_KEY: string, RESEND_API_KEY: string, PUBLIC_BASE_URL: string, EMAIL_FROM: string } }>) {
  app.post('/api/submit', async (c) => {
    const clonedReq = c.req.raw.clone();
    try {
      const { turnstileToken, ...input } = await c.req.json();
      const secret = c.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";
      const isHuman = await verifyTurnstile(turnstileToken, secret);
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
        emailStatus: 'pending',
        timing: input.timing || 'immediate',
        budgetRange: input.budgetRange || 'med',
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
      const vTokenEntity = new VerificationTokenEntity(c.env, vToken);
      await vTokenEntity.save({ hash: vToken, leadId, expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) });
      const oToken = crypto.randomUUID();
      const oTokenEntity = new OptOutTokenEntity(c.env, oToken);
      await oTokenEntity.save({ hash: oToken, leadId, createdAt: Date.now() });
      const emailRes = await sendVerificationEmail(c.env, lead, vToken, oToken);
      const emailStatus = emailRes.success ? 'sent' : 'failed';
      await new LeadEntity(c.env, leadId).patch({
        emailStatus,
        emailError: emailRes.error
      });
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
      console.error('Submit failed', e);
      return bad(c, 'Submission failed');
    }
  });
  app.get('/api/sample-comparison', async (c) => {
    const sampleSeats = 250;
    const sampleVpnStatus = 'active';
    const allVendorResults = vendors.map((v) => {
      const basePricing = pricing.find(p => p.vendorId === v.id) || { vendorId: v.id, basePricePerMonth: 25, isQuoteOnly: true, installationFee: 4000 };
      const vendorFeatures = features.find(f => f.vendorId === v.id) || { vendorId: v.id, hasZTNA: true, hasSWG: false, hasCASB: false, hasDLP: false, hasFWaaS: false, hasRBI: false, isBSIQualified: false };
      return {
        id: v.id,
        name: v.name,
        pricing: basePricing,
        features: vendorFeatures,
        tco: calculateTCO(sampleSeats, basePricing)
      };
    });
    const tcos = allVendorResults.map(r => r.tco);
    const maxTco = tcos.length > 0 ? Math.max(...tcos) : 1;
    const minTco = tcos.length > 0 ? Math.min(...tcos) : 1;
    const results: ComparisonResult[] = allVendorResults.map(r => ({
      vendorId: r.id,
      vendorName: r.name,
      tcoYear1: r.tco,
      scores: calculateScores(r.features, r.tco, maxTco, minTco),
      features: r.features
    }));
    const snapshot: ComparisonSnapshot = {
      id: 'sample',
      leadId: 'demo-lead',
      results,
      inputs: { seats: sampleSeats, vpnStatus: sampleVpnStatus, budgetRange: 'med' },
      createdAt: Date.now(),
      isSample: true
    };
    return ok(c, snapshot);
  });
  app.get('/api/verify/:token', async (c) => {
    const token = c.req.param('token');
    const tokenEntity = new VerificationTokenEntity(c.env, token);
    if (!await tokenEntity.exists()) return notFound(c, 'Invalid or expired token');
    const tokenData = await tokenEntity.getState();
    const leadEntity = new LeadEntity(c.env, tokenData.leadId);
    const leadState = await leadEntity.getState();
    if (leadState.status === 'confirmed' && leadState.comparisonId) {
      return ok(c, { comparisonId: leadState.comparisonId });
    }
    if (tokenData.usedAt || tokenData.expiresAt < Date.now()) return bad(c, 'Token expired or used');
    const allVendorResults = vendors.map((v) => {
        const basePricing = pricing.find(p => p.vendorId === v.id) || { vendorId: v.id, basePricePerMonth: 25, isQuoteOnly: true, installationFee: 4000 };
        const vendorFeatures = features.find(f => f.vendorId === v.id) || { vendorId: v.id, hasZTNA: true, hasSWG: false, hasCASB: false, hasDLP: false, hasFWaaS: false, hasRBI: false, isBSIQualified: false };
        return {
          id: v.id,
          name: v.name,
          pricing: basePricing,
          features: vendorFeatures,
          tco: calculateTCO(leadState.seats, basePricing)
        };
    });
    const tcos = allVendorResults.map(r => r.tco);
    const maxTco = tcos.length > 0 ? Math.max(...tcos) : 1;
    const minTco = tcos.length > 0 ? Math.min(...tcos) : 1;
    const results: ComparisonResult[] = allVendorResults.map(r => ({
      vendorId: r.id,
      vendorName: r.name,
      tcoYear1: r.tco,
      scores: calculateScores(r.features, r.tco, maxTco, minTco),
      features: r.features
    }));
    const snapshotId = crypto.randomUUID();
    const snapshot: ComparisonSnapshot = {
      id: snapshotId,
      leadId: leadState.id,
      results,
      inputs: { seats: leadState.seats, vpnStatus: leadState.vpnStatus, budgetRange: leadState.budgetRange },
      createdAt: Date.now()
    };
    await ComparisonEntity.create(c.env, snapshot);
    await leadEntity.patch({ status: 'confirmed', confirmedAt: Date.now(), comparisonId: snapshotId });
    await tokenEntity.patch({ usedAt: Date.now() });
    return ok(c, { comparisonId: snapshotId });
  });
  app.post('/api/opt-out', async (c) => {
    const { token } = await c.req.json();
    const optOutEntity = new OptOutTokenEntity(c.env, token);
    if (!await optOutEntity.exists()) return bad(c, 'Invalid token');
    const tokenData = await optOutEntity.getState();
    const leadEntity = new LeadEntity(c.env, tokenData.leadId);
    await leadEntity.patch({ contactAllowed: false, optedOutAt: Date.now() });
    return ok(c, { success: true });
  });
  app.get('/api/comparison/:id', async (c) => {
    const comp = new ComparisonEntity(c.env, c.req.param('id'));
    if (!await comp.exists()) return notFound(c);
    return ok(c, await comp.getState());
  });
  app.get('/api/admin/leads', async (c) => {
    const leads = await LeadEntity.list(c.env, null, 1000);
    return ok(c, leads.items.sort((a, b) => b.createdAt - a.createdAt));
  });
  app.delete('/api/admin/leads/:id', async (c) => {
    const deleted = await LeadEntity.delete(c.env, c.req.param('id'));
    return ok(c, { success: deleted });
  });
  app.get('/api/admin/stats', async (c) => {
    const leadRes = await LeadEntity.list(c.env, null, 2000);
    const leads = leadRes.items;
    const totalLeads = leads.length;
    const confirmedLeads = leads.filter(l => l.status === 'confirmed').length;
    const conversionRate = totalLeads > 0 ? Math.round((confirmedLeads / totalLeads) * 100) : 0;
    const avgSeats = totalLeads > 0 ? Math.round(leads.reduce((acc, curr) => acc + (curr.seats || 0), 0) / totalLeads) : 0;
    const vpnCounts: Record<string, number> = {};
    leads.forEach(l => {
      vpnCounts[l.vpnStatus] = (vpnCounts[l.vpnStatus] || 0) + 1;
    });
    const mostCommonVpn = Object.entries(vpnCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
    const dailyLeads: TimeSeriesData[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLeads = leads.filter(l => new Date(l.createdAt).toISOString().split('T')[0] === dateStr);
      dailyLeads.push({
        date: dateStr,
        pending: dayLeads.filter(l => l.status === 'pending').length,
        confirmed: dayLeads.filter(l => l.status === 'confirmed').length
      });
    }
    return ok(c, { totalLeads, pendingLeads: totalLeads - confirmedLeads, confirmedLeads, conversionRate, avgSeats, mostCommonVpn, dailyLeads });
  });
  app.post('/api/admin/pricing', async (c) => {
    const update = await c.req.json<PricingOverride>();
    const inst = new PricingOverrideEntity(c.env, update.vendorId);
    await inst.save({ ...update, updatedAt: Date.now() });
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
}