'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PlaceholderPage } from '@/components';

export default function RitualEditAudioPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <PlaceholderPage
      title={`Edit sound / script — Ritual ${id}`}
      description="Edit voice, script, and audio for this ritual. (Stub — pipeline edit step)"
      backHref={`/sanctuary/rituals/${id}`}
    />
  );
}
