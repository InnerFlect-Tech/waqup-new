import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreditTransaction } from '../../types/credits';

export type { CreditTransaction };

export interface CreditsService {
  getCreditBalance: () => Promise<{ success: boolean; balance: number; error: string | null }>;
  getTransactionHistory: (
    limit?: number,
    offset?: number
  ) => Promise<{ success: boolean; transactions: CreditTransaction[]; error: string | null }>;
}

/**
 * Creates a credits service bound to the given Supabase client.
 * Calls the `get_credit_balance` RPC function — returns 0 for unauthenticated users.
 */
export function createCreditsService(client: SupabaseClient): CreditsService {
  return {
    async getCreditBalance() {
      try {
        const { data, error } = await client.rpc('get_credit_balance');
        if (error) {
          return { success: false, balance: 0, error: error.message };
        }
        return { success: true, balance: (data as number) ?? 0, error: null };
      } catch (err) {
        return {
          success: false,
          balance: 0,
          error: err instanceof Error ? err.message : 'Failed to fetch credit balance',
        };
      }
    },

    async getTransactionHistory(limit = 20, offset = 0) {
      try {
        const {
          data: { user },
        } = await client.auth.getUser();

        if (!user) {
          return { success: false, transactions: [], error: 'Not authenticated' };
        }

        const { data, error } = await client
          .from('credit_transactions')
          .select('id, amount, description, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          return { success: false, transactions: [], error: error.message };
        }

        const transactions: CreditTransaction[] = (data ?? []).map((row) => ({
          id: row.id as string,
          type: ((row.amount as number) >= 0 ? 'credit' : 'debit') as 'credit' | 'debit',
          amount: row.amount as number,
          description: (row.description as string) ?? 'Transaction',
          created_at: row.created_at as string,
        }));

        return { success: true, transactions, error: null };
      } catch (err) {
        return {
          success: false,
          transactions: [],
          error: err instanceof Error ? err.message : 'Failed to fetch transactions',
        };
      }
    },
  };
}
