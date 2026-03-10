'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { ContentEditPage } from '@/components/content';
import { useContentItem } from '@/hooks';
import { Loading, Typography } from '@/components';
import { spacing } from '@/theme';
import { useTheme } from '@/theme';

export default function RitualEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { item, isLoading, error, update } = useContentItem(id);
  const { theme } = useTheme();
  const colors = theme.colors;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loading variant="spinner" size="lg" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div style={{ padding: spacing.xl, textAlign: 'center' }}>
        <Typography variant="h3" style={{ color: colors.error, marginBottom: spacing.md }}>
          {error || 'Ritual not found'}
        </Typography>
        <Link href="/sanctuary/rituals" style={{ color: colors.accent.primary }}>
          Back to rituals
        </Link>
      </div>
    );
  }

  return (
    <ContentEditPage
      title={item.title}
      description={item.description}
      script={item.script ?? ''}
      backHref={`/sanctuary/rituals/${id}`}
      contentType="ritual"
      onSave={async (data) => {
        await update(data);
        router.push(`/sanctuary/rituals/${id}`);
      }}
    />
  );
}
