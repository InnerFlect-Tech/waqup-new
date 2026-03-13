'use client';

import React from 'react';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import type { CheckpointItem } from '@/lib/admin/company-strategy-data';

export function StrategicCheckpointList({ items }: { items: CheckpointItem[] }) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: spacing.md,
            padding: spacing.md,
            borderRadius: borderRadius.md,
            background: colors.glass.light,
            border: `1px solid ${colors.glass.border}`,
          }}
        >
          <span
            style={{
              width: 20,
              height: 20,
              minWidth: 20,
              borderRadius: borderRadius.sm,
              background: `${colors.success}20`,
              border: `1px solid ${colors.success}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              color: colors.success,
              fontWeight: 600,
            }}
          >
            ✓
          </span>
          <Typography variant="body" style={{ color: colors.text.primary, lineHeight: 1.5, flex: 1 }}>
            {item.label}
          </Typography>
        </div>
      ))}
    </div>
  );
}
