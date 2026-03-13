/**
 * RitualHomeScreen — Default ritual-first home tab.
 * Prepares for: Start Ritual / Resume Ritual CTA, today-focused ritual state, future mini-player.
 */
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainStackParamList, MainTabParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius, homeTokens } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Button } from '@/components';
import { useAuthStore } from '@/stores';
import { useContent } from '@/hooks';
import { PRACTICE_IS_FREE_ONE_LINER } from '@waqup/shared/constants';

type RitualHomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Ritual'>,
  NativeStackNavigationProp<MainStackParamList>
>;

function getGreeting(): { label: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { label: 'Good morning', emoji: '☀' };
  if (hour < 17) return { label: 'Good afternoon', emoji: '◑' };
  return { label: 'Good evening', emoji: '☽' };
}

export default function RitualHomeScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RitualHomeNav>();
  const { user } = useAuthStore();
  const { data: rituals = [] } = useContent('ritual');

  const greeting = getGreeting();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? '';
  const hasRituals = rituals.length > 0;

  const handleStartRitual = () => {
    navigation.navigate('ContentCreate', { contentType: 'ritual', mode: 'chat' });
  };

  const handleResumeRitual = () => {
    if (hasRituals) {
      // Navigate to Library tab so user can pick a ritual
      navigation.navigate('Library');
    } else {
      handleStartRitual();
    }
  };

  return (
    <Screen padding={false}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: spacing.xl, paddingBottom: insets.bottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting header */}
        <View style={styles.header}>
          <Typography
            variant="small"
            style={[styles.greetingLabel, { color: colors.text.secondary }]}
          >
            {greeting.label}{firstName ? `, ${firstName}` : ''} {greeting.emoji}
          </Typography>
          <Typography
            variant="h2"
            style={[styles.headline, { color: colors.text.primary }]}
          >
            Your ritual{'\n'}awaits
          </Typography>
        </View>

        {/* Primary CTA */}
        <View style={styles.ctaSection}>
          {hasRituals ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleResumeRitual}
              style={styles.primaryButton}
            >
              Resume Ritual
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleStartRitual}
              style={styles.primaryButton}
            >
              Start Ritual
            </Button>
          )}
        </View>

        {/* Placeholder for today-focused ritual state — future: show suggested/last ritual */}
        {/* Placeholder for future mini-player support */}

        {/* Quick tip */}
        <View style={[styles.tipCard, { backgroundColor: colors.glass.transparent, borderColor: colors.glass.border }]}>
          <View style={styles.tipRow}>
            <MaterialCommunityIcons name="lightbulb-on-outline" size={homeTokens.tipIconSize} color={colors.accent.tertiary} style={styles.tipIcon} />
            <View style={styles.tipTextWrap}>
              <Typography variant="smallBold" style={{ color: colors.text.primary }}>Tip: </Typography>
              <Typography variant="small" style={{ color: colors.text.secondary }}>{PRACTICE_IS_FREE_ONE_LINER}</Typography>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greetingLabel: {
    letterSpacing: homeTokens.greetingLetterSpacing,
    marginBottom: spacing.sm,
  },
  headline: {
    fontWeight: '300',
    letterSpacing: -0.3,
    lineHeight: homeTokens.headlineLineHeight,
  },
  ctaSection: {
    marginBottom: spacing.xl,
  },
  primaryButton: {
    minHeight: homeTokens.ctaMinHeight,
  },
  tipCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  tipIcon: {
    marginTop: 2,
  },
  tipTextWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
