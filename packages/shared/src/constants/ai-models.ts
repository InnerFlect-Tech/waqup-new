/**
 * AI model identifiers — single source of truth.
 * Updating a model string here propagates across all routes and services.
 */

export const AI_MODELS = {
  /** Script generation (cost-optimised) */
  SCRIPT_GENERATION: 'gpt-4o-mini',
  /** Conversational creation guide */
  CONVERSATION: 'gpt-4o-mini',
  /** Orb chat (real-time voice-first) */
  ORB_CHAT: 'gpt-4o-mini',
  /** Agent mode — autonomous full draft (GPT-4o for quality) */
  AGENT: 'gpt-4o',
  /** Standard TTS — highest quality cloned voice */
  TTS_STANDARD: 'eleven_multilingual_v2',
  /** Real-time TTS — low latency for Oracle / live voice */
  TTS_REALTIME: 'eleven_flash_v2_5',
} as const;

export type AiModelKey = keyof typeof AI_MODELS;
