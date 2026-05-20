import { Entitlement } from '../entitlements';

export const CONTENT_TIERS = ['free', 'spicy', 'hardcore'] as const;
export type ContentTier = (typeof CONTENT_TIERS)[number];

export interface ContentItem {
  id: string;
  text: string;
  tier?: ContentTier;
  tags?: readonly string[];
}

export const TIER_ENTITLEMENT: Readonly<Record<ContentTier, Entitlement | null>> = {
  free: null,
  spicy: 'spicy_content',
  hardcore: 'hardcore_content',
};
