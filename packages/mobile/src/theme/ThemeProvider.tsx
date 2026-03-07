import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, defaultTheme, type Theme } from '@waqup/shared/theme';

const KEY = 'waqup-theme';

interface ThemeContextType {
  theme: Theme;
  themeName: string;
  setTheme: (name: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export function ThemeProvider({ children, defaultThemeName = 'mystical-purple' }: { children: ReactNode; defaultThemeName?: string }) {
  const [themeName, setThemeName] = useState(defaultThemeName);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((saved) => {
      if (saved && themes[saved]) setThemeName(saved);
      setMounted(true);
    });
  }, []);

  const theme = themes[themeName] ?? defaultTheme;

  useEffect(() => {
    if (mounted) AsyncStorage.setItem(KEY, themeName);
  }, [themeName, mounted]);

  const setTheme = (name: string) => { if (themes[name]) setThemeName(name); };

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme, availableThemes: Object.keys(themes) }}>
      {children}
    </ThemeContext.Provider>
  );
}
