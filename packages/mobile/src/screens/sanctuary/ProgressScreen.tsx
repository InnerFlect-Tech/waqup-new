import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Loading } from '@/components';
import { supabase } from '@/services/supabase';
import { createProgressService } from '@waqup/shared/services';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';
import { withOpacity } from '@waqup/shared/theme';
import { LEVEL_COLORS } from '@waqup/shared/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Progress'>;

async function fetchProgress() {
  const progressService = createProgressService(supabase);
  const [statsResult, sessionsResult] = await Promise.all([
    progressService.getProgressStats(),
    progressService.getRecentSessions(5),
  ]);

  if (!statsResult.success || !statsResult.data) {
    return null;
  }

  const { totalSessions, minutesPracticed, streak, level, totalXp } = statsResult.data;
  const recentItems = (sessionsResult.data ?? []).map((s) => ({
    id: s.playedAt,
    type: s.contentType,
    title: s.title ?? 'Untitled',
  }));

  return {
    totalSessions,
    totalMinutes: minutesPracticed,
    streak,
    level,
    totalXp,
    recentItems,
  };
}

export default function ProgressScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { data, isLoading } = useQuery({ queryKey: ['progress'], queryFn: fetchProgress });

  const stats = [
    { label: 'Day Streak', value: data?.streak ?? 0, emoji: '🔥', color: colors.warning },
    { label: 'Total Sessions', value: data?.totalSessions ?? 0, emoji: '🧘', color: CONTENT_TYPE_COLORS.affirmation },
    { label: 'Minutes Practiced', value: data?.totalMinutes ?? 0, emoji: '⏱️', color: CONTENT_TYPE_COLORS.meditation },
  ];

  return (
    <Screen scrollable padding={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Typography variant="body" style={{ color: colors.accent.primary }}>← Back</Typography>
          </TouchableOpacity>
          <Typography variant="h2" style={{ color: colors.text.primary, fontWeight: '300', marginTop: spacing.lg }}>
            Progress
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
            Your practice journey
          </Typography>
        </View>

        {isLoading ? (
          <View style={{ alignItems: 'center', paddingTop: spacing.xxl, flex: 1 }}>
            <Loading variant="spinner" size="lg" />
          </View>
        ) : (
          <>
            {/* Level badge */}
            {data?.level && data?.totalXp != null && (
              <View style={[styles.levelCard, { backgroundColor: withOpacity(LEVEL_COLORS[data.level as keyof typeof LEVEL_COLORS] ?? colors.accent.primary, 0.09), borderColor: withOpacity(LEVEL_COLORS[data.level as keyof typeof LEVEL_COLORS] ?? colors.accent.primary, 0.25) }]}>
                <Typography variant="small" style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 2 }}>
                  Level
                </Typography>
                <Typography variant="h2" style={{ color: LEVEL_COLORS[data.level as keyof typeof LEVEL_COLORS] ?? colors.accent.primary, fontWeight: '700', textTransform: 'capitalize' }}>
                  {data.level}
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, marginTop: 2 }}>
                  {data.totalXp} XP
                </Typography>
              </View>
            )}

            {/* Stats grid */}
            <View style={styles.statsGrid}>
              {stats.map((stat) => (
                <Card key={stat.label} variant="default" style={[styles.statCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
                  <Typography style={{ fontSize: 28, marginBottom: spacing.sm }}>{stat.emoji}</Typography>
                  <Typography variant="h2" style={{ color: stat.color, fontWeight: '700', marginBottom: spacing.xs }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11 }}>
                    {stat.label}
                  </Typography>
                </Card>
              ))}
            </View>

            {/* Recent practice */}
            {(data?.recentItems ?? []).length > 0 && (
              <>
                <Typography variant="h3" style={{ color: colors.text.primary, marginTop: spacing.xl, marginBottom: spacing.md, fontWeight: '400' }}>
                  Recent Practice
                </Typography>
                <View style={{ gap: spacing.sm }}>
                  {data!.recentItems.map((item) => (
                    <Card key={item.id} variant="default" style={[styles.recentCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
                      <View style={[styles.typeDot, { backgroundColor: CONTENT_TYPE_COLORS[item.type as keyof typeof CONTENT_TYPE_COLORS] ?? colors.accent.primary }]} />
                      <View style={{ flex: 1 }}>
                        <Typography variant="captionBold" style={{ color: colors.text.primary }}>{item.title}</Typography>
                        <Typography variant="small" style={{ color: colors.text.secondary, marginTop: 2, textTransform: 'capitalize' }}>{item.type}</Typography>
                      </View>
                    </Card>
                  ))}
                </View>
              </>
            )}

            {data?.totalSessions === 0 && (
              <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
                <Typography style={{ fontSize: 48, marginBottom: spacing.md }}>🌱</Typography>
                <Typography variant="h3" style={{ color: colors.text.primary, fontWeight: '400', marginBottom: spacing.sm }}>
                  Your journey starts here
                </Typography>
                <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center', lineHeight: 22 }}>
                  Play your first piece of content to start tracking your practice.
                </Typography>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  levelCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
  },
  recentCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  typeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
