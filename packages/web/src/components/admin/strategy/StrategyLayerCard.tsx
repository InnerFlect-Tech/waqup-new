'use client';

import React from 'react';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import type { StrategyLayer } from '@/lib/admin/company-strategy-data';

export function StrategyLayerCard({ layer }: { layer: StrategyLayer }) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <div
      style={{
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        background: colors.glass.light,
        border: `1px solid ${colors.glass.border}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing.md,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          minWidth: 36,
          borderRadius: borderRadius.md,
          background: `${colors.accent.primary}20`,
          border: `1px solid ${colors.accent.primary}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 600,
          color: colors.accent.primary,
        }}
      >
        {layer.number}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
          {layer.title}
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.5 }}>
          {layer.description}
        </Typography>
      </div>
    </div>
  );
}
