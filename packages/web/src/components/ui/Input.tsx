'use client';

import React, { useState } from 'react';
import { spacing, borderRadius, BLUR } from '@/theme';
import { useTheme } from '@/theme';
import { Typography } from './Typography';

type BaseInputProps = {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: React.CSSProperties;
  /** Override wrapper styles (e.g. marginBottom: 0 for inline forms) */
  wrapperStyle?: React.CSSProperties;
  /** Render textarea instead of input */
  multiline?: boolean;
  rows?: number;
};

export type InputProps = BaseInputProps &
  (React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>);

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  wrapperStyle,
  style,
  className,
  multiline,
  rows = 3,
  onFocus,
  onBlur,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
      ? colors.accent.primary
      : colors.border.light;
  const borderWidth = focused ? 2 : 1;

  const inputContainerStyle: React.CSSProperties = {
    borderRadius: borderRadius.md,
    borderWidth: `${borderWidth}px`,
    borderStyle: 'solid',
    borderColor,
    backgroundColor: colors.glass.light,
    backdropFilter: BLUR.md,
    WebkitBackdropFilter: BLUR.md,
    display: 'flex',
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    minHeight: multiline ? undefined : '44px',
    transition: 'all 0.2s ease-in-out',
    ...containerStyle,
  };

  const baseInputStyle: React.CSSProperties = {
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
    fontFamily: 'inherit',
    ...(style as React.CSSProperties),
  };

  return (
    <div style={{ marginBottom: spacing.md, ...wrapperStyle }}>
      {label && (
        <Typography variant="caption" color="secondary" style={{ fontWeight: 500, marginBottom: spacing.sm }}>
          {label}
        </Typography>
      )}
      <div style={inputContainerStyle} className={className}>
        {leftIcon && <div style={{ paddingLeft: spacing.md, display: 'flex', alignItems: 'center', paddingTop: multiline ? spacing.sm : 0 }}>{leftIcon}</div>}
        {multiline ? (
          <textarea
            style={{
              ...baseInputStyle,
              minHeight: '80px',
              resize: 'none',
              lineHeight: 1.5,
            }}
            rows={rows}
            onFocus={(e) => {
              setFocused(true);
              (onFocus as React.FocusEventHandler<HTMLTextAreaElement>)?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              (onBlur as React.FocusEventHandler<HTMLTextAreaElement>)?.(e);
            }}
            aria-label={label}
            aria-describedby={error || helperText ? `${props.id || 'input'}-helper` : undefined}
            aria-invalid={!!error}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            style={{
              ...baseInputStyle,
              minHeight: '44px',
            }}
            onFocus={(e) => {
              setFocused(true);
              (onFocus as React.FocusEventHandler<HTMLInputElement>)?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              (onBlur as React.FocusEventHandler<HTMLInputElement>)?.(e);
            }}
            aria-label={label}
            aria-describedby={error || helperText ? `${props.id || 'input'}-helper` : undefined}
            aria-invalid={!!error}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {rightIcon && <div style={{ paddingRight: spacing.md, display: 'flex', alignItems: 'center', paddingTop: multiline ? spacing.sm : 0 }}>{rightIcon}</div>}
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
