import type { ContentItemType } from './content';

export type PracticeLevel = 'seeker' | 'practitioner' | 'alchemist' | 'master';

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
  practitioner: 150,
  alchemist: 500,
  master: 1000,
};

/** XP earned per session by content type */
export const SESSION_XP: Record<ContentItemType, number> = {
  affirmation: 5,
  meditation: 10,
  ritual: 15,
};

/** Taglines shown in the identity hero section per level */
export const LEVEL_TAGLINES: Record<PracticeLevel, string> = {
  seeker: 'Your journey begins. The subconscious is listening.',
  practitioner: 'New patterns are forming beneath the surface.',
  alchemist: 'You are transmuting resistance into identity.',
  master: 'You are encoding a new version of yourself, daily.',
};

export function xpToLevel(xp: number): PracticeLevel {
  if (xp >= LEVEL_THRESHOLDS.master) return 'master';
  if (xp >= LEVEL_THRESHOLDS.alchemist) return 'alchemist';
  if (xp >= LEVEL_THRESHOLDS.practitioner) return 'practitioner';
  return 'seeker';
}

export function xpToNextLevel(xp: number): number {
  if (xp >= LEVEL_THRESHOLDS.master) return 0;
  if (xp >= LEVEL_THRESHOLDS.alchemist) return LEVEL_THRESHOLDS.master - xp;
  if (xp >= LEVEL_THRESHOLDS.practitioner) return LEVEL_THRESHOLDS.alchemist - xp;
  return LEVEL_THRESHOLDS.practitioner - xp;
}

export function xpProgressPercent(xp: number): number {
  if (xp >= LEVEL_THRESHOLDS.master) return 100;
  if (xp >= LEVEL_THRESHOLDS.alchemist) {
    return ((xp - LEVEL_THRESHOLDS.alchemist) / (LEVEL_THRESHOLDS.master - LEVEL_THRESHOLDS.alchemist)) * 100;
  }
  if (xp >= LEVEL_THRESHOLDS.practitioner) {
    return ((xp - LEVEL_THRESHOLDS.practitioner) / (LEVEL_THRESHOLDS.alchemist - LEVEL_THRESHOLDS.practitioner)) * 100;
  }
  return (xp / LEVEL_THRESHOLDS.practitioner) * 100;
}
