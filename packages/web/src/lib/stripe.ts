import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

let stripeInstance: Stripe | null = null;

/**
 * Returns a cached Stripe server client.
 * Must only be called in server contexts (API routes, Server Actions).
 */
export function getStripeClient(): Stripe {
  if (stripeInstance) return stripeInstance;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }

  stripeInstance = new Stripe(secretKey, {
    apiVersion: '2026-02-25.clover',
    typescript: true,
  });

  return stripeInstance;
}

/**
 * Returns a Supabase admin client (service role) for server-only operations
 * such as webhook processing and admin queries.
 * Only available server-side — never expose the service role key to the browser.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase admin env vars (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Returns a Supabase admin client or null when env vars are missing.
 * Use for non-critical reads (e.g. waitlist count, founding members remaining)
 * so CI E2E can run without Supabase credentials.
 */
export function createSupabaseAdminClientOrNull(): ReturnType<typeof createClient> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
