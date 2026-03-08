'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ContentDetailPage } from '@/components/content';
import { useContentItem } from '@/hooks';
import { Loading, Typography } from '@/components';
import { spacing } from '@/theme';
import { useTheme } from '@/theme';

export default function AffirmationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { item, isLoading, error, remove, recordPlay } = useContentItem(id);
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
          {error || 'Affirmation not found'}
        </Typography>
        <Link href="/sanctuary/affirmations" style={{ color: colors.accent.primary }}>
          Back to affirmations
        </Link>
      </div>
    );
  }

  return (
    <ContentDetailPage
      id={item.id}
      contentType="affirmation"
      title={item.title}
      description={item.description}
      duration={item.duration}
      script={item.script}
      lastPlayed={item.lastPlayed}
      audioUrl={item.audioUrl}
      backHref="/sanctuary/affirmations"
      editHref={`/sanctuary/affirmations/${id}/edit`}
      editAudioHref={`/sanctuary/affirmations/${id}/edit-audio`}
      onRecordPlay={async () => {
        await recordPlay();
      }}
      onDelete={async () => {
        const ok = await remove();
        if (ok) router.push('/sanctuary/affirmations');
      }}
    />
  );
}
