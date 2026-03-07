import type { SupabaseClient } from '@supabase/supabase-js';
import type { ContentItem, ContentItemType } from '../../types/content';

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
  status?: 'draft' | 'complete';
}

export interface UpdateContentInput {
  title?: string;
  description?: string;
  duration?: string;
  frequency?: string;
  script?: string;
  status?: 'draft' | 'complete';
}

function mapRow(row: Record<string, unknown>): ContentItem {
  return {
    id: row.id as string,
    type: row.type as ContentItemType,
    title: row.title as string,
    description: (row.description as string) || '',
    duration: (row.duration as string) || '',
    frequency: (row.frequency as string) || undefined,
    lastPlayed: (row.last_played_at as string) || undefined,
    script: (row.script as string) || undefined,
  };
}

export function createContentService(client: SupabaseClient) {
  async function getUserContent(
    type?: ContentItemType
  ): Promise<ContentServiceResult<ContentItem[]>> {
    try {
      let query = client
        .from('content_items')
        .select('*')
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
    } catch (err) {
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
    } catch (err) {
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
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: mapRow(data), error: null, success: true };
    } catch (err) {
      return { data: null, error: 'Failed to create content', success: false };
    }
  }

  async function updateContent(
    id: string,
    input: UpdateContentInput
  ): Promise<ContentServiceResult<ContentItem>> {
    try {
      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (input.title !== undefined) updatePayload.title = input.title;
      if (input.description !== undefined) updatePayload.description = input.description;
      if (input.duration !== undefined) updatePayload.duration = input.duration;
      if (input.frequency !== undefined) updatePayload.frequency = input.frequency;
      if (input.script !== undefined) updatePayload.script = input.script;
      if (input.status !== undefined) updatePayload.status = input.status;

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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
