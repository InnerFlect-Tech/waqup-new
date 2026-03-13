'use client';

import React, { useEffect } from 'react';
import { Target, MapPin, Sparkles, Mic, Music, Eye } from 'lucide-react';
import { CreateFlowInitStep } from '@/components/content/CreateFlowInitStep';
import { ContentModeSelector } from '@/components/content/ContentModeSelector';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { CONTENT_CREDIT_COSTS, AI_MODE_COSTS } from '@waqup/shared/constants';

const MEDITATION_STEPS = [
  {
    icon: Target,
    title: 'Set Your Intent',
    description: 'What state do you want to regulate? (calm, focus, sleep, reset)',
  },
  {
    icon: MapPin,
    title: 'Add Context',
    description: 'When will you practice? How are you arriving? (morning, before sleep, present state)',
  },
  {
    icon: Sparkles,
    title: 'Generate Your Script',
    description: 'AI creates a short regulation meditation — breath, body, attention',
  },
  {
    icon: Mic,
    title: 'Choose Your Voice',
    description: 'ElevenLabs long-form voice or your own personal recording',
  },
  {
    icon: Music,
    title: 'Mix & Enhance',
    description: 'Add background soundscapes and sacred frequency layers',
  },
  {
    icon: Eye,
    title: 'Review & Save',
    description: 'Preview your meditation and save it to your sanctuary',
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
  const maxCost = AI_MODE_COSTS.chat + costs.withAi;
  const creditRange = `${costs.base}–${maxCost} Qs`;

  return (
    <CreateFlowInitStep
      title="Create Your Meditation"
      description="State regulation through breath and body awareness"
      steps={MEDITATION_STEPS}
      tips={TIPS}
      creditRange={creditRange}
      footer={
        <ContentModeSelector
          formHref="/sanctuary/meditations/create/intent"
          chatHref="/create/conversation?type=meditation"
          agentHref="/create/orb?type=meditation"
        />
      }
    />
  );
}
