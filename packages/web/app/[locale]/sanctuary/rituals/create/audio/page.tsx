'use client';

import React, { useEffect } from 'react';
import { ContentAudioStep } from '@/components/content/ContentAudioStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function RitualAudioPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('audio'); }, [setCurrentStep]);

  return (
    <ContentAudioStep
      backHref="/sanctuary/rituals/create/voice"
      nextHref="/sanctuary/rituals/create/review"
    />
  );
}
