'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AudioPage } from '@/components/audio';
import { getMockContent } from '@/components/content/mockContent';
import { spacing } from '@/theme';

export default function MeditationEditAudioPage() {
  const params = useParams();
  const id = params.id as string;
  const item = getMockContent('meditation', id);

  if (!item) {
    return (
      <div style={{ padding: spacing.lg, textAlign: 'center' }}>
        Meditation not found. <Link href="/sanctuary/meditations">Back to meditations</Link>
      </div>
    );
  }

  return (
    <AudioPage
      id={id}
      contentType="meditation"
      title={`Edit sound — ${item.title}`}
      backHref={`/sanctuary/meditations/${id}`}
    />
  );
}
