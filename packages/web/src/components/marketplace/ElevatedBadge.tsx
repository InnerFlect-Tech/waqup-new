'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { borderRadius, spacing } from '@/theme';
import { ELEVATED_BADGE_COLOR } from '@waqup/shared/constants';

interface ElevatedBadgeProps {
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

/**
 * Elevated badge — shown on marketplace cards and detail pages
 * for platform-curated content. Not paid placement — purely quality curation.
 */
export function ElevatedBadge({ size = 'sm', style }: ElevatedBadgeProps) {
  const isSm = size === 'sm';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSm ? 3 : 4,
        padding: isSm ? `2px ${spacing.xs}` : `${spacing.xs} ${spacing.sm}`,
        borderRadius: borderRadius.full,
        background: `linear-gradient(135deg, ${ELEVATED_BADGE_COLOR}22, ${ELEVATED_BADGE_COLOR}22)`,
        border: `1px solid ${ELEVATED_BADGE_COLOR}55`,
        boxShadow: `0 0 12px ${ELEVATED_BADGE_COLOR}18`,
        ...style,
      }}
    >
      <Sparkles
        size={isSm ? 10 : 13}
        color={ELEVATED_BADGE_COLOR}
        style={{ flexShrink: 0 }}
      />
      <span
        style={{
          fontSize: isSm ? 10 : 12,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: ELEVATED_BADGE_COLOR,
          lineHeight: 1,
        }}
      >
        Elevated
      </span>
    </div>
  );
}
