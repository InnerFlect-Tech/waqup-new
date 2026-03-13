import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
} from 'react-native-reanimated';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Typography, Button } from '@/components/ui';
import { logError } from '@waqup/shared/utils';

type RecordState = 'idle' | 'recording' | 'recorded' | 'playing' | 'uploading';

export interface AudioRecorderProps {
  onConfirm?: (uri: string) => Promise<void>;
  onCancel?: () => void;
}

export function AudioRecorder({ onConfirm, onCancel }: AudioRecorderProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [state, setState] = useState<RecordState>('idle');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pulseScale = useSharedValue(1);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseScale.value,
  }));

  const startPulse = () => {
    pulseScale.value = withRepeat(
      withSequence(withTiming(1.15, { duration: 700 }), withTiming(0.9, { duration: 700 })),
      -1,
      true,
    );
  };

  const stopPulse = () => {
    cancelAnimation(pulseScale);
    pulseScale.value = withTiming(1);
  };

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        setError('Microphone permission is required. Please allow it in your device settings.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      recordingRef.current = recording;
      setState('recording');
      setDuration(0);
      startPulse();
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (e) {
      logError('AudioRecorder.start', e);
      setError('Could not start recording. Please try again.');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recordingRef.current) return;
    try {
      stopPulse();
      if (timerRef.current) clearInterval(timerRef.current);
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      if (uri) {
        setRecordingUri(uri);
        setState('recorded');
      } else {
        setError('Recording failed — no audio captured.');
        setState('idle');
      }
    } catch (e) {
      logError('AudioRecorder.stop', e);
      setState('idle');
    }
  }, []);

  const playRecording = useCallback(async () => {
    if (!recordingUri) return;
    try {
      soundRef.current?.unloadAsync();
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      soundRef.current = sound;
      setState('playing');
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setState('recorded');
          sound.unloadAsync();
        }
      });
    } catch (e) {
      logError('AudioRecorder.play', e);
    }
  }, [recordingUri]);

  const stopPlayback = useCallback(async () => {
    try {
      await soundRef.current?.stopAsync();
      setState('recorded');
    } catch {
      setState('recorded');
    }
  }, []);

  const reRecord = useCallback(() => {
    soundRef.current?.unloadAsync();
    soundRef.current = null;
    setRecordingUri(null);
    setDuration(0);
    setState('idle');
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!recordingUri || !onConfirm) return;
    setState('uploading');
    setError(null);
    try {
      await onConfirm(recordingUri);
    } catch (e) {
      logError('AudioRecorder.confirm', e);
      setError('Upload failed. Please try again.');
      setState('recorded');
    }
  }, [recordingUri, onConfirm]);

  return (
    <View style={styles.container}>
      {/* State: idle — show record button */}
      {state === 'idle' && (
        <View style={styles.center}>
          <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 22 }}>
            Read your script aloud in a calm, intentional voice. Take a breath before you start.
          </Typography>
          {error && (
            <View style={[styles.errorBox, { backgroundColor: `${colors.error}15`, borderColor: `${colors.error}30` }]}>
              <Typography variant="small" style={{ color: colors.error }}>{error}</Typography>
            </View>
          )}
          <TouchableOpacity
            onPress={startRecording}
            activeOpacity={0.8}
            style={[styles.recordBtn, { backgroundColor: colors.accent.primary }]}
          >
            <Typography style={{ fontSize: 32 }}>🎙️</Typography>
          </TouchableOpacity>
          <Typography variant="captionBold" style={{ color: colors.text.secondary, marginTop: spacing.md }}>
            Tap to record
          </Typography>
        </View>
      )}

      {/* State: recording — pulsing button */}
      {state === 'recording' && (
        <View style={styles.center}>
          <Typography variant="h2" style={{ color: colors.error, marginBottom: spacing.lg, fontWeight: '200' }}>
            {formatDuration(duration)}
          </Typography>
          <Animated.View style={[styles.pulseRing, pulseStyle, { borderColor: colors.error }]}>
            <TouchableOpacity
              onPress={stopRecording}
              activeOpacity={0.8}
              style={[styles.recordBtn, { backgroundColor: colors.error }]}
            >
              <View style={[styles.stopSquare, { backgroundColor: colors.text.onDark }]} />
            </TouchableOpacity>
          </Animated.View>
          <Typography variant="captionBold" style={{ color: colors.error, marginTop: spacing.md }}>
            Recording… tap to stop
          </Typography>
        </View>
      )}

      {/* State: recorded — playback + confirm */}
      {(state === 'recorded' || state === 'playing') && (
        <View style={styles.center}>
          <View style={[styles.waveformPlaceholder, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <Typography variant="captionBold" style={{ color: colors.text.secondary }}>
              Recording · {formatDuration(duration)}
            </Typography>
          </View>

          <View style={styles.playbackRow}>
            {state === 'playing' ? (
              <Button variant="ghost" size="md" onPress={stopPlayback} style={{ flex: 1 }}>
                ⏸ Pause
              </Button>
            ) : (
              <Button variant="ghost" size="md" onPress={playRecording} style={{ flex: 1 }}>
                ▶ Play back
              </Button>
            )}
            <Button variant="ghost" size="sm" onPress={reRecord} style={{ flex: 1 }}>
              🔄 Re-record
            </Button>
          </View>

          {error && (
            <View style={[styles.errorBox, { backgroundColor: `${colors.error}15`, borderColor: `${colors.error}30` }]}>
              <Typography variant="small" style={{ color: colors.error }}>{error}</Typography>
            </View>
          )}

          {onConfirm && (
            <Button variant="primary" size="lg" fullWidth onPress={handleConfirm} style={{ marginTop: spacing.lg }}>
              ✓ Use this recording
            </Button>
          )}
          {onCancel && (
            <Button variant="ghost" size="md" fullWidth onPress={onCancel} style={{ marginTop: spacing.sm }}>
              Cancel
            </Button>
          )}
        </View>
      )}

      {/* State: uploading */}
      {state === 'uploading' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.md }}>
            Saving your recording…
          </Typography>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  center: {
    alignItems: 'center',
    gap: spacing.md,
  },
  recordBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    borderWidth: 2,
    borderRadius: 44,
    padding: 8,
  },
  stopSquare: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  waveformPlaceholder: {
    width: '100%',
    height: 64,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playbackRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  errorBox: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    width: '100%',
  },
});
