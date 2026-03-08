'use client';

import React, { useEffect } from 'react';
import { ContentIntentStep } from '@/components/content/ContentIntentStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function MeditationIntentPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('intent'); }, [setCurrentStep]);

  return (
    <ContentIntentStep
      backHref="/sanctuary/meditations/create/init"
      nextHref="/sanctuary/meditations/create/context"
    />
  );
}
