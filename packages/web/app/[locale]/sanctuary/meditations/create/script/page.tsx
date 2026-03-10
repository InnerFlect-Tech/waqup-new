'use client';

import React, { useEffect } from 'react';
import { ContentScriptStep } from '@/components/content/ContentScriptStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function MeditationScriptPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('script'); }, [setCurrentStep]);

  return (
    <ContentScriptStep
      backHref="/sanctuary/meditations/create/context"
      nextHref="/sanctuary/meditations/create/voice"
    />
  );
}
