'use client';

import React from 'react';
import { Typography } from './Typography';
import { Card } from './Card';
import { BLUR } from '@/theme';
import { useTheme } from '@/theme';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  action?: React.ReactNode;
  /** Override container styles */
  style?: React.CSSProperties;
}

/**
 * Standard empty state for lists, grids, and data views.
 * Use when there is no data to display but the user can take action.
 */
export function EmptyState({ icon, title, body, action, style }: EmptyStateProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <Card
      variant="default"
      style={{
        padding: 40,
        textAlign: 'center',
        background: colors.glass.light,
        backdropFilter: BLUR.md,
        WebkitBackdropFilter: BLUR.md,
        border: `1px solid ${colors.glass.border}`,
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: colors.glass.light,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            marginBottom: 24,
          }}
        >
          {icon}
        </div>
      )}
      <Typography variant="h3" style={{ marginBottom: body ? 8 : action ? 24 : 0, color: colors.text.primary }}>
        {title}
      </Typography>
      {body && (
        <Typography variant="body" style={{ marginBottom: action ? 24 : 0, color: colors.text.secondary }}>
          {body}
        </Typography>
      )}
      {action}
    </Card>
  );
}
