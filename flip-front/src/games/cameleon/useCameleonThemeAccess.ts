import { useCallback } from 'react';
import { useEntitlements } from '../../entitlements';
import { usePaywall } from '../../paywall';
import { cameleonThemeRequiredEntitlement } from './themeTiers';
import { CameleonTheme } from './types';

export interface CameleonThemeAccess {
  isThemeAllowed: (theme: CameleonTheme) => boolean;
  requestUnlockFor: (theme: CameleonTheme) => void;
  filterAllowed: (themes: CameleonTheme[]) => CameleonTheme[];
}

export function useCameleonThemeAccess(): CameleonThemeAccess {
  const { has } = useEntitlements();
  const { open } = usePaywall();

  const isThemeAllowed = useCallback(
    (theme: CameleonTheme) => {
      const req = cameleonThemeRequiredEntitlement(theme);
      return req === null || has(req);
    },
    [has],
  );

  const requestUnlockFor = useCallback(
    (theme: CameleonTheme) => {
      const req = cameleonThemeRequiredEntitlement(theme);
      if (req) open(req);
    },
    [open],
  );

  const filterAllowed = useCallback(
    (themes: CameleonTheme[]) => themes.filter(isThemeAllowed),
    [isThemeAllowed],
  );

  return { isThemeAllowed, requestUnlockFor, filterAllowed };
}
