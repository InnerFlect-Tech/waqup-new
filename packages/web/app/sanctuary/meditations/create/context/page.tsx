'use client';

import React, { useEffect } from 'react';
import { ContentContextStep } from '@/components/content/ContentContextStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function MeditationContextPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('context'); }, [setCurrentStep]);

  return (
    <ContentContextStep
      backHref="/sanctuary/meditations/create/intent"
      nextHref="/sanctuary/meditations/create/script"
    />
  );
}
