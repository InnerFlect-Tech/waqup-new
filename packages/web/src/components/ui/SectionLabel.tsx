'use client';

import React from 'react';
import { useTheme } from '@/theme';

interface SectionLabelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Standardised section heading — 11px uppercase label with tracking.
 * Replaces the repeated inline pattern of h4 + fontSize 11 + uppercase + letterSpacing.
 */
export function SectionLabel({ children, style }: SectionLabelProps) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: theme.colors.text.secondary,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
