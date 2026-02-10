/**
 * Override login: allow signing in with env-configured credentials (e.g. admin)
 * without Supabase. Used for dev/admin access. Persists in localStorage so
 * refresh keeps the user "logged in" until they sign out.
 */

import type { User } from '@supabase/supabase-js';

const OVERRIDE_STORAGE_KEY = 'waqup_override_user';

export function getOverrideStorageKey(): string {
  return OVERRIDE_STORAGE_KEY;
}

/** Create a minimal User-like object for override sessions (satisfies store's User | null). */
export function createOverrideUser(email: string): User {
  return {
    id: `override-${email}`,
    email,
    aud: 'override',
    role: 'override',
    email_confirmed_at: new Date().toISOString(),
    phone_confirmed_at: null,
    confirmed_at: new Date().toISOString(),
    phone: undefined,
    last_sign_in_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_anonymous: false,
  } as User;
}

export function getStoredOverrideEmail(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(OVERRIDE_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { email?: string };
    return typeof data?.email === 'string' ? data.email : null;
  } catch {
    return null;
  }
}

export function setStoredOverride(email: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify({ email }));
  } catch {
    // ignore
  }
}

export function clearStoredOverride(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(OVERRIDE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Call after override login succeeds: persist and return user to set in store. */
export function applyOverrideLogin(email: string): User {
  setStoredOverride(email);
  return createOverrideUser(email);
}

/** If override is stored, return user to restore in store; otherwise null. */
export function getOverrideUserToRestore(): User | null {
  const email = getStoredOverrideEmail();
  return email ? createOverrideUser(email) : null;
}
