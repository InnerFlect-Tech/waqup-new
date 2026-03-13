import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { supabase } from '@/services/supabase';

/**
 * Handles OAuth deep links (waqup://auth/callback?code=XXX).
 * Used when the web proxy redirects to the app; the app exchanges the code for a session.
 * onAuthStateChange in the auth store then fires SIGNED_IN and navigation updates.
 */
export function useOAuthDeepLink() {
  useEffect(() => {
    const handleUrl = async (url: string) => {
      if (!url.startsWith('waqup://auth/callback')) return;
      try {
        const code = new URL(url).searchParams.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) console.error('[OAuth deep link] exchangeCodeForSession:', error);
        }
      } catch (err) {
        console.error('[OAuth deep link]', err);
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) void handleUrl(url);
    });

    const sub = Linking.addEventListener('url', ({ url }) => void handleUrl(url));
    return () => sub.remove();
  }, []);
}
