import React, { createContext, useContext } from 'react';
import { lightTheme, Theme } from '../constants/themes';

type ThemeContextValue = {
  theme: Theme;
};

const ThemeContext = createContext<ThemeContextValue>({ theme: lightTheme });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeContext.Provider value={{ theme: lightTheme }}>{children}</ThemeContext.Provider>
);

export function useTheme() {
  return useContext(ThemeContext);
}
