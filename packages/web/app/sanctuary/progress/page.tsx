'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import { Zap, Clock, BookOpen, Flame } from 'lucide-react';

const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function generateHeatmap(weeks = 12) {
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const rand = Math.random();
      if (rand < 0.3) return 0;
      if (rand < 0.55) return 1;
      if (rand < 0.75) return 2;
      if (rand < 0.9) return 3;
      return 4;
    })
  );
}

const HEATMAP_DATA = generateHeatmap(12);

const STATS = [
  { label: 'Day Streak', value: '—', icon: Flame, color: '#f97316' },
  { label: 'Total Sessions', value: '—', icon: Zap, color: '#c084fc' },
  { label: 'Minutes Practiced', value: '—', icon: Clock, color: '#60a5fa' },
  { label: 'Content Created', value: '—', icon: BookOpen, color: '#34d399' },
];

export default function ProgressPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  function intensityColor(level: number): string {
    const alpha = [0.08, 0.25, 0.5, 0.75, 1][level];
    return `${colors.accent.primary}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
  }

  return (
    <PageShell intensity="medium">
      <PageContent>
        <Link href="/sanctuary" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: spacing.xl }}>
          <Typography variant="small" style={{ color: colors.text.secondary }}>
            ← Sanctuary
          </Typography>
        </Link>

        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
          Progress
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xxl }}>
          Track your transformation journey. Consistency compounds.
        </Typography>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: spacing.md,
            marginBottom: spacing.xxl,
          }}
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.xl,
                background: colors.glass.light,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${colors.glass.border}`,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: borderRadius.md,
                  background: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  marginBottom: spacing.md,
                }}
              >
                <stat.icon size={22} color={stat.color} strokeWidth={2} />
              </div>
              <Typography variant="h2" style={{ color: colors.text.primary, margin: 0, fontWeight: 300 }}>
                {stat.value}
              </Typography>
              <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                {stat.label}
              </Typography>
            </motion.div>
          ))}
        </div>

        {/* Practice heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${colors.glass.border}`,
            marginBottom: spacing.xxl,
          }}
        >
          <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.lg }}>
            Practice activity
          </Typography>

          {/* Day labels */}
          <div style={{ display: 'flex', gap: spacing.xs, marginBottom: spacing.sm, paddingLeft: 0 }}>
            {WEEK_LABELS.map((day, i) => (
              <div
                key={i}
                style={{
                  width: 14,
                  fontSize: 10,
                  color: colors.text.secondary,
                  textAlign: 'center',
                  opacity: 0.6,
                  marginRight: spacing.xs,
                }}
              >
                {i % 2 === 0 ? day : ''}
              </div>
            ))}
          </div>

          {/* Grid: weeks × days, transposed */}
          <div style={{ display: 'flex', gap: spacing.xs }}>
            {HEATMAP_DATA.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                {week.map((level, di) => (
                  <div
                    key={di}
                    title={`${level > 0 ? `${level * 10} min` : 'No practice'}`}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      background: intensityColor(level),
                      cursor: 'default',
                      transition: 'transform 0.1s',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md }}>
            <Typography variant="small" style={{ color: colors.text.secondary }}>
              Less
            </Typography>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                style={{ width: 12, height: 12, borderRadius: 3, background: intensityColor(level) }}
              />
            ))}
            <Typography variant="small" style={{ color: colors.text.secondary }}>
              More
            </Typography>
          </div>
        </motion.div>

        {/* Empty state nudge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: `${colors.accent.primary}10`,
            border: `1px solid ${colors.accent.primary}20`,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
            Start your practice streak
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg, fontSize: 14 }}>
            Data will fill in as you listen to your affirmations, meditations, and rituals.
          </Typography>
          <Link href="/library" style={{ textDecoration: 'none' }}>
            <Typography variant="body" style={{ color: colors.accent.primary, fontWeight: 600, fontSize: 14 }}>
              Go to Library →
            </Typography>
          </Link>
        </motion.div>
      </PageContent>
    </PageShell>
  );
}
