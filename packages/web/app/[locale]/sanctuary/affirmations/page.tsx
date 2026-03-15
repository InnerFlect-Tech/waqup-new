'use client';

import React, { useMemo } from 'react';
import { ContentListPage } from '@/components/content';
import { useContent } from '@/hooks';

export default function AffirmationsListPage() {
  const { items, isLoading, error, refetch } = useContent('affirmation');

  const continueListeningItem = useMemo(() => {
    const played = items.filter((i) => i.lastPlayed).sort(
      (a, b) => new Date(b.lastPlayed!).getTime() - new Date(a.lastPlayed!).getTime()
    );
    return played[0] ?? null;
  }, [items]);

  return (
    <ContentListPage
      title="Affirmation tracks"
      description="Short, repeatable tracks for identity change."
      contentType="affirmation"
      createHref="/sanctuary/affirmations/create"
      backHref="/sanctuary"
      content={items}
      createLabel="Create track"
      createInHeaderOnly
      useDisplayTitle
      continueListeningItem={continueListeningItem}
      searchPlaceholder="Search your tracks..."
      createCardSubtitle="Turn an intention into personal audio"
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
    />
  );
}
