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
  messages: ChatMessage[],
  getSession: () => Promise<{ data: { session: { access_token: string } | null } }>
): Promise<ConversationResponse> {
  const res = await fetch(`${API_BASE_URL}/api/conversation`, {
    method: 'POST',
    headers: await authHeaders(getSession),
    body: JSON.stringify({ type, messages }),
  });
  if (!res.ok) throw new Error(`Conversation API error: ${res.status}`);
  return res.json() as Promise<ConversationResponse>;
}

export async function generateScript(
  type: ContentItemType,
  intent: string,
  context: string | undefined,
  getSession: () => Promise<{ data: { session: { access_token: string } | null } }>
): Promise<ScriptResponse> {
  const res = await fetch(`${API_BASE_URL}/api/generate-script`, {
    method: 'POST',
    headers: await authHeaders(getSession),
    body: JSON.stringify({ type, intent, context }),
  });
  if (!res.ok) throw new Error(`Generate script API error: ${res.status}`);
  return res.json() as Promise<ScriptResponse>;
}

export async function generateAgentScript(
  type: ContentItemType,
  intent: string,
  options: { context?: string; name?: string; coreValues?: string[]; whyThisMatters?: string } | undefined,
  getSession: () => Promise<{ data: { session: { access_token: string } | null } }>
): Promise<ScriptResponse> {
  const res = await fetch(`${API_BASE_URL}/api/ai/agent`, {
    method: 'POST',
    headers: await authHeaders(getSession),
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
  getSession: () => Promise<{ data: { session: { access_token: string } | null } }>
): Promise<RenderResponse | RenderInsufficientCreditsError> {
  const res = await fetch(`${API_BASE_URL}/api/ai/render`, {
    method: 'POST',
    headers: await authHeaders(getSession),
    body: JSON.stringify({ contentId, text, voiceId }),
  });

  if (res.status === 402) {
    return res.json() as Promise<RenderInsufficientCreditsError>;
  }

  if (!res.ok) throw new Error(`Render API error: ${res.status}`);
  return res.json() as Promise<RenderResponse>;
}

export interface OracleSessionResponse {
  sessionId: string;
  repliesAllowed: number;
  qs: number;
  creditsUsed: number;
  expiresAt: string;
}

export interface OracleSessionInsufficientCreditsError {
  code: 'insufficient_credits';
  message: string;
  required: number;
  balance: number;
}

export interface OracleResponse {
  reply: string;
  creditsUsed?: number;
  repliesUsed?: number;
}

export interface OracleInsufficientCreditsError {
  code: 'insufficient_credits';
  message: string;
}

/** Creates an auth headers object with Bearer token from Supabase session. Caller must pass getSession. */
async function authHeaders(getSession: () => Promise<{ data: { session: { access_token: string } | null } }>): Promise<HeadersInit> {
  const { data: { session } } = await getSession();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }
  return headers;
}

/**
 * Starts an Oracle session. Costs 1 Q per bundle (3 replies).
 * Must be called before sendOracleMessage. Throws on insufficient credits.
 */
export async function createOracleSession(
  qs: number,
  getSession: () => Promise<{ data: { session: { access_token: string } | null } }>
): Promise<OracleSessionResponse> {
  const res = await fetch(`${API_BASE_URL}/api/oracle/session`, {
    method: 'POST',
    headers: await authHeaders(getSession),
    body: JSON.stringify({ qs: Math.max(1, Math.min(20, Math.round(qs))) }),
  });

  if (res.status === 402) {
    const data = await res.json() as { message?: string; required?: number; balance?: number };
    const err: OracleSessionInsufficientCreditsError & Error = Object.assign(
      new Error(data.message ?? 'Not enough Qs to start a session.'),
      {
        code: 'insufficient_credits' as const,
        required: data.required ?? 1,
        balance: data.balance ?? 0,
      }
    );
    throw err;
  }

  if (!res.ok) throw new Error(`Oracle session API error: ${res.status}`);
  const body = await res.json() as { sessionId: string; repliesAllowed: number; qs: number; creditsUsed: number; expiresAt: string };
  return {
    sessionId: body.sessionId,
    repliesAllowed: body.repliesAllowed,
    qs: body.qs,
    creditsUsed: body.creditsUsed,
    expiresAt: body.expiresAt,
  };
}

/**
 * Sends a conversation to the Oracle AI. Requires an active session (from createOracleSession).
 * Consumes one reply from the session. Throws when session exhausted or insufficient credits.
 */
export async function sendOracleMessage(
  sessionId: string,
  messages: ChatMessage[],
  getSession: () => Promise<{ data: { session: { access_token: string } | null } }>
): Promise<OracleResponse> {
  const res = await fetch(`${API_BASE_URL}/api/oracle`, {
    method: 'POST',
    headers: await authHeaders(getSession),
    body: JSON.stringify({ sessionId, messages }),
  });

  if (res.status === 402) {
    const data = await res.json() as { error?: string; message?: string };
    if (data.error === 'session_exhausted') {
      const err = Object.assign(
        new Error(data.message ?? 'Session used up. Start a new conversation.'),
        { code: 'session_exhausted' as const }
      );
      throw err;
    }
    const err: OracleInsufficientCreditsError & Error = Object.assign(
      new Error(data.message ?? 'Not enough Qs to continue.'),
      { code: 'insufficient_credits' as const }
    );
    throw err;
  }

  if (res.status === 404) throw new Error('Session not found. Please start a new conversation.');
  if (res.status === 410) throw new Error('Session expired. Please start a new conversation.');
  if (!res.ok) throw new Error(`Oracle API error: ${res.status}`);
  const body = await res.json() as { reply: string; repliesUsed?: number };
  return { reply: body.reply, repliesUsed: body.repliesUsed };
}
