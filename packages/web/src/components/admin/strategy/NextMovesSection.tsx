'use client';

import React from 'react';
import { Typography, Badge } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import type { CurrentPosition } from '@/lib/admin/company-strategy-data';

export function NextMovesSection({ data }: { data: CurrentPosition }) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
      <div
        style={{
          padding: spacing.lg,
          borderRadius: borderRadius.lg,
          background: `${colors.accent.primary}15`,
          border: `1px solid ${colors.accent.primary}30`,
        }}
      >
        <Typography variant="caption" style={{ color: colors.accent.primary, marginBottom: spacing.xs, display: 'block' }}>
          Current position
        </Typography>
        <Typography variant="bodyBold" style={{ color: colors.text.primary }}>
          Phase {data.phase}: {data.phaseTitle}
        </Typography>
        <Typography variant="small" style={{ color: colors.text.secondary, marginTop: spacing.xs, lineHeight: 1.5 }}>
          {data.summary}
        </Typography>
      </div>
      <div>
        <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
          Next 3–5 strategic moves
        </Typography>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
          }}
        >
          {data.nextMoves.map((move, i) => (
            <li
              key={move.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: spacing.md,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                background: move.priority === 'wait' ? `${colors.glass.light}80` : colors.glass.light,
                border: `1px solid ${colors.glass.border}`,
              }}
            >
              <Badge variant={move.priority === 'now' ? 'accent' : 'default'} size="sm">
                {move.priority}
              </Badge>
              <Typography
                variant="body"
                style={{
                  color: move.priority === 'wait' ? colors.text.tertiary : colors.text.primary,
                  lineHeight: 1.5,
                }}
              >
                {move.label}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
