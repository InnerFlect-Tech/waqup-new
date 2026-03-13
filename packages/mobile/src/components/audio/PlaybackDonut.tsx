/**
 * PlaybackDonut — Gradient purple donut for Now Playing screen.
 * Large circle with gradient (lighter top-left → darker bottom-right), solid black inner circle.
 * Optional soft glow. Can later support album art in the center.
 */
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme';

export interface PlaybackDonutProps {
  /** Diameter in px */
  size?: number;
  /** Soft glow around the donut */
  glow?: boolean;
  style?: ViewStyle;
}

const DEFAULT_SIZE = 200;

export function PlaybackDonut({ size = DEFAULT_SIZE, glow = true, style }: PlaybackDonutProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const accent = colors.accent.primary;
  /** Gradient: lighter tertiary top-left → primary → darker bottom-right */
  const gradientColors = [
    colors.accent.tertiary,
    colors.accent.primary,
    colors.accent.secondary,
  ] as [string, string, ...string[]];
  const r = size / 2;
  const innerR = size * 0.42; // Inner black circle radius (~42% of outer)

  return (
    <View style={[styles.wrapper, { width: size, height: size }, style]}>
      {glow && (
        <View
          style={[
            styles.glow,
            {
              width: size * 1.4,
              height: size * 1.4,
              borderRadius: size * 0.7,
              backgroundColor: accent,
              top: -size * 0.2,
              left: -size * 0.2,
            },
          ]}
        />
      )}
      <View style={[styles.donutOuter, { width: size, height: size, borderRadius: r }]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0.25, y: 0.1 }}
          end={{ x: 0.85, y: 1 }}
          style={[styles.gradient, { width: size, height: size, borderRadius: r }]}
        >
          <View
            style={[
              styles.innerCircle,
              {
                width: innerR * 2,
                height: innerR * 2,
                borderRadius: innerR,
                top: r - innerR,
                left: r - innerR,
              },
            ]}
          />
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    opacity: 0.15,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 8,
  },
  donutOuter: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  innerCircle: {
    position: 'absolute',
    backgroundColor: '#000000',
  },
});
