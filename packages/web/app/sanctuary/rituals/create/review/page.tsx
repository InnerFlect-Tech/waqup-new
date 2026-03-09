'use client';

import React, { useEffect } from 'react';
import { ContentReviewStep } from '@/components/content/ContentReviewStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function RitualReviewPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('review'); }, [setCurrentStep]);

  return (
    <ContentReviewStep
      backHref="/sanctuary/rituals/create/audio"
      completeHref="/sanctuary/rituals/create/complete"
      intentEditHref="/sanctuary/rituals/create/goals"
      scriptEditHref="/sanctuary/rituals/create/script"
      voiceEditHref="/sanctuary/rituals/create/voice"
      audioEditHref="/sanctuary/rituals/create/audio"
    />
  );
}
