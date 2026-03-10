import React from 'react';
import { OnboardingCompletionProvider } from '@/contexts/OnboardingCompletionContext';
import OnboardingNavigator from './OnboardingNavigator';

interface OnboardingWrapperProps {
  onComplete: () => Promise<void>;
}

export default function OnboardingWrapper({ onComplete }: OnboardingWrapperProps) {
  return (
    <OnboardingCompletionProvider onComplete={onComplete}>
      <OnboardingNavigator />
    </OnboardingCompletionProvider>
  );
}
