import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

export async function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase env vars');
  }

  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: Record<string, unknown>) {
        cookieStore.set({ name, value: '', ...options });
      },
    },
  });
}

/**
 * Gets an authenticated Supabase client and user for API routes.
 * Supports both cookie-based auth (web) and Bearer token (mobile).
 * Use this in API routes that may be called from mobile with Authorization header.
 */
export async function getAuthenticatedUserForApi(
  req: NextRequest
): Promise<{ supabase: SupabaseClient; user: User } | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  // Try cookie-based auth first (web)
  const supabaseCookie = await createSupabaseServerClient();
  const { data: { user: cookieUser }, error: cookieError } = await supabaseCookie.auth.getUser();

  if (!cookieError && cookieUser) {
    return { supabase: supabaseCookie, user: cookieUser };
  }

  // Fall back to Bearer token (mobile)
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  const supabaseToken = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader! } },
  });

  const { data: { user: tokenUser }, error: tokenError } = await supabaseToken.auth.getUser(token);
  if (tokenError || !tokenUser) return null;

  return { supabase: supabaseToken, user: tokenUser };
}
