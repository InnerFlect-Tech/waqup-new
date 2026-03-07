'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AudioPage } from '@/components/audio';
import { getMockContent } from '@/components/content/mockContent';

export default function AffirmationEditAudioPage() {
  const params = useParams();
  const id = params.id as string;
  const item = getMockContent('affirmation', id);

  if (!item) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        Affirmation not found. <Link href="/sanctuary/affirmations">Back to affirmations</Link>
      </div>
    );
  }

  return (
    <AudioPage
      id={id}
      contentType="affirmation"
      title={`Edit sound — ${item.title}`}
      backHref={`/sanctuary/affirmations/${id}`}
    />
  );
}
