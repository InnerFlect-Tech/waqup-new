'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, themes, defaultTheme } from './themes';

interface ThemeContextType {
  theme: Theme;
  themeName: string;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultThemeName?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultThemeName = 'mystical-purple',
}) => {
  // Always start with defaultThemeName to prevent hydration mismatch
  const [themeName, setThemeName] = useState<string>(defaultThemeName);
  const [mounted, setMounted] = useState(false);

  // Only check localStorage after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('waqup-theme');
      if (saved && themes[saved]) {
        setThemeName(saved);
      }
    }
  }, []);

  const theme = themes[themeName] || defaultTheme;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('waqup-theme', themeName);
      // Apply theme CSS variables
      const root = document.documentElement;
      const themeColors = theme.colors;
      
      // Set CSS variables
      root.style.setProperty('--theme-bg-primary', themeColors.background.primary);
      root.style.setProperty('--theme-bg-secondary', themeColors.background.secondary);
      root.style.setProperty('--theme-bg-tertiary', themeColors.background.tertiary);
      root.style.setProperty('--theme-text-primary', themeColors.text.primary);
      root.style.setProperty('--theme-text-secondary', themeColors.text.secondary);
      root.style.setProperty('--theme-text-tertiary', themeColors.text.tertiary);
      root.style.setProperty('--theme-accent-primary', themeColors.accent.primary);
      root.style.setProperty('--theme-accent-secondary', themeColors.accent.secondary);
      root.style.setProperty('--theme-glass-light', themeColors.glass.light);
      root.style.setProperty('--theme-glass-border', themeColors.glass.border);
      root.style.setProperty('--theme-gradient-primary', themeColors.gradients.primary);
      root.style.setProperty('--theme-gradient-background', themeColors.gradients.background);
      root.style.setProperty('--theme-mystical-glow', themeColors.mystical.glow);
      root.style.setProperty('--theme-mystical-blur', themeColors.mystical.blur);
      root.style.setProperty('--theme-mystical-orb', themeColors.mystical.orb);
    }
  }, [themeName, theme]);

  const setTheme = (name: string) => {
    if (themes[name]) {
      setThemeName(name);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName,
        setTheme,
        availableThemes: Object.keys(themes),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
