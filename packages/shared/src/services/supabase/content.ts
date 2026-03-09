import type { SupabaseClient } from '@supabase/supabase-js';
import type { ContentItem, ContentItemType, ContentStatus, VoiceType, AudioSettings } from '../../types/content';
import { DEFAULT_AUDIO_SETTINGS } from '../../types/content';

export interface ContentServiceResult<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface CreateContentInput {
  type: ContentItemType;
  title: string;
  description: string;
  duration?: string;
  frequency?: string;
  script?: string;
  status?: ContentStatus;
  /** Legacy single-track URL — kept for backward compat */
  audioUrl?: string;
  /** Three-layer audio URLs */
  voiceUrl?: string;
  ambientUrl?: string;
  binauralUrl?: string;
  voiceType?: VoiceType;
  audioSettings?: AudioSettings;
}

export interface UpdateContentInput {
  title?: string;
  description?: string;
  duration?: string;
  frequency?: string;
  script?: string;
  status?: ContentStatus;
  audioUrl?: string;
  voiceUrl?: string;
  ambientUrl?: string;
  binauralUrl?: string;
  voiceType?: VoiceType;
  audioSettings?: AudioSettings;
}

/**
 * Maps a raw Supabase DB row to a ContentItem.
 * Handles both new AudioSettings shape and old legacy fields gracefully.
 */
function mapRow(row: Record<string, unknown>): ContentItem {
  const raw = row.audio_settings as Record<string, unknown> | null;

  let audioSettings: AudioSettings | undefined;
  if (raw) {
    audioSettings = {
      // New canonical fields (preferred)
      volumeVoice:   (raw.volumeVoice   as number  | undefined) ?? (raw.voiceVolume as number | undefined) ?? DEFAULT_AUDIO_SETTINGS.volumeVoice,
      volumeAmbient: (raw.volumeAmbient as number  | undefined) ?? (raw.musicVolume  as number | undefined) ?? DEFAULT_AUDIO_SETTINGS.volumeAmbient,
      volumeBinaural:(raw.volumeBinaural as number  | undefined) ?? DEFAULT_AUDIO_SETTINGS.volumeBinaural,
      volumeMaster:  (raw.volumeMaster  as number  | undefined) ?? DEFAULT_AUDIO_SETTINGS.volumeMaster,
      // Preset IDs — map legacy string labels to new stable IDs where possible
      binauralPresetId:   (raw.binauralPresetId   as string | undefined) ?? (raw.frequencyId as string | undefined) ?? DEFAULT_AUDIO_SETTINGS.binauralPresetId,
      atmospherePresetId: (raw.atmospherePresetId as string | undefined) ?? (raw.ambienceId   as string | undefined) ?? DEFAULT_AUDIO_SETTINGS.atmospherePresetId,
      fadeIn:  (raw.fadeIn  as boolean | undefined) ?? DEFAULT_AUDIO_SETTINGS.fadeIn,
      fadeOut: (raw.fadeOut as boolean | undefined) ?? DEFAULT_AUDIO_SETTINGS.fadeOut,
    };
  }

  return {
    id: row.id as string,
    type: row.type as ContentItemType,
    title: row.title as string,
    description: (row.description as string) || '',
    duration: (row.duration as string) || '',
    frequency: (row.frequency as string) || undefined,
    lastPlayed: (row.last_played_at as string) || undefined,
    script: (row.script as string) || undefined,
    status: ((row.status as string) || 'draft') as ContentStatus,
    // Legacy single-track URL
    audioUrl: (row.audio_url as string) || undefined,
    // Three-layer audio URLs
    voiceUrl:    (row.voice_url    as string) || undefined,
    ambientUrl:  (row.ambient_url  as string) || undefined,
    binauralUrl: (row.binaural_url as string) || undefined,
    // Per-content default volumes
    defaultVolVoice:    (row.default_vol_voice    as number) ?? undefined,
    defaultVolAmbient:  (row.default_vol_ambient  as number) ?? undefined,
    defaultVolBinaural: (row.default_vol_binaural as number) ?? undefined,
    voiceType: (row.voice_type as VoiceType) || undefined,
    audioSettings,
    // Marketplace fields
    isElevated: (row.is_elevated as boolean) ?? undefined,
    isListed:   (row.is_listed   as boolean) ?? undefined,
    playCount:  (row.play_count  as number)  ?? undefined,
    shareCount: (row.share_count as number)  ?? undefined,
    createdAt: (row.created_at as string) || undefined,
    updatedAt: (row.updated_at as string) || undefined,
  };
}

