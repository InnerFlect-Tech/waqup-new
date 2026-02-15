'use client';

import React from 'react';
import { PlaceholderPage } from '@/components';
import Link from 'next/link';
import { Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

export default function RitualsListPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PlaceholderPage
      title="Rituals"
      description="Your rituals for identity encoding."
      backHref="/sanctuary"
    >
      <div style={{ marginTop: spacing.lg }}>
        <Link href="/sanctuary/rituals/create" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
            Create Ritual
          </Button>
        </Link>
      </div>
    </PlaceholderPage>
  );
}
