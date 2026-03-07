'use client';

import React, { memo } from 'react';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import type { Theme } from '@waqup/shared/theme';
import { Typography } from './Typography';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'outline' | 'accent';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

function getTextVariant(variant: BadgeProps['variant']): 'primary' | 'secondary' | 'muted' | 'accent' | 'error' | 'success' | 'warning' {
  switch (variant) {
    case 'error': return 'error';
    case 'success': return 'success';
    case 'warning': return 'warning';
    default: return 'primary';
  }
}

export const Badge: React.FC<BadgeProps> = memo(({
  variant = 'default',
  size = 'md',
  children,
  style,
  className,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const badgeStyle: React.CSSProperties = {
    borderRadius: borderRadius.full,
    paddingLeft: size === 'sm' ? spacing.xs : spacing.sm,
    paddingRight: size === 'sm' ? spacing.xs : spacing.sm,
    paddingTop: size === 'sm' ? '2px' : spacing.xs,
    paddingBottom: size === 'sm' ? '2px' : spacing.xs,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    ...getVariantStyles(variant, colors),
    ...style,
  };

  return (
    <div style={badgeStyle} className={className} role="status" aria-label={typeof children === 'string' ? children : undefined}>
      <Typography variant="small" color={getTextVariant(variant)} style={variant === 'accent' ? { color: '#c084fc' } : undefined}>
        {children}
      </Typography>
    </div>
  );
});
Badge.displayName = 'Badge';

function getVariantStyles(variant: BadgeProps['variant'], colors: Theme['colors']): React.CSSProperties {
  switch (variant) {
    case 'default':
      return { backgroundColor: `${colors.accent.primary}33`, border: `1px solid ${colors.accent.primary}40` };
    case 'accent':
      return {
        backgroundColor: `${colors.accent.tertiary}33`,
        border: `1px solid ${colors.accent.tertiary}40`,
      };
    case 'success':
      return { backgroundColor: `${colors.success}26`, border: `1px solid ${colors.success}40` };
    case 'error':
      return { backgroundColor: `${colors.error}26`, border: `1px solid ${colors.error}40` };
    case 'warning':
      return { backgroundColor: `${colors.warning}26`, border: `1px solid ${colors.warning}40` };
    case 'info':
      return { backgroundColor: `${colors.info}26`, border: `1px solid ${colors.info}40` };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        border: `1px solid ${colors.accent.primary}40`,
      };
    default:
      return {};
  }
}
