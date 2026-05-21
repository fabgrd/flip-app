import { ContentTier } from '../../content';
import { Entitlement } from '../../entitlements';
import { CastingTheme } from './constants';

export const CASTING_THEME_TIER: Readonly<Record<CastingTheme, ContentTier>> = {
  daily: 'free',
  relations: 'free',
  gaming: 'free',
  studies: 'free',
  spicy: 'spicy',
  family: 'spicy',
  party: 'spicy',
  taboo: 'hardcore',
};

const TIER_ENTITLEMENT: Readonly<Record<ContentTier, Entitlement | null>> = {
  free: null,
  spicy: 'spicy_content',
  hardcore: 'hardcore_content',
};

export function castingThemeRequiredEntitlement(theme: CastingTheme): Entitlement | null {
  return TIER_ENTITLEMENT[CASTING_THEME_TIER[theme]];
}
