import type { TFunction } from 'i18next';
import { Entitlement } from '../entitlements';
import { PaywallBenefit, PaywallContent, PaywallPlanId } from './types';

interface PaywallContextMeta {
  recommendedPlan: PaywallPlanId;
}

const CONTEXT_META: Readonly<Record<Entitlement, PaywallContextMeta>> = {
  drinks_mode: { recommendedPlan: 'annual' },
  spicy_content: { recommendedPlan: 'annual' },
  hardcore_content: { recommendedPlan: 'annual' },
  extra_questions: { recommendedPlan: 'monthly' },
  premium_themes: { recommendedPlan: 'monthly' },
  unlimited_players: { recommendedPlan: 'monthly' },
};

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

export function getPaywallContent(feature: Entitlement | null, t: TFunction): PaywallContent {
  if (feature && t(`paywall:contexts.${feature}.title`, { defaultValue: '' })) {
    return {
      feature,
      title: t(`paywall:contexts.${feature}.title`),
      pitch: t(`paywall:contexts.${feature}.pitch`),
      benefits: sanitizeBenefits(
        t(`paywall:contexts.${feature}.benefits`, { returnObjects: true }),
      ),
      recommendedPlan: CONTEXT_META[feature]?.recommendedPlan ?? DEFAULT_PLAN,
    };
  }

  return {
    feature: null,
    title: t('paywall:default.title'),
    pitch: t('paywall:default.pitch'),
    benefits: sanitizeBenefits(t('paywall:default.benefits', { returnObjects: true })),
    recommendedPlan: DEFAULT_PLAN,
  };
}
