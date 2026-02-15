'use client';

import React from 'react';
import { PlaceholderPage } from '@/components';
import Link from 'next/link';
import { Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

export default function AffirmationsListPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PlaceholderPage
      title="Affirmations"
      description="Your affirmations for cognitive re-patterning."
      backHref="/sanctuary"
    >
      <div style={{ marginTop: spacing.lg }}>
        <Link href="/sanctuary/affirmations/create" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
            Create Affirmation
          </Button>
        </Link>
      </div>
    </PlaceholderPage>
  );
}
