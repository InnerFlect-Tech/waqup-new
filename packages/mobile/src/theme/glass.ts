/**
 * Glass-Morphism - Mobile (no backdrop-filter, use BlurView for blur)
 */

import { colors } from '@waqup/shared/theme';
import { borderRadius, shadows } from './format';

export const glassStyles = {
  light: {
    backgroundColor: colors.glass.light,
    borderWidth: 1,
    borderColor: colors.glass.border,
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
  medium: {
    backgroundColor: colors.glass.medium,
    borderWidth: 1,
    borderColor: colors.glass.border,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  dark: {
    backgroundColor: colors.glass.dark,
    borderWidth: 1,
    borderColor: colors.glass.borderDark,
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
};
