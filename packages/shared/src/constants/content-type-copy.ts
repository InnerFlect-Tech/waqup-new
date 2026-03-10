/**
 * Canonical content type descriptions — single source of truth.
 * Use across web and mobile for consistency.
 */

import type { ContentItemType } from '../types/content';

export interface ContentTypeCopy {
  label: string;
  shortDesc: string;
  longDesc: string;
  duration: string;
  depth: string;
  scienceTag: string;
}

export const CONTENT_TYPE_COPY: Record<ContentItemType, ContentTypeCopy> = {
  affirmation: {
    label: 'Affirmation',
    shortDesc: 'Short, powerful statements. Replay daily.',
    longDesc: 'Cognitive re-patterning through voice and positive language. Listen each morning to reprogram the beliefs that shape every decision you make.',
    duration: '2–5 min',
    depth: 'Daily ritual',
    scienceTag: 'neuroplasticity',
  },
  meditation: {
    label: 'Meditation',
    shortDesc: 'Guided journeys. Set the scene, then relax.',
    longDesc: 'State induction through guided visualization and relaxation. AI-scripted sessions designed for your emotional goals, voiced by you.',
    duration: '10–30 min',
    depth: 'State induction',
    scienceTag: 'relaxed-states',
  },
  ritual: {
    label: 'Ritual',
    shortDesc: 'Deeper work. Your values, your voice.',
    longDesc: 'Identity encoding through intentional practice and voice. Multi-part practices combining breathwork, visualization, and affirmations.',
    duration: '20–60 min',
    depth: 'Identity encoding',
    scienceTag: 'identity-encoding',
  },
};
