'use client';

import React from 'react';
import { ContentListPage } from '@/components/content';
import { useContent } from '@/hooks';

export default function RitualsListPage() {
  const { items, isLoading, error, refetch } = useContent('ritual');

  return (
    <ContentListPage
      title="Rituals"
      description="Your rituals for identity encoding."
      contentType="ritual"
      createHref="/sanctuary/rituals/create"
      backHref="/sanctuary"
      content={items}
      createLabel="Create Ritual"
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
    />
  );
}
