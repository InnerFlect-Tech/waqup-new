'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AudioPage } from '@/components/audio';
import { getMockContent } from '@/components/content/mockContent';

export default function RitualEditAudioPage() {
  const params = useParams();
  const id = params.id as string;
  const item = getMockContent('ritual', id);

  if (!item) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        Ritual not found. <Link href="/sanctuary/rituals">Back to rituals</Link>
      </div>
    );
  }

  return (
    <AudioPage
      id={id}
      contentType="ritual"
      title={`Edit sound — ${item.title}`}
      backHref={`/sanctuary/rituals/${id}`}
    />
  );
}
