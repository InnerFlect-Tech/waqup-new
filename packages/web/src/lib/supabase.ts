import { createSupabaseClient } from '@waqup/shared/services';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createSupabaseClient({
  url: supabaseUrl,
  key: supabaseKey,
  // No storage needed - Supabase uses browser localStorage by default
});
