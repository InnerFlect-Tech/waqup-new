'use client';

import React, { useEffect } from 'react';
import { ContentVoiceStep } from '@/components/content/ContentVoiceStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function RitualVoicePage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('voice'); }, [setCurrentStep]);

  return (
    <ContentVoiceStep
      backHref="/sanctuary/rituals/create/script"
      nextHref="/sanctuary/rituals/create/audio"
    />
  );
}
