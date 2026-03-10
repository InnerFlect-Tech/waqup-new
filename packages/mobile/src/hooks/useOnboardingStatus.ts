import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores';
import { supabase } from '@/services/supabase';

export interface OnboardingStatus {
  needsOnboarding: boolean;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

/**
 * Fetches profile.onboarding_completed_at to determine if user needs to see onboarding.
 * Used by RootNavigator to decide between Onboarding stack vs Main.
 */
export function useOnboardingStatus(): OnboardingStatus {
  const user = useAuthStore((s) => s.user);
  const [needsOnboarding, setNeedsOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user?.id) {
      setNeedsOnboarding(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('onboarding_completed_at')
        .eq('id', user.id)
        .maybeSingle();
      setNeedsOnboarding(!(data as { onboarding_completed_at: string | null } | null)?.onboarding_completed_at);
    } catch {
      setNeedsOnboarding(true);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { needsOnboarding, isLoading, refetch };
}
