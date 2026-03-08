import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

export interface QCoinProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  style?: ViewStyle;
}

const SIZE_MAP = { sm: 20, md: 28, lg: 48 } as const;
const FONT_MAP = { sm: 12, md: 16, lg: 24 } as const;

/**
 * QCoin - Branded credits icon for waQup (mobile)
 * Minimalist coin-like shape with Q in the center.
 */
export const QCoin: React.FC<QCoinProps> = ({ size = 'md', color, style }) => {
  const { theme } = useTheme();
  const qColor = color ?? theme.colors.accent.tertiary;
  const px = SIZE_MAP[size];
  const fontSize = FONT_MAP[size];

  return (
    <View
      style={[
        styles.coin,
        {
          width: px,
          height: px,
          borderRadius: px / 2,
        },
        style,
      ]}
    >
      <Text style={[styles.q, { color: qColor, fontSize }]}>Q</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  coin: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  q: {
    fontWeight: '600',
    fontFamily: 'system-ui',
  },
});
