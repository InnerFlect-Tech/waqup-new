'use client';

import React from 'react';
import { useTheme } from '@/theme';
import { borderRadius } from '@/theme';
import { GLASS_CARD_STYLES, CARD_PADDING_AUTH, CARD_PADDING_CONTENT } from '@/theme';

export interface GlassCardProps {
  children: React.ReactNode;
  /** auth = xxxl padding, content = xl padding */
  variant?: 'auth' | 'content';
  style?: React.CSSProperties;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'content',
  style,
  className,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const padding = variant === 'auth' ? CARD_PADDING_AUTH : CARD_PADDING_CONTENT;
  const glowColor = colors.mystical?.glow ?? 'rgba(0,0,0,0.1)';

  return (
    <div
      className={className}
      style={{
        padding,
        borderRadius: GLASS_CARD_STYLES.borderRadius,
        background: colors.glass.opaque,
        backdropFilter: GLASS_CARD_STYLES.backdropFilter,
        WebkitBackdropFilter: GLASS_CARD_STYLES.WebkitBackdropFilter,
        border: `${GLASS_CARD_STYLES.borderBase} ${colors.glass.border}`,
        boxShadow: `0 16px 64px ${glowColor}40`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
