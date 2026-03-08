'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const INIT_SEEN_KEY = 'waqup_create_init_seen';
const FORCE_SHOW_KEY = 'waqup_force_show_init';

/**
 * Clears the create-init-seen flag so the next visit shows the init/tips again.
 * Used by the settings "Show create-flow tips again" button.
 */
export function clearCreateInitSeen(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(INIT_SEEN_KEY);
  }
}

/**
 * Hook for create-flow init pages. On first visit, shows the init with steps and tips.
 * After the user has seen it once, redirects directly to the conversation.
 * Use the settings "Show create-flow tips again" button to reset for testing.
 */
export function useCreateInitGate(nextHref: string) {
  const router = useRouter();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(INIT_SEEN_KEY) === 'true';
    const forceShow = localStorage.getItem(FORCE_SHOW_KEY) === 'true';

    if (seen && !forceShow) {
      router.replace(nextHref);
    } else {
      setShouldShow(true);
    }
  }, [nextHref, router]);

  const markSeen = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(INIT_SEEN_KEY, 'true');
    }
  }, []);

  return { shouldShow, markSeen };
}
