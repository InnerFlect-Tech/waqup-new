/**
 * Theme System - 6 Variable Color Palette Generator
 * Single source of truth for web, iOS, Android
 * WCAG AA contrast ratios (4.5:1 normal text, 3:1 large)
 */

import type { Theme, ThemeVariables } from './types';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const hexClean = hex.replace(/^#/, '');
  return {
    r: parseInt(hexClean.slice(0, 2), 16),
    g: parseInt(hexClean.slice(2, 4), 16),
    b: parseInt(hexClean.slice(4, 6), 16),
  };
}

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    v = v / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(c1: string, c2: string): number {
  const l1 = getLuminance(c1);
  const l2 = getLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function isDark(hex: string): boolean {
  return getLuminance(hex) < 0.5;
}

function getOptimalTextColor(bg: string): string {
  return isDark(bg) ? '#FFFFFF' : (getContrastRatio('#000000', bg) >= 4.5 ? '#000000' : '#1A1A1A');
}

function withOpacity(color: string, opacity: number): string {
  const rgb = hexToRgb(color);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

function lighten(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const f = (v: number) => Math.min(255, v + amount).toString(16).padStart(2, '0');
  return `#${f(rgb.r)}${f(rgb.g)}${f(rgb.b)}`;
}

function darken(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const f = (v: number) => Math.max(0, v - amount).toString(16).padStart(2, '0');
  return `#${f(rgb.r)}${f(rgb.g)}${f(rgb.b)}`;
}

export function generateTheme(name: string, vars: ThemeVariables): Theme {
  const baseIsDark = isDark(vars.base);
  const bgPrimary = vars.base;
  const bgSecondary = baseIsDark ? lighten(vars.base, 15) : darken(vars.base, 8);
  const bgTertiary = baseIsDark ? lighten(vars.base, 25) : darken(vars.base, 16);
  const textPrimary = getOptimalTextColor(bgPrimary);
  const textSecondary = baseIsDark ? withOpacity(textPrimary, 0.65) : '#525252';
  const textTertiary = baseIsDark ? withOpacity(textPrimary, 0.45) : '#737373';
  const textInverse = baseIsDark ? '#000000' : '#FFFFFF';
  const textDisabled = withOpacity(textPrimary, 0.35);
  const textOnDark = '#FFFFFF';
  const textOnLight = '#000000';

  const accentPrimary = vars.primary;
  const accentSecondary = vars.secondary;
  const accentTertiary = baseIsDark ? '#A855F7' : vars.primary;
  const accentLight = withOpacity(accentPrimary, 0.15);

  // Glass: dark themes use dark translucent overlays; light themes use white/light tints
  const glassBg = baseIsDark ? withOpacity(vars.text, vars.glass) : withOpacity('#FFFFFF', 0.92);
  const glassDarkBg = baseIsDark ? withOpacity(vars.base, vars.glass * 0.5) : withOpacity('#FFFFFF', 0.85);
  const glassOpaque = baseIsDark ? withOpacity(vars.text, Math.min(1, vars.glass * 2)) : withOpacity('#FFFFFF', 0.98);
  const glassTransparent = baseIsDark ? withOpacity(vars.text, vars.glass * 0.5) : withOpacity('#FFFFFF', 0.6);

  const glassLight = baseIsDark ? withOpacity(vars.text, vars.glass) : withOpacity('#FFFFFF', 0.92);
  const glassMedium = baseIsDark ? withOpacity(vars.text, vars.glass * 0.6) : withOpacity('#FFFFFF', 0.85);
  const glassDark = baseIsDark ? withOpacity(vars.base, vars.glass * 0.1) : withOpacity('#000000', 0.03);
  const glassBorder = baseIsDark ? withOpacity(vars.text, Math.min(1, vars.glass * 2)) : 'rgba(0, 0, 0, 0.08)';
  const glassBorderDark = baseIsDark ? withOpacity(vars.base, vars.glass * 0.15) : 'rgba(0, 0, 0, 0.06)';
  const glassOpaqueStyle = baseIsDark ? withOpacity(vars.text, Math.min(1, vars.glass * 2)) : withOpacity('#FFFFFF', 0.98);
  const glassTransparentStyle = baseIsDark ? withOpacity(vars.text, vars.glass * 0.5) : withOpacity('#FFFFFF', 0.7);

  const purple900_20 = withOpacity('#581C87', 0.2);
  const gradientPrimary = `linear-gradient(to right, ${vars.primary}, ${vars.secondary})`;
  const gradientPrimaryHover = 'linear-gradient(to right, #A855F7, #6366F1)';
  const gradientSecondary = `linear-gradient(to bottom right, ${vars.primary}, ${vars.secondary})`;
  const gradientBackground = baseIsDark
    ? `linear-gradient(to bottom right, ${bgPrimary}, ${purple900_20}, ${bgPrimary})`
    : `linear-gradient(to bottom right, ${bgPrimary}, ${withOpacity(bgSecondary, 0.5)}, ${bgPrimary})`;
  const gradientMystical = baseIsDark
    ? `radial-gradient(circle at center, ${withOpacity(vars.primary, vars.mystical * 0.1)}, transparent)`
    : `radial-gradient(circle at center, ${withOpacity(vars.primary, 0.03)}, transparent)`;

  const mysticalGlow = withOpacity(vars.primary, vars.mystical * 0.4);
  const mysticalBlur = `${vars.mystical * 100}px`;
  const mysticalOrb = withOpacity(vars.primary, vars.mystical * 0.2);

  return {
    name,
    variables: vars,
    colors: {
      background: { primary: bgPrimary, secondary: bgSecondary, tertiary: bgTertiary, glass: glassBg, glassDark: glassDarkBg, glassOpaque, glassTransparent },
      text: { primary: textPrimary, secondary: textSecondary, tertiary: textTertiary, inverse: textInverse, disabled: textDisabled, onDark: textOnDark, onLight: textOnLight },
      accent: { primary: accentPrimary, secondary: accentSecondary, tertiary: accentTertiary, light: accentLight },
      glass: { light: glassLight, medium: glassMedium, dark: glassDark, border: glassBorder, borderDark: glassBorderDark, opaque: glassOpaqueStyle, transparent: glassTransparentStyle },
      error: '#FF6B6B',
      success: '#51CF66',
      warning: '#FFD93D',
      info: vars.primary,
      border: { light: withOpacity(textPrimary, 0.1), medium: withOpacity(textPrimary, 0.2), dark: withOpacity(textPrimary, 0.3) },
      gradients: { primary: gradientPrimary, primaryHover: gradientPrimaryHover, secondary: gradientSecondary, background: gradientBackground, mystical: gradientMystical },
      mystical: { glow: mysticalGlow, blur: mysticalBlur, orb: mysticalOrb },
    },
  };
}

const themeDefs: [string, ThemeVariables][] = [
  ['Mystical Purple', { primary: '#9333EA', secondary: '#4F46E5', base: '#000000', text: '#FFFFFF', glass: 0.05, mystical: 0.3 }],
  ['Professional Blue', { primary: '#3B82F6', secondary: '#06B6D4', base: '#0F172A', text: '#F8FAFC', glass: 0.12, mystical: 0.1 }],
  ['Serene Green', { primary: '#10B981', secondary: '#14B8A6', base: '#064E3B', text: '#ECFDF5', glass: 0.15, mystical: 0.15 }],
  ['Golden Sunset', { primary: '#F59E0B', secondary: '#EF4444', base: '#1C1917', text: '#FEF3C7', glass: 0.15, mystical: 0.2 }],
  ['Cosmic Dark', { primary: '#8B5CF6', secondary: '#EC4899', base: '#030712', text: '#E0E7FF', glass: 0.2, mystical: 0.4 }],
  ['Minimalist Light', { primary: '#2563EB', secondary: '#0EA5E9', base: '#F1F5F9', text: '#0F172A', glass: 0.12, mystical: 0.04 }],
];

export const themes: Record<string, Theme> = Object.fromEntries(
  themeDefs.map(([name, vars]) => [`${name.toLowerCase().replace(/\s+/g, '-')}`, generateTheme(name, vars)])
);

export const defaultTheme = themes['mystical-purple']!;
