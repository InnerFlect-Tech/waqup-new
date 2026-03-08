/**
 * Orb AI Engine types
 *
 * Covers the add-on system, credit-consent flow, and message types for the
 * Orb conversation engine. Shared across Web and Mobile.
 */

// ─── Add-on keys ─────────────────────────────────────────────────────────────

export type OrbAddonKey = 'base_llm' | 'user_context' | 'collective_wisdom';

// ─── Orb config (from DB / API) ───────────────────────────────────────────────

export interface OrbAddon {
  addonKey: OrbAddonKey;
  enabled: boolean;
  userConfigurable: boolean;
  label: string;
  description: string;
  costQs: number;
}

/** Full Orb configuration: global flags merged with user preferences */
export interface OrbConfig {
  addons: OrbAddon[];
}

/** Resolved view: which add-ons are actually active for the current user+session */
export interface ActiveAddons {
  baseLlm: boolean;
  userContext: boolean;
  collectiveWisdom: boolean;
}

// ─── Chat messages ────────────────────────────────────────────────────────────

export type OrbMessageRole = 'user' | 'assistant' | 'system';

export interface OrbMessage {
  role: OrbMessageRole;
  content: string;
}

// ─── Credit consent ───────────────────────────────────────────────────────────

export interface CreditAction {
  addonKey: OrbAddonKey;
  label: string;
  costQs: number;
}

/** Emitted by the API / state machine when credit consent is required */
export interface CreditConsentRequest {
  actions: CreditAction[];
  totalCostQs: number;
}

// ─── Conversation state machine ───────────────────────────────────────────────

export type ConversationStep =
  | 'init'
  | 'intent'
  | 'context'
  | 'personalization'
  | 'script'
  | 'voice'
  | 'audio'
  | 'review'
  | 'complete';

// ─── API request / response shapes ───────────────────────────────────────────

export interface OrbChatRequest {
  messages: OrbMessage[];
  contentType: 'affirmation' | 'meditation' | 'ritual' | null;
  step: ConversationStep;
  /** Which add-ons the user consented to for this message */
  activeAddons: OrbAddonKey[];
}

export interface OrbChatResponse {
  reply: string;
  step: ConversationStep;
  /** Credits deducted for this exchange */
  creditsUsed: number;
}

export interface OrbConfigResponse {
  addons: OrbAddon[];
  /** Current user credit balance */
  balance: number;
}
