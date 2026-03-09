/**
 * Web API client — typed wrappers around Next.js API routes.
 * All fetch calls to /api/* should go through here, not inline in components.
 */

import type { UserVoice } from '@waqup/shared/types';
import type { ContentItemType } from '@waqup/shared/types';
import type { ProgressStats, ProgressHeatmap, RecentSession, ReflectionMessage, PersonalizationData } from '@waqup/shared/types';

// ─── Voices ──────────────────────────────────────────────────────────────────

export interface VoiceStatus {
  voice_id: string | null;
  name: string | null;
  language: string | null;
  status: 'not_setup' | 'processing' | 'ready';
}

export async function getVoices(): Promise<UserVoice[]> {
  const res = await fetch('/api/voices');
  if (!res.ok) return [];
  const data = (await res.json()) as { voices: UserVoice[] };
  return data.voices ?? [];
}

export async function getVoiceStatus(): Promise<VoiceStatus> {
  const res = await fetch('/api/voice');
  const data = (await res.json()) as VoiceStatus & { error?: { message: string } };
  if (!res.ok) throw new Error(data.error?.message ?? 'Failed to fetch voice status');
  return data;
}

export async function createVoice(formData: FormData): Promise<void> {
  const res = await fetch('/api/voice/create', { method: 'POST', body: formData });
  const data = (await res.json()) as { error?: { message: string } };
  if (!res.ok) throw new Error(data.error?.message ?? 'Failed to create voice');
}

export async function uploadVoiceSamples(formData: FormData): Promise<void> {
  const res = await fetch('/api/voice/samples', { method: 'POST', body: formData });
  const data = (await res.json()) as { error?: { message: string } };
  if (!res.ok) throw new Error(data.error?.message ?? 'Failed to upload samples');
}

export async function previewVoice(text: string): Promise<Blob> {
  const res = await fetch('/api/voice/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: { message: string } };
    throw new Error(data.error?.message ?? 'Failed to generate preview');
  }
  return res.blob();
}

// ─── Script generation ────────────────────────────────────────────────────────

export interface GenerateScriptInput {
  type: ContentItemType;
  intent: string;
  context?: string;
  personalization?: PersonalizationData;
}

export async function generateScript(input: GenerateScriptInput): Promise<string> {
  const res = await fetch('/api/generate-script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = (await res.json()) as { script?: string; error?: string; message?: string };
  if (!res.ok) {
    if (res.status === 401) throw new Error('Please sign in to generate a script.');
    if (res.status === 402) throw new Error(body.message ?? 'Insufficient Qs. Get more Qs to continue.');
    throw new Error(body.error ?? `Server error ${res.status}`);
  }
  const script = body.script;
  if (!script) throw new Error('AI returned an empty script. Please try again.');
  return script;
}

// ─── Marketplace ──────────────────────────────────────────────────────────────

export interface MarketplaceItem {
  id: string;
  contentItemId: string;
  creatorId: string;
  type: 'affirmation' | 'ritual' | 'meditation';
  title: string;
  description: string;
  duration: string;
  playCount: number;
  shareCount: number;
  isElevated: boolean;
  creatorName?: string;
}

type SortId = 'trending' | 'recent' | 'top';

function normalizeMarketplaceItem(raw: Record<string, unknown>): MarketplaceItem | null {
  const ci = raw.content_items as Record<string, unknown> | null;
  if (!ci) return null;
  return {
    id: raw.id as string,
    contentItemId: raw.content_item_id as string,
    creatorId: raw.creator_id as string,
    type: ci.type as MarketplaceItem['type'],
    title: ci.title as string,
    description: (ci.description as string) ?? '',
    duration: (ci.duration as string) ?? '',
    playCount: (raw.play_count as number) ?? 0,
    shareCount: (raw.share_count as number) ?? 0,
    isElevated: (raw.is_elevated as boolean) ?? false,
  };
}

export async function getMarketplaceItems(params: {
  type?: string;
  elevated?: boolean;
  sort?: SortId;
  limit?: number;
}): Promise<MarketplaceItem[]> {
  const qs = new URLSearchParams();
  if (params.type && params.type !== 'all') qs.set('type', params.type);
  if (params.elevated) qs.set('elevated', 'true');
  if (params.sort) qs.set('sort', params.sort);
  qs.set('limit', String(params.limit ?? 24));

  const res = await fetch(`/api/marketplace/items?${qs.toString()}`);
  if (!res.ok) return [];
  const json = (await res.json()) as { items: Record<string, unknown>[] };
  return (json.items ?? []).flatMap((r) => {
    const item = normalizeMarketplaceItem(r);
    return item ? [item] : [];
  });
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface ProgressStatsResponse {
  stats: ProgressStats;
  heatmap: ProgressHeatmap;
  recentSessions: RecentSession[];
}

export async function getProgressStats(): Promise<ProgressStatsResponse | null> {
  const res = await fetch('/api/progress/stats');
  if (!res.ok) return null;
  return res.json() as Promise<ProgressStatsResponse>;
}

// ─── Reflection ───────────────────────────────────────────────────────────────

export interface ReflectionChatResponse {
  reply: string;
  readyToSummarize: boolean;
  aiSummary: string | null;
}

export async function reflectionChat(
  messages: ReflectionMessage[],
  energyLevel?: number | null
): Promise<ReflectionChatResponse> {
  const res = await fetch('/api/reflection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'chat', messages, energyLevel }),
  });
  if (!res.ok) throw new Error('Reflection chat failed');
  return res.json() as Promise<ReflectionChatResponse>;
}

export async function saveReflection(params: {
  messages: ReflectionMessage[];
  energyLevel?: number;
  notes?: string;
  aiSummary?: string;
}): Promise<void> {
  await fetch('/api/reflection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'save', ...params }),
  });
}

export async function generateWeeklySynthesis(summaries: string[]): Promise<string | null> {
  const res = await fetch('/api/reflection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'weekly_synthesis', summaries }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { synthesis: string };
  return json.synthesis ?? null;
}
