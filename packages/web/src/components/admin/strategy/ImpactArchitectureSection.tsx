'use client';

import React from 'react';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import type { AccessArchitectureItem } from '@/lib/admin/company-strategy-data';

export function ImpactArchitectureSection({ items }: { items: AccessArchitectureItem[] }) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
      }}
    >
      {items.map((item) => (
        <li
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: spacing.md,
            padding: spacing.md,
            borderRadius: borderRadius.md,
            background: item.id === '5' ? `${colors.accent.primary}10` : 'transparent',
            border: item.id === '5' ? `1px solid ${colors.accent.primary}25` : 'none',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              minWidth: 6,
              marginTop: 8,
              borderRadius: '50%',
              background: colors.accent.primary,
            }}
          />
          <div style={{ flex: 1 }}>
            <Typography variant="bodyBold" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
              {item.title}
            </Typography>
            <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.5 }}>
              {item.description}
            </Typography>
          </div>
        </li>
      ))}
    </ul>
  );
}
