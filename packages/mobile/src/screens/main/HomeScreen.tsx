import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography } from '@/components';
import { useAuthStore } from '@/stores';
import {
  CONTENT_TYPE_COPY,
  CONTENT_TYPE_COLORS,
  PRACTICE_IS_FREE_ONE_LINER,
} from '@waqup/shared/constants';
import type { ContentItemType } from '@waqup/shared/types';

const CONTENT_TYPE_ICONS: Record<ContentItemType, string> = {
  affirmation: '☀',
  meditation: '☽',
  ritual: '◎',
};

const CONTENT_TYPES = (['affirmation', 'meditation', 'ritual'] as const).map(
  (contentType) => {
    const copy = CONTENT_TYPE_COPY[contentType];
    const accentColor = CONTENT_TYPE_COLORS[contentType];
    return {
      label: `${copy.label}s`,
      subtitle: copy.depth,
      description: copy.shortDesc,
      icon: CONTENT_TYPE_ICONS[contentType],
      accentColor,
      bgColor: `${accentColor}30`,
      contentType,
    };
  }
);

function getGreeting(): { label: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { label: 'Good morning', emoji: '☀' };
  if (hour < 17) return { label: 'Good afternoon', emoji: '◑' };
  return { label: 'Good evening', emoji: '☽' };
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { user } = useAuthStore();

  const greeting = getGreeting();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? '';

  const handleTypePress = (contentType: 'affirmation' | 'meditation' | 'ritual') => {
    navigation.navigate('CreateMode', { contentType });
  };

  return (
    // Screen handles the background color; scrolling is done by the inner ScrollView
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
            What would you like to{'\n'}practice today?
          </Typography>
        </View>

        {/* Section label */}
        <Typography
          variant="small"
          style={[styles.sectionLabel, { color: colors.text.secondary }]}
        >
          CHOOSE A PRACTICE
        </Typography>

        {/* Content type cards */}
        <View style={styles.cardList}>
          {CONTENT_TYPES.map((item) => (
            <TouchableOpacity
              key={item.contentType}
              activeOpacity={0.8}
              onPress={() => handleTypePress(item.contentType)}
              style={[
                styles.card,
                {
                  backgroundColor: colors.glass.opaque,
                  borderColor: colors.glass.border,
                },
              ]}
            >
              {/* Icon column */}
              <View style={[styles.iconTile, { backgroundColor: item.bgColor }]}>
                <Typography style={[styles.iconText, { color: item.accentColor }]}>
                  {item.icon}
                </Typography>
              </View>

              {/* Text column */}
              <View style={styles.cardText}>
                <Typography variant="bodyBold" style={{ color: colors.text.primary }}>
                  {item.label}
                </Typography>
                <Typography
                  variant="caption"
                  style={{ color: colors.text.secondary, marginTop: 2 }}
                >
                  {item.subtitle}
                </Typography>
                <Typography
                  variant="small"
                  style={{ color: colors.text.tertiary, marginTop: 4 }}
                  numberOfLines={2}
                >
                  {item.description}
                </Typography>
              </View>

              {/* Chevron */}
              <View style={styles.chevronWrapper}>
                <Typography style={[styles.chevron, { color: item.accentColor }]}>›</Typography>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick tip */}
        <View style={[styles.tipCard, { backgroundColor: colors.glass.transparent, borderColor: colors.glass.border }]}>
          <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 18 }}>
            💡 <Typography variant="smallBold" style={{ color: colors.text.primary }}>Tip:</Typography>
            {' '}{PRACTICE_IS_FREE_ONE_LINER}
          </Typography>
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
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  headline: {
    fontWeight: '300',
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  sectionLabel: {
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  cardList: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    gap: spacing.md,
    minHeight: 88,
  },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconText: {
    fontSize: 24,
  },
  cardText: {
    flex: 1,
  },
  chevronWrapper: {
    flexShrink: 0,
    width: 24,
    alignItems: 'center',
  },
  chevron: {
    fontSize: 22,
    lineHeight: 26,
  },
  tipCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
});
