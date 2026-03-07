import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card } from '@/components';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

const QUICK_ACTIONS = [
  { label: 'New Affirmation', icon: '✨', tab: 'Create' as const },
  { label: 'New Meditation', icon: '🧘', tab: 'Create' as const },
  { label: 'New Ritual', icon: '🔮', tab: 'Create' as const },
  { label: 'My Library', icon: '📚', tab: 'Library' as const },
];

export default function HomeScreen({ navigation }: Props) {
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
            Your Sanctuary
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
            Transform your mind, one practice at a time
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography
            variant="h4"
            style={{ color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 }}
          >
            Quick Actions
          </Typography>
          <View style={styles.grid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={() => navigation.navigate(action.tab)}
                activeOpacity={0.8}
                style={styles.gridItem}
              >
                <Card
                  variant="elevated"
                  style={[
                    styles.actionCard,
                    {
                      backgroundColor: colors.glass.opaque,
                      borderColor: colors.glass.border,
                    },
                  ]}
                >
                  <Typography variant="h2" style={{ fontSize: 32, marginBottom: spacing.sm }}>
                    {action.icon}
                  </Typography>
                  <Typography variant="captionBold" style={{ color: colors.text.primary, textAlign: 'center' }}>
                    {action.label}
                  </Typography>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Typography
            variant="h4"
            style={{ color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 }}
          >
            Recent Activity
          </Typography>
          <Card
            variant="default"
            style={{
              padding: spacing.xl,
              backgroundColor: colors.glass.opaque,
              borderColor: colors.glass.border,
              alignItems: 'center',
            }}
          >
            <Typography variant="h2" style={{ fontSize: 32, marginBottom: spacing.sm }}>
              🌱
            </Typography>
            <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
              Start Your Journey
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center' }}>
              Create your first affirmation, meditation, or ritual to begin transforming your mind
            </Typography>
          </Card>
    </View>
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
  section: {
    marginBottom: spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: {
    width: '47%',
  },
  actionCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
});