export function createContentService(client: SupabaseClient) {
  async function getUserContent(
    type?: ContentItemType
  ): Promise<ContentServiceResult<ContentItem[]>> {
    try {
      // Get the authenticated user explicitly so we can filter by user_id at the
      // query level. This works alongside (not instead of) RLS, ensuring the
      // library works correctly on all environments regardless of RLS config.
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        // Not signed in — return empty list gracefully rather than an error
        return { data: [], error: null, success: true };
      }

      let query = client
        .from('content_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return {
        data: (data || []).map(mapRow),
        error: null,
        success: true,
      };
    } catch {
      return { data: null, error: 'Failed to fetch content', success: false };
    }
  }

  async function getContentById(
    id: string
  ): Promise<ContentServiceResult<ContentItem>> {
    try {
      const { data, error } = await client
        .from('content_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: mapRow(data), error: null, success: true };
    } catch {
      return { data: null, error: 'Failed to fetch content item', success: false };
    }
  }

  async function createContent(
    input: CreateContentInput
  ): Promise<ContentServiceResult<ContentItem>> {
    try {
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        return { data: null, error: 'Not authenticated', success: false };
      }

      const { data, error } = await client
        .from('content_items')
        .insert({
          user_id: user.id,
          type: input.type,
          title: input.title,
          description: input.description || '',
          duration: input.duration || '',
          frequency: input.frequency || null,
          script: input.script || null,
          status: input.status || 'draft',
          audio_url: input.audioUrl || null,
          voice_url: input.voiceUrl || null,
          ambient_url: input.ambientUrl || null,
          binaural_url: input.binauralUrl || null,
          voice_type: input.voiceType || null,
          audio_settings: input.audioSettings || null,
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: mapRow(data), error: null, success: true };
    } catch {
      return { data: null, error: 'Failed to create content', success: false };
    }
  }

  async function updateContent(
    id: string,
    input: UpdateContentInput
  ): Promise<ContentServiceResult<ContentItem>> {
    try {
      const updatePayload: Record<string, unknown> = {};
      if (input.title !== undefined) updatePayload.title = input.title;
      if (input.description !== undefined) updatePayload.description = input.description;
      if (input.duration !== undefined) updatePayload.duration = input.duration;
      if (input.frequency !== undefined) updatePayload.frequency = input.frequency;
      if (input.script !== undefined) updatePayload.script = input.script;
      if (input.status !== undefined) updatePayload.status = input.status;
      if (input.audioUrl !== undefined) updatePayload.audio_url = input.audioUrl;
      if (input.voiceUrl !== undefined) updatePayload.voice_url = input.voiceUrl;
      if (input.ambientUrl !== undefined) updatePayload.ambient_url = input.ambientUrl;
      if (input.binauralUrl !== undefined) updatePayload.binaural_url = input.binauralUrl;
      if (input.voiceType !== undefined) updatePayload.voice_type = input.voiceType;
      if (input.audioSettings !== undefined) updatePayload.audio_settings = input.audioSettings;

      const { data, error } = await client
        .from('content_items')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: mapRow(data), error: null, success: true };
    } catch {
      return { data: null, error: 'Failed to update content', success: false };
    }
  }

  async function deleteContent(id: string): Promise<ContentServiceResult<void>> {
    try {
      const { error } = await client
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: null, error: null, success: true };
    } catch {
      return { data: null, error: 'Failed to delete content', success: false };
    }
  }

  async function recordPlay(
    id: string,
    durationSeconds = 0
  ): Promise<ContentServiceResult<void>> {
    try {
      // Update last_played_at on the content item
      const { data: contentRow, error: contentError } = await client
        .from('content_items')
        .update({ last_played_at: new Date().toISOString() })
        .eq('id', id)
        .select('type')
        .single();

      if (contentError) {
        return { data: null, error: contentError.message, success: false };
      }

      // Also insert a practice session row for progress tracking
      try {
        const {
          data: { user },
        } = await client.auth.getUser();
        if (user && contentRow?.type) {
          await client.from('practice_sessions').insert({
            user_id: user.id,
            content_item_id: id,
            content_type: contentRow.type,
            duration_seconds: durationSeconds,
          });
        }
      } catch {
        // Non-fatal: session insert failure should not block playback
      }

      return { data: null, error: null, success: true };
    } catch {
      return { data: null, error: 'Failed to record play', success: false };
    }
  }

  return {
    getUserContent,
    getContentById,
    createContent,
    updateContent,
    deleteContent,
    recordPlay,
  };
}
