import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Button, Card } from '@/components';
import { useAuthStore } from '@/stores';
import { supabase } from '@/services/supabase';
import { Analytics } from '@waqup/shared/utils';
import type { OnboardingStackParamList } from '@/navigation/types';

const PRESETS = [
  { id: 'voice', label: 'Voice-focused', sub: 'Clear and upfront', emoji: '🎤', values: { voice: 90, ambient: 20, binaural: 10 } },
  { id: 'balanced', label: 'Balanced', sub: 'Mix of all layers', emoji: '⚖️', values: { voice: 70, ambient: 40, binaural: 30 } },
  { id: 'ambient', label: 'Ambient-first', sub: 'Soothing background', emoji: '🌊', values: { voice: 50, ambient: 60, binaural: 40 } },
] as const;

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingPreferences'>;

export default function OnboardingPreferencesScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const user = useAuthStore((s) => s.user);
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      const preset = PRESETS.find((p) => p.id === selected);
      if (preset && user?.id) {
        await supabase.from('profiles').upsert({
          id: user.id,
          pref_vol_voice: preset.values.voice,
          pref_vol_ambient: preset.values.ambient,
          pref_vol_binaural: preset.values.binaural,
          pref_vol_master: 100,
        });
      }
      Analytics.onboardingStepCompleted('preferences', user?.id);
      await new Promise((r) => setTimeout(r, 300));
      navigation.replace('OnboardingGuide');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigation.replace('OnboardingGuide');
  };

  return (
    <Screen scrollable padding={false}>
      <View style={styles.content}>
        <View style={styles.progress}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i <= 3 ? colors.accent.primary : `${colors.accent.primary}30` },
              ]}
            />
          ))}
        </View>

        <Card variant="elevated" style={[styles.headerCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
          <Typography variant="h1" style={[styles.title, { color: colors.text.primary }]}>
            How do you like your audio?
          </Typography>
          <Typography variant="body" style={[styles.subtitle, { color: colors.text.secondary }]}>
            Choose a preset. You can fine-tune later in settings.
          </Typography>
        </Card>

        <View style={styles.grid}>
          {PRESETS.map((preset) => {
            const isActive = selected === preset.id;
            return (
              <TouchableOpacity
                key={preset.id}
                onPress={() => setSelected(preset.id)}
                activeOpacity={0.8}
                style={[
                  styles.presetCard,
                  {
                    backgroundColor: isActive ? `${colors.accent.primary}25` : colors.glass.opaque,
                    borderColor: isActive ? colors.accent.primary : colors.glass.border,
                  },
                ]}
              >
                <Typography variant="h1" style={styles.emoji}>{preset.emoji}</Typography>
                <Typography
                  variant="body"
                  style={[styles.presetLabel, { color: isActive ? colors.accent.primary : colors.text.primary }]}
                >
                  {preset.label}
                </Typography>
                <Typography variant="small" style={[styles.presetSub, { color: colors.text.secondary }]}>
                  {preset.sub}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => void handleContinue()}
          disabled={!selected || isSubmitting}
        >
          {isSubmitting ? '…' : 'Continue →'}
        </Button>

        <TouchableOpacity onPress={handleSkip} style={styles.skip} activeOpacity={0.7}>
          <Typography variant="body" style={{ color: colors.text.secondary, opacity: 0.55 }}>
            Use defaults
          </Typography>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  progress: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.md,
    marginBottom: spacing.xl,
  },
  dot: {
    height: 3,
    width: 32,
    borderRadius: borderRadius.full,
  },
  headerCard: {
    padding: spacing.xxl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  presetCard: {
    width: '30%',
    flexGrow: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 100,
  },
  emoji: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  presetLabel: {
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  presetSub: {
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.8,
  },
  skip: {
    marginTop: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
});
