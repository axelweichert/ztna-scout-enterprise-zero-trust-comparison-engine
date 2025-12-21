import type { PricingModel, FeatureMatrix } from "./shared-types";
/**
 * DETERMINISTIC TCO CALCULATION
 * Formula: (Seats * MonthlyPrice * 12) + InstallationFee
 */
export function calculateTCO(seats: number, model: PricingModel): number {
  const safeSeats = Math.max(1, seats);
  const annualSubscription = safeSeats * (model.basePricePerMonth || 0) * 12;
  return Number((annualSubscription + (model.installationFee || 0)).toFixed(2));
}
/**
 * WEIGHTED SCORING ENGINE
 * Features (40%), Price (40%), Compliance (20%)
 */
export function calculateScores(feats: FeatureMatrix, tco: number, maxTco: number, minTco: number) {
  const featureList = ['hasZTNA', 'hasSWG', 'hasCASB', 'hasDLP', 'hasFWaaS', 'hasRBI'] as const;
  const featurePoints = featureList.reduce((acc, key) => acc + (feats[key] ? 1 : 0), 0);
  const featureScore = Math.round((featurePoints / featureList.length) * 100);
  let priceScore = 70;
  const spread = maxTco - minTco;
  // Defensive check for division by zero or uniform market pricing
  if (spread > 0.01) {
    priceScore = Math.round(100 - (((tco - minTco) / spread) * 100));
  } else {
    // Deterministic fallback if all prices are identical
    if (feats.vendorId === 'cloudflare') priceScore = 95;
    else if (feats.isBSIQualified) priceScore = 90;
    else priceScore = 80;
  }
  priceScore = Math.max(0, Math.min(100, priceScore));
  const complianceScore = feats.isBSIQualified ? 100 : 40;
  // Final weighted calculation
  const totalScore = Math.round(
    (featureScore * 0.4) + 
    (priceScore * 0.4) + 
    (complianceScore * 0.2)
  );
  return {
    featureScore,
    priceScore,
    complianceScore,
    totalScore
  };
}