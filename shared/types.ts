export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type VpnStatus = 'active' | 'replacing' | 'none';
export type Timing = 'immediate' | '3_months' | '6_months' | 'planning';
export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  seats: number;
  vpnStatus: VpnStatus;
  budgetRange: string;
  timing: Timing;
  consentGiven: boolean;
  createdAt: number;
}
export interface Vendor {
  id: string;
  name: string;
  logoUrl?: string;
  website: string;
}
export interface FeatureMatrix {
  vendorId: string;
  hasZTNA: boolean;
  hasSWG: boolean;
  hasCASB: boolean;
  hasDLP: boolean;
  hasFWaaS: boolean;
  hasRBI: boolean;
  isBSIQualified: boolean;
}
export interface PricingModel {
  vendorId: string;
  basePricePerMonth: number; // in EUR
  isQuoteOnly: boolean;
  installationFee: number; // default 4000
}
export interface ComparisonResult {
  vendorId: string;
  vendorName: string;
  tcoYear1: number;
  scores: {
    featureScore: number; // 0-100
    priceScore: number;   // 0-100
    complianceScore: number; // 0-100
    totalScore: number;   // Weighted average
  };
  features: FeatureMatrix;
}
export interface ComparisonSnapshot {
  id: string;
  leadId: string;
  results: ComparisonResult[];
  inputs: {
    seats: number;
    vpnStatus: VpnStatus;
  };
  createdAt: number;
}