/**
 * Design Tokens Reference
 * Canonical values for consistent layout and styling across all pages
 */

import { spacing } from './spacing';
import { borderRadius } from './borders';

export const CONTENT_MAX_WIDTH = '1400px';
export const AUTH_CARD_MAX_WIDTH = '480px';
export const PAGE_PADDING = spacing.xl;
/** Right padding so fixed Theme button does not overlap page content */
export const SAFE_AREA_RIGHT = '100px';
export const SECTION_GAP = spacing.xl;
export const CARD_PADDING_AUTH = spacing.xxxl;
export const CARD_PADDING_CONTENT = spacing.xl;
export const INPUT_GAP = spacing.lg;

export const GLASS_CARD_STYLES = {
  borderRadius: borderRadius.xl,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)' as const,
  borderBase: '1px solid', // Use with colors.glass.border
};
