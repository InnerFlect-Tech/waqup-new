'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ContentItemType, PersonalizationData, AudioSettings, ConversationStep } from '@waqup/shared/types';
import { DEFAULT_AUDIO_SETTINGS } from '@waqup/shared/types';
import type { CreationMode } from '@waqup/shared/constants';
export type { CreationMode, PersonalizationData };

interface PersistedState {
  creationMode: CreationMode;
  currentStep: ConversationStep;
  intent: string;
  context: string;
  personalization: PersonalizationData;
  script: string;
  voiceId: string | null;
  voiceType: 'own' | 'ai' | null;
  /**
   * Supabase Storage public URL for a user-recorded voice blob.
   * Populated when voiceType === 'own' after the recording is uploaded.
   * The render route uses this URL directly as voice_url (no TTS generation needed).
   */
  ownVoiceUrl: string | null;
  audioSettings: AudioSettings;
}

interface ContentCreationContextType {
  contentType: ContentItemType;
  creationMode: CreationMode;
  currentStep: ConversationStep;
  intent: string;
  context: string;
  personalization: PersonalizationData;
  script: string;
  voiceId: string | null;
  voiceType: 'own' | 'ai' | null;
  ownVoiceUrl: string | null;
  audioSettings: AudioSettings;
  setCreationMode: (mode: CreationMode) => void;
  setCurrentStep: (step: ConversationStep) => void;
  setIntent: (intent: string) => void;
  setContext: (context: string) => void;
  setPersonalization: (data: PersonalizationData) => void;
  setScript: (script: string) => void;
  setVoiceId: (id: string | null) => void;
  setVoiceType: (type: 'own' | 'ai' | null) => void;
  setOwnVoiceUrl: (url: string | null) => void;
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
  ownVoiceUrl: null,
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

  const setCurrentStep = useCallback((step: ConversationStep) => {
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

  const setOwnVoiceUrl = useCallback((ownVoiceUrl: string | null) => {
    setState((prev) => ({ ...prev, ownVoiceUrl }));
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
    ownVoiceUrl: state.ownVoiceUrl,
    audioSettings: state.audioSettings,
    setCreationMode,
    setCurrentStep,
    setIntent,
    setContext,
    setPersonalization,
    setScript,
    setVoiceId,
    setVoiceType,
    setOwnVoiceUrl,
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
