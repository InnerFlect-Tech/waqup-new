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

/** Elevated/curated badge accent — used for platform-curated marketplace content. */
export const ELEVATED_BADGE_COLOR = '#f59e0b' as const;
/** Secondary gradient color for elevated badge/cards. */
export const ELEVATED_BADGE_COLOR_SECONDARY = '#f97316' as const;

/** Dark gradient start colors for play page radial gradients (ellipse center). */
export const CONTENT_TYPE_GRADIENT_DARK = {
  affirmation: '#4a1a6e',
  meditation: '#1a2a4e',
  ritual: '#0a2e1a',
} as const satisfies Record<string, string>;
