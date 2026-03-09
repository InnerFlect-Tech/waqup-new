import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserVoice, CreateUserVoiceInput, VoiceRelationship } from '../../types/voice';

export interface VoicesService {
  listUserVoices: () => Promise<{ success: boolean; voices: UserVoice[]; error: string | null }>;
  createUserVoice: (
    input: CreateUserVoiceInput & { elevenlabs_voice_id: string }
  ) => Promise<{ success: boolean; voice: UserVoice | null; error: string | null }>;
  deleteUserVoice: (
    id: string
  ) => Promise<{ success: boolean; elevenlabs_voice_id: string | null; error: string | null }>;
}

export function createVoicesService(client: SupabaseClient): VoicesService {
  return {
    async listUserVoices() {
      try {
        const { data, error } = await client
          .from('user_voices')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          return { success: false, voices: [], error: error.message };
        }
        return { success: true, voices: (data ?? []) as UserVoice[], error: null };
      } catch (err) {
        return {
          success: false,
          voices: [],
          error: err instanceof Error ? err.message : 'Failed to list voices',
        };
      }
    },

    async createUserVoice(input) {
      try {
        const { data: userData } = await client.auth.getUser();
        if (!userData.user) {
          return { success: false, voice: null, error: 'Not authenticated' };
        }

        const { data, error } = await client
          .from('user_voices')
          .insert({
            user_id: userData.user.id,
            elevenlabs_voice_id: input.elevenlabs_voice_id,
            name: input.name,
            relationship: (input.relationship ?? 'other') as VoiceRelationship,
            description: input.description ?? null,
            avatar_color: input.avatar_color ?? null,
          })
          .select()
          .single();

        if (error) {
          return { success: false, voice: null, error: error.message };
        }
        return { success: true, voice: data as UserVoice, error: null };
      } catch (err) {
        return {
          success: false,
          voice: null,
          error: err instanceof Error ? err.message : 'Failed to create voice',
        };
      }
    },

    async deleteUserVoice(id) {
      try {
        const { data, error: fetchError } = await client
          .from('user_voices')
          .select('elevenlabs_voice_id')
          .eq('id', id)
          .single();

        if (fetchError) {
          return { success: false, elevenlabs_voice_id: null, error: fetchError.message };
        }

        const elevenlabs_voice_id = (data as { elevenlabs_voice_id: string })?.elevenlabs_voice_id ?? null;

        const { error: deleteError } = await client
          .from('user_voices')
          .delete()
          .eq('id', id);

        if (deleteError) {
          return { success: false, elevenlabs_voice_id: null, error: deleteError.message };
        }

        return { success: true, elevenlabs_voice_id, error: null };
      } catch (err) {
        return {
          success: false,
          elevenlabs_voice_id: null,
          error: err instanceof Error ? err.message : 'Failed to delete voice',
        };
      }
    },
  };
}
