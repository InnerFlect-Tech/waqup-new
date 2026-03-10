import { createUseCreditBalance } from '@waqup/shared/hooks';
import { supabase } from '@/services/supabase';

export const useCreditBalance = createUseCreditBalance(supabase, 'credit-balance-mobile');
export type { UseCreditBalanceResult } from '@waqup/shared/hooks';
