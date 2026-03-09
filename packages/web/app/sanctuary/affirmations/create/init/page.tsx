'use client';

import React, { useEffect } from 'react';
import { Target, Sparkles, Mic, Music, Eye } from 'lucide-react';
import { CreateFlowInitStep } from '@/components/content/CreateFlowInitStep';
import { ContentModeSelector } from '@/components/content/ContentModeSelector';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { CONTENT_CREDIT_COSTS, AI_MODE_COSTS } from '@waqup/shared/constants';

const AFFIRMATION_STEPS = [
  {
    icon: Target,
    title: 'Set Your Intent',
    description: 'Articulate what you want to change or strengthen',
  },
  {
    icon: Sparkles,
    title: 'Generate Your Script',
    description: 'AI creates positive, present-tense affirmations tailored to you',
  },
  {
    icon: Mic,
    title: 'Choose Your Voice',
    description: 'Record your own voice or use AI voice for personalized delivery',
  },
  {
    icon: Music,
    title: 'Mix & Enhance',
    description: 'Add sacred frequencies and customize your audio experience',
  },
  {
    icon: Eye,
    title: 'Review & Save',
    description: 'Preview your affirmation and save it to your sanctuary',
  },
];

const TIPS = [
  'Use positive, present-tense language',
  'Focus on what you want, not what you want to avoid',
  'Keep affirmations believable and gradual',
  'Record in a calm, relaxed state for deeper encoding',
];

export default function AffirmationCreateInitPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('init'); }, [setCurrentStep]);

  const costs = CONTENT_CREDIT_COSTS.affirmation;
  const maxCost = AI_MODE_COSTS.chat + costs.withAi;
  const creditRange = `${costs.base}–${maxCost} Qs`;

  return (
    <CreateFlowInitStep
      title="Create Your Affirmation"
      description="Cognitive re-patterning through voice and positive language"
      steps={AFFIRMATION_STEPS}
      tips={TIPS}
      creditRange={creditRange}
      footer={
        <ContentModeSelector
          formHref="/sanctuary/affirmations/create/intent"
          chatHref="/create/conversation?type=affirmation"
          agentHref="/create/orb?type=affirmation"
        />
      }
    />
  );
}
