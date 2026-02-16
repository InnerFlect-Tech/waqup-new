'use client';

import React from 'react';
import { PlaceholderPage } from '@/components';
import Link from 'next/link';
import { Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

export default function MeditationsListPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PlaceholderPage
      title="Meditations"
      description="Your guided meditations for state induction. (Stub — to be implemented)"
      backHref="/sanctuary"
    >
      <div style={{ marginTop: spacing.lg }}>
        <Link href="/sanctuary/meditations/create" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
            Create Meditation
          </Button>
        </Link>
      </div>
    </PlaceholderPage>
  );
}
