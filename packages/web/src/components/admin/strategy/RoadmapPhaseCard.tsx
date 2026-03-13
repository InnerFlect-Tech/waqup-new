'use client';

import React from 'react';
import { Typography, Badge } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import type { RoadmapPhase } from '@/lib/admin/company-strategy-data';

export function RoadmapPhaseCard({ phase }: { phase: RoadmapPhase }) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const isCurrentPhase = phase.phase === 1;

  return (
    <div
      style={{
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        background: colors.glass.light,
        border: `1px solid ${colors.glass.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm }}>
        <Typography variant="h4" style={{ color: colors.text.primary }}>
          Phase {phase.phase} — {phase.title}
        </Typography>
        {isCurrentPhase && (
          <Badge variant="accent" size="sm">
            Current
          </Badge>
        )}
      </div>
      <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.5 }}>
        {phase.objective}
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <Typography variant="smallBold" style={{ color: colors.text.primary }}>What must be built</Typography>
        <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.4 }}>
          {phase.builds.join(', ')}
        </Typography>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <Typography variant="smallBold" style={{ color: colors.text.primary }}>Monetization move</Typography>
        <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.4 }}>
          {phase.monetizationMove}
        </Typography>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <Typography variant="smallBold" style={{ color: colors.text.primary }}>Distribution move</Typography>
        <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.4 }}>
          {phase.distributionMove}
        </Typography>
      </div>
      <div
        style={{
          padding: spacing.sm,
          borderRadius: borderRadius.sm,
          background: `${colors.accent.primary}10`,
          border: `1px solid ${colors.accent.primary}30`,
        }}
      >
        <Typography variant="smallBold" style={{ color: colors.accent.primary }}>Gate condition</Typography>
        <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.4 }}>
          {phase.gateCondition}
        </Typography>
      </div>
      <div
        style={{
          padding: spacing.sm,
          borderRadius: borderRadius.sm,
          background: `${colors.warning}15`,
          border: `1px solid ${colors.warning}30`,
        }}
      >
        <Typography variant="smallBold" style={{ color: colors.warning }}>Major risk</Typography>
        <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.4 }}>
          {phase.majorRisk}
        </Typography>
      </div>
    </div>
  );
}
