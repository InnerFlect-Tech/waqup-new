/**
 * Content creation credit costs - single source of truth.
 *
 * Creation modes:
 *  - form:  User fills structured fields. Cost = base (voice cost only).
 *  - chat:  GPT-4o-mini conversation guides creation. Flat fee = 3 Qs.
 *  - agent: GPT-4o autonomous agent drafts content. Flat fee = 7 Qs.
 *
 * Voice cost is added on top when using AI voice (ElevenLabs TTS).
 */

import type { ContentItemType } from '../types/content';

export type { ContentItemType };

export type CreationMode = 'form' | 'chat' | 'agent';

export const CONTENT_CREDIT_COSTS = {
  affirmation: { base: 1, withAi: 2 },
  meditation: { base: 2, withAi: 4 },
  ritual: { base: 5, withAi: 10 },
} as const;

/** Flat AI mode fees (applied regardless of content type) */
export const AI_MODE_COSTS: Record<CreationMode, number> = {
  form: 0,
  chat: 3,
  agent: 7,
} as const;

/**
 * Total credit cost for a creation:
 *  = AI mode fee + voice cost (if AI voice used)
 */
export function getCreditCost(
  type: ContentItemType,
  mode: CreationMode,
  useAiVoice: boolean,
): number {
  const voiceCost = useAiVoice ? CONTENT_CREDIT_COSTS[type].withAi : CONTENT_CREDIT_COSTS[type].base;
  return AI_MODE_COSTS[mode] + voiceCost;
}

/**
 * Per-API-route credit costs — charged server-side on every successful call.
 * These are the canonical values used in both the API gate and the UI warning.
 */
export const API_ROUTE_COSTS = {
  /** POST /api/conversation — 1Q per AI reply in the chat creation flow */
  conversation: 1,
  /** POST /api/generate-script — 2Q per script generation or regeneration */
  generateScript: 2,
  /** POST /api/ai/agent — 7Q flat fee (GPT-4o, autonomous draft) */
  aiAgent: 7,
  /** POST /api/oracle/session — 1Q per session bundle (each Q = 3 oracle replies) */
  oracleSession: 1,
  /** POST /api/ai/tts — fallback; TTS uses getTtsCreditsForScript for variable cost */
  aiTts: 1,
  /** POST /api/voices — 50Q per new voice slot (ElevenLabs IVC for a person you care about) */
  voiceSlot: 50,
} as const;

export type ApiRouteCostKey = keyof typeof API_ROUTE_COSTS;

/**
 * Max recording duration (seconds) per content type.
 * User records full script; auto-stop when limit reached.
 */
export const RECORDING_LIMITS_SEC: Record<ContentItemType, number> = {
  affirmation: 120,  // 2 min — short scripts
  meditation: 300,   // 5 min — guided, slower pace
  ritual: 600,       // 10 min — longer rituals
} as const;

/**
 * Tiered credits for TTS render by script length (~5x profit on ElevenLabs at €0.10/Q).
 * Own-voice recording uses base credits only (no TTS cost).
 */
const TTS_CREDIT_BANDS: Array<{ maxChars: number; credits: number }> = [
  { maxChars: 500, credits: 4 },
  { maxChars: 1500, credits: 10 },
  { maxChars: 3500, credits: 22 },
  { maxChars: 8000, credits: 50 },
  { maxChars: Infinity, credits: 72 },
];

/**
 * Credits for TTS render based on script length.
 * Use for AI voice and Library voice (ElevenLabs).
 */
export function getTtsCreditsForScript(script: string): number {
  const chars = script.length;
  const band = TTS_CREDIT_BANDS.find((b) => chars <= b.maxChars);
  return band?.credits ?? 72;
}

/** Estimate duration in minutes from character count (~800 chars/min speech rate). */
export function estimateDurationMinutes(chars: number): number {
  return Math.round((chars / 800) * 10) / 10;
}
