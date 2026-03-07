import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card } from '@/components';

type Props = BottomTabScreenProps<MainTabParamList, 'Create'>;

const CONTENT_TYPES = [
  {
    type: 'Affirmation',
    icon: '✨',
    description: 'Cognitive re-patterning for lasting belief change',
    depth: 'Shallow → Medium',
  },
  {
    type: 'Meditation',
    icon: '🧘',
    description: 'Guided state induction for deep relaxation',
    depth: 'Medium depth',
  },
  {
    type: 'Ritual',
    icon: '🔮',
    description: 'Identity encoding for transformational change',
    depth: 'Deepest',
  },
];

export default function CreateScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;

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
            Choose what you would like to create
          </Typography>
        </View>

        <View style={styles.cards}>
          {CONTENT_TYPES.map((ct) => (
            <TouchableOpacity key={ct.type} activeOpacity={0.8}>
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
                <View style={styles.typeCardContent}>
                  <Typography variant="h1" style={{ fontSize: 40 }}>
                    {ct.icon}
                  </Typography>
                  <View style={styles.typeCardText}>
                    <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                      {ct.type}
                    </Typography>
                    <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>
                      {ct.description}
                    </Typography>
                    <Typography variant="small" style={{ color: colors.accent.primary }}>
                      {ct.depth}
                    </Typography>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Card
          variant="default"
          style={{
            padding: spacing.lg,
            backgroundColor: colors.glass.transparent,
            borderColor: colors.glass.border,
            borderWidth: 1,
            borderRadius: borderRadius.lg,
            alignItems: 'center',
            marginTop: spacing.md,
          }}
        >
          <Typography variant="caption" style={{ color: colors.text.tertiary ?? colors.text.secondary, textAlign: 'center' }}>
            Full creation flow coming in the next update.{'\n'}All practices are free to replay.
          </Typography>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  cards: {
    gap: spacing.lg,
  },
  typeCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  typeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  typeCardText: {
    flex: 1,
  },
});
