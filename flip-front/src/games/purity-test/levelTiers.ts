import { ContentTier } from '../../content';
import { Entitlement } from '../../entitlements';
import { LevelKey } from './types';

export const LEVEL_TIER: Readonly<Record<LevelKey, ContentTier>> = {
  level1: 'free',
  level2: 'free',
  level3: 'free',
  level4: 'spicy',
  level5: 'hardcore',
  levelBonus: 'hardcore',
};

const TIER_ENTITLEMENT: Readonly<Record<ContentTier, Entitlement | null>> = {
  free: null,
  spicy: 'spicy_content',
  hardcore: 'hardcore_content',
};

export function levelRequiredEntitlement(level: LevelKey): Entitlement | null {
  return TIER_ENTITLEMENT[LEVEL_TIER[level]];
}
