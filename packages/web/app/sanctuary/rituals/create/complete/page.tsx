'use client';

import React, { useEffect } from 'react';
import { ContentCompleteStep } from '@/components/content/ContentCompleteStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

export default function RitualCompletePage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('complete'); }, [setCurrentStep]);

  return <ContentCompleteStep />;
}
