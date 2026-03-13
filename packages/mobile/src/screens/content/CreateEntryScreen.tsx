/**
 * CreateEntryScreen — Create tab; ritual-first type picker.
 * Replaces CreateMode modal; each type goes directly to ContentCreate with chat mode.
 */
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card } from '@/components';
import { CONTENT_TYPE_COLORS, CONTENT_TYPE_COPY } from '@waqup/shared/constants';
import type { ContentItemType } from '@waqup/shared/types';

const TYPE_ICONS: Record<ContentItemType, string> = {
  affirmation: '✨',
  meditation: '🧘',
  ritual: '🔮',
};

const CREATE_ORDER: ContentItemType[] = ['ritual', 'affirmation', 'meditation'];

export default function CreateEntryScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleTypePress = (contentType: ContentItemType) => {
    navigation.navigate('ContentCreate', { contentType, mode: 'chat' });
  };

  return (
    <Screen padding={false}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Typography
            variant="h1"
            style={{ color: colors.text.primary, fontWeight: '300', letterSpacing: -1 }}
          >
            Create
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
            Choose what you'd like to create
          </Typography>
        </View>

        <Typography
          variant="small"
          style={[styles.sectionLabel, { color: colors.text.secondary }]}
        >
          CHOOSE A TYPE
        </Typography>

        <View style={styles.cardList}>
          {CREATE_ORDER.map((contentType) => {
            const copy = CONTENT_TYPE_COPY[contentType];
            const accentColor = CONTENT_TYPE_COLORS[contentType];
            const bgColor = `${accentColor}30`;
            const isRitual = contentType === 'ritual';

            return (
              <TouchableOpacity
                key={contentType}
                activeOpacity={0.8}
                onPress={() => handleTypePress(contentType)}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.glass.opaque,
                    borderColor: colors.glass.border,
                    ...(isRitual && styles.ritualCard),
                },
                ]}
              >
                <View style={[styles.iconTile, { backgroundColor: bgColor }]}>
                  <Typography style={[styles.iconText, { color: accentColor }]}>
                    {TYPE_ICONS[contentType]}
                  </Typography>
                </View>
                <View style={styles.cardText}>
                  <Typography variant="bodyBold" style={{ color: colors.text.primary }}>
                    {copy.label}s
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{ color: colors.text.secondary, marginTop: 2 }}
                  >
                    {copy.depth}
                  </Typography>
                  <Typography
                    variant="small"
                    style={{ color: colors.text.tertiary, marginTop: 4 }}
                    numberOfLines={2}
                  >
                    {copy.shortDesc}
                  </Typography>
                </View>
                <View style={styles.chevronWrapper}>
                  <Typography style={[styles.chevron, { color: accentColor }]}>›</Typography>
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
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
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
    gap: spacing.md,
    minHeight: 88,
  },
  ritualCard: {
    minHeight: 96,
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
});
