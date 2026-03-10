/**
 * Stripe Checkout for credit packs — used when RevenueCat IAP is unavailable
 * (e.g. simulator, missing StoreKit config).
 * Calls the web API with Bearer token and returns the Checkout URL.
 */
import { API_BASE_URL } from '@/constants/app';
import { supabase } from './supabase';
import type { CreditPackId } from '@waqup/shared/constants';

export interface StripeCheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Creates a Stripe Checkout session for a credit pack.
 * Requires an active Supabase session — pass the access token via Authorization header.
 */
export async function createCreditCheckoutSession(packId: CreditPackId): Promise<StripeCheckoutResult> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      return { success: false, error: 'Not signed in' };
    }

    const res = await fetch(`${API_BASE_URL}/api/stripe/checkout/credits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ packId }),
    });

    if (res.status === 401) {
      return { success: false, error: 'Session expired. Please sign in again.' };
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: (body.error as string) || 'Failed to start checkout' };
    }

    const { url } = await res.json();
    if (!url || typeof url !== 'string') {
      return { success: false, error: 'No checkout URL returned' };
    }

    return { success: true, url };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { success: false, error: message };
  }
}
