'use client';

import React from 'react';
import { ContentListPage } from '@/components/content';
import { useContent } from '@/hooks';

export default function MeditationsListPage() {
  const { items, isLoading, error, refetch } = useContent('meditation');

  return (
    <ContentListPage
      title="Meditations"
      description="Your guided meditations for state induction."
      contentType="meditation"
      createHref="/sanctuary/meditations/create"
      backHref="/sanctuary"
      content={items}
      createLabel="Create Meditation"
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
    />
  );
}
