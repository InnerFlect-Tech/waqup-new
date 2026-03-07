'use client';

import React from 'react';
import { Target, Mic, Music, Sparkles } from 'lucide-react';
import { CreateFlowInitStep } from '@/components/content/CreateFlowInitStep';

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
    description: 'Add sacred frequencies and customize your audio',
  },
];

const TIPS = [
  'Use positive, present-tense language',
  'Focus on what you want, not what you want to avoid',
  'Keep affirmations believable and gradual',
  'Record in a calm, relaxed state for deeper encoding',
];

export default function AffirmationCreateInitPage() {
  return (
    <CreateFlowInitStep
      title="Create Your Affirmation"
      description="Cognitive re-patterning through voice and positive language"
      steps={AFFIRMATION_STEPS}
      tips={TIPS}
      nextHref="/create/conversation"
      nextLabel="Begin →"
    />
  );
}
