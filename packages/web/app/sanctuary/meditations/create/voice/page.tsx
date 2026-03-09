'use client';

import React, { useEffect } from 'react';
import { ContentVoiceStep } from '@/components/content/ContentVoiceStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function MeditationVoicePage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('voice'); }, [setCurrentStep]);

  return (
    <ContentVoiceStep
      backHref="/sanctuary/meditations/create/script"
      nextHref="/sanctuary/meditations/create/audio"
    />
  );
}
