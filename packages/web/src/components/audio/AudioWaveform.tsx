'use client';

import React from 'react';
import { useTheme } from '@/theme';

const BAR_COUNT = 24;
const IDLE_LEVELS = Array.from({ length: BAR_COUNT }, (_, i) =>
  0.12 + 0.06 * Math.sin((i / BAR_COUNT) * Math.PI * 2)
);

export interface AudioWaveformProps {
  /** True when audio is playing — shows live frequency data */
  isPlaying: boolean;
  /** Real-time frequency values 0–1 from analyser (when playing) */
  frequencyData?: number[];
  /** Accent color for bars */
  accentColor?: string;
  style?: React.CSSProperties;
}

/**
 * Single, cohesive waveform visualization for audio playback.
 * No page cycling — just a cool reactive bar wave that responds to the audio.
 * Idle state: subtle static bars. Playing: live frequency-driven bars.
 */
export function AudioWaveform({
  isPlaying,
  frequencyData = [],
  accentColor,
  style,
}: AudioWaveformProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const accent = accentColor ?? colors.accent.primary;

  // When playing with data: use it (pad/trim to BAR_COUNT). Otherwise idle levels.
  const levels = React.useMemo(() => {
    if (isPlaying && frequencyData.length > 0) {
      const step = Math.max(1, Math.floor(frequencyData.length / BAR_COUNT));
      return Array.from({ length: BAR_COUNT }, (_, i) => {
        const idx = Math.min(i * step, frequencyData.length - 1);
        const v = frequencyData[idx] ?? 0;
        return Math.min(1, v / 255);
      });
    }
    return IDLE_LEVELS;
  }, [isPlaying, frequencyData]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        minHeight: 120,
        padding: 24,
        width: '100%',
        ...style,
      }}
    >
      {levels.map((h, i) => (
        <div
          key={i}
          style={{
            width: 8,
            minHeight: 8,
            height: Math.max(12, h * 80),
            borderRadius: 4,
            background: `linear-gradient(to top, ${accent}60, ${accent})`,
            opacity: isPlaying ? 0.7 + h * 0.4 : 0.4,
            transition: isPlaying ? 'height 0.05s ease-out' : 'height 0.3s ease-out',
            boxShadow: isPlaying && h > 0.3 ? `0 0 12px ${accent}40` : 'none',
          }}
        />
      ))}
    </div>
  );
}
