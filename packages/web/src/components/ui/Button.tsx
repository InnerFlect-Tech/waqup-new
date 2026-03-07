'use client';

import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useTheme } from '@/theme';
import { Typography } from './Typography';
import { Loading } from './Loading';
import { getTextColor, getTextVariant } from '@waqup/shared/utils';
import { spacing } from '@/theme';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'border-0',
        secondary: 'border',
        outline: 'border',
        text: 'border-0',
        ghost: 'border',
      },
      size: {
        sm: 'min-h-[32px] px-4 py-2 text-sm',
        md: 'min-h-[44px] px-6 py-3 text-base',
        lg: 'min-h-[52px] px-8 py-4 text-base',
        icon: 'min-h-[40px] min-w-[40px] p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      className,
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const colors = theme.colors;

    const variantStyle = (): React.CSSProperties => {
      switch (variant) {
        case 'primary':
          return {
            background: colors.gradients.primary,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: `0 4px 12px ${colors.accent.primary}60`,
          };
        case 'secondary':
          return {
            background: colors.glass.light,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderColor: colors.glass.border,
          };
        case 'outline':
          return {
            borderColor: colors.accent.primary,
            color: colors.text.primary,
          };
        case 'text':
          return {
            color: colors.text.primary,
          };
        case 'ghost':
          return {
            background: colors.glass.transparent,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderColor: colors.glass.border,
            color: colors.text.primary,
          };
        default:
          return {};
      }
    };

    const textColor =
      variant === 'primary'
        ? colors.text.onDark
        : getTextColor(variant ?? 'primary') === 'inverse'
          ? colors.text.onDark
          : colors.text.primary;

    const textVariant = getTextVariant(size ?? 'md');

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (variant === 'primary' && !disabled && !loading) {
        e.currentTarget.style.background = colors.gradients.primaryHover;
      }
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (variant === 'primary' && !disabled && !loading) {
        e.currentTarget.style.background = colors.gradients.primary;
      }
      onMouseLeave?.(e);
    };

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          className
        )}
        style={{
          ...variantStyle(),
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          ...style,
        }}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        aria-label={typeof children === 'string' ? children : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center">
            <Loading
              variant="spinner"
              size="sm"
              color={variant === 'primary' ? 'white' : 'primary'}
            />
          </span>
        ) : (
          <Typography
            as="span"
            variant={textVariant}
            style={{
              color: textColor,
              textAlign: 'center',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              flexWrap: 'nowrap',
            }}
          >
            {children}
          </Typography>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
