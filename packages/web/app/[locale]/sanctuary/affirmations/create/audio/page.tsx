'use client';

import React, { useEffect } from 'react';
import { ContentAudioStep } from '@/components/content/ContentAudioStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function AffirmationAudioPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('audio'); }, [setCurrentStep]);

  return (
    <ContentAudioStep
      backHref="/sanctuary/affirmations/create/voice"
      nextHref="/sanctuary/affirmations/create/review"
    />
  );
}
