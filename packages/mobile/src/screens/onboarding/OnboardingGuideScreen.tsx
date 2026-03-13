import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Button, Card } from '@/components';
import { useAuthStore } from '@/stores';
import { supabase } from '@/services/supabase';
import { Analytics } from '@waqup/shared/utils';
import { useOnboardingCompletion } from '@/contexts/OnboardingCompletionContext';
import type { OnboardingStackParamList } from '@/navigation/types';
import type { ContentItemType } from '@waqup/shared/types';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';

const QUICK_START_OPTIONS: Array<{
  id: string;
  emoji: string;
  label: string;
  sub: string;
  contentType: ContentItemType;
  color: string;
}> = [
  { id: 'affirmation', emoji: '🦁', label: 'Create my first affirmation', sub: 'Cognitive re-patterning · 1 min · 1 Q', contentType: 'affirmation', color: CONTENT_TYPE_COLORS.affirmation },
  { id: 'meditation', emoji: '🌊', label: 'Create a short meditation', sub: 'State induction · 5 min · 2 Q', contentType: 'meditation', color: CONTENT_TYPE_COLORS.meditation },
  { id: 'ritual', emoji: '🔥', label: 'Build a daily ritual', sub: 'Identity encoding · 10 min · 5 Q', contentType: 'ritual', color: CONTENT_TYPE_COLORS.ritual },
];

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingGuide'>;

export default function OnboardingGuideScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const user = useAuthStore((s) => s.user);
  const { completeOnboarding } = useOnboardingCompletion();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEnterSanctuary = async () => {
    setIsSubmitting(true);
    try {
      Analytics.onboardingStepCompleted('guide', user?.id);
      if (user?.id) {
        await supabase
          .from('profiles')
          .update({ onboarding_completed_at: new Date().toISOString() })
          .eq('id', user.id);
      }
      await completeOnboarding();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNow = async (contentType: ContentItemType) => {
    Analytics.onboardingStepCompleted('guide-create', user?.id);
    if (user?.id) {
      await supabase
        .from('profiles')
        .update({ onboarding_completed_at: new Date().toISOString() })
        .eq('id', user.id);
    }
    await completeOnboarding();
    // User lands on Main; they can tap Create tab from there.
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
                { backgroundColor: colors.accent.primary },
              ]}
            />
          ))}
        </View>

        <Card variant="elevated" style={[styles.headerCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
          <Typography variant="h1" style={[styles.title, { color: colors.text.primary }]}>
            Create your first practice now
          </Typography>
        </Card>

        <View style={styles.options}>
          {QUICK_START_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => void handleCreateNow(item.contentType)}
              activeOpacity={0.8}
              style={[
                styles.optionCard,
                {
                  backgroundColor: `${item.color}18`,
                  borderColor: `${item.color}40`,
                },
              ]}
            >
              <Typography variant="h1" style={styles.optionEmoji}>{item.emoji}</Typography>
              <View style={styles.optionText}>
                <Typography variant="body" style={[styles.optionLabel, { color: colors.text.primary }]}>
                  {item.label}
                </Typography>
                <Typography variant="small" style={{ color: item.color, fontSize: 11, opacity: 0.85 }}>
                  {item.sub}
                </Typography>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Typography variant="small" style={[styles.reminder, { color: colors.text.secondary }]}>
          Create by talking — no forms. Practice is free. Qs are only used when you create.
        </Typography>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => void handleEnterSanctuary()}
          disabled={isSubmitting}
        >
          {isSubmitting ? '…' : 'Skip to Sanctuary →'}
        </Button>
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
    textAlign: 'center',
  },
  options: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    minHeight: 44,
    gap: spacing.md,
  },
  optionEmoji: {
    fontSize: 24,
    width: 36,
    textAlign: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  reminder: {
    textAlign: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
    lineHeight: 18,
  },
});
