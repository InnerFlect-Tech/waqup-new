'use client';

import React, { useEffect } from 'react';
import { ContentReviewStep } from '@/components/content/ContentReviewStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function AffirmationReviewPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('review'); }, [setCurrentStep]);

  return (
    <ContentReviewStep
      backHref="/sanctuary/affirmations/create/audio"
      completeHref="/sanctuary/affirmations/create/complete"
      intentEditHref="/sanctuary/affirmations/create/intent"
      scriptEditHref="/sanctuary/affirmations/create/script"
      voiceEditHref="/sanctuary/affirmations/create/voice"
      audioEditHref="/sanctuary/affirmations/create/audio"
    />
  );
}
