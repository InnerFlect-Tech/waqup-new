'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { ContentDetailPage } from '@/components/content';
import { useContentItem } from '@/hooks';
import { Loading, Typography } from '@/components';
import { spacing } from '@/theme';
import { useTheme } from '@/theme';

export default function RitualDetailPage() {
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
      audioUrl={item.audioUrl}
      backHref="/sanctuary/rituals"
      editHref={`/sanctuary/rituals/${id}/edit`}
      editAudioHref={`/sanctuary/rituals/${id}/edit-audio`}
      onRecordPlay={async (durationSeconds) => {
        await recordPlay(durationSeconds);
      }}
      onDelete={async () => {
        const ok = await remove(item.id);
        if (ok) router.push('/sanctuary/rituals');
      }}
    />
  );
}
