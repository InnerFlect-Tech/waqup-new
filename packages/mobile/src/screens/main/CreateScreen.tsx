import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card } from '@/components';
import {
  CONTENT_TYPE_COPY,
  CONTENT_TYPE_COLORS,
  CONTENT_CREDIT_COSTS,
  PRACTICE_IS_FREE_ONE_LINER,
} from '@waqup/shared/constants';
import type { ContentItemType } from '@waqup/shared/types';

const CONTENT_TYPE_ICONS: Record<ContentItemType, string> = {
  affirmation: '✨',
  meditation: '🧘',
  ritual: '🔮',
};

const CONTENT_TYPES: {
  type: ContentItemType;
  icon: string;
  color: string;
  title: string;
  description: string;
  depth: string;
  time: string;
  credits: string;
}[] = (['affirmation', 'meditation', 'ritual'] as const).map((type) => {
  const copy = CONTENT_TYPE_COPY[type];
  const costs = CONTENT_CREDIT_COSTS[type];
  return {
    type,
    icon: CONTENT_TYPE_ICONS[type],
    color: CONTENT_TYPE_COLORS[type],
    title: copy.label,
    description: copy.longDesc,
    depth: copy.depth,
    time: copy.duration,
    credits: `${costs.base}–${costs.withAi} Qs`,
  };
});

export default function CreateScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleTypePress = (contentType: ContentItemType) => {
    navigation.navigate('CreateMode', { contentType });
  };

  return (
    <Screen scrollable padding={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
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
            What would you like to create today?
          </Typography>
        </View>

        <View style={styles.cards}>
          {CONTENT_TYPES.map((ct) => (
            <TouchableOpacity
              key={ct.type}
              onPress={() => handleTypePress(ct.type)}
              activeOpacity={0.8}
            >
              <Card
                variant="elevated"
                style={[
                  styles.typeCard,
                  {
                    backgroundColor: colors.glass.opaque,
                    borderColor: colors.glass.border,
                  },
                ]}
              >
                {/* Left accent bar */}
                <View style={[styles.accentBar, { backgroundColor: ct.color }]} />

                <View style={styles.typeCardBody}>
                  {/* Top row */}
                  <View style={styles.typeCardHeader}>
                    <View style={[styles.iconCircle, { backgroundColor: ct.color + '22' }]}>
                      <Typography variant="h2" style={{ fontSize: 28 }}>
                        {ct.icon}
                      </Typography>
                    </View>
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                        {ct.title}
                      </Typography>
                      <View style={styles.metaRow}>
                        <Typography variant="small" style={{ color: ct.color }}>
                          {ct.depth}
                        </Typography>
                        <Typography variant="small" style={{ color: colors.text.secondary }}>
                          {'  ·  '}
                        </Typography>
                        <Typography variant="small" style={{ color: colors.text.secondary }}>
                          {ct.time}
                        </Typography>
                      </View>
                    </View>
                    <View style={[styles.creditsBadge, { backgroundColor: ct.color + '22', borderColor: ct.color + '44' }]}>
                      <Typography variant="small" style={{ color: ct.color, fontWeight: '600' }}>
                        {ct.credits}
                      </Typography>
                    </View>
                  </View>

                  {/* Description */}
                  <Typography
                    variant="body"
                    style={{ color: colors.text.secondary, marginTop: spacing.md, lineHeight: 22 }}
                  >
                    {ct.description}
                  </Typography>

                  {/* CTA hint */}
                  <View style={styles.ctaRow}>
                    <Typography variant="captionBold" style={{ color: ct.color }}>
                      Choose creation mode →
                    </Typography>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[
            styles.freeNote,
            { backgroundColor: colors.glass.transparent, borderColor: colors.glass.border },
          ]}
        >
          <Typography variant="caption" style={{ color: colors.text.secondary, textAlign: 'center' }}>
            🎧  {PRACTICE_IS_FREE_ONE_LINER}
          </Typography>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  cards: {
    gap: spacing.lg,
  },
  typeCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    borderTopLeftRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xl,
  },
  typeCardBody: {
    flex: 1,
    padding: spacing.lg,
  },
  typeCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  creditsBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  ctaRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
  },
  freeNote: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
});
