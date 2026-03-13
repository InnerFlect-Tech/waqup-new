/**
 * WaveformBar — Vertical bar waveform for Now Playing.
 * Played portion = purple, unplayed = dark grey. Bar heights from deterministic pattern.
 */
import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, spacing } from '@/theme';

const BAR_COUNT = 28;
/** Deterministic bar heights (0.15–0.9) for waveform shape */
const BAR_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) =>
  0.15 + 0.75 * (0.5 + 0.5 * Math.sin((i / BAR_COUNT) * Math.PI * 2.5))
);

export interface WaveformBarProps {
  /** Progress 0–1; bars to the left are purple, to the right are grey */
  progress: number;
  /** When playing, bars can have slight opacity/glow variation */
  isPlaying?: boolean;
  accentColor?: string;
  style?: ViewStyle;
}

export function WaveformBar({
  progress,
  isPlaying = false,
  accentColor,
  style,
}: WaveformBarProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const accent = accentColor ?? colors.accent.primary;
  const greyColor = colors.glass.border ?? colors.text.tertiary;

  const barWidth = 6;
  const gap = 5;
  const maxBarHeight = 32;

  const bars = useMemo(() => BAR_HEIGHTS.map((h, i) => ({
    height: Math.max(8, h * maxBarHeight),
    isPlayed: (i + 1) / BAR_COUNT <= progress,
  })), [progress]);

  return (
    <View style={[styles.container, style]}>
      {bars.map((bar, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              width: barWidth,
              height: bar.height,
              borderRadius: barWidth / 2,
              backgroundColor: bar.isPlayed ? accent : greyColor,
              opacity: bar.isPlayed ? (isPlaying ? 0.9 : 0.85) : 0.5,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    height: 40,
  },
  bar: {
    minHeight: 8,
  },
});
