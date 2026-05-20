import { ContentTier } from '../../content';
import { Entitlement } from '../../entitlements';
import { CameleonTheme } from './types';

export const CAMELEON_THEME_TIER: Readonly<Record<CameleonTheme, ContentTier>> = {
  random: 'free',
  daily: 'free',
  football: 'free',
  sousculture: 'free',
  rap: 'free',
  hot: 'spicy',
  decadence: 'spicy',
  wtf: 'hardcore',
};

const TIER_ENTITLEMENT: Readonly<Record<ContentTier, Entitlement | null>> = {
  free: null,
  spicy: 'spicy_content',
  hardcore: 'hardcore_content',
};

export function cameleonThemeRequiredEntitlement(theme: CameleonTheme): Entitlement | null {
  return TIER_ENTITLEMENT[CAMELEON_THEME_TIER[theme]];
}
