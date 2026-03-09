import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card } from '@/components';
import { supabase } from '@/services/supabase';

type Props = NativeStackScreenProps<MainStackParamList, 'Progress'>;

async function fetchProgress() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: sessions } = await supabase
    .from('practice_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: items } = await supabase
    .from('content_items')
    .select('id, type, title, last_played_at')
    .eq('user_id', user.id)
    .not('last_played_at', 'is', null)
    .order('last_played_at', { ascending: false })
    .limit(5);

  const totalSessions = sessions?.length ?? 0;
  const totalMinutes = Math.round((sessions ?? []).reduce((s, r) => s + (r.duration_seconds ?? 0), 0) / 60);

  // Calculate streak
  const today = new Date().toDateString();
  const sessionDays = new Set((sessions ?? []).map(s => new Date(s.created_at).toDateString()));
  let streak = 0;
  const d = new Date();
  while (sessionDays.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  return { totalSessions, totalMinutes, streak, recentItems: items ?? [] };
}

const TYPE_COLORS: Record<string, string> = {
  affirmation: '#c084fc',
  meditation: '#60a5fa',
  ritual: '#f59e0b',
};

export default function ProgressScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { data, isLoading } = useQuery({ queryKey: ['progress'], queryFn: fetchProgress });

  const stats = [
    { label: 'Day Streak', value: data?.streak ?? 0, emoji: '🔥', color: '#f97316' },
    { label: 'Total Sessions', value: data?.totalSessions ?? 0, emoji: '🧘', color: '#c084fc' },
    { label: 'Minutes Practiced', value: data?.totalMinutes ?? 0, emoji: '⏱️', color: '#60a5fa' },
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
          <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xxl }}>
            Loading…
          </Typography>
        ) : (
          <>
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
                      <View style={[styles.typeDot, { backgroundColor: TYPE_COLORS[item.type] ?? colors.accent.primary }]} />
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
