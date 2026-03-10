/**
 * Audio helper utilities - shared across web and mobile
 */

/**
 * Formats milliseconds as m:ss (e.g. 125000 → "2:05").
 * Used for audio duration display.
 */
export function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
