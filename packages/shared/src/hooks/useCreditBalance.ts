import { useState, useEffect, useCallback } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createCreditsService } from '../services/supabase/credits';
import type { UseCreditBalanceResult } from '../types/credits';

export type { UseCreditBalanceResult };

/**
 * Factory that creates a useCreditBalance hook bound to the given Supabase client.
 * Subscribes to credit_transactions for real-time balance updates.
 *
 * @param supabase - Supabase client (browser for web, with AsyncStorage for mobile)
 * @param channelName - Unique channel name for Realtime subscription (e.g. 'credit-balance-web', 'credit-balance-mobile')
 */
export function createUseCreditBalance(
  supabase: SupabaseClient,
  channelName: string,
): () => UseCreditBalanceResult {
  const creditsService = createCreditsService(supabase);

  return function useCreditBalance(): UseCreditBalanceResult {
    const [balance, setBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetch = useCallback(async () => {
      setIsLoading(true);
      const result = await creditsService.getCreditBalance();
      if (result.success) {
        setBalance(result.balance);
      }
      setIsLoading(false);
    }, []);

    useEffect(() => {
      void fetch();

      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'credit_transactions' },
          () => {
            void fetch();
          },
        )
        .subscribe();

      return () => {
        void supabase.removeChannel(channel);
      };
    }, [fetch]);

    return { balance, isLoading, refetch: fetch };
  };
}
