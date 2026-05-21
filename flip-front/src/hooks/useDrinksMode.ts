import { useCallback } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';
import { useEntitlement } from '../entitlements';

export interface DrinksModeAPI {
  available: boolean;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

export function useDrinksMode(): DrinksModeAPI {
  const { canAccess } = useEntitlement('drinks_mode');
  const { preferences, setPreference } = usePreferences();

  const setEnabled = useCallback(
    (value: boolean) => {
      setPreference('drinksEnabled', value);
    },
    [setPreference],
  );

  return {
    available: canAccess,
    enabled: canAccess && preferences.drinksEnabled,
    setEnabled,
  };
}
