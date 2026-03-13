'use client';

import React, { useEffect } from 'react';
import { Target, MapPin, Heart, Sparkles, Mic, Music, Eye } from 'lucide-react';
import { Analytics } from '@waqup/shared/utils';
import { useAuthStore } from '@/stores';
import { CreateFlowInitStep } from '@/components/content/CreateFlowInitStep';
import { ContentModeSelector } from '@/components/content/ContentModeSelector';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { CONTENT_CREDIT_COSTS, AI_MODE_COSTS } from '@waqup/shared/constants';

const RITUAL_STEPS = [
  {
    icon: Target,
    title: 'Set Your Intentions',
    description: 'Define the transformation you seek and who you want to become',
  },
  {
    icon: MapPin,
    title: 'Your Situation',
    description: 'The context and emotional state surrounding your practice',
  },
  {
    icon: Heart,
    title: 'Your Core Values',
    description: 'Core values, personal name, and why this transformation matters',
  },
  {
    icon: Sparkles,
    title: 'Generate Your Script',
    description: 'AI crafts your daily conditioning sequence: arrival, regulation, identity encoding, repetition, closure',
  },
  {
    icon: Mic,
    title: 'Choose Your Voice',
    description: 'Record your voice for identity encoding or use ElevenLabs emotional prosody',
  },
  {
    icon: Music,
    title: 'Mix & Enhance',
    description: 'Add ritual soundscape, sacred frequencies, and ambient layers',
  },
  {
    icon: Eye,
    title: 'Review & Save',
    description: 'Preview your ritual and save it to your sanctuary',
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
  const { user } = useAuthStore();

  useEffect(() => { setCurrentStep('init'); }, [setCurrentStep]);
  useEffect(() => { Analytics.ritualStarted(user?.id); }, [user?.id]);

  const costs = CONTENT_CREDIT_COSTS.ritual;
  const maxCost = AI_MODE_COSTS.chat + costs.withAi;
  const creditRange = `${costs.base}–${maxCost} Qs`;

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
          agentHref="/create/orb?type=ritual"
        />
      }
    />
  );
}
