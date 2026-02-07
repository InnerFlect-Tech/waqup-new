'use client';

import React, { useCallback, useMemo } from 'react';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { Typography } from './Typography';
import { Loading } from './Loading';
import { getTextColor, getTextVariant } from '@waqup/shared/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const buttonStyle: React.CSSProperties = useMemo(
    () => ({
      ...getBaseStyles(),
      ...getSizeStyles(size),
      ...getVariantStyles(variant, colors),
      ...(fullWidth && { width: '100%' }),
      ...(disabled || loading ? { opacity: 0.6, cursor: 'not-allowed' } : { cursor: 'pointer' }),
      transition: 'all 0.2s ease-in-out',
      ...style,
    }),
    [size, variant, fullWidth, disabled, loading, style, colors]
  );

  const textColor = useMemo(() => {
    // For primary buttons, use inverse text for better contrast
    if (variant === 'primary') {
      return colors.text.onDark;
    }
    return getTextColor(variant) === 'inverse' ? colors.text.onDark : colors.text.primary;
  }, [variant, colors]);

  const textVariant = useMemo(() => getTextVariant(size), [size]);

  return (
    <button
      style={buttonStyle}
      disabled={disabled || loading}
      className={className}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      aria-label={typeof children === 'string' ? children : undefined}
      onMouseEnter={(e) => {
        if (variant === 'primary' && !disabled && !loading) {
          e.currentTarget.style.background = colors.gradients.primaryHover;
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary' && !disabled && !loading) {
          e.currentTarget.style.background = colors.gradients.primary;
        }
      }}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loading variant="spinner" size="sm" color={variant === 'primary' ? 'white' : 'primary'} />
        </span>
      ) : (
        <Typography variant={textVariant} style={{ color: textColor, textAlign: 'center' }}>
          {children}
        </Typography>
      )}
    </button>
  );
};

function getBaseStyles(): React.CSSProperties {
  return {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    border: 'none',
    outline: 'none',
    fontFamily: 'inherit',
  };
}

function getSizeStyles(size: string): React.CSSProperties {
  switch (size) {
    case 'sm':
      return {
        paddingLeft: spacing.md,
        paddingRight: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.sm,
        minHeight: '32px',
      };
    case 'lg':
      return {
        paddingLeft: spacing.xl,
        paddingRight: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.lg,
        minHeight: '52px',
      };
    default:
      return {
        paddingLeft: spacing.lg,
        paddingRight: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
        minHeight: '44px',
      };
  }
}

function getVariantStyles(variant: string, colors: any): React.CSSProperties {
  switch (variant) {
    case 'primary':
      return {
        background: colors.gradients.primary, // from-purple-600 to-indigo-600
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: `0 4px 12px ${colors.mystical.glow}60`,
        // Hover state handled via CSS or inline styles
      };
    case 'secondary':
      return {
        backgroundColor: colors.glass.light,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${colors.glass.border}`,
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        border: `1px solid ${colors.accent.primary}`,
        color: colors.text.primary,
      };
    case 'text':
      return {
        backgroundColor: 'transparent',
        color: colors.text.primary,
      };
    case 'ghost':
      return {
        backgroundColor: colors.glass.transparent,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${colors.glass.border}`,
        color: colors.text.primary,
      };
    default:
      return {};
  }
}
