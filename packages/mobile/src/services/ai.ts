/**
 * Mobile AI service — proxies all AI calls through the Next.js web server.
 * This keeps API keys server-side and never exposes them to the mobile client.
 */
import { API_BASE_URL } from '@/constants/app';
import type { ContentItemType } from '@waqup/shared/types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConversationResponse {
  reply: string;
  shouldGenerateScript: boolean;
}

export interface ScriptResponse {
  script: string;
}

export async function sendConversationMessage(
  type: ContentItemType,
  messages: ChatMessage[]
): Promise<ConversationResponse> {
  const res = await fetch(`${API_BASE_URL}/api/conversation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, messages }),
  });
  if (!res.ok) throw new Error(`Conversation API error: ${res.status}`);
  return res.json() as Promise<ConversationResponse>;
}

export async function generateScript(
  type: ContentItemType,
  intent: string,
  context?: string
): Promise<ScriptResponse> {
  const res = await fetch(`${API_BASE_URL}/api/generate-script`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, intent, context }),
  });
  if (!res.ok) throw new Error(`Generate script API error: ${res.status}`);
  return res.json() as Promise<ScriptResponse>;
}

export async function generateAgentScript(
  type: ContentItemType,
  intent: string,
  options?: {
    context?: string;
    name?: string;
    coreValues?: string[];
    whyThisMatters?: string;
  }
): Promise<ScriptResponse> {
  const res = await fetch(`${API_BASE_URL}/api/ai/agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, intent, ...options }),
  });
  if (!res.ok) throw new Error(`Agent API error: ${res.status}`);
  return res.json() as Promise<ScriptResponse>;
}

export interface RenderResponse {
  audioUrl: string | null;
  storagePath: string | null;
  creditsUsed: number;
}

export interface RenderInsufficientCreditsError {
  error: 'insufficient_credits';
  message: string;
  required: number;
  balance: number;
}

/**
 * Renders a content item's script to audio using ElevenLabs TTS via the web server.
 * Deducts 1Q server-side. Returns the audio URL on success.
 */
export async function renderContentAudio(
  contentId: string,
  text: string,
  voiceId: string,
): Promise<RenderResponse | RenderInsufficientCreditsError> {
  const res = await fetch(`${API_BASE_URL}/api/ai/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentId, text, voiceId }),
  });

  if (res.status === 402) {
    return res.json() as Promise<RenderInsufficientCreditsError>;
  }

  if (!res.ok) throw new Error(`Render API error: ${res.status}`);
  return res.json() as Promise<RenderResponse>;
}

export interface OracleResponse {
  reply: string;
  creditsUsed: number;
}

export interface OracleInsufficientCreditsError {
  code: 'insufficient_credits';
  message: string;
}

/**
 * Sends a conversation to the Oracle voice AI.
 * Costs 1 Q per reply — deducted server-side.
 * Throws `OracleInsufficientCreditsError` when the user has no credits.
 */
export async function sendOracleMessage(
  messages: ChatMessage[]
): Promise<OracleResponse> {
  const res = await fetch(`${API_BASE_URL}/api/oracle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (res.status === 402) {
    const data = await res.json() as { message?: string };
    const err: OracleInsufficientCreditsError & Error = Object.assign(
      new Error(data.message ?? 'Not enough Qs to continue.'),
      { code: 'insufficient_credits' as const }
    );
    throw err;
  }

  if (!res.ok) throw new Error(`Oracle API error: ${res.status}`);
  return res.json() as Promise<OracleResponse>;
}
