'use client';

import React, { useEffect } from 'react';
import { ContentPersonalizationStep } from '@/components/content/ContentPersonalizationStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function RitualPersonalizationPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('personalization'); }, [setCurrentStep]);

  return (
    <ContentPersonalizationStep
      backHref="/sanctuary/rituals/create/context"
      nextHref="/sanctuary/rituals/create/script"
    />
  );
}
