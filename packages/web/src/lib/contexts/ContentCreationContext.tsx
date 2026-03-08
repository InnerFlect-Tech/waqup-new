'use client';

import React, { createContext, useContext, useState } from 'react';

export type ContentType = 'affirmation' | 'meditation' | 'ritual';
export type CreationMode = 'form' | 'conversation' | 'orb';

export type CreationStep =
  | 'init'
  | 'intent'
  | 'context'
  | 'personalization'
  | 'script'
  | 'voice'
  | 'audio'
  | 'review'
  | 'complete';

export interface PersonalizationData {
  coreValues?: string[];
  name?: string;
  whyThisMatters?: string;
}

interface ContentCreationContextType {
  contentType: ContentType;
  creationMode: CreationMode;
  currentStep: CreationStep;
  intent: string;
  context: string;
  personalization: PersonalizationData;
  script: string;
  setCreationMode: (mode: CreationMode) => void;
  setCurrentStep: (step: CreationStep) => void;
  setIntent: (intent: string) => void;
  setContext: (context: string) => void;
  setPersonalization: (data: PersonalizationData) => void;
  setScript: (script: string) => void;
  reset: () => void;
}

const ContentCreationContext = createContext<ContentCreationContextType | undefined>(undefined);

export function ContentCreationProvider({
  children,
  contentType,
}: {
  children: React.ReactNode;
  contentType: ContentType;
}) {
  const [creationMode, setCreationMode] = useState<CreationMode>('form');
  const [currentStep, setCurrentStep] = useState<CreationStep>('init');
  const [intent, setIntent] = useState('');
  const [context, setContext] = useState('');
  const [personalization, setPersonalization] = useState<PersonalizationData>({});
  const [script, setScript] = useState('');

  const reset = () => {
    setCreationMode('form');
    setCurrentStep('init');
    setIntent('');
    setContext('');
    setPersonalization({});
    setScript('');
  };

  const value: ContentCreationContextType = {
    contentType,
    creationMode,
    currentStep,
    intent,
    context,
    personalization,
    script,
    setCreationMode,
    setCurrentStep,
    setIntent,
    setContext,
    setPersonalization,
    setScript,
    reset,
  };

  return (
    <ContentCreationContext.Provider value={value}>
      {children}
    </ContentCreationContext.Provider>
  );
}

export function useContentCreation() {
  const ctx = useContext(ContentCreationContext);
  if (ctx === undefined) {
    throw new Error('useContentCreation must be used within a ContentCreationProvider');
  }
  return ctx;
}
