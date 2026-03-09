import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { useTheme, spacing } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography } from '@/components';
import { VoiceOrb } from '@/components/audio';
import type { OrbState } from '@/components/audio';

type SpeakState = 'idle' | 'requesting' | 'listening' | 'processing' | 'speaking' | 'error';

const STATE_LABEL: Record<SpeakState, string> = {
  idle:       'Tap to speak',
  requesting: 'Requesting access…',
  listening:  'Listening…',
  processing: 'Thinking…',
  speaking:   'Speaking…',
  error:      'Something went wrong',
};

const STATE_TO_ORB: Record<SpeakState, OrbState> = {
  idle:       'idle',
  requesting: 'idle',
  listening:  'listening',
  processing: 'thinking',
  speaking:   'speaking',
  error:      'error',
};

export default function SpeakScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [speakState, setSpeakState] = useState<SpeakState>('idle');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return true;
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Microphone Access',
        'waQup needs microphone access to listen to you. Enable it in Settings.',
        [{ text: 'OK' }],
      );
      return false;
    }
    return true;
  };

  const startListening = useCallback(async () => {
    if (speakState !== 'idle' && speakState !== 'error') return;

    setSpeakState('requesting');
    const granted = await requestPermission();
    if (!granted) {
      setSpeakState('idle');
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(rec);
      setSpeakState('listening');
    } catch {
      setSpeakState('error');
    }
  }, [speakState]);

  const stopListening = useCallback(async () => {
    if (!recording || speakState !== 'listening') return;
    setSpeakState('processing');

    try {
      await recording.stopAndUnloadAsync();
      setRecording(null);

      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      // Placeholder: future AI processing goes here
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSpeakState('idle');
    } catch {
      setRecording(null);
      setSpeakState('error');
    }
  }, [recording, speakState]);

  const handleOrbPress = () => {
    if (speakState === 'listening') {
      void stopListening();
    } else if (speakState === 'idle' || speakState === 'error') {
      void startListening();
    }
  };

  const isActive = speakState === 'listening';
  const label = STATE_LABEL[speakState];
  const orbState = STATE_TO_ORB[speakState];

  return (
    <Screen scrollable={false} padding={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Typography
            variant="small"
            style={[styles.headerLabel, { color: colors.text.secondary }]}
          >
            SPEAK
          </Typography>
          <Typography
            variant="h2"
            style={{ color: colors.text.primary, fontWeight: '300', textAlign: 'center' }}
          >
            Talk to the Orb
          </Typography>
        </View>

        {/* Orb — tap to start/stop */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleOrbPress}
          disabled={speakState === 'processing' || speakState === 'speaking' || speakState === 'requesting'}
          style={styles.orbTouchable}
        >
          <VoiceOrb size="md" orbState={orbState} />
        </TouchableOpacity>

        {/* Status label */}
        <Typography
          variant="body"
          style={[styles.statusLabel, { color: speakState === 'error' ? colors.error : colors.text.secondary }]}
        >
          {label}
        </Typography>

        {/* Tap indicator ring when active */}
        {isActive && (
          <View style={[styles.activeHint, { borderColor: colors.accent.primary + '40' }]}>
            <Typography variant="caption" style={{ color: colors.accent.primary }}>
              Tap orb to stop
            </Typography>
          </View>
        )}

        {/* Footer note */}
        <View style={styles.footer}>
          <Typography variant="caption" style={{ color: colors.text.secondary, textAlign: 'center', lineHeight: 18 }}>
            Your voice conversation stays private.{'\n'}Credits are only used for AI responses.
          </Typography>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl * 1.5,
    gap: spacing.sm,
  },
  headerLabel: {
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  orbTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  statusLabel: {
    fontSize: 15,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  activeHint: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xxxl,
    left: spacing.xl,
    right: spacing.xl,
  },
});
