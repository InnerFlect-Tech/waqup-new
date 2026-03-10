'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores';
import { Analytics } from '@waqup/shared/utils';

/**
 * Fires session_start when user becomes available (authenticated session).
 * Uses a ref to fire at most once per page load when user is present.
 */
export function SessionTracker() {
  const { user } = useAuthStore();
  const firedRef = useRef(false);

  useEffect(() => {
    if (!user?.id || firedRef.current) return;
    firedRef.current = true;
    Analytics.sessionStarted(user.id);
  }, [user?.id]);

  return null;
}
