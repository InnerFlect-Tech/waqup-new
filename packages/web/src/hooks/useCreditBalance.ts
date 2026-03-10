'use client';

import { createUseCreditBalance } from '@waqup/shared/hooks';
import { supabase } from '@/lib/supabase';

export const useCreditBalance = createUseCreditBalance(supabase, 'credit-balance-web');
export type { UseCreditBalanceResult } from '@waqup/shared/hooks';
