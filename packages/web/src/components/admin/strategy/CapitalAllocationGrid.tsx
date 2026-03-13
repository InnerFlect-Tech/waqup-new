'use client';

import React from 'react';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import type { CapitalAllocationBucket } from '@/lib/admin/company-strategy-data';

export function CapitalAllocationGrid({ buckets }: { buckets: CapitalAllocationBucket[] }) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: spacing.md,
      }}
    >
      {buckets.map((bucket) => (
        <div
          key={bucket.id}
          style={{
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            background: colors.glass.light,
            border: `1px solid ${colors.glass.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
          }}
        >
          <Typography variant="h4" style={{ color: colors.text.primary }}>
            {bucket.label}
          </Typography>
          <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.4 }}>
            {bucket.description}
          </Typography>
        </div>
      ))}
    </div>
  );
}
