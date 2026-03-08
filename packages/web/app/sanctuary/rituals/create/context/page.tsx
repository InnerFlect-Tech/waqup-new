'use client';

import React, { useEffect } from 'react';
import { ContentContextStep } from '@/components/content/ContentContextStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function RitualContextPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('context'); }, [setCurrentStep]);

  return (
    <ContentContextStep
      backHref="/sanctuary/rituals/create/goals"
      nextHref="/sanctuary/rituals/create/personalization"
    />
  );
}
