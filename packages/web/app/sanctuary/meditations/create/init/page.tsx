'use client';

import React from 'react';
import { Target, MapPin, FileText, Mic } from 'lucide-react';
import { CreateFlowInitStep } from '@/components/content/CreateFlowInitStep';

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
  'Use headphones for immersive experience',
  'Practice at the same time daily for best results',
  'Start with shorter meditations and build up',
];

export default function MeditationCreateInitPage() {
  return (
    <CreateFlowInitStep
      title="Create Your Meditation"
      description="State induction through guided visualization and relaxation"
      steps={MEDITATION_STEPS}
      tips={TIPS}
      nextHref="/create/conversation"
      nextLabel="Begin →"
    />
  );
}
