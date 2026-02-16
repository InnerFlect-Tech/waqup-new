'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PlaceholderPage } from '@/components';

export default function MeditationEditPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <PlaceholderPage
      title={`Edit meditation ${id}`}
      description="Edit your guided meditation. (Stub — to be implemented)"
      backHref={`/sanctuary/meditations/${id}`}
    />
  );
}
