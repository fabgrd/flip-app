import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme, Theme } from '../constants/themes';

const STORAGE_KEY = 'app.theme.preference';

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const system = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setPreferenceState(saved);
        }
      } catch {}
    })();
  }, []);

  const theme = useMemo<Theme>(() => {
    const mode: 'light' | 'dark' =
      preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;
    return mode === 'dark' ? darkTheme : lightTheme;
  }, [preference, system]);

  const setPreference = useCallback(async (pref: ThemePreference) => {
    setPreferenceState(pref);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, pref);
    } catch {}
  }, []);

  const toggleDarkMode = useCallback(async () => {
    const next = theme.mode === 'dark' ? 'light' : 'dark';
    await setPreference(next);
  }, [theme.mode, setPreference]);

  const value = useMemo(
    () => ({ theme, preference, setPreference, toggleDarkMode }),
    [theme, preference, setPreference, toggleDarkMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
