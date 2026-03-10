'use client';

import React from 'react';
import { Typography } from './Typography';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';

export interface ErrorBannerProps {
  message: string;
  /** Optional retry callback — when provided, shows "Try again" affordance */
  onRetry?: () => void;
  /** Override container styles */
  style?: React.CSSProperties;
}

/**
 * Standard error banner for API failures, validation errors, and recoverable failures.
 * Use try/catch to capture errors and display user-friendly messages via this component.
 */
export function ErrorBanner({ message, onRetry, style }: ErrorBannerProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <div
      role="alert"
      style={{
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.error,
        backgroundColor: `${colors.error}15`,
        marginBottom: spacing.md,
        ...style,
      }}
    >
      <Typography variant="body" style={{ color: colors.error, margin: 0 }}>
        {message}
      </Typography>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            marginTop: spacing.sm,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: colors.accent.tertiary,
            fontSize: 14,
            fontWeight: 500,
            padding: 0,
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
