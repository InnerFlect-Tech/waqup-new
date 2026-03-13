/**
 * CreateVoiceStepScreen — Voice choice after script generation.
 * User chooses: Record my voice or Use AI voice. Then save and open in ContentDetail.
 */
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button } from '@/components';
import { AudioRecorder } from '@/components/audio';
import { uploadRecording } from '@/services/audio';
import { renderContentAudio } from '@/services/ai';
import { supabase } from '@/services/supabase';

type Props = NativeStackScreenProps<MainStackParamList, 'CreateVoiceStep'>;

type Step = 'choose' | 'recording' | 'uploading' | 'rendering';

export default function CreateVoiceStepScreen({ navigation, route }: Props) {
  const { contentId, contentType, script } = route.params;
  const { theme } = useTheme();
  const colors = theme.colors;

  const [step, setStep] = useState<Step>('choose');
  const [renderError, setRenderError] = useState<string | null>(null);

  const getSession = useCallback(() => supabase.auth.getSession(), []);

  const handleOwnVoiceConfirm = useCallback(
    async (uri: string) => {
      setStep('uploading');
      setRenderError(null);
      try {
        const { url } = await uploadRecording(uri, contentId, getSession);
        setStep('rendering');
        const result = await renderContentAudio(contentId, script, { ownVoiceUrl: url }, getSession);

        if ('error' in result && result.error === 'insufficient_credits') {
          setRenderError(result.message ?? 'Not enough Qs. Get more credits to continue.');
          setStep('choose');
          return;
        }

        navigation.navigate('ContentDetail', { contentId, contentType });
      } catch (e) {
        setRenderError(e instanceof Error ? e.message : 'Something went wrong.');
        setStep('recording');
      }
    },
    [contentId, contentType, script, getSession, navigation]
  );

  const handleUseAIVoice = useCallback(async () => {
    setStep('rendering');
    setRenderError(null);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('elevenlabs_voice_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
        .single();

      const voiceId = (profile as { elevenlabs_voice_id?: string } | null)?.elevenlabs_voice_id;

      if (!voiceId) {
        setRenderError('No voice set up. Go to Profile → Voice Settings to add your cloned voice, or use Record my voice below.');
        setStep('choose');
        return;
      }

      const result = await renderContentAudio(contentId, script, voiceId, getSession);

      if ('error' in result && result.error === 'insufficient_credits') {
        setRenderError(result.message ?? 'Not enough Qs to render audio. Get more credits to continue.');
        setStep('choose');
        return;
      }

      navigation.navigate('ContentDetail', { contentId, contentType });
    } catch (e) {
      setRenderError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setStep('choose');
    }
  }, [contentId, contentType, script, getSession, navigation]);

  const handleRecordMyVoice = useCallback(() => {
    setStep('recording');
    setRenderError(null);
  }, []);

  const handleCancelRecording = useCallback(() => {
    setStep('choose');
  }, []);

  // Loading overlay for upload/render
  if (step === 'uploading' || step === 'rendering') {
    return (
      <Screen scrollable={false} padding={false}>
        <View style={[styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.lg }}>
            {step === 'uploading' ? 'Uploading your recording…' : 'Generating audio…'}
          </Typography>
        </View>
      </Screen>
    );
  }

  // Recording step — AudioRecorder
  if (step === 'recording') {
    return (
      <Screen scrollable={false} padding={false}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={handleCancelRecording} activeOpacity={0.8}>
            <Typography variant="body" style={{ color: colors.accent.primary }}>← Back</Typography>
          </TouchableOpacity>
          <Typography variant="captionBold" style={{ color: colors.text.primary }}>
            Record Your Voice
          </Typography>
        </View>
        <AudioRecorder onConfirm={handleOwnVoiceConfirm} onCancel={handleCancelRecording} />
      </Screen>
    );
  }

  // Choose step
  return (
    <Screen scrollable padding>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Typography variant="body" style={{ color: colors.accent.primary }}>← Back</Typography>
        </TouchableOpacity>
        <Typography variant="captionBold" style={{ color: colors.text.primary }}>
          Add Your Voice
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card variant="default" style={[styles.scriptCard, { borderColor: colors.glass.border }]}>
          <Typography variant="captionBold" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
            Your script
          </Typography>
          <Typography variant="body" style={{ color: colors.text.primary, lineHeight: 22 }} numberOfLines={6}>
            {script}
          </Typography>
        </Card>

        {renderError && (
          <View style={[styles.errorBox, { backgroundColor: `${colors.error}15`, borderColor: `${colors.error}30` }]}>
            <Typography variant="small" style={{ color: colors.error }}>{renderError}</Typography>
          </View>
        )}

        <Typography variant="captionBold" style={[styles.sectionLabel, { color: colors.text.secondary }]}>
          How do you want to voice it?
        </Typography>

        <View style={styles.options}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleRecordMyVoice}
            style={[styles.optionCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}
          >
            <Typography style={styles.optionIcon}>🎙️</Typography>
            <Typography variant="bodyBold" style={{ color: colors.text.primary }}>Record my voice</Typography>
            <Typography variant="caption" style={{ color: colors.text.secondary, marginTop: 4 }}>
              Read the script aloud — most powerful for subconscious programming
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleUseAIVoice}
            style={[styles.optionCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}
          >
            <Typography style={styles.optionIcon}>✨</Typography>
            <Typography variant="bodyBold" style={{ color: colors.text.primary }}>Use AI voice</Typography>
            <Typography variant="caption" style={{ color: colors.text.secondary, marginTop: 4 }}>
              Generated with your cloned voice (costs Qs)
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  scriptCard: {
    padding: spacing.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  errorBox: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  options: {
    gap: spacing.md,
  },
  optionCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  optionIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
});
