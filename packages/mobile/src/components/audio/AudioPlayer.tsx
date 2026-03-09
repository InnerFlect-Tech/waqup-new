import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Typography, Loading } from '@/components';
import { useAudioPlayer } from './useAudioPlayer';
import type { AudioLayers, AudioVolumes, PlaybackSpeed } from '@waqup/shared/types';
import { PLAYBACK_SPEEDS } from '@waqup/shared/types';

export interface AudioPlayerProps {
  layers: AudioLayers;
  initialVolumes?: Partial<AudioVolumes>;
  accentColor?: string;
  showVolumeControls?: boolean;
  showSpeedControls?: boolean;
  onEnd?: () => void;
  style?: ViewStyle;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export const AudioPlayer = memo(function AudioPlayer({
  layers,
  initialVolumes,
  accentColor,
  showVolumeControls = true,
  showSpeedControls = true,
  onEnd,
  style,
}: AudioPlayerProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const accent = accentColor ?? colors.accent.primary;

  const { state, position, volumes, speed, play, pause, seek, setVolumes, setSpeed, isReady } =
    useAudioPlayer({ layers, initialVolumes, onEnd });

  const isPlaying = state === 'playing';
  const isLoading = state === 'loading' || (!isReady && !!layers.voiceUrl);
  const progress = position.durationMs > 0 ? position.positionMs / position.durationMs : 0;

  const handlePlayPause = () => {
    if (isPlaying) void pause();
    else void play();
  };

  const handleSeek = () => {
    // Simplified — full scrub gesture implemented with PanResponder in Phase 11
  };

  return (
    <View style={[styles.container, style]}>
      {/* Time & progress */}
      <View style={styles.progressRow}>
        <Typography variant="small" style={{ color: colors.text.secondary }}>
          {formatTime(position.positionMs)}
        </Typography>
        <Typography variant="small" style={{ color: colors.text.secondary }}>
          {formatTime(position.durationMs)}
        </Typography>
      </View>

      {/* Progress track */}
      <TouchableOpacity onPress={handleSeek} activeOpacity={0.9} style={styles.trackHit}>
        <View style={[styles.track, { backgroundColor: colors.glass.border }]}>
          <View
            style={[
              styles.trackFill,
              { backgroundColor: accent, width: `${Math.min(progress * 100, 100)}%` },
            ]}
          />
          {/* Scrub dot */}
          <View
            style={[
              styles.scrubDot,
              { backgroundColor: accent, left: `${Math.min(progress * 100, 100)}%` },
            ]}
          />
        </View>
      </TouchableOpacity>

      {/* Controls row */}
      <View style={styles.controls}>
        {/* Rewind 15s */}
        <TouchableOpacity
          onPress={() => seek(Math.max(0, position.positionMs - 15000))}
          activeOpacity={0.8}
          style={styles.controlBtn}
        >
          <Typography style={{ fontSize: 20, color: colors.text.secondary }}>⏮</Typography>
        </TouchableOpacity>

        {/* Play / Pause */}
        <TouchableOpacity
          onPress={handlePlayPause}
          activeOpacity={0.8}
          style={[styles.playBtn, { backgroundColor: accent }]}
          disabled={isLoading || !layers.voiceUrl}
        >
          {isLoading ? (
            <Loading variant="spinner" size="sm" />
          ) : (
            <Typography style={{ fontSize: 22, color: '#000' }}>
              {isPlaying ? '⏸' : '▶'}
            </Typography>
          )}
        </TouchableOpacity>

        {/* Forward 15s */}
        <TouchableOpacity
          onPress={() => seek(Math.min(position.durationMs, position.positionMs + 15000))}
          activeOpacity={0.8}
          style={styles.controlBtn}
        >
          <Typography style={{ fontSize: 20, color: colors.text.secondary }}>⏭</Typography>
        </TouchableOpacity>
      </View>

      {/* Speed selector */}
      {showSpeedControls && (
        <View style={styles.speedRow}>
          {PLAYBACK_SPEEDS.map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setSpeed(s)}
              activeOpacity={0.8}
              style={[
                styles.speedChip,
                {
                  backgroundColor: speed === s ? accent + '33' : colors.glass.transparent,
                  borderColor: speed === s ? accent : colors.glass.border,
                },
              ]}
            >
              <Typography
                variant="small"
                style={{ color: speed === s ? accent : colors.text.secondary }}
              >
                {s}×
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Volume controls — three independent layers + master */}
      {showVolumeControls && (
        <View style={styles.volumeSection}>
          <VolumeSlider
            label="Voice"
            value={volumes.voice}
            onChange={(v) => setVolumes({ voice: v })}
            color={accent}
            colors={colors}
          />
          <VolumeSlider
            label="Binaural"
            value={volumes.binaural}
            onChange={(v) => setVolumes({ binaural: v })}
            color="#a78bfa"
            colors={colors}
          />
          <VolumeSlider
            label="Atmosphere"
            value={volumes.ambient}
            onChange={(v) => setVolumes({ ambient: v })}
            color="#60a5fa"
            colors={colors}
          />
          <VolumeSlider
            label="Master"
            value={volumes.master}
            onChange={(v) => setVolumes({ master: v })}
            color={colors.text.secondary}
            colors={colors}
          />
        </View>
      )}
    </View>
  );
});

// ─── Volume Slider ────────────────────────────────────────────────────────────

interface VolumeSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
  colors: ReturnType<typeof useTheme>['theme']['colors'];
}

function VolumeSlider({ label, value, onChange, color, colors }: VolumeSliderProps) {
  return (
    <View style={styles.sliderRow}>
      <Typography variant="small" style={{ color: colors.text.secondary, width: 50 }}>
        {label}
      </Typography>
      <View style={[styles.sliderTrack, { backgroundColor: colors.glass.border, flex: 1 }]}>
        <TouchableOpacity
          style={{ flex: 1, height: '100%' }}
          onPress={(e) => {
            // Simplified — in production use PanResponder / Reanimated gesture
          }}
          activeOpacity={1}
        >
          <View
            style={[styles.sliderFill, { backgroundColor: color, width: `${value}%` }]}
          />
        </TouchableOpacity>
      </View>
      <Typography variant="small" style={{ color: colors.text.secondary, width: 32, textAlign: 'right' }}>
        {value}%
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  trackHit: {
    paddingVertical: spacing.sm,
  },
  track: {
    height: 4,
    borderRadius: 2,
    position: 'relative',
    overflow: 'visible',
  },
  trackFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrubDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    top: -5,
    marginLeft: -7,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  controlBtn: {
    padding: spacing.md,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  speedChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  volumeSection: {
    gap: spacing.md,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 3,
  },
});
