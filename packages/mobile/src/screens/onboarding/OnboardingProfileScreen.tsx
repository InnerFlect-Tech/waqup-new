import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Button, Card, Input } from '@/components';
import { useAuthStore } from '@/stores';
import { supabase } from '@/services/supabase';
import { Analytics } from '@waqup/shared/utils';
import type { OnboardingStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingProfile'>;

export default function OnboardingProfileScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const user = useAuthStore((s) => s.user);
  const intention = route.params?.intention;
  const [preferredName, setPreferredName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const firstName =
      user?.user_metadata?.full_name?.split(' ')[0] ||
      user?.email?.split('@')[0] ||
      '';
    if (firstName && !preferredName) setPreferredName(firstName);
  }, [user?.user_metadata?.full_name, user?.email, preferredName]);

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      if (user?.id) {
        const updates: { preferred_name?: string; onboarding_intention?: string } = {};
        if (preferredName.trim()) updates.preferred_name = preferredName.trim();
        if (intention) updates.onboarding_intention = intention;
        if (Object.keys(updates).length > 0) {
          await supabase.from('profiles').upsert({ id: user.id, ...updates });
        }
      }
      Analytics.onboardingStepCompleted('profile', user?.id);
      await new Promise((r) => setTimeout(r, 300));
      navigation.replace('OnboardingPreferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigation.replace('OnboardingPreferences');
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
                { backgroundColor: i <= 2 ? colors.accent.primary : `${colors.accent.primary}30` },
              ]}
            />
          ))}
        </View>

        <Card variant="elevated" style={[styles.headerCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
          <Typography variant="h1" style={[styles.title, { color: colors.text.primary }]}>
            What should we call you?
          </Typography>
          <Typography variant="body" style={[styles.subtitle, { color: colors.text.secondary }]}>
            We'll use this when we speak to you in your rituals. You can change it anytime.
          </Typography>
        </Card>

        <Input
          placeholder="e.g. Alex"
          value={preferredName}
          onChangeText={setPreferredName}
          autoComplete="given-name"
          style={styles.input}
        />

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => void handleContinue()}
          disabled={isSubmitting}
        >
          {isSubmitting ? '…' : 'Continue →'}
        </Button>

        <TouchableOpacity onPress={handleSkip} style={styles.skip} activeOpacity={0.7}>
          <Typography variant="body" style={{ color: colors.text.secondary, opacity: 0.55 }}>
            Skip for now
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
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.xl,
  },
  skip: {
    marginTop: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
});
