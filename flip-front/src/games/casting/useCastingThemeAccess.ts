import { useCallback } from 'react';
import { useEntitlements } from '../../entitlements';
import { usePaywall } from '../../paywall';
import { CastingTheme } from './constants';
import { castingThemeRequiredEntitlement } from './themeTiers';

export interface CastingThemeAccess {
  isThemeAllowed: (theme: CastingTheme) => boolean;
  requestUnlockFor: (theme: CastingTheme) => void;
  filterAllowed: (themes: CastingTheme[]) => CastingTheme[];
}

export function useCastingThemeAccess(): CastingThemeAccess {
  const { has } = useEntitlements();
  const { open } = usePaywall();

  const isThemeAllowed = useCallback(
    (theme: CastingTheme) => {
      const req = castingThemeRequiredEntitlement(theme);
      return req === null || has(req);
    },
    [has],
  );

  const requestUnlockFor = useCallback(
    (theme: CastingTheme) => {
      const req = castingThemeRequiredEntitlement(theme);
      if (req) open(req);
    },
    [open],
  );

  const filterAllowed = useCallback(
    (themes: CastingTheme[]) => themes.filter(isThemeAllowed),
    [isThemeAllowed],
  );

  return { isThemeAllowed, requestUnlockFor, filterAllowed };
}
