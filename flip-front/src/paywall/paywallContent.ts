import type { TFunction } from 'i18next';
import { PaywallBenefit, PaywallContent, PaywallPlanId } from './types';

const DEFAULT_PLAN: PaywallPlanId = 'annual';

const sanitizeBenefits = (raw: unknown): PaywallBenefit[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((b): b is PaywallBenefit => {
      if (!b || typeof b !== 'object') return false;
      const r = b as Record<string, unknown>;
      return typeof r.icon === 'string' && typeof r.title === 'string' && typeof r.sub === 'string';
    })
    .map((b) => ({ icon: b.icon, title: b.title, sub: b.sub }));
};

export function getPaywallContent(t: TFunction): PaywallContent {
  return {
    title: t('paywall:default.title'),
    pitch: t('paywall:default.pitch'),
    benefits: sanitizeBenefits(t('paywall:default.benefits', { returnObjects: true })),
    recommendedPlan: DEFAULT_PLAN,
  };
}
