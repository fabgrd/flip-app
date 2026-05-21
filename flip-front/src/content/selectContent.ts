import { Entitlement } from '../entitlements';
import { ContentItem, ContentTier, TIER_ENTITLEMENT } from './types';

export interface ContentFilter {
  has: (e: Entitlement) => boolean;
  tags?: readonly string[];
  maxTier?: ContentTier;
}

const TIER_ORDER: Record<ContentTier, number> = { free: 0, spicy: 1, hardcore: 2 };

export function selectContent<T extends ContentItem>(
  items: readonly T[],
  filter: ContentFilter,
): T[] {
  const requiredTags = filter.tags && filter.tags.length > 0 ? filter.tags : null;
  const maxTierRank = filter.maxTier !== undefined ? TIER_ORDER[filter.maxTier] : Infinity;

  return items.filter((item) => {
    const tier = item.tier ?? 'free';
    if (TIER_ORDER[tier] > maxTierRank) return false;

    const required = TIER_ENTITLEMENT[tier];
    if (required !== null && !filter.has(required)) return false;

    if (requiredTags) {
      const itemTags = item.tags ?? [];
      if (!requiredTags.every((t) => itemTags.includes(t))) return false;
    }

    return true;
  });
}
