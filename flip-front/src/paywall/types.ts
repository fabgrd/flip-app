export type PaywallPlanId = 'annual' | 'monthly' | 'weekly';

export interface PaywallBenefit {
  icon: string;
  title: string;
  sub: string;
}

export interface PaywallContent {
  title: string;
  pitch: string;
  benefits: PaywallBenefit[];
  recommendedPlan: PaywallPlanId;
}
