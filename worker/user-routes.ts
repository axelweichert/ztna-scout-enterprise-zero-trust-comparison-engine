import { Hono } from "hono";
import type { Env } from "./core-utils";
import { ok, bad, notFound } from "./core-utils";
import { IndexedEntity, Entity } from "./core-utils";
import { calculateTCO, calculateScores } from "./calculator";
import type {
  Lead,
  ComparisonSnapshot,
  ComparisonResult,
  PricingModel,
  FeatureMatrix,
  PricingOverride,
  VerificationToken,
  OptOutToken,
} from "./shared-types";

const VENDORS = [
  { id: "cloudflare", name: "Cloudflare", website: "https://www.cloudflare.com" },
  { id: "zscaler", name: "Zscaler", website: "https://www.zscaler.com" },
  { id: "akamai", name: "Akamai", website: "https://www.akamai.com" },
  { id: "fortinet", name: "Fortinet", website: "https://www.fortinet.com" },
  { id: "aruba", name: "HPE Aruba SSE", website: "https://www.arubanetworks.com/products/security/sase/" },
  { id: "cisco", name: "Cisco Umbrella", website: "https://www.cisco.com" },
  { id: "checkpoint", name: "Check Point Harmony SASE", website: "https://www.checkpoint.com" },
  { id: "cato", name: "Cato Networks", website: "https://www.catonetworks.com/" },
  { id: "forcepoint", name: "Forcepoint ONE", website: "https://www.forcepoint.com" },
  { id: "iboss", name: "iboss", website: "https://www.iboss.com" },
  { id: "netskope", name: "Netskope", website: "https://www.netskope.com" },
  { id: "paloalto", name: "Palo Alto Prisma Access", website: "https://www.paloaltonetworks.com" },
  {
    id: "dt_managed_sase",
    name: "Deutsche Telekom Managed SASE",
    website: "https://business.telekom.com/global/products-and-solutions/next-level-networking/sase/",
  },
];

const FEATURES: FeatureMatrix[] = [
  { vendorId: "cloudflare", hasZTNA: true, hasSWG: true, hasCASB: true, hasDLP: true, hasFWaaS: true, hasRBI: true, isBSIQualified: true },
  { vendorId: "zscaler", hasZTNA: true, hasSWG: true, hasCASB: true, hasDLP: true, hasFWaaS: true, hasRBI: true, isBSIQualified: false },
  { vendorId: "akamai", hasZTNA: true, hasSWG: true, hasCASB: true, hasDLP: false, hasFWaaS: false, hasRBI: true, isBSIQualified: true },
  { vendorId: "fortinet", hasZTNA: true, hasSWG: true, hasCASB: false, hasDLP: false, hasFWaaS: true, hasRBI: false, isBSIQualified: false },
  { vendorId: "aruba", hasZTNA: true, hasSWG: true, hasCASB: true, hasDLP: true, hasFWaaS: true, hasRBI: false, isBSIQualified: false },
  { vendorId: "cisco", hasZTNA: true, hasSWG: true, hasCASB: true, hasDLP: true, hasFWaaS: true, hasRBI: true, isBSIQualified: false },
  { vendorId: "checkpoint", hasZTNA: true, hasSWG: true, hasCASB: true, hasDLP: true, hasFWaaS: true, hasRBI: true, isBSIQualified: false },
  { vendorId: "cato", hasZTNA: true, hasSWG: true, hasCASB: true, hasDLP: true, hasFWaaS: true, hasRBI: true, isBSIQualified: false },
  { vendorId: "forcepoint", hasZTNA: true, hasSWG: true, hasCASB: true, hasDLP: true, hasFWaaS: false, hasRBI: true, isBSIQualified: false },
  { vendorId: "iboss", hasZTNA: true, hasSWG: true, hasCASB: true, hasDLP: true, hasFWaaS: true, hasRBI: true, isBSIQualified: false },
  { vendorId: "netskope", hasZTNA: true, hasSWG: true, hasCASB: true, hasDLP: true, hasFWaaS: true, hasRBI: true, isBSIQualified: false },
  { vendorId: "paloalto", hasZTNA: true, hasSWG: true, hasCASB: true, hasDLP: true, hasFWaaS: true, hasRBI: true, isBSIQualified: false },
  { vendorId: "dt_managed_sase", hasZTNA: true, hasSWG: true, hasCASB: true, hasDLP: true, hasFWaaS: true, hasRBI: true, isBSIQualified: true },
];

