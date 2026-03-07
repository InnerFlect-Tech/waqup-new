'use client';

import React from 'react';
import { ContentListPage } from '@/components/content';
import { useContent } from '@/hooks';

export default function AffirmationsListPage() {
  const { items, isLoading, error, refetch } = useContent('affirmation');

  return (
    <ContentListPage
      title="Affirmations"
      description="Your affirmations for cognitive re-patterning."
      contentType="affirmation"
      createHref="/sanctuary/affirmations/create"
      backHref="/sanctuary"
      content={items}
      createLabel="Create Affirmation"
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
    />
  );
}
