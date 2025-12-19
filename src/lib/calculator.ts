import type { ComparisonResult, FeatureMatrix, PricingModel } from "@shared/types";
export function calculateTCO(seats: number, pricing: PricingModel): number {
  const monthlyCost = seats * pricing.basePricePerMonth;
  const yearlyCost = monthlyCost * 12;
  return yearlyCost + pricing.installationFee;
}
export function calculateScores(
  features: FeatureMatrix,
  tco: number,
  maxTco: number,
  minTco: number
): ComparisonResult['scores'] {
  // Feature Score (0-100)
  const featureWeight = {
    hasZTNA: 30,
    hasSWG: 15,
    hasCASB: 15,
    hasDLP: 15,
    hasFWaaS: 15,
    hasRBI: 10
  };
  let featureScore = 0;
  if (features.hasZTNA) featureScore += featureWeight.hasZTNA;
  if (features.hasSWG) featureScore += featureWeight.hasSWG;
  if (features.hasCASB) featureScore += featureWeight.hasCASB;
  if (features.hasDLP) featureScore += featureWeight.hasDLP;
  if (features.hasFWaaS) featureScore += featureWeight.hasFWaaS;
  if (features.hasRBI) featureScore += featureWeight.hasRBI;
  // Price Score (0-100, lower TCO is better)
  const priceScore = maxTco === minTco ? 100 : Math.max(0, 100 * (1 - (tco - minTco) / (maxTco - minTco)));
  // Compliance Score (0 or 100 based on BSI)
  const complianceScore = features.isBSIQualified ? 100 : 0;
  // Total Score (Weighted)
  const totalScore = (featureScore * 0.4) + (priceScore * 0.4) + (complianceScore * 0.2);
  return {
    featureScore,
    priceScore,
    complianceScore,
    totalScore: Math.round(totalScore)
  };
}