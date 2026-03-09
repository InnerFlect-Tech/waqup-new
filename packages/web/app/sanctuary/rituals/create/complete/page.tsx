'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentCompleteStep } from '@/components/content/ContentCompleteStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

function RitualCompleteInner() {
  const { setCurrentStep } = useContentCreation();
  const searchParams = useSearchParams();
  const savedId = searchParams.get('id') ?? undefined;

  useEffect(() => { setCurrentStep('complete'); }, [setCurrentStep]);

  return <ContentCompleteStep savedId={savedId} />;
}

export default function RitualCompletePage() {
  return (
    <Suspense fallback={null}>
      <RitualCompleteInner />
    </Suspense>
  );
}
