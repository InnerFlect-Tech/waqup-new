'use client';

import React, { useEffect } from 'react';
import { ContentReviewStep } from '@/components/content/ContentReviewStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function MeditationReviewPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('review'); }, [setCurrentStep]);

  return (
    <ContentReviewStep
      backHref="/sanctuary/meditations/create/audio"
      completeHref="/sanctuary/meditations/create/complete"
      intentEditHref="/sanctuary/meditations/create/intent"
      scriptEditHref="/sanctuary/meditations/create/script"
      voiceEditHref="/sanctuary/meditations/create/voice"
      audioEditHref="/sanctuary/meditations/create/audio"
    />
  );
}
