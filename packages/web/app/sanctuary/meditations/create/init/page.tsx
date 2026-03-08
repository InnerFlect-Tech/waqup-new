'use client';

import React, { useEffect } from 'react';
import { Target, MapPin, FileText, Mic } from 'lucide-react';
import { CreateFlowInitStep } from '@/components/content/CreateFlowInitStep';
import { ContentModeSelector } from '@/components/content/ContentModeSelector';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { CONTENT_CREDIT_COSTS } from '@waqup/shared/constants';
import { formatQs } from '@waqup/shared/utils';

const MEDITATION_STEPS = [
  {
    icon: Target,
    title: 'Set Your Intent',
    description: 'What state or outcome do you seek? (sleep, focus, calm)',
  },
  {
    icon: MapPin,
    title: 'Add Context',
    description: 'When and where will you practice? (morning, before sleep, commute)',
  },
  {
    icon: FileText,
    title: 'Generate Your Script',
    description: 'AI creates grounding, visualization, and relaxation induction',
  },
  {
    icon: Mic,
    title: 'Voice & Audio',
    description: 'Choose voice, record, and mix with sacred frequencies',
  },
];

const TIPS = [
  'Find a comfortable, quiet space',
  'Use headphones for an immersive experience',
  'Practice at the same time daily for best results',
  'Start with shorter meditations and build up',
];

export default function MeditationCreateInitPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('init'); }, [setCurrentStep]);

  const costs = CONTENT_CREDIT_COSTS.meditation;
  const creditRange =
    costs.withAi > costs.base
      ? `${costs.base}–${costs.withAi} Qs`
      : formatQs(costs.base);

  return (
    <CreateFlowInitStep
      title="Create Your Meditation"
      description="State induction through guided visualization and relaxation"
      steps={MEDITATION_STEPS}
      tips={TIPS}
      creditRange={creditRange}
      footer={
        <ContentModeSelector
          formHref="/sanctuary/meditations/create/intent"
          chatHref="/create/conversation?type=meditation"
        />
      }
    />
  );
}
