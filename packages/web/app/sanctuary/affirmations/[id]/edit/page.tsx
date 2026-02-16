'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PlaceholderPage } from '@/components';

export default function AffirmationEditPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <PlaceholderPage
      title={`Edit affirmation ${id}`}
      description="Edit your affirmation. (Stub — to be implemented)"
      backHref={`/sanctuary/affirmations/${id}`}
    />
  );
}
