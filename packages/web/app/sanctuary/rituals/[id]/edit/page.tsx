'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PlaceholderPage } from '@/components';

export default function RitualEditPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <PlaceholderPage
      title={`Edit Ritual ${id}`}
      description="Modify your ritual."
      backHref={`/sanctuary/rituals/${id}`}
    />
  );
}
