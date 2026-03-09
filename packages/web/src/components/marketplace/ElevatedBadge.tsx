'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { borderRadius, spacing } from '@/theme';
import { useTheme } from '@/theme';

interface ElevatedBadgeProps {
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

/**
 * Elevated badge — shown on marketplace cards and detail pages
 * for platform-curated content. Not paid placement — purely quality curation.
 */
export function ElevatedBadge({ size = 'sm', style }: ElevatedBadgeProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const isSm = size === 'sm';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSm ? 3 : 4,
        padding: isSm ? `2px ${spacing.xs}` : `${spacing.xs} ${spacing.sm}`,
        borderRadius: borderRadius.full,
        background: 'linear-gradient(135deg, #f59e0b22, #f97316 22)',
        border: '1px solid #f59e0b55',
        boxShadow: '0 0 12px #f59e0b18',
        ...style,
      }}
    >
      <Sparkles
        size={isSm ? 10 : 13}
        color="#f59e0b"
        style={{ flexShrink: 0 }}
      />
      <span
        style={{
          fontSize: isSm ? 10 : 12,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#f59e0b',
          lineHeight: 1,
        }}
      >
        Elevated
      </span>
    </div>
  );
}
