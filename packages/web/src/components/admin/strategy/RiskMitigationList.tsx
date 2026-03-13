'use client';

import React from 'react';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import type { RiskItem } from '@/lib/admin/company-strategy-data';

export function RiskMitigationList({ items }: { items: RiskItem[] }) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      {items.map((item) => (
        <div
          key={item.id}
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
          <Typography variant="bodyBold" style={{ color: colors.text.primary }}>
            {item.risk}
          </Typography>
          <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.4 }}>
            <strong>Mitigation:</strong> {item.mitigation}
          </Typography>
        </div>
      ))}
    </div>
  );
}
