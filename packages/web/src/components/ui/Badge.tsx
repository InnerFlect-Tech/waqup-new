import React, { memo } from 'react';
import { colors, spacing, borderRadius } from '@/theme';
import { Typography } from './Typography';
import { getTextColor } from '@waqup/shared/utils';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = memo(({
  variant = 'default',
  size = 'md',
  children,
  style,
  className,
}) => {
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
    ...getVariantStyles(variant),
    ...style,
  };

  const textColor = getTextColor(variant);

  return (
    <div style={badgeStyle} className={className} role="status" aria-label={typeof children === 'string' ? children : undefined}>
      <Typography variant="small" color={textColor}>
        {children}
      </Typography>
    </div>
  );
});

function getVariantStyles(variant: string): React.CSSProperties {
  switch (variant) {
    case 'default':
      return { backgroundColor: colors.accent.primary };
    case 'success':
      return { backgroundColor: colors.success };
    case 'error':
      return { backgroundColor: colors.error };
    case 'warning':
      return { backgroundColor: colors.warning };
    case 'info':
      return { backgroundColor: colors.info };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        border: `1px solid ${colors.accent.primary}`,
      };
    default:
      return {};
  }
}

