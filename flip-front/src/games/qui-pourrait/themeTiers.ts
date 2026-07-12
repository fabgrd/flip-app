import { ContentTier, TIER_ENTITLEMENT } from '../../content';
import { Entitlement } from '../../entitlements';
import { QuiPourraitTheme } from './constants';

export const QUI_POURRAIT_THEME_TIER: Readonly<Record<QuiPourraitTheme, ContentTier>> = {
  daily: 'free',
  party: 'free',
  love: 'free',
  wtf: 'free',
  hot: 'spicy',
  trash: 'hardcore',
};

export function quiPourraitThemeRequiredEntitlement(theme: QuiPourraitTheme): Entitlement | null {
  return TIER_ENTITLEMENT[QUI_POURRAIT_THEME_TIER[theme]];
}
