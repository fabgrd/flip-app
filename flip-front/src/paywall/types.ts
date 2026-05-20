import { Entitlement } from '../entitlements';

export type PaywallPlanId = 'annual' | 'monthly' | 'weekly';

export interface PaywallBenefit {
  icon: string;
  title: string;
  sub: string;
}

export interface PaywallContent {
  feature: Entitlement | null;
  title: string;
  pitch: string;
  benefits: PaywallBenefit[];
  recommendedPlan: PaywallPlanId;
}
