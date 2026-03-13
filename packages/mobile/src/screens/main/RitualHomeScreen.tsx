/**
 * RitualHomeScreen — Home tab with greeting and 3 content-type cards.
 * Affirmations, Meditations, Rituals — each navigates to ContentCreate.
 */
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainStackParamList, MainTabParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography } from '@/components';
import { CONTENT_TYPE_COPY } from '@waqup/shared/constants';
import type { ContentItemType } from '@waqup/shared/types';

type RitualHomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Ritual'>,
  NativeStackNavigationProp<MainStackParamList>
>;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

const CARD_CONFIG: { type: ContentItemType; icon: string; subtitle: string }[] = [
  { type: 'affirmation', icon: 'white-balance-sunny', subtitle: 'Rewire your beliefs' },
  { type: 'meditation', icon: 'moon-waning-crescent', subtitle: 'Induce calm states' },
  { type: 'ritual', icon: 'fire', subtitle: 'Encode identity' },
];

export default function RitualHomeScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RitualHomeNav>();

  const greeting = getGreeting();

  const handleCardPress = (contentType: ContentItemType) => {
    navigation.navigate('ContentCreate', { contentType, mode: 'chat' });
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
            {greeting}
          </Typography>
          <Typography
            variant="h2"
            style={[styles.headline, { color: colors.text.primary }]}
          >
            Ready to transform? ✨
          </Typography>
        </View>

        {/* 3 content-type cards */}
        <View style={styles.cardList}>
          {CARD_CONFIG.map(({ type, icon, subtitle }) => {
            const copy = CONTENT_TYPE_COPY[type];
            const title = copy?.label ? `${copy.label}s` : type;
            return (
              <TouchableOpacity
                key={type}
                activeOpacity={0.8}
                onPress={() => handleCardPress(type)}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.glass.opaque,
                    borderColor: colors.glass.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      borderColor: colors.accent.tertiary,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={icon as 'white-balance-sunny' | 'moon-waning-crescent' | 'fire'}
                    size={24}
                    color={colors.accent.tertiary}
                  />
                </View>
                <View style={styles.cardText}>
                  <Typography variant="bodyBold" style={{ color: colors.text.primary }}>
                    {title}
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{ color: colors.text.secondary, marginTop: 2 }}
                  >
                    {subtitle}
                  </Typography>
                </View>
              </TouchableOpacity>
            );
          })}
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
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  headline: {
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  cardList: {
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    minHeight: 88,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardText: {
    flex: 1,
  },
});
