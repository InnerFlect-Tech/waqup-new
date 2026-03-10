'use client';

import React from 'react';
import { ContentListPage } from '@/components/content';
import { useContent } from '@/hooks';

export default function RitualsRecordingsPage() {
  const { items, isLoading, error, refetch } = useContent('ritual');

  return (
    <ContentListPage
      title="Recordings"
      description="Your ritual recordings — revisit and replay anytime."
      contentType="ritual"
      createHref="/sanctuary/rituals/create"
      backHref="/sanctuary/rituals"
      content={items}
      createLabel="Create Ritual"
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
    />
  );
}
