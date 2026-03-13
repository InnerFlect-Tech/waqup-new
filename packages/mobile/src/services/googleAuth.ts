import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

/**
 * OAuth redirect URL for mobile. Uses custom scheme so the redirect stays in-app
 * (no Safari handoff). Supabase redirects to waqup://auth/callback?code=xxx and
 * openAuthSessionAsync receives it.
 *
 * Add to Supabase Redirect URLs: waqup://auth/callback
 */
const MOBILE_REDIRECT_URL = 'waqup://auth/callback';

/**
 * Opens Google OAuth flow in a browser session and exchanges the code for a
 * Supabase session. Once the session is set, the shared auth store's
 * onAuthStateChange listener fires SIGNED_IN and navigation happens automatically.
 *
 * Uses waqup://auth/callback so the redirect returns to the app (in-app browser),
 * not Safari.
 */
export async function signInWithGoogle(): Promise<{ success: boolean; error: string | null }> {
  try {
    const redirectUrl = MOBILE_REDIRECT_URL;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data.url) {
      return { success: false, error: error?.message ?? 'Failed to initiate Google sign-in.' };
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl, {
      preferEphemeralSession: false,
    });

    if (result.type === 'cancel' || result.type === 'dismiss') {
      return { success: false, error: null }; // User cancelled — not an error
    }

    if (result.type !== 'success') {
      return { success: false, error: 'Google sign-in was not completed.' };
    }

    // Exchange the authorisation code for a Supabase session
    const url = new URL(result.url);
    const code = url.searchParams.get('code');

    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        return { success: false, error: exchangeError.message };
      }
    }

    // onAuthStateChange in the auth store will fire SIGNED_IN and update user state
    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred.',
    };
  }
}
