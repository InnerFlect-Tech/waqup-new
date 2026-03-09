import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseClientOptions } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  key: string;
  /** Platform-specific storage adapter (AsyncStorage on mobile, localStorage on web) */
  storage?: { getItem: (key: string) => Promise<string | null>; setItem: (key: string, value: string) => Promise<void>; removeItem: (key: string) => Promise<void> };
  /** Set true on web to support OAuth/magic-link URL callbacks; false on mobile (mobile uses custom URL schemes) */
  detectSessionInUrl?: boolean;
}

export function createSupabaseClient(config: SupabaseConfig): SupabaseClient {
  const { url, key, storage, detectSessionInUrl = false } = config;
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables: URL and key are required');
  }

  const options: SupabaseClientOptions<'public'> = {
    auth: {
      storage: storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl,
      flowType: 'pkce',
    },
  };

  return createClient(url, key, options);
}

export async function testSupabaseConnection(
  client: SupabaseClient
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await client.from('profiles').select('id').limit(1);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
