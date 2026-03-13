'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

/** 'inline' = no block spacing, for footer flex rows; 'default' = standalone with top padding */
export function WellnessDisclaimer({ variant = 'default' }: { variant?: 'default' | 'inline' }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const Tag = variant === 'inline' ? 'span' : 'p';

  return (
    <Tag
      style={{
        fontSize: 10,
        color: colors.text.tertiary,
        lineHeight: 1.4,
        margin: 0,
        ...(variant === 'default' && { paddingTop: spacing.sm }),
        opacity: 0.85,
      }}
    >
      Wellness tool, not medical advice.{' '}
      <Link
        href="/terms"
        style={{
          color: colors.text.tertiary,
          textDecoration: 'none',
          fontSize: 'inherit',
          opacity: 0.9,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.textDecoration = 'underline';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textDecoration = 'none';
        }}
      >
        Full disclaimer →
      </Link>
    </Tag>
  );
}
