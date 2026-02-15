'use client';

import React from 'react';
import { PlaceholderPage } from '@/components';
import Link from 'next/link';
import { Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

export default function SanctuaryHomePage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PlaceholderPage
      title="Sanctuary"
      description="Your space for transformation and growth."
      backHref="/home"
    >
      <div style={{ marginTop: spacing.lg, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
        <Link href="/sanctuary/affirmations" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
            Affirmations
          </Button>
        </Link>
        <Link href="/sanctuary/rituals" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
            Rituals
          </Button>
        </Link>
      </div>
    </PlaceholderPage>
  );
}
