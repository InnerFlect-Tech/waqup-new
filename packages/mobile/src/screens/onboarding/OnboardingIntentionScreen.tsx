/**
 * OnboardingIntentionScreen — Calm-style: full-height gradient, stacked pill buttons.
 */
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Button } from '@/components';
import { useAuthStore } from '@/stores';
import { Analytics } from '@waqup/shared/utils';
import { API_BASE_URL } from '@/constants/app';
import { supabase } from '@/services/supabase';
import type { OnboardingStackParamList } from '@/navigation/types';

const INTENTIONS = [
  { id: 'confidence', emoji: '🦁', label: 'Confidence & Self-Worth', sub: 'Own who you are, fully' },
  { id: 'abundance', emoji: '💎', label: 'Abundance & Wealth', sub: 'Rewire your money beliefs' },
  { id: 'peace', emoji: '🌊', label: 'Inner Peace & Calm', sub: 'Quiet the noise inside' },
  { id: 'love', emoji: '❤️', label: 'Love & Relationships', sub: 'Open your heart completely' },
  { id: 'purpose', emoji: '🔥', label: 'Purpose & Direction', sub: 'Live with total clarity' },
  { id: 'health', emoji: '⚡', label: 'Health & Vitality', sub: 'Heal from the inside out' },
];

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingIntention'>;

export default function OnboardingIntentionScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'there';

  useEffect(() => {
    if (!user) return;
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      try {
        await fetch(`${API_BASE_URL}/api/credits/welcome`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
      } catch {}
    };
    void run();
  }, [user]);

  const handleContinue = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    Analytics.onboardingStepCompleted('intention', user?.id);
    await new Promise((r) => setTimeout(r, 400));
    navigation.replace('OnboardingProfile', { intention: selected });
  };

  const handleSkip = () => {
    Analytics.onboardingStepCompleted('intention_skipped', user?.id);
    navigation.replace('OnboardingProfile', {});
  };

  const gradientColors = [
    colors.background.primary,
    `${colors.accent.primary}20`,
    colors.background.primary,
  ] as const;

  return (
    <Screen scrollable padding={false}>
      <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFill} />
      <Animated.View
        entering={FadeIn.duration(500)}
        style={[styles.content, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xxxl }]}
      >
        {/* Progress */}
        <View style={styles.progress}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === 1 ? colors.accent.primary : `${colors.accent.primary}30` },
              ]}
            />
          ))}
        </View>

        {/* Title — Calm-style */}
        <Typography variant="h1" style={[styles.title, { color: colors.text.primary }]}>
          What brings you to waQup?
        </Typography>
        <Typography variant="body" style={[styles.subtitle, { color: colors.text.secondary }]}>
          We'll personalise your voice experience around this. You can always change it later.
        </Typography>

        {/* Vertically stacked pill buttons — Calm-style */}
        <View style={styles.pills}>
          {INTENTIONS.map((intention) => {
            const isActive = selected === intention.id;
            return (
              <TouchableOpacity
                key={intention.id}
                onPress={() => setSelected(intention.id)}
                activeOpacity={0.8}
                style={[
                  styles.pill,
                  {
                    backgroundColor: isActive ? `${colors.accent.primary}40` : `${colors.accent.primary}15`,
                    borderColor: isActive ? colors.accent.primary : `${colors.accent.primary}30`,
                  },
                ]}
              >
                <Typography variant="h3" style={styles.pillEmoji}>{intention.emoji}</Typography>
                <View style={styles.pillText}>
                  <Typography variant="bodyBold" style={[styles.pillLabel, { color: colors.text.primary }]}>
                    {intention.label}
                  </Typography>
                  <Typography variant="small" style={[styles.pillSub, { color: colors.text.secondary }]}>
                    {intention.sub}
                  </Typography>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue — fixed at bottom */}
        <View style={styles.footer}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => void handleContinue()}
            disabled={!selected || isSubmitting}
          >
            {isSubmitting ? 'Creating your first practice…' : 'Continue'}
          </Button>
          <TouchableOpacity onPress={handleSkip} style={styles.skip} activeOpacity={0.7}>
            <Typography variant="body" style={{ color: colors.text.secondary, opacity: 0.6 }}>
              Skip — go straight to the orb →
            </Typography>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  progress: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  dot: {
    height: 3,
    width: 32,
    borderRadius: borderRadius.full,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  pills: {
    gap: spacing.md,
    flex: 1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    minHeight: 52,
  },
  pillEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  pillText: {
    flex: 1,
  },
  pillLabel: {
    marginBottom: spacing.xs,
  },
  pillSub: {
    opacity: 0.85,
  },
  footer: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  skip: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
});
