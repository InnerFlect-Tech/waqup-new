import type { ContentItemType } from './content';

export type PracticeLevel =
  | 'seeker'
  | 'initiate'
  | 'explorer'
  | 'practitioner'
  | 'adept'
  | 'alchemist'
  | 'sage'
  | 'master';

export interface PracticeSession {
  id: string;
  userId: string;
  contentItemId: string | null;
  contentType: ContentItemType;
  durationSeconds: number;
  playedAt: string;
}

export interface ReflectionMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ReflectionEntry {
  id: string;
  userId: string;
  energyLevel: number | null;
  notes: string | null;
  messages: ReflectionMessage[];
  aiSummary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressStats {
  streak: number;
  totalSessions: number;
  minutesPracticed: number;
  contentCreated: number;
  totalXp: number;
  affirmationXp: number;
  meditationXp: number;
  ritualXp: number;
  level: PracticeLevel;
  xpToNext: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
  dominantType?: ContentItemType | null;
}

export interface ProgressHeatmap {
  weeks: HeatmapDay[][];
  startDate: string;
  endDate: string;
}

export interface RecentSession {
  contentType: ContentItemType;
  title: string | null;
  durationSeconds: number;
  playedAt: string;
}

/** XP thresholds per level */
export const LEVEL_THRESHOLDS: Record<PracticeLevel, number> = {
  seeker: 0,
  initiate: 25,
  explorer: 50,
  practitioner: 100,
  adept: 200,
  alchemist: 400,
  sage: 600,
  master: 1000,
};

/** Ordered from lowest to highest XP */
export const LEVEL_ORDER: PracticeLevel[] = [
  'seeker',
  'initiate',
  'explorer',
  'practitioner',
  'adept',
  'alchemist',
  'sage',
  'master',
];

/** XP thresholds for feature unlocks */
export const UNLOCK_THRESHOLDS = {
  ivc: 25,
  exportAudio: 50,
  creator: 100,
} as const;

/** XP earned per session by content type */
export const SESSION_XP: Record<ContentItemType, number> = {
  affirmation: 5,
  meditation: 10,
  ritual: 15,
};

/** Colors for level badges and UI */
export const LEVEL_COLORS: Record<PracticeLevel, string> = {
  seeker: '#60a5fa',
  initiate: '#a78bfa',
  explorer: '#34d399',
  practitioner: '#a78bfa',
  adept: '#f59e0b',
  alchemist: '#f59e0b',
  sage: '#8b5cf6',
  master: '#10b981',
};

/** Taglines shown in the identity hero section per level */
export const LEVEL_TAGLINES: Record<PracticeLevel, string> = {
  seeker: 'Your journey begins. The subconscious is listening.',
  initiate: 'A few tryouts — your voice awaits.',
  explorer: 'You are uncovering what lies beneath.',
  practitioner: 'New patterns are forming beneath the surface.',
  adept: 'Practice is becoming second nature.',
  alchemist: 'You are transmuting resistance into identity.',
  sage: 'Your practice has deepened into wisdom.',
  master: 'You are encoding a new version of yourself, daily.',
};

export function xpToLevel(xp: number): PracticeLevel {
  if (xp >= LEVEL_THRESHOLDS.master) return 'master';
  if (xp >= LEVEL_THRESHOLDS.sage) return 'sage';
  if (xp >= LEVEL_THRESHOLDS.alchemist) return 'alchemist';
  if (xp >= LEVEL_THRESHOLDS.adept) return 'adept';
  if (xp >= LEVEL_THRESHOLDS.practitioner) return 'practitioner';
  if (xp >= LEVEL_THRESHOLDS.explorer) return 'explorer';
  if (xp >= LEVEL_THRESHOLDS.initiate) return 'initiate';
  return 'seeker';
}

export function xpToNextLevel(xp: number): number {
  if (xp >= LEVEL_THRESHOLDS.master) return 0;
  if (xp >= LEVEL_THRESHOLDS.sage) return LEVEL_THRESHOLDS.master - xp;
  if (xp >= LEVEL_THRESHOLDS.alchemist) return LEVEL_THRESHOLDS.sage - xp;
  if (xp >= LEVEL_THRESHOLDS.adept) return LEVEL_THRESHOLDS.alchemist - xp;
  if (xp >= LEVEL_THRESHOLDS.practitioner) return LEVEL_THRESHOLDS.adept - xp;
  if (xp >= LEVEL_THRESHOLDS.explorer) return LEVEL_THRESHOLDS.practitioner - xp;
  if (xp >= LEVEL_THRESHOLDS.initiate) return LEVEL_THRESHOLDS.explorer - xp;
  return LEVEL_THRESHOLDS.initiate - xp;
}

export function xpProgressPercent(xp: number): number {
  if (xp >= LEVEL_THRESHOLDS.master) return 100;
  if (xp >= LEVEL_THRESHOLDS.sage) {
    return (
      ((xp - LEVEL_THRESHOLDS.sage) /
        (LEVEL_THRESHOLDS.master - LEVEL_THRESHOLDS.sage)) *
      100
    );
  }
  if (xp >= LEVEL_THRESHOLDS.alchemist) {
    return (
      ((xp - LEVEL_THRESHOLDS.alchemist) /
        (LEVEL_THRESHOLDS.sage - LEVEL_THRESHOLDS.alchemist)) *
      100
    );
  }
  if (xp >= LEVEL_THRESHOLDS.adept) {
    return (
      ((xp - LEVEL_THRESHOLDS.adept) /
        (LEVEL_THRESHOLDS.alchemist - LEVEL_THRESHOLDS.adept)) *
      100
    );
  }
  if (xp >= LEVEL_THRESHOLDS.practitioner) {
    return (
      ((xp - LEVEL_THRESHOLDS.practitioner) /
        (LEVEL_THRESHOLDS.adept - LEVEL_THRESHOLDS.practitioner)) *
      100
    );
  }
  if (xp >= LEVEL_THRESHOLDS.explorer) {
    return (
      ((xp - LEVEL_THRESHOLDS.explorer) /
        (LEVEL_THRESHOLDS.practitioner - LEVEL_THRESHOLDS.explorer)) *
      100
    );
  }
  if (xp >= LEVEL_THRESHOLDS.initiate) {
    return (
      ((xp - LEVEL_THRESHOLDS.initiate) /
        (LEVEL_THRESHOLDS.explorer - LEVEL_THRESHOLDS.initiate)) *
      100
    );
  }
  return (xp / LEVEL_THRESHOLDS.initiate) * 100;
}
