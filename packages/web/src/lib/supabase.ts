import { createSupabaseClient } from '@waqup/shared/services';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const isDev = process.env.NODE_ENV === 'development';
const missing = !supabaseUrl || !supabaseKey;

if (missing && !isDev) {
  throw new Error(
    'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Copy packages/web/.env.example to .env.local and add your values.'
  );
}

// In development, use placeholders when vars are missing so the app loads (auth/API calls will fail until .env is set)
const url = supabaseUrl || (isDev ? 'https://placeholder.supabase.co' : '');
const key = supabaseKey || (isDev ? 'placeholder-anon-key-dev-only' : '');

if (missing && isDev && typeof window !== 'undefined') {
  console.warn(
    '[waQup] Supabase not configured. Copy packages/web/.env.example to .env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for auth and data.'
  );
}

export const supabase = createSupabaseClient({
  url,
  key,
  // No storage needed - Supabase uses browser localStorage by default
});