const PRICING: PricingModel[] = [
  { vendorId: "cloudflare", basePricePerMonth: 12.5, isQuoteOnly: false, installationFee: 4000 },
  { vendorId: "zscaler", basePricePerMonth: 35.0, isQuoteOnly: true, installationFee: 4000 },
  { vendorId: "akamai", basePricePerMonth: 28.0, isQuoteOnly: true, installationFee: 4000 },
  { vendorId: "fortinet", basePricePerMonth: 18.0, isQuoteOnly: false, installationFee: 4000 },
  { vendorId: "aruba", basePricePerMonth: 27.0, isQuoteOnly: true, installationFee: 4000 },
  { vendorId: "cisco", basePricePerMonth: 30.0, isQuoteOnly: true, installationFee: 4000 },
  { vendorId: "checkpoint", basePricePerMonth: 24.0, isQuoteOnly: true, installationFee: 4000 },
  { vendorId: "cato", basePricePerMonth: 29.0, isQuoteOnly: true, installationFee: 4000 },
  { vendorId: "forcepoint", basePricePerMonth: 25.0, isQuoteOnly: true, installationFee: 4000 },
  { vendorId: "iboss", basePricePerMonth: 22.0, isQuoteOnly: true, installationFee: 4000 },
  { vendorId: "netskope", basePricePerMonth: 32.0, isQuoteOnly: true, installationFee: 4000 },
  { vendorId: "paloalto", basePricePerMonth: 45.0, isQuoteOnly: true, installationFee: 4000 },
  { vendorId: "dt_managed_sase", basePricePerMonth: 38.0, isQuoteOnly: true, installationFee: 4000 },
];

class LeadEntity extends IndexedEntity<Lead> {
  static readonly entityName = "lead";
  static readonly indexName = "leads";
  static readonly initialState: Lead = {
    id: "",
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    seats: 0,
    vpnStatus: "none",
    budgetRange: "med",
    timing: "planning",
    consentGiven: false,
    createdAt: 0,
    status: "pending",
    contactAllowed: true,
    emailStatus: "pending",
  };
}

class ComparisonEntity extends IndexedEntity<ComparisonSnapshot> {
  static readonly entityName = "comparison";
  static readonly indexName = "comparisons";
  static readonly initialState: ComparisonSnapshot = {
    id: "",
    leadId: "",
    results: [],
    inputs: { seats: 0, vpnStatus: "none" },
    createdAt: 0,
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
  static readonly initialState: PricingOverride = { vendorId: "", basePricePerMonth: 0, isQuoteOnly: false, updatedAt: 0 };
}

async function getMergedPricing(env: Env, vendorId: string): Promise<PricingModel> {
  const base =
    PRICING.find((p) => p.vendorId === vendorId) || {
      vendorId,
      basePricePerMonth: 25,
      isQuoteOnly: true,
      installationFee: 4000,
    };

  const overrideInst = new PricingOverrideEntity(env, vendorId);
  try {
    if (await overrideInst.exists()) {
      const override = await overrideInst.getState();
      if (override && typeof override.basePricePerMonth === "number" && override.basePricePerMonth > 0) {
        return { ...base, basePricePerMonth: override.basePricePerMonth, isQuoteOnly: !!override.isQuoteOnly };
      }
    }
  } catch (e) {
    console.error(`[WORKER] Override fetch failed for ${vendorId}:`, e);
  }

  return base;
}

async function buildComparison(env: Env, leadId: string, seats: number, inputs: any): Promise<ComparisonSnapshot> {
  const processedResults = await Promise.all(
    VENDORS.map(async (v) => {
      const model = await getMergedPricing(env, v.id);
      const feat = FEATURES.find((f) => f.vendorId === v.id) as FeatureMatrix;
      const tco = calculateTCO(seats, model);
      return { v, feat, tco };
    }),
  );

  const tcos = processedResults.map((r) => r.tco);
  const maxTco = Math.max(...tcos, 1);
  const minTco = Math.min(...tcos, 0);

  const snapshotResults: ComparisonResult[] = processedResults.map((r) => ({
    vendorId: r.v.id,
    vendorName: r.v.name,
    tcoYear1: Number(r.tco.toFixed(2)),
    scores: calculateScores(r.feat, r.tco, maxTco, minTco),
    features: r.feat,
  }));

  return {
    id: crypto.randomUUID(),
    leadId,
    results: snapshotResults,
    inputs,
    createdAt: Date.now(),
  };
}

/**
 * IMPORTANT:
 * We export BOTH:
 * - named export: userRoutes
 * - default export: userRoutes
 *
 * This prevents Rollup/Vite from failing depending on how worker/index.ts imports it.
 */
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get("/api/config", (c) => {
    const env = c.env as any;

    // Correct binding name (as per your rules):
    // PUBLIC_TURNSTILE_SITE_KEY as public var
    const siteKey = env.PUBLIC_TURNSTILE_SITE_KEY || "";

    return ok(c, { turnstileSiteKey: siteKey });
  });

