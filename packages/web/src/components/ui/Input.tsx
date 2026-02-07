'use client';

import React, { useState } from 'react';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { Typography } from './Typography';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: React.CSSProperties;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  className,
  onFocus,
  onBlur,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [focused, setFocused] = useState(false);

  const inputContainerStyle: React.CSSProperties = {
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border.light}`,
    backgroundColor: colors.glass.light,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: '44px',
    transition: 'all 0.2s ease-in-out',
    ...(focused && {
      borderColor: colors.accent.primary,
      borderWidth: '2px',
    }),
    ...(error && {
      borderColor: colors.error,
    }),
    ...containerStyle,
  };

  return (
    <div style={{ marginBottom: spacing.md }}>
      {label && (
        <Typography variant="captionBold" color="primary" style={{ marginBottom: spacing.sm }}>
          {label}
        </Typography>
      )}
      <div style={inputContainerStyle} className={className}>
        {leftIcon && <div style={{ paddingLeft: spacing.md, display: 'flex', alignItems: 'center' }}>{leftIcon}</div>}
        <input
          style={{
            flex: 1,
            paddingLeft: leftIcon ? spacing.sm : spacing.md,
            paddingRight: rightIcon ? spacing.sm : spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.sm,
            fontSize: 16,
            color: colors.text.primary,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            minHeight: '44px',
            fontFamily: 'inherit',
            ...style,
          }}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          aria-label={label}
          aria-describedby={error || helperText ? `${props.id || 'input'}-helper` : undefined}
          aria-invalid={!!error}
          {...props}
        />
        {rightIcon && <div style={{ paddingRight: spacing.md, display: 'flex', alignItems: 'center' }}>{rightIcon}</div>}
      </div>
      {error && (
        <Typography variant="small" style={{ marginTop: spacing.xs, color: colors.error }}>
          {error}
        </Typography>
      )}
      {helperText && !error && (
        <Typography variant="small" color="secondary" style={{ marginTop: spacing.xs }}>
          {helperText}
        </Typography>
      )}
    </div>
  );
};
