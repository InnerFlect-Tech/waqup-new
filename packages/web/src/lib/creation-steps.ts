import { Sparkles, Brain, Music } from 'lucide-react';
import type React from 'react';
import type { CreationStep, ContentType } from '@/lib/contexts/ContentCreationContext';

export interface PipelineStep {
  step: CreationStep;
  label: string;
  description: string;
  orbPrompt: string;
  conversationKey: string;
  formRoute: (type: ContentType) => string;
  applyToTypes: ContentType[];
}

export interface ContentTypeMeta {
  color: string;
  emoji: string;
  label: string;
  description: string;
  scienceTag: string;
}

export const CONTENT_TYPE_META: Record<ContentType, ContentTypeMeta> = {
  affirmation: {
    color: '#c084fc',
    emoji: '✦',
    label: 'Affirmation',
    description: 'Cognitive re-patterning through voice and positive language',
    scienceTag: 'neuroplasticity',
  },
  meditation: {
    color: '#60a5fa',
    emoji: '◎',
    label: 'Meditation',
    description: 'State induction through guided visualization and relaxation',
    scienceTag: 'relaxed-states',
  },
  ritual: {
    color: '#34d399',
    emoji: '⬡',
    label: 'Ritual',
    description: 'Identity encoding through intentional practice and voice',
    scienceTag: 'identity-encoding',
  },
};

export const ALL_PIPELINE_STEPS: PipelineStep[] = [
  {
    step: 'intent',
    label: 'Set Your Intent',
    description: 'Articulate the change or state you are seeking',
    orbPrompt: 'What do you want to change or create in your life?',
    conversationKey: 'intent',
    formRoute: (type) => `/sanctuary/${type}s/create/intent`,
    applyToTypes: ['affirmation', 'meditation', 'ritual'],
  },
  {
    step: 'context',
    label: 'Add Context',
    description: 'When, where, and the situation surrounding your practice',
    orbPrompt: 'When and where will you practice this? Morning, evening, or a specific moment?',
    conversationKey: 'context',
    formRoute: (type) => `/sanctuary/${type}s/create/context`,
    applyToTypes: ['meditation', 'ritual'],
  },
  {
    step: 'personalization',
    label: 'Your Values',
    description: 'Core values, personal name, and why this matters deeply to you',
    orbPrompt: 'What core values are most important to you, and why does this transformation matter?',
    conversationKey: 'personalization',
    formRoute: (type) => `/sanctuary/${type}s/create/personalization`,
    applyToTypes: ['ritual'],
  },
  {
    step: 'script',
    label: 'Your Script',
    description: 'AI generates your personalised script from all gathered context',
    orbPrompt: 'Ready to generate your script — is there anything else you want to add?',
    conversationKey: 'script',
    formRoute: (type) => `/sanctuary/${type}s/create/script`,
    applyToTypes: ['affirmation', 'meditation', 'ritual'],
  },
  {
    step: 'voice',
    label: 'Choose Voice',
    description: 'Record your own voice or use ElevenLabs AI voice',
    orbPrompt: 'Record your own voice for the deepest impact, or choose AI voice.',
    conversationKey: 'voice',
    formRoute: (type) => `/sanctuary/${type}s/create/voice`,
    applyToTypes: ['affirmation', 'meditation', 'ritual'],
  },
  {
    step: 'audio',
    label: 'Mix & Enhance',
    description: 'Add sacred frequencies, background soundscapes, and audio effects',
    orbPrompt: 'Customize your audio with frequencies and ambient sounds.',
    conversationKey: 'audio',
    formRoute: (type) => `/sanctuary/${type}s/create/audio`,
    applyToTypes: ['affirmation', 'meditation', 'ritual'],
  },
  {
    step: 'review',
    label: 'Review',
    description: 'Preview your complete creation and save it to your sanctuary',
    orbPrompt: 'Your creation is ready. Review it and save to your sanctuary.',
    conversationKey: 'review',
    formRoute: (type) => `/sanctuary/${type}s/create/review`,
    applyToTypes: ['affirmation', 'meditation', 'ritual'],
  },
];

export function getStepsForType(type: ContentType): PipelineStep[] {
  return ALL_PIPELINE_STEPS.filter((s) => s.applyToTypes.includes(type));
}

export function getStepIndex(type: ContentType, step: CreationStep): number {
  const steps = getStepsForType(type);
  return steps.findIndex((s) => s.step === step);
}

export function getNextStep(type: ContentType, current: CreationStep): PipelineStep | null {
  const steps = getStepsForType(type);
  const idx = steps.findIndex((s) => s.step === current);
  return idx !== -1 && idx < steps.length - 1 ? steps[idx + 1] : null;
}

export function getPrevStep(type: ContentType, current: CreationStep): PipelineStep | null {
  const steps = getStepsForType(type);
  const idx = steps.findIndex((s) => s.step === current);
  return idx > 0 ? steps[idx - 1] : null;
}

/** Lucide icon components keyed by content type — single source of truth for type icons */
export const CONTENT_TYPE_ICONS: Record<ContentType, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  affirmation: Sparkles,
  meditation: Brain,
  ritual: Music,
};

/**
 * Save creation state to sessionStorage so the voice step can pick it up.
 * Called by both the conversation page and the orb page when script is ready.
 */
export function saveCreationHandoff(type: ContentType, script: string, intent: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `waqup_creation_${type}`;
    const existing = JSON.parse(sessionStorage.getItem(key) ?? '{}') as Record<string, unknown>;
    sessionStorage.setItem(key, JSON.stringify({ ...existing, script, intent, currentStep: 'script' }));
  } catch {
    // sessionStorage unavailable (SSR or private mode)
  }
}

/** Conversation-mode: prompts the AI should address per step, per type */
export const CONVERSATION_STEP_PROMPTS: Record<ContentType, Array<{ step: CreationStep; question: string }>> = {
  affirmation: [
    { step: 'intent', question: 'What area of your life would you like to strengthen or change?' },
    { step: 'script', question: 'Let me generate your affirmation script now.' },
  ],
  meditation: [
    { step: 'intent', question: 'What state are you looking to access — sleep, calm, focus, or something else?' },
    { step: 'context', question: 'When and where will you practice this meditation?' },
    { step: 'script', question: 'Let me create your guided meditation now.' },
  ],
  ritual: [
    { step: 'intent', question: 'What transformation are you working toward?' },
    { step: 'context', question: 'What is the situation and emotional state you want to shift?' },
    { step: 'personalization', question: 'What core values guide you, and why does this transformation matter deeply?' },
    { step: 'script', question: 'Let me craft your ritual now.' },
  ],
};
