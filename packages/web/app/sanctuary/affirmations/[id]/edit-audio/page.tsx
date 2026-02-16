'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PlaceholderPage } from '@/components';

export default function AffirmationEditAudioPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <PlaceholderPage
      title={`Edit sound / script — Affirmation ${id}`}
      description="Edit voice, script, and audio for this affirmation. (Stub — pipeline edit step)"
      backHref={`/sanctuary/affirmations/${id}`}
    />
  );
}
