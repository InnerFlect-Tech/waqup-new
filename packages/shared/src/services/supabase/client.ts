import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseClientOptions } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  key: string;
  storage?: any; // AsyncStorage for mobile, undefined for web
}

export function createSupabaseClient(config: SupabaseConfig): SupabaseClient {
  const { url, key, storage } = config;
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables: URL and key are required');
  }

  const options: SupabaseClientOptions<'public'> = {
    auth: {
      storage: storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Important for mobile
    },
  };

  return createClient(url, key, options);
}

export async function testSupabaseConnection(
  client: SupabaseClient
): Promise<{ success: boolean; error?: any }> {
  try {
    // Simple query to test connection
    const { error } = await client.from('users').select('count').limit(1);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error };
  }
}
