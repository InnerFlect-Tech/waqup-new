'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PlaceholderPage } from '@/components';

export default function MeditationEditAudioPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <PlaceholderPage
      title={`Edit sound / script — Meditation ${id}`}
      description="Edit voice, script, and audio for this meditation. (Stub — pipeline edit step)"
      backHref={`/sanctuary/meditations/${id}`}
    />
  );
}
