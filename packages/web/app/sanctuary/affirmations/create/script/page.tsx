'use client';

import React, { useEffect } from 'react';
import { ContentScriptStep } from '@/components/content/ContentScriptStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function AffirmationScriptPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('script'); }, [setCurrentStep]);

  return (
    <ContentScriptStep
      backHref="/sanctuary/affirmations/create/intent"
      nextHref="/sanctuary/affirmations/create/voice"
    />
  );
}
