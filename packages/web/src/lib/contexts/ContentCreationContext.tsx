'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ContentItemType, PersonalizationData, AudioSettings } from '@waqup/shared/types';
import { DEFAULT_AUDIO_SETTINGS } from '@waqup/shared/types';
import type { CreationMode } from '@waqup/shared/constants';
import type { ConversationStep } from '@waqup/shared/types';

/** @deprecated Use ContentItemType from @waqup/shared/types */
export type ContentType = ContentItemType;
export type { CreationMode, PersonalizationData };
/** @deprecated Use ConversationStep from @waqup/shared/types */
export type CreationStep = ConversationStep;

interface PersistedState {
  creationMode: CreationMode;
  currentStep: CreationStep;
  intent: string;
  context: string;
  personalization: PersonalizationData;
  script: string;
  voiceId: string | null;
  voiceType: 'own' | 'ai' | null;
  audioSettings: AudioSettings;
}

interface ContentCreationContextType {
  contentType: ContentItemType;
  creationMode: CreationMode;
  currentStep: CreationStep;
  intent: string;
  context: string;
  personalization: PersonalizationData;
  script: string;
  voiceId: string | null;
  voiceType: 'own' | 'ai' | null;
  audioSettings: AudioSettings;
  setCreationMode: (mode: CreationMode) => void;
  setCurrentStep: (step: CreationStep) => void;
  setIntent: (intent: string) => void;
  setContext: (context: string) => void;
  setPersonalization: (data: PersonalizationData) => void;
  setScript: (script: string) => void;
  setVoiceId: (id: string | null) => void;
  setVoiceType: (type: 'own' | 'ai' | null) => void;
  setAudioSettings: (settings: AudioSettings) => void;
  reset: () => void;
}

const ContentCreationContext = createContext<ContentCreationContextType | undefined>(undefined);

const DEFAULT_STATE: PersistedState = {
  creationMode: 'form' as CreationMode,
  currentStep: 'init',
  intent: '',
  context: '',
  personalization: {},
  script: '',
  voiceId: null,
  voiceType: null,
  audioSettings: DEFAULT_AUDIO_SETTINGS,
};

function getStorageKey(contentType: ContentItemType) {
  return `waqup_creation_${contentType}`;
}

function loadFromStorage(contentType: ContentItemType): PersistedState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = sessionStorage.getItem(getStorageKey(contentType));
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<PersistedState>) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveToStorage(contentType: ContentItemType, state: PersistedState) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(getStorageKey(contentType), JSON.stringify(state));
  } catch {
    // sessionStorage unavailable — silent fail
  }
}

export function ContentCreationProvider({
  children,
  contentType,
}: {
  children: React.ReactNode;
  contentType: ContentItemType;
}) {
  // Initialise from sessionStorage so intent survives cross-segment navigations
  const [state, setState] = useState<PersistedState>(() => loadFromStorage(contentType));

  // Persist every change
  useEffect(() => {
    saveToStorage(contentType, state);
  }, [contentType, state]);

  const setCreationMode = useCallback((mode: CreationMode) => {
    setState((prev) => ({ ...prev, creationMode: mode }));
  }, []);

  const setCurrentStep = useCallback((step: CreationStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setIntent = useCallback((intent: string) => {
    setState((prev) => ({ ...prev, intent }));
  }, []);

  const setContext = useCallback((context: string) => {
    setState((prev) => ({ ...prev, context }));
  }, []);

  const setPersonalization = useCallback((personalization: PersonalizationData) => {
    setState((prev) => ({ ...prev, personalization }));
  }, []);

  const setScript = useCallback((script: string) => {
    setState((prev) => ({ ...prev, script }));
  }, []);

  const setVoiceId = useCallback((voiceId: string | null) => {
    setState((prev) => ({ ...prev, voiceId }));
  }, []);

  const setVoiceType = useCallback((voiceType: 'own' | 'ai' | null) => {
    setState((prev) => ({ ...prev, voiceType }));
  }, []);

  const setAudioSettings = useCallback((audioSettings: AudioSettings) => {
    setState((prev) => ({ ...prev, audioSettings }));
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
    if (typeof window !== 'undefined') {
      try { sessionStorage.removeItem(getStorageKey(contentType)); } catch { /* noop */ }
    }
  }, [contentType]);

  const value: ContentCreationContextType = {
    contentType,
    creationMode: state.creationMode,
    currentStep: state.currentStep,
    intent: state.intent,
    context: state.context,
    personalization: state.personalization,
    script: state.script,
    voiceId: state.voiceId,
    voiceType: state.voiceType,
    audioSettings: state.audioSettings,
    setCreationMode,
    setCurrentStep,
    setIntent,
    setContext,
    setPersonalization,
    setScript,
    setVoiceId,
    setVoiceType,
    setAudioSettings,
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
