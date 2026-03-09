/**
 * Canonical content-type color palette — single source of truth.
 * These are used for badges, cards, heatmaps, and accent highlights.
 */

export const CONTENT_TYPE_COLORS = {
  affirmation: '#c084fc',
  meditation: '#60a5fa',
  ritual: '#34d399',
} as const satisfies Record<string, string>;

export type ContentTypeColorKey = keyof typeof CONTENT_TYPE_COLORS;

/** Returns the accent color for a content type, falling back to a neutral purple. */
export function getContentTypeColor(type: string): string {
  return (CONTENT_TYPE_COLORS as Record<string, string>)[type] ?? '#c084fc';
}
