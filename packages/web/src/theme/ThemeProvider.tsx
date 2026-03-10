'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { themes, defaultTheme, withOpacity, type Theme } from '@waqup/shared/theme';

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

/** Resolve theme: URL param (for shared links) > localStorage > default */
function resolveInitialTheme(): string {
  if (typeof window === 'undefined') return 'mystical-purple';
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('theme');
  if (fromUrl && themes[fromUrl]) return fromUrl;
  const saved = localStorage.getItem('waqup-theme');
  if (saved && themes[saved]) return saved;
  return 'mystical-purple';
}

export function ThemeProvider({ children, defaultThemeName = 'mystical-purple' }: { children: ReactNode; defaultThemeName?: string }) {
  const [themeName, setThemeName] = useState(defaultThemeName);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const resolved = resolveInitialTheme();
    setThemeName(resolved);
  }, []);

  const theme = themes[themeName] ?? defaultTheme;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('waqup-theme', themeName);
    const root = document.documentElement;
    const c = theme.colors;
    root.style.setProperty('--theme-bg-primary', c.background.primary);
    root.style.setProperty('--theme-bg-secondary', c.background.secondary);
    root.style.setProperty('--theme-bg-tertiary', c.background.tertiary);
    root.style.setProperty('--theme-text-primary', c.text.primary);
    root.style.setProperty('--theme-text-secondary', c.text.secondary);
    root.style.setProperty('--theme-text-tertiary', c.text.tertiary);
    root.style.setProperty('--theme-accent-primary', c.accent.primary);
    root.style.setProperty('--theme-accent-secondary', c.accent.secondary);
    root.style.setProperty('--theme-accent-focus', withOpacity(c.accent.primary, 0.6));
    root.style.setProperty('--theme-accent-selection', withOpacity(c.accent.primary, 0.2));
    root.style.setProperty('--theme-glass-light', c.glass.light);
    root.style.setProperty('--theme-glass-border', c.glass.border);
    root.style.setProperty('--theme-gradient-primary', c.gradients.primary);
    root.style.setProperty('--theme-gradient-background', c.gradients.background);
    root.style.setProperty('--theme-mystical-glow', c.mystical.glow);
    root.style.setProperty('--theme-mystical-blur', c.mystical.blur);
    root.style.setProperty('--theme-mystical-orb', c.mystical.orb);
  }, [themeName, theme]);

  const setTheme = (name: string) => { if (themes[name]) setThemeName(name); };

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme, availableThemes: Object.keys(themes) }}>
      {children}
    </ThemeContext.Provider>
  );
}