  app.post("/api/submit", async (c) => {
    try {
      const input = await c.req.json();
      if (!input.email || !input.companyName || !input.phone) return bad(c, "Required fields missing");

      const leadId = crypto.randomUUID();
      const lead: Lead = {
        ...input,
        id: leadId,
        createdAt: Date.now(),
        status: "pending",
        contactAllowed: true,
        consentGiven: true,
        emailStatus: "pending",
      };

      await LeadEntity.create(c.env, lead);

      const vToken = crypto.randomUUID();
      await new VerificationTokenEntity(c.env, vToken).save({
        hash: vToken,
        leadId,
        expiresAt: Date.now() + 604800000,
      });

      const oToken = crypto.randomUUID();
      await new OptOutTokenEntity(c.env, oToken).save({
        hash: oToken,
        leadId,
        createdAt: Date.now(),
      });

      return ok(c, { leadId, verificationToken: vToken });
    } catch (e) {
      console.error("[WORKER] submit failed:", e);
      return bad(c, "Submission failed");
    }
  });

  app.post("/api/opt-out", async (c) => {
    try {
      const { token } = await c.req.json();
      const tokenEntity = new OptOutTokenEntity(c.env, token);
      if (!(await tokenEntity.exists())) return bad(c, "Invalid token");

      const { leadId } = await tokenEntity.getState();
      const leadEntity = new LeadEntity(c.env, leadId);

      if (await leadEntity.exists()) {
        await leadEntity.patch({ contactAllowed: false, optedOutAt: Date.now() } as any);
      }

      return ok(c, { success: true });
    } catch (e) {
      console.error("[WORKER] opt-out failed:", e);
      return bad(c, "Opt-out failed");
    }
  });

  app.get("/api/sample-comparison", async (c) => {
    try {
      const seats = 250;
      const snapshot = await buildComparison(c.env, "demo", seats, { seats, vpnStatus: "active", budgetRange: "med" });
      return ok(c, { ...snapshot, id: "sample", isSample: true });
    } catch (e) {
      console.error("[WORKER] sample failed:", e);
      return bad(c, "Sample failed");
    }
  });

  app.get("/api/verify/:token", async (c) => {
    try {
      const token = c.req.param("token");
      const tokenEntity = new VerificationTokenEntity(c.env, token);
      if (!(await tokenEntity.exists())) return notFound(c, "Link invalid");

      const tokenData = await tokenEntity.getState();
      const leadEntity = new LeadEntity(c.env, tokenData.leadId);
      const leadState = await leadEntity.getState();

      if ((leadState as any).comparisonId) return ok(c, { comparisonId: (leadState as any).comparisonId });

      const snapshot = await buildComparison(c.env, leadState.id, leadState.seats || 50, {
        seats: leadState.seats,
        vpnStatus: leadState.vpnStatus,
        budgetRange: (leadState as any).budgetRange,
      });

      await ComparisonEntity.create(c.env, snapshot);
      await leadEntity.patch({ status: "confirmed", comparisonId: snapshot.id } as any);

      return ok(c, { comparisonId: snapshot.id });
    } catch (e) {
      console.error("[WORKER] verification failed:", e);
      return bad(c, "Verification failed");
    }
  });
}

export default userRoutes;
