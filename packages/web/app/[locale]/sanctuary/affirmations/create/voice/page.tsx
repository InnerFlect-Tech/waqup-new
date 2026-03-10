'use client';

import React, { useEffect } from 'react';
import { ContentVoiceStep } from '@/components/content/ContentVoiceStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function AffirmationVoicePage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('voice'); }, [setCurrentStep]);

  return (
    <ContentVoiceStep
      backHref="/sanctuary/affirmations/create/script"
      nextHref="/sanctuary/affirmations/create/audio"
    />
  );
}
