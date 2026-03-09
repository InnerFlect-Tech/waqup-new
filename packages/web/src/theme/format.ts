/**
 * Web format adapters - convert canonical tokens to CSS values
 */

import { spacing as sp, borderRadius as br, typography as ty, shadowTokens, buttonTokens, blurTokens } from '@waqup/shared/theme';
import { layout } from '@waqup/shared/theme';

const px = (n: number) => `${n}px`;

export const spacing = Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, px(v)])) as Record<keyof typeof sp, string>;
export const borderRadius = Object.fromEntries(Object.entries(br).map(([k, v]) => [k, px(v)])) as Record<keyof typeof br, string>;

export const typography = Object.fromEntries(
  Object.entries(ty).map(([k, v]) => [
    k,
    {
      fontSize: px(v.fontSize),
      fontWeight: v.fontWeight,
      lineHeight: px(v.lineHeight),
      ...('letterSpacing' in v && typeof v.letterSpacing === 'number' && v.letterSpacing !== 0 && {
        letterSpacing: `${v.letterSpacing}px`,
      }),
    },
  ])
) as Record<keyof typeof ty, { fontSize: string; fontWeight: number; lineHeight: string; letterSpacing?: string }>;

export const shadows = Object.fromEntries(
  Object.entries(shadowTokens).map(([k, v]) => [k, `0 ${v.y}px ${v.blur}px rgba(0, 0, 0, ${v.opacity})`])
) as Record<keyof typeof shadowTokens, string>;

/** Blur tokens (CSS values) - SSOT for backdrop-filter blur */
export const BLUR = {
  sm: `blur(${blurTokens.sm}px)`,
  md: `blur(${blurTokens.md}px)`,
  lg: `blur(${blurTokens.lg}px)`,
  xl: `blur(${blurTokens.xl}px)`,
} as const;

/** Layout design tokens (CSS values). CONTENT_MAX_WIDTH = maxWidth7xl (1280px) for main content. */
export const CONTENT_MAX_WIDTH = px(layout.maxWidth7xl);
export const AUTH_CARD_MAX_WIDTH = px(layout.authCardMaxWidth);
export const CONTENT_NARROW = px(layout.contentNarrow);
export const CONTENT_MEDIUM = px(layout.contentMedium);
export const NAV_HEIGHT = px(layout.navHeight);
/** Distance from top of viewport to where page content starts (nav clearance). Use for main paddingTop and fixed layouts (e.g. speak page). */
export const NAV_TOP_OFFSET = `calc(${NAV_HEIGHT} + max(${spacing.sm}, env(safe-area-inset-top, 0px)))`;
export const GRID_CARD_MIN = px(layout.gridCardMin);
export const SEARCH_INPUT_MAX_WIDTH = px(layout.searchInputMaxWidth);
export const PAGE_TOP_PADDING = px(layout.pageTopPadding);
/** Vertical padding (top + bottom) for full-height layouts - use in calc(100dvh - PAGE_VERTICAL_PADDING_PX) */
export const PAGE_VERTICAL_PADDING_PX = layout.pageTopPadding + 32;
export const MAX_WIDTH_7XL = px(layout.maxWidth7xl);
/**
 * Header horizontal padding — SSOT: packages/shared/src/theme/tokens.ts → layout.headerPaddingX
 * Same value for left and right so logo and nav buttons align symmetrically.
 */
export const HEADER_PADDING_X = px(layout.headerPaddingX);
/** Speak page bottom UI height — SSOT for orb centering area */
export const SPEAK_BOTTOM_UI_HEIGHT = px(layout.speakBottomUiHeight);
export const PAGE_PADDING = spacing.xl;
/** Standard glass card padding - use for most cards */
export const CARD_PADDING = spacing.lg;
/** Auth/content glass card padding */
export const CARD_PADDING_AUTH = spacing.xl;
export const CARD_PADDING_CONTENT = spacing.xl;

/** Button design tokens (CSS values) - SSOT for Button component */
export const BUTTON_TOKENS = {
  borderRadius: px(buttonTokens.borderRadius),
  iconGap: px(buttonTokens.iconGap),
  iconSize: {
    sm: px(buttonTokens.iconSize.sm),
    md: px(buttonTokens.iconSize.md),
    lg: px(buttonTokens.iconSize.lg),
  },
  iconOnlySize: px(buttonTokens.iconOnlySize),
  paddingX: {
    sm: px(buttonTokens.paddingX.sm),
    md: px(buttonTokens.paddingX.md),
    lg: px(buttonTokens.paddingX.lg),
  },
  paddingY: {
    sm: px(buttonTokens.paddingY.sm),
    md: px(buttonTokens.paddingY.md),
    lg: px(buttonTokens.paddingY.lg),
  },
  minHeight: {
    sm: px(buttonTokens.minHeight.sm),
    md: px(buttonTokens.minHeight.md),
    lg: px(buttonTokens.minHeight.lg),
  },
} as const;

export const GLASS_CARD_STYLES = {
  borderRadius: borderRadius.lg,
  backdropFilter: BLUR.xl,
  WebkitBackdropFilter: BLUR.xl,
  borderBase: '1px solid',
};
