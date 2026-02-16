'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PlaceholderPage } from '@/components';
import Link from 'next/link';
import { Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

export default function MeditationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PlaceholderPage
      title={`Meditation ${id}`}
      description="View and play your guided meditation. (Stub — Phase 5.2)"
      backHref="/sanctuary/meditations"
    >
      <div style={{ marginTop: spacing.lg, display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
        <Link href={`/sanctuary/meditations/${id}/edit`} style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
            Edit
          </Button>
        </Link>
        <Link href={`/sanctuary/meditations/${id}/edit-audio`} style={{ textDecoration: 'none' }}>
          <Button variant="outline" size="md">
            Edit sound / script
          </Button>
        </Link>
      </div>
    </PlaceholderPage>
  );
}
