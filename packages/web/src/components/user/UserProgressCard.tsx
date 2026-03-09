'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Clock, Star, Lock } from 'lucide-react';
import { Typography, Card, Badge } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import type { ProgressStats, PracticeLevel } from '@waqup/shared/types';
import {
  LEVEL_TAGLINES,
  LEVEL_THRESHOLDS,
  xpProgressPercent,
} from '@waqup/shared/types';
import { createProgressService } from '@waqup/shared/services';
import { supabase } from '@/lib/supabase';

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_COLORS: Record<PracticeLevel, string> = {
  seeker: '#60a5fa',
  practitioner: '#a78bfa',
  alchemist: '#f59e0b',
  master: '#10b981',
};

const LEVEL_GLOWS: Record<PracticeLevel, string> = {
  seeker: '#60a5fa33',
  practitioner: '#a78bfa33',
  alchemist: '#f59e0b33',
  master: '#10b98133',
};

const LEVEL_ICONS: Record<PracticeLevel, React.ReactNode> = {
  seeker: <Star size={14} />,
  practitioner: <Zap size={14} />,
  alchemist: <Flame size={14} />,
  master: <Flame size={14} />,
};

const NEXT_LEVEL_LABELS: Record<PracticeLevel, string | null> = {
  seeker: 'Practitioner',
  practitioner: 'Alchemist',
  alchemist: 'Master',
  master: null,
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface UserProgressCardProps {
  /** When true, renders a compact single-row version for embedding in gates/overlays */
  mini?: boolean;
  /** Pre-loaded stats — skip fetching if provided */
  stats?: ProgressStats | null;
  style?: React.CSSProperties;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UserProgressCard({
  mini = false,
  stats: externalStats,
  style,
  className,
}: UserProgressCardProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [stats, setStats] = useState<ProgressStats | null>(externalStats ?? null);
  const [loading, setLoading] = useState(externalStats === undefined);

  useEffect(() => {
    if (externalStats !== undefined) return;

    const progressService = createProgressService(supabase);
    progressService.getProgressStats().then(({ data }) => {
      setStats(data);
      setLoading(false);
    });
  }, [externalStats]);

  if (loading) {
    return <ProgressSkeleton mini={mini} />;
  }

  // Fallback placeholder when stats aren't available yet
  const safeStats: ProgressStats = stats ?? {
    streak: 0,
    totalSessions: 0,
    minutesPracticed: 0,
    contentCreated: 0,
    totalXp: 0,
    affirmationXp: 0,
    meditationXp: 0,
    ritualXp: 0,
    level: 'seeker',
    xpToNext: LEVEL_THRESHOLDS.practitioner,
  };

  const level = safeStats.level;
  const levelColor = LEVEL_COLORS[level];
  const levelGlow = LEVEL_GLOWS[level];
  const pct = xpProgressPercent(safeStats.totalXp);
  const nextLevel = NEXT_LEVEL_LABELS[level];
  const tagline = LEVEL_TAGLINES[level];

  if (mini) {
    return (
      <MiniProgressCard
        stats={safeStats}
        level={level}
        levelColor={levelColor}
        levelGlow={levelGlow}
        pct={pct}
        nextLevel={nextLevel}
        style={style}
        className={className}
      />
    );
  }

  return (
    <Card style={{ padding: 0, overflow: 'hidden', ...style }} className={className}>
      {/* Level header band */}
      <div
        style={{
          background: `linear-gradient(135deg, ${levelColor}22, ${levelColor}08)`,
          borderBottom: `1px solid ${levelColor}30`,
          padding: `${spacing.md}px ${spacing.lg}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
        }}
      >
        {/* Level icon + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: borderRadius.full,
              background: `${levelColor}22`,
              border: `1.5px solid ${levelColor}55`,
              boxShadow: `0 0 16px ${levelGlow}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: levelColor,
              flexShrink: 0,
            }}
          >
            {LEVEL_ICONS[level]}
          </div>
          <div>
            <Typography variant="small" style={{ color: levelColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {level}
            </Typography>
            <Typography variant="small" color="secondary" style={{ marginTop: 2 }}>
              {tagline}
            </Typography>
          </div>
        </div>

        {/* XP badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            flexShrink: 0,
          }}
        >
          <Typography variant="h4" style={{ color: levelColor, fontWeight: 800 }}>
            {safeStats.totalXp}
          </Typography>
          <Typography variant="small" color="secondary">XP</Typography>
        </div>
      </div>

      {/* XP progress bar */}
      <div style={{ padding: `${spacing.sm}px ${spacing.lg}px`, borderBottom: `1px solid ${colors.border.light}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
          <Typography variant="small" color="secondary">
            {nextLevel ? `Progress to ${nextLevel}` : 'Maximum level reached'}
          </Typography>
          {nextLevel && (
            <Typography variant="small" color="secondary">
              {safeStats.xpToNext} XP to go
            </Typography>
          )}
        </div>
        <div
          style={{
            height: 6,
            borderRadius: borderRadius.full,
            background: colors.glass.light,
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(pct, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%',
              borderRadius: borderRadius.full,
              background: `linear-gradient(90deg, ${levelColor}aa, ${levelColor})`,
              boxShadow: `0 0 8px ${levelColor}66`,
            }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          padding: `${spacing.md}px ${spacing.lg}px`,
          gap: spacing.sm,
        }}
      >
        <StatItem icon={<Flame size={14} />} color="#f97316" value={safeStats.streak} label="day streak" />
        <StatItem icon={<Zap size={14} />} color="#a78bfa" value={safeStats.totalSessions} label="sessions" />
        <StatItem icon={<Clock size={14} />} color="#60a5fa" value={safeStats.minutesPracticed} label="minutes" />
      </div>
    </Card>
  );
}

// ─── Mini variant ─────────────────────────────────────────────────────────────

interface MiniProgressCardProps {
  stats: ProgressStats;
  level: PracticeLevel;
  levelColor: string;
  levelGlow: string;
  pct: number;
  nextLevel: string | null;
  style?: React.CSSProperties;
  className?: string;
}

function MiniProgressCard({
  stats,
  level,
  levelColor,
  levelGlow,
  pct,
  nextLevel,
  style,
  className,
}: MiniProgressCardProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <div
      style={{
        borderRadius: borderRadius.lg,
        background: colors.glass.light,
        backdropFilter: BLUR.md,
        WebkitBackdropFilter: BLUR.md,
        border: `1px solid ${levelColor}30`,
        padding: `${spacing.sm}px ${spacing.md}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xs,
        ...style,
      }}
      className={className}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <div
            style={{
              color: levelColor,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {LEVEL_ICONS[level]}
          </div>
          <Typography variant="small" style={{ color: levelColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {level}
          </Typography>
        </div>
        <Typography variant="small" style={{ color: levelColor, fontWeight: 700 }}>
          {stats.totalXp} XP
        </Typography>
      </div>
      <div
        style={{
          height: 4,
          borderRadius: borderRadius.full,
          background: colors.glass.light,
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%',
            borderRadius: borderRadius.full,
            background: `linear-gradient(90deg, ${levelColor}aa, ${levelColor})`,
          }}
        />
      </div>
      {nextLevel && (
        <Typography variant="small" color="secondary" style={{ fontSize: 11 }}>
          {stats.xpToNext} XP until {nextLevel}
        </Typography>
      )}
    </div>
  );
}

// ─── Stat item ────────────────────────────────────────────────────────────────

function StatItem({
  icon,
  color,
  value,
  label,
}: {
  icon: React.ReactNode;
  color: string;
  value: number;
  label: string;
}) {
  const { theme } = useTheme();
  const colors = theme.colors;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{ color, display: 'flex', alignItems: 'center', marginBottom: 2 }}>{icon}</div>
      <Typography variant="bodyBold" style={{ color: colors.text.primary, fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography variant="small" color="secondary">
        {label}
      </Typography>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ProgressSkeleton({ mini }: { mini: boolean }) {
  const { theme } = useTheme();
  const colors = theme.colors;

  if (mini) {
    return (
      <div
        style={{
          borderRadius: borderRadius.lg,
          background: colors.glass.light,
          height: 60,
          animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        }}
      />
    );
  }

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ height: 72, background: colors.glass.light, animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }} />
      <div style={{ height: 44, borderTop: `1px solid ${colors.border.light}`, background: colors.glass.transparent }} />
      <div style={{ height: 80, borderTop: `1px solid ${colors.border.light}` }} />
    </Card>
  );
}
