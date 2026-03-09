'use client';

import { useState, useEffect, useCallback } from 'react';
import { createCreditsService } from '@waqup/shared/services';
import type { UseCreditBalanceResult } from '@waqup/shared/types';
import { supabase } from '@/lib/supabase';

export type { UseCreditBalanceResult };

const creditsService = createCreditsService(supabase);

/**
 * Returns the authenticated user's live Q credit balance from Supabase.
 * Subscribes to credit_transactions changes in real-time — balance updates
 * automatically whenever a credit is added or deducted server-side.
 */
export function useCreditBalance(): UseCreditBalanceResult {
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
    queueMicrotask(() => fetch());

    // Subscribe to credit_transactions for real-time balance updates
    const channel = supabase
      .channel('credit-balance-web')
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
}
