'use client';

import React, { useEffect } from 'react';
import { ContentAudioStep } from '@/components/content/ContentAudioStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function MeditationAudioPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('audio'); }, [setCurrentStep]);

  return (
    <ContentAudioStep
      backHref="/sanctuary/meditations/create/voice"
      nextHref="/sanctuary/meditations/create/review"
    />
  );
}
