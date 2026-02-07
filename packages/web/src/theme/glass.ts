/**
 * Glass-Morphism Utilities
 * Backdrop blur effects using CSS backdrop-filter
 */

import { colors } from './colors';
import { borderRadius } from './borders';
import { shadows } from './shadows';

export const glassStyles = {
  light: {
    backgroundColor: colors.glass.light,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)', // Safari support
    border: `1px solid ${colors.glass.border}`,
    borderRadius: borderRadius.md,
    boxShadow: shadows.md,
  },
  medium: {
    backgroundColor: colors.glass.medium,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: `1px solid ${colors.glass.border}`,
    borderRadius: borderRadius.md,
    boxShadow: shadows.sm,
  },
  dark: {
    backgroundColor: colors.glass.dark,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: `1px solid ${colors.glass.borderDark}`,
    borderRadius: borderRadius.md,
    boxShadow: shadows.md,
  },
};

// CSS class versions for Tailwind/global styles
export const glassClasses = {
  light: 'glass-light',
  medium: 'glass-medium',
  dark: 'glass-dark',
};
