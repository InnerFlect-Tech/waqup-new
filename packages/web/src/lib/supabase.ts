import { createSupabaseClient } from '@waqup/shared/services';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const missing = !supabaseUrl || !supabaseKey;

// Use placeholders at build/prerender time so static generation doesn't throw.
// Pages that need live Supabase data must export `dynamic = 'force-dynamic'`.
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseKey || 'placeholder-anon-key-build-only';

if (missing && typeof window !== 'undefined') {
  console.warn(
    '[waQup] Supabase not configured. Copy packages/web/.env.example to .env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for auth and data.'
  );
}

export const supabase = createSupabaseClient({
  url,
  key,
  detectSessionInUrl: true, // Required on web for OAuth/magic-link URL callbacks
});
