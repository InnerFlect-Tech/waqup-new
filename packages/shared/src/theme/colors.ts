/**
 * Color Palette - Glass-Morphism Minimalist Design
 * Single source of truth for all platforms (web, iOS, Android)
 */

/** Default brand colors (Mystical Purple) — used outside ThemeProvider (CookieConsentBanner, PWA manifest, layout themeColor) */
export const DEFAULT_BRAND_COLORS = {
  primary: '#9333EA',
  secondary: '#7C3AED',
  accent: '#A855F7',
  background: '#0A040C',
  textMuted: 'rgba(255,255,255,0.65)',
  border: 'rgba(255,255,255,0.12)',
  borderHover: 'rgba(255,255,255,0.3)',
  textOnDark: '#fff',
  gradient: 'linear-gradient(135deg, #9333EA, #7C3AED)',
} as const;

export const colors = {
  background: {
    primary: '#FAFAFA',
    secondary: '#F5F5F5',
    tertiary: '#EEEEEE',
    glass: 'rgba(255, 255, 255, 0.7)',
    glassDark: 'rgba(0, 0, 0, 0.05)',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
    disabled: '#CCCCCC',
  },
  accent: {
    primary: '#4A90E2',
    secondary: '#7B68EE',
    tertiary: '#50C878',
    light: '#E8F4FD',
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.8)',
    medium: 'rgba(255, 255, 255, 0.6)',
    dark: 'rgba(0, 0, 0, 0.1)',
    border: 'rgba(255, 255, 255, 0.3)',
    borderDark: 'rgba(0, 0, 0, 0.1)',
  },
  error: '#FF6B6B',
  success: '#51CF66',
  warning: '#FFD93D',
  info: '#4A90E2',
  border: {
    light: '#E0E0E0',
    medium: '#CCCCCC',
    dark: '#999999',
  },
} as const;
