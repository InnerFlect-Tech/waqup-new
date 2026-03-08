import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, QCoin } from '@/components';
import { useAuthStore } from '@/stores/authStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.xl * 2 - spacing.md) / 2;

const QUICK_ACTIONS = [
  {
    label: 'Affirmation',
    icon: '✨',
    color: '#c084fc',
    description: 'Re-pattern beliefs',
    contentType: 'affirmation' as const,
  },
  {
    label: 'Meditation',
    icon: '🧘',
    color: '#60a5fa',
    description: 'Induce calm states',
    contentType: 'meditation' as const,
  },
  {
    label: 'Ritual',
    icon: '🔮',
    color: '#34d399',
    description: 'Encode identity',
    contentType: 'ritual' as const,
  },
];

const STATS = [
  { label: 'Day Streak', value: '0', icon: '🔥' },
  { label: 'Sessions', value: '0', icon: '🎧' },
  { label: 'Created', value: '0', icon: '✨' },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { user } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'there';

  const handleCreatePress = (contentType: 'affirmation' | 'meditation' | 'ritual') => {
    navigation.navigate('CreateMode', { contentType });
  };

  return (
    <Screen scrollable padding={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>
              Welcome back,
            </Typography>
            <Typography
              variant="h1"
              style={{ color: colors.text.primary, fontWeight: '300', letterSpacing: -1 }}
            >
              {displayName}
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
              Your sanctuary awaits
            </Typography>
          </View>
          <View style={[styles.creditsChip, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <QCoin size="sm" />
            <Typography variant="captionBold" style={{ color: colors.text.primary, marginLeft: spacing.xs }}>
              0
            </Typography>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {STATS.map((stat) => (
            <Card
              key={stat.label}
              variant="default"
              style={[styles.statCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}
            >
              <Typography variant="h3" style={{ fontSize: 22 }}>{stat.icon}</Typography>
              <Typography variant="h4" style={{ color: colors.text.primary, marginTop: spacing.xs }}>
                {stat.value}
              </Typography>
              <Typography variant="small" style={{ color: colors.text.secondary }}>
                {stat.label}
              </Typography>
            </Card>
          ))}
        </View>

        {/* Create section */}
        <View style={styles.section}>
          <Typography
            variant="small"
            style={styles.sectionLabel}
          >
            CREATE NEW
          </Typography>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={() => handleCreatePress(action.contentType)}
                activeOpacity={0.8}
                style={{ width: CARD_WIDTH }}
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
                  <View style={[styles.actionIcon, { backgroundColor: action.color + '22' }]}>
                    <Typography variant="h2" style={{ fontSize: 28 }}>
                      {action.icon}
                    </Typography>
                  </View>
                  <Typography variant="captionBold" style={{ color: colors.text.primary, marginTop: spacing.sm }}>
                    {action.label}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, marginTop: 2 }}>
                    {action.description}
                  </Typography>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent activity */}
        <View style={styles.section}>
          <Typography variant="small" style={styles.sectionLabel}>
            RECENT ACTIVITY
          </Typography>
          <Card
            variant="default"
            style={[
              styles.emptyCard,
              { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border },
            ]}
          >
            <Typography variant="h2" style={{ fontSize: 40, marginBottom: spacing.md }}>
              🌱
            </Typography>
            <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs, textAlign: 'center' }}>
              Start Your Journey
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center', lineHeight: 22 }}>
              Create your first practice to see your activity here
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
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  creditsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionLabel: {
    color: '#ffffff55',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    padding: spacing.xxl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
  },
});
