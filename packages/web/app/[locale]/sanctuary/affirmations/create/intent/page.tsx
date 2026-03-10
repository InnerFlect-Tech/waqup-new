'use client';

import React, { useEffect } from 'react';
import { ContentIntentStep } from '@/components/content/ContentIntentStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function AffirmationIntentPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('intent'); }, [setCurrentStep]);

  return (
    <ContentIntentStep
      backHref="/sanctuary/affirmations/create/init"
      nextHref="/sanctuary/affirmations/create/script"
    />
  );
}
