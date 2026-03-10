import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, QCoin } from '@/components';
import { CONTENT_CREDIT_COSTS, CONTENT_TYPE_COLORS, PRACTICE_IS_FREE_ONE_LINER } from '@waqup/shared/constants';

type Props = NativeStackScreenProps<MainStackParamList, 'CreateMode'>;

type CreationMode = 'form' | 'chat' | 'agent';

interface ModeConfig {
  id: CreationMode;
  title: string;
  icon: string;
  color: string;
  description: string;
  creditCost: string;
  tag: string;
}

const TYPE_ICONS: Record<string, string> = {
  affirmation: '✨',
  meditation: '🧘',
  ritual: '🔮',
};

const TYPE_LABELS: Record<string, string> = {
  affirmation: 'Affirmation',
  meditation: 'Meditation',
  ritual: 'Ritual',
};

export default function CreateModeScreen({ navigation, route }: Props) {
  const { contentType } = route.params;
  const { theme } = useTheme();
  const colors = theme.colors;

  const costs = CONTENT_CREDIT_COSTS[contentType];

  const MODES: ModeConfig[] = [
    {
      id: 'form',
      title: 'Quick Form',
      icon: '📝',
      color: colors.text.tertiary,
      description:
        'Fill in structured fields to craft your practice. Full control, zero AI cost.',
      creditCost: `${costs.base} Q`,
      tag: 'Free',
    },
    {
      id: 'chat',
      title: 'Guided Chat',
      icon: '💬',
      color: CONTENT_TYPE_COLORS.meditation,
      description:
        'Have a conversation with AI to shape your practice. GPT-4o-mini guides you step by step.',
      creditCost: `${costs.withAi} Qs`,
      tag: 'GPT-4o-mini',
    },
    {
      id: 'agent',
      title: 'AI Agent',
      icon: '🤖',
      color: CONTENT_TYPE_COLORS.affirmation,
      description:
        'Let an autonomous AI agent draft your entire practice from a single goal statement. GPT-4o quality.',
      creditCost: `${costs.withAi + Math.ceil(costs.withAi * 0.5)} Qs`,
      tag: 'GPT-4o',
    },
  ];

  const handleModeSelect = (mode: CreationMode) => {
    navigation.navigate('ContentCreate', { contentType, mode });
  };

  return (
    <Screen scrollable padding={false}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Typography variant="body" style={{ color: colors.accent.primary }}>
            ← Back
          </Typography>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h2" style={{ fontSize: 32 }}>
            {TYPE_ICONS[contentType]}
          </Typography>
          <Typography
            variant="h1"
            style={{ color: colors.text.primary, fontWeight: '300', letterSpacing: -1, marginTop: spacing.sm }}
          >
            New {TYPE_LABELS[contentType]}
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
            Choose how you'd like to create it
          </Typography>
        </View>

        {/* Mode cards */}
        <View style={styles.modesContainer}>
          {MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              onPress={() => handleModeSelect(mode.id)}
              activeOpacity={0.8}
            >
              <Card
                variant="elevated"
                style={[
                  styles.modeCard,
                  { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border },
                ]}
              >
                {/* Tag badge */}
                <View
                  style={[
                    styles.tagBadge,
                    { backgroundColor: mode.color + '22', borderColor: mode.color + '44' },
                  ]}
                >
                  <Typography variant="small" style={{ color: mode.color, fontWeight: '600' }}>
                    {mode.tag}
                  </Typography>
                </View>

                {/* Icon + title */}
                <View style={styles.modeHeader}>
                  <View style={[styles.modeIcon, { backgroundColor: mode.color + '22' }]}>
                    <Typography variant="h2" style={{ fontSize: 28 }}>
                      {mode.icon}
                    </Typography>
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Typography variant="h4" style={{ color: colors.text.primary }}>
                      {mode.title}
                    </Typography>
                    <View style={styles.costRow}>
                      <QCoin size="sm" />
                      <Typography variant="captionBold" style={{ color: colors.text.secondary, marginLeft: spacing.xs }}>
                        {mode.creditCost}
                      </Typography>
                    </View>
                  </View>
                  <Typography variant="body" style={{ color: mode.color }}>
                    →
                  </Typography>
                </View>

                {/* Description */}
                <Typography
                  variant="body"
                  style={{ color: colors.text.secondary, marginTop: spacing.md, lineHeight: 22 }}
                >
                  {mode.description}
                </Typography>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note */}
        <View
          style={[
            styles.note,
            { backgroundColor: colors.glass.transparent, borderColor: colors.glass.border },
          ]}
        >
          <Typography variant="caption" style={{ color: colors.text.secondary, textAlign: 'center' }}>
            {PRACTICE_IS_FREE_ONE_LINER}
          </Typography>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  navBar: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingTop: 0,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  modesContainer: {
    gap: spacing.lg,
  },
  modeCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  note: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
});
