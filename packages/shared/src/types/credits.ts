/**
 * Credit system types — shared across web and mobile.
 */

export interface CreditTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  created_at: string;
}

export interface UseCreditBalanceResult {
  balance: number;
  isLoading: boolean;
  refetch: () => void;
}

export interface PersonalizationData {
  coreValues?: string[];
  name?: string;
  whyThisMatters?: string;
}
