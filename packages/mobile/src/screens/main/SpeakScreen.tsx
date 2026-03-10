import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import { Audio } from 'expo-av';
import { useTheme, spacing } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card } from '@/components';
import { VoiceOrb } from '@/components/audio';
import type { OrbState } from '@/components/audio';
import { PRACTICE_IS_FREE_ONE_LINER } from '@waqup/shared/constants';
import { sendOracleMessage } from '@/services/ai';
import type { ChatMessage } from '@/services/ai';

type SpeakState = 'idle' | 'requesting' | 'listening' | 'processing' | 'speaking' | 'error';

const STATE_LABEL: Record<SpeakState, string> = {
  idle:       'Tap to speak',
  requesting: 'Requesting access…',
  listening:  'Listening…',
  processing: 'Thinking…',
  speaking:   'Response ready',
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

interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export default function SpeakScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [speakState, setSpeakState] = useState<SpeakState>('idle');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const conversationRef = useRef<ChatMessage[]>([]);

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return true;
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      setPermissionDenied(true);
      return false;
    }
    setPermissionDenied(false);
    return true;
  };

  const openSettings = () => {
    void Linking.openSettings();
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
      const uri = recording.getURI();
      setRecording(null);
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      // Transcribe the recording via the web server (OpenAI Whisper)
      let transcript = '';
      if (uri) {
        try {
          const apiBase = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
          const formData = new FormData();
          formData.append('file', {
            uri,
            name: 'recording.m4a',
            type: 'audio/m4a',
          } as unknown as Blob);

          const transcribeRes = await fetch(`${apiBase}/api/transcribe`, {
            method: 'POST',
            body: formData,
          });

          if (transcribeRes.ok) {
            const data = (await transcribeRes.json()) as { text?: string };
            transcript = data.text ?? '';
          }
        } catch {
          // Transcription unavailable — use a placeholder so the oracle still responds
          transcript = '[voice message]';
        }
      }

      if (!transcript.trim()) {
        setSpeakState('idle');
        return;
      }

      // Add to conversation history
      const userTurn: ConversationTurn = { role: 'user', content: transcript };
      setConversation(prev => [...prev, userTurn]);
      conversationRef.current = [
        ...conversationRef.current,
        { role: 'user', content: transcript },
      ];

      // Send to Oracle AI
      const response = await sendOracleMessage(conversationRef.current);

      const assistantTurn: ConversationTurn = { role: 'assistant', content: response.reply };
      setConversation(prev => [...prev, assistantTurn]);
      conversationRef.current = [
        ...conversationRef.current,
        { role: 'assistant', content: response.reply },
      ];

      setSpeakState('speaking');
    } catch (err: unknown) {
      const isInsufficientCredits =
        err &&
        typeof err === 'object' &&
        'code' in err &&
        (err as { code: string }).code === 'insufficient_credits';

      if (isInsufficientCredits) {
        const message = (err as { message?: string }).message ?? 'Not enough Qs.';
        Alert.alert('Not Enough Qs', message);
        setSpeakState('idle');
      } else {
        setRecording(null);
        setSpeakState('error');
      }
    }
  }, [recording, speakState]);

  const handleOrbPress = () => {
    if (speakState === 'listening') {
      void stopListening();
    } else if (speakState === 'idle' || speakState === 'error' || speakState === 'speaking') {
      void startListening();
    }
  };

  const handleReset = () => {
    setConversation([]);
    conversationRef.current = [];
    setSpeakState('idle');
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

        {/* Microphone permission denied state */}
        {permissionDenied ? (
          <Card
            variant="default"
            style={{ padding: spacing.xl, margin: spacing.xl, borderColor: `${colors.error}40`, borderWidth: 1 }}
          >
            <Typography variant="body" style={{ color: colors.text.primary, textAlign: 'center', marginBottom: spacing.md }}>
              Microphone access is required to use this feature.
            </Typography>
            <TouchableOpacity onPress={openSettings} activeOpacity={0.8}>
              <Typography variant="bodyBold" style={{ color: colors.accent.primary, textAlign: 'center' }}>
                Open Settings →
              </Typography>
            </TouchableOpacity>
          </Card>
        ) : (
          <>
            {/* Orb — tap to start/stop */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleOrbPress}
              disabled={speakState === 'processing' || speakState === 'requesting'}
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

            {/* Conversation history */}
            {conversation.length > 0 && (
              <View style={styles.conversationContainer}>
                <ScrollView
                  style={styles.conversationScroll}
                  contentContainerStyle={{ gap: spacing.sm }}
                  showsVerticalScrollIndicator={false}
                >
                  {conversation.slice(-4).map((turn, i) => (
                    <View
                      key={i}
                      style={[
                        styles.bubble,
                        turn.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
                      ]}
                    >
                      <Typography
                        variant="small"
                        style={{
                          color: turn.role === 'user' ? '#fff' : colors.text.primary,
                          lineHeight: 20,
                        }}
                      >
                        {turn.content}
                      </Typography>
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity onPress={handleReset} style={styles.resetBtn} activeOpacity={0.7}>
                  <Typography variant="caption" style={{ color: colors.text.secondary }}>
                    Clear conversation
                  </Typography>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* Footer note */}
        <View style={styles.footer}>
          <Typography variant="caption" style={{ color: colors.text.secondary, textAlign: 'center', lineHeight: 18 }}>
            Your voice conversation stays private.{'\n'}{PRACTICE_IS_FREE_ONE_LINER}
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
    marginBottom: spacing.xl * 1.5,
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
  conversationContainer: {
    width: '100%',
    maxHeight: 200,
    marginTop: spacing.xl,
  },
  conversationScroll: {
    maxHeight: 160,
  },
  bubble: {
    padding: spacing.md,
    borderRadius: 12,
    maxWidth: '90%',
  },
  bubbleUser: {
    backgroundColor: '#9333EA',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xxxl,
    left: spacing.xl,
    right: spacing.xl,
  },
});
