import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface UserPreferences {
  drinksEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  drinksEnabled: true,
};

const STORAGE_KEY = 'flip_user_preferences';

interface PreferencesContextValue {
  preferences: UserPreferences;
  ready: boolean;
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

const sanitize = (raw: unknown): UserPreferences => {
  if (!raw || typeof raw !== 'object') return DEFAULT_PREFERENCES;
  const r = raw as Record<string, unknown>;
  return {
    drinksEnabled:
      typeof r.drinksEnabled === 'boolean' ? r.drinksEnabled : DEFAULT_PREFERENCES.drinksEnabled,
  };
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        if (raw) setPreferences(sanitize(JSON.parse(raw)));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setPreference = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      setPreferences((prev) => {
        const next = { ...prev, [key]: value };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    [],
  );

  const value = useMemo<PreferencesContextValue>(
    () => ({ preferences, ready, setPreference }),
    [preferences, ready, setPreference],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within a PreferencesProvider');
  return ctx;
}
