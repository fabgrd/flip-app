import { ContentTier } from '../../content';
import { Entitlement } from '../../entitlements';
import { RFLevelKey } from './types';

export const RF_LEVEL_TIER: Readonly<Record<RFLevelKey, ContentTier>> = {
  soft: 'free',
  chill: 'free',
  hot: 'spicy',
  hard: 'hardcore',
};

const TIER_ENTITLEMENT: Readonly<Record<ContentTier, Entitlement | null>> = {
  free: null,
  spicy: 'spicy_content',
  hardcore: 'hardcore_content',
};

export function rfLevelRequiredEntitlement(level: RFLevelKey): Entitlement | null {
  return TIER_ENTITLEMENT[RF_LEVEL_TIER[level]];
}
