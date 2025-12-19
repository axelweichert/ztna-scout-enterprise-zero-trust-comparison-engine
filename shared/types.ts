export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Template Demo Types
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}
// ZTNA Scout Types
export type VpnStatus = 'active' | 'replacing' | 'none';
export type Timing = 'immediate' | '3_months' | '6_months' | 'planning';
export type LeadStatus = 'pending' | 'confirmed' | 'deleted';
export interface TimeSeriesData {
  date: string;
  pending: number;
  confirmed: number;
}
export interface ConsentRecord {
  ipHash: string;
  userAgent: string;
  timestamp: number;
  acceptedTextVersion: string;
  disclaimerAccepted: boolean;
}
export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  seats: number;
  vpnStatus: VpnStatus;
  budgetRange?: string;
  timing: Timing;
  consentGiven: boolean;
  createdAt: number;
  status: LeadStatus;
  confirmedAt?: number;
  contactAllowed: boolean;
  optedOutAt?: number;
  consentRecord?: ConsentRecord;
  comparisonId?: string;
}
export interface LeadFormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  seats: number;
  vpnStatus: VpnStatus;
}
export interface VerificationToken {
  hash: string;
  leadId: string;
  expiresAt: number;
  usedAt?: number;
}
export interface OptOutToken {
  hash: string;
  leadId: string;
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
  basePricePerMonth: number;
  isQuoteOnly: boolean;
  installationFee: number;
}
export interface PricingOverride {
  vendorId: string;
  basePricePerMonth: number;
  isQuoteOnly: boolean;
  updatedAt: number;
}
export interface ComparisonResult {
  vendorId: string;
  vendorName: string;
  tcoYear1: number;
  scores: {
    featureScore: number;
    priceScore: number;
    complianceScore: number;
    totalScore: number;
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
  isSample?: boolean;
}
export interface AdminStats {
  totalLeads: number;
  pendingLeads: number;
  confirmedLeads: number;
  conversionRate: number;
  avgSeats: number;
  mostCommonVpn: string;
  dailyLeads: TimeSeriesData[];
}