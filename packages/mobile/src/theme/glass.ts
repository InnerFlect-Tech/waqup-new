/**
 * Glass-Morphism Utilities
 * Backdrop blur effects and transparency layers
 * Note: React Native requires expo-blur for backdrop blur
 */

import { colors } from './colors';
import { borderRadius } from './borders';
import { shadows } from './shadows';

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

// Note: For actual backdrop blur effect, use BlurView from expo-blur
// Example:
// import { BlurView } from 'expo-blur';
// <BlurView intensity={80} style={glassStyles.light}>...</BlurView>
