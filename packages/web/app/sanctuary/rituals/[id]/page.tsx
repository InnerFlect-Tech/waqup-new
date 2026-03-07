'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ContentDetailPage } from '@/components/content';
import { useContentItem } from '@/hooks';
import { Loading, Typography } from '@/components';
import { spacing } from '@/theme';
import { useTheme } from '@/theme';

export default function RitualDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { item, isLoading, error, remove } = useContentItem(id);
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
    <ContentDetailPage
      id={item.id}
      contentType="ritual"
      title={item.title}
      description={item.description}
      duration={item.duration}
      script={item.script}
      lastPlayed={item.lastPlayed}
      backHref="/sanctuary/rituals"
      editHref={`/sanctuary/rituals/${id}/edit`}
      editAudioHref={`/sanctuary/rituals/${id}/edit-audio`}
      onDelete={async () => {
        const ok = await remove();
        if (ok) router.push('/sanctuary/rituals');
      }}
    />
  );
}
