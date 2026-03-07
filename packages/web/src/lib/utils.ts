import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind-aware conflict resolution.
 * Use for combining conditional classes with component variants.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
