'use client';

import React, { useEffect } from 'react';
import { Target, Heart, Mic, Sparkles } from 'lucide-react';
import { CreateFlowInitStep } from '@/components/content/CreateFlowInitStep';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

const RITUAL_STEPS = [
  {
    icon: Target,
    title: 'Set Your Intentions',
    description: 'Define your goals and the transformation you seek',
  },
  {
    icon: Heart,
    title: 'Connect with Your Values',
    description: 'Identify core values and strengths that guide you',
  },
  {
    icon: Mic,
    title: 'Speak Your Truth',
    description: 'Record your personalized affirmations with intention',
  },
  {
    icon: Sparkles,
    title: 'Enhance Your Practice',
    description: 'Add sacred frequencies and ambient sounds',
  },
];

const TIPS = [
  'Find a quiet space where you won\'t be disturbed',
  'Take a few deep breaths to center yourself',
  'Have a clear intention for your practice',
  'Trust in the process of transformation',
];

export default function RitualCreateInitPage() {
  const { setCurrentStep } = useContentCreation();
  useEffect(() => { setCurrentStep('init'); }, [setCurrentStep]);

  return (
    <CreateFlowInitStep
      title="Create Your Ritual"
      description="Transform your life through the power of intentional practice"
      steps={RITUAL_STEPS}
      tips={TIPS}
      nextHref="/sanctuary/rituals/create/goals"
      nextLabel="Begin Journey →"
    />
  );
}
