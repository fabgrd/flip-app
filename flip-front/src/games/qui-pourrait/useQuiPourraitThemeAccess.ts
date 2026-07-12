import { useCallback } from 'react';
import { useEntitlements } from '../../entitlements';
import { usePaywall } from '../../paywall';
import { QuiPourraitTheme } from './constants';
import { quiPourraitThemeRequiredEntitlement } from './themeTiers';

export interface QuiPourraitThemeAccess {
  isThemeAllowed: (theme: QuiPourraitTheme) => boolean;
  requestUnlockFor: (theme: QuiPourraitTheme) => void;
  filterAllowed: (themes: QuiPourraitTheme[]) => QuiPourraitTheme[];
}

export function useQuiPourraitThemeAccess(): QuiPourraitThemeAccess {
  const { has } = useEntitlements();
  const { open } = usePaywall();

  const isThemeAllowed = useCallback(
    (theme: QuiPourraitTheme) => {
      const req = quiPourraitThemeRequiredEntitlement(theme);
      return req === null || has(req);
    },
    [has],
  );

  const requestUnlockFor = useCallback(
    (theme: QuiPourraitTheme) => {
      const req = quiPourraitThemeRequiredEntitlement(theme);
      if (req) open(req);
    },
    [open],
  );

  const filterAllowed = useCallback(
    (themes: QuiPourraitTheme[]) => themes.filter(isThemeAllowed),
    [isThemeAllowed],
  );

  return { isThemeAllowed, requestUnlockFor, filterAllowed };
}
