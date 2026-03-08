'use client';

import React, { useEffect } from 'react';
import { Target, Heart, Mic, Sparkles } from 'lucide-react';
import { CreateFlowInitStep } from '@/components/content/CreateFlowInitStep';
import { ContentModeSelector } from '@/components/content/ContentModeSelector';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { CONTENT_CREDIT_COSTS } from '@waqup/shared/constants';
import { formatQs } from '@waqup/shared/utils';

const RITUAL_STEPS = [
  {
    icon: Target,
    title: 'Set Your Intentions',
    description: 'Define your goals and the transformation you seek',
  },
  {
    icon: Heart,
    title: 'Connect with Your Values',
    description: 'Identify core values and the deeper why behind your practice',
  },
  {
    icon: Mic,
    title: 'Speak Your Truth',
    description: 'Record your personalized affirmations with full intention',
  },
  {
    icon: Sparkles,
    title: 'Enhance Your Practice',
    description: 'Add sacred frequencies and ambient sounds',
  },
];

const TIPS = [
  'Find a quiet space where you won\'t be disturbed',
  'Take a few deep breaths to centre yourself first',
  'Have a clear intention — rituals work through specificity',
  'Trust in the process of transformation',
];

export default function RitualCreateInitPage() {
  const { setCurrentStep } = useContentCreation();

  useEffect(() => { setCurrentStep('init'); }, [setCurrentStep]);

  const costs = CONTENT_CREDIT_COSTS.ritual;
  const creditRange =
    costs.withAi > costs.base
      ? `${costs.base}–${costs.withAi} Qs`
      : formatQs(costs.base);

  return (
    <CreateFlowInitStep
      title="Create Your Ritual"
      description="Identity encoding through intentional practice and voice"
      steps={RITUAL_STEPS}
      tips={TIPS}
      creditRange={creditRange}
      footer={
        <ContentModeSelector
          formHref="/sanctuary/rituals/create/goals"
          chatHref="/create/conversation?type=ritual"
        />
      }
    />
  );
}
