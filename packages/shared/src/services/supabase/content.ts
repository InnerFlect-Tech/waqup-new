import type { SupabaseClient } from '@supabase/supabase-js';
import type { ContentItem, ContentItemType, ContentStatus, VoiceType, AudioSettings } from '../../types/content';

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
  audioUrl?: string;
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
  voiceType?: VoiceType;
  audioSettings?: AudioSettings;
}

function mapRow(row: Record<string, unknown>): ContentItem {
  const audioSettings = row.audio_settings as Record<string, number> | null;
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
    audioUrl: (row.audio_url as string) || undefined,
    voiceType: (row.voice_type as VoiceType) || undefined,
    audioSettings: audioSettings
      ? {
          volumeVoice: audioSettings.volumeVoice ?? 80,
          volumeAmbient: audioSettings.volumeAmbient ?? 40,
          volumeMaster: audioSettings.volumeMaster ?? 100,
        }
      : undefined,
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

  async function recordPlay(id: string): Promise<ContentServiceResult<void>> {
    try {
      const { error } = await client
        .from('content_items')
        .update({ last_played_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        return { data: null, error: error.message, success: false };
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
