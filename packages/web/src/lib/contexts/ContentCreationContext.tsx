'use client';

import React, { createContext, useContext, useState } from 'react';

export type ContentType = 'affirmation' | 'meditation' | 'ritual';

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

interface ContentCreationState {
  contentType: ContentType;
  currentStep: CreationStep;
  intent?: string;
  script?: string;
}

interface ContentCreationContextType {
  contentType: ContentType;
  currentStep: CreationStep;
  setCurrentStep: (step: CreationStep) => void;
  setIntent: (intent: string) => void;
  setScript: (script: string) => void;
}

const ContentCreationContext = createContext<ContentCreationContextType | undefined>(undefined);

export function ContentCreationProvider({
  children,
  contentType,
}: {
  children: React.ReactNode;
  contentType: ContentType;
}) {
  const [currentStep, setCurrentStep] = useState<CreationStep>('init');
  const [intent, setIntent] = useState<string | undefined>();
  const [script, setScript] = useState<string | undefined>();

  const value: ContentCreationContextType = {
    contentType,
    currentStep,
    setCurrentStep,
    setIntent: (v) => setIntent(v),
    setScript: (v) => setScript(v),
  };

  return (
    <ContentCreationContext.Provider value={value}>
      {children}
    </ContentCreationContext.Provider>
  );
}

export function useContentCreation() {
  const context = useContext(ContentCreationContext);
  if (context === undefined) {
    throw new Error('useContentCreation must be used within a ContentCreationProvider');
  }
  return context;
}
