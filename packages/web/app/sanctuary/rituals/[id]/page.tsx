'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PlaceholderPage } from '@/components';
import Link from 'next/link';
import { Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

export default function RitualDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PlaceholderPage
      title={`Ritual ${id}`}
      description="View and play your ritual."
      backHref="/sanctuary/rituals"
    >
      <div style={{ marginTop: spacing.lg }}>
        <Link href={`/sanctuary/rituals/${id}/edit`} style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
            Edit
          </Button>
        </Link>
      </div>
    </PlaceholderPage>
  );
}
