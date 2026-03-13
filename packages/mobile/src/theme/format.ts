/**
 * Mobile format adapters - convert canonical tokens to React Native StyleSheet format
 */

import { Platform } from 'react-native';
import { spacing, borderRadius, typography as ty, shadowTokens } from '@waqup/shared/theme';

export { spacing, borderRadius } from '@waqup/shared/theme';

export const typography = Object.fromEntries(
  Object.entries(ty).map(([k, v]) => [
    k,
    {
      fontSize: v.fontSize,
      fontWeight: String(v.fontWeight) as '300' | '400' | '500' | '600' | '700',
      lineHeight: v.lineHeight,
      ...(v.letterSpacing !== 0 && { letterSpacing: v.letterSpacing }),
    },
  ])
) as Record<keyof typeof ty, { fontSize: number; fontWeight: '300' | '400' | '500' | '600' | '700'; lineHeight: number; letterSpacing?: number }>;

export const shadows = Object.fromEntries(
  Object.entries(shadowTokens).map(([k, v]) => [
    k,
    {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: v.y },
      shadowOpacity: v.opacity,
      shadowRadius: v.blur,
      elevation: Platform.OS === 'android' ? v.y : 0,
    },
  ])
) as Record<keyof typeof shadowTokens, { shadowColor: string; shadowOffset: { width: number; height: number }; shadowOpacity: number; shadowRadius: number; elevation: number }>;
