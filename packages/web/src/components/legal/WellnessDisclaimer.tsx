'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

/**
 * Compact wellness disclaimer for sanctuary and create flows.
 * Links to full disclaimer in Terms of Service.
 */
export function WellnessDisclaimer() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <p
      style={{
        fontSize: 12,
        color: colors.text.tertiary,
        lineHeight: 1.5,
        margin: 0,
        marginTop: spacing.md,
        maxWidth: 480,
      }}
    >
      waQup is a wellness tool, not a substitute for professional medical or
      mental health care.{' '}
      <Link
        href="/terms"
        style={{
          color: colors.accent.tertiary,
          textDecoration: 'underline',
          textUnderlineOffset: 2,
        }}
      >
        Full disclaimer
      </Link>
    </p>
  );
}
