/**
 * Format credit amounts for display as Qs
 * e.g. "50 Qs", "1 Q"
 */

export function formatQs(amount: number): string {
  return amount === 1 ? '1 Q' : `${amount} Qs`;
}
