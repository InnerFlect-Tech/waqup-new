import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export interface QCoinProps {
  size?: 'sm' | 'md' | 'lg';
  /** When provided, renders the coin inline with a numeric amount beside it */
  showAmount?: number;
  style?: ViewStyle;
}

const SIZE_MAP = { sm: 20, md: 28, lg: 48 } as const;
const FONT_MAP = { sm: 9, md: 13, lg: 22 } as const;
const AMOUNT_FONT_MAP = { sm: 12, md: 14, lg: 20 } as const;

/**
 * QCoin — waQup branded credit icon (mobile).
 *
 * Mirrors the waQup logo: a glowing purple orb with "Q" at its centre.
 * Pass `showAmount` to display a live credit balance inline beside the coin.
 */
export const QCoin: React.FC<QCoinProps> = ({ size = 'md', showAmount, style }) => {
  const px = SIZE_MAP[size];
  const fontSize = FONT_MAP[size];
  const r = px / 2;

  const coin = (
    <View
      style={[
        styles.glow,
        {
          width: px + 4,
          height: px + 4,
          borderRadius: (px + 4) / 2,
        },
      ]}
    >
      {/* Outer dark rim */}
      <View
        style={[
          styles.rim,
          {
            width: px,
            height: px,
            borderRadius: r,
          },
        ]}
      >
        {/* Purple orb face */}
        <View
          style={[
            styles.face,
            {
              width: px - 3,
              height: px - 3,
              borderRadius: (px - 3) / 2,
              overflow: 'hidden',
            },
          ]}
        >
          {/* Shine highlight — top-left radial */}
          <View
            style={[
              styles.shine,
              {
                width: px * 0.6,
                height: px * 0.6,
                borderRadius: (px * 0.6) / 2,
                top: -(px * 0.12),
                left: -(px * 0.12),
              },
            ]}
          />
          <Text style={[styles.q, { fontSize, lineHeight: px - 3 }]}>Q</Text>
        </View>
      </View>
    </View>
  );

  if (showAmount !== undefined) {
    return (
      <View style={[styles.row, style]}>
        {coin}
        <Text style={[styles.amount, { fontSize: AMOUNT_FONT_MAP[size] }]}>{showAmount}</Text>
      </View>
    );
  }

  return <View style={style}>{coin}</View>;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  glow: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  rim: {
    backgroundColor: '#3B0764',
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    backgroundColor: '#9333EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shine: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.32)',
  },
  q: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(74,0,148,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  amount: {
    color: '#A855F7',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
