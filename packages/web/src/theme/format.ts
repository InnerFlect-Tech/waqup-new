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
export const GRID_CARD_MIN = px(layout.gridCardMin);
export const SEARCH_INPUT_MAX_WIDTH = px(layout.searchInputMaxWidth);
export const PAGE_TOP_PADDING = px(layout.pageTopPadding);
/** Vertical padding (top + bottom) for full-height layouts - use in calc(100dvh - PAGE_VERTICAL_PADDING_PX) */
export const PAGE_VERTICAL_PADDING_PX = layout.pageTopPadding + 32;
export const MAX_WIDTH_7XL = px(layout.maxWidth7xl);
export const HEADER_PADDING_X = px(layout.headerPaddingX);
export const HEADER_PADDING_X_SM = px(layout.headerPaddingXSm);
export const PAGE_PADDING = spacing.xl;
export const SECTION_GAP = spacing.xl;
/** Standard glass card padding - use for most cards */
export const CARD_PADDING = spacing.lg;
/** Hero/featured card padding - use for auth cards and prominent feature cards */
export const CARD_PADDING_HERO = spacing.xl;
export const CARD_PADDING_AUTH = spacing.xl;
export const CARD_PADDING_CONTENT = spacing.xl;
/** Inter-section margin - gap between stacked sections */
export const SECTION_MARGIN = spacing.lg;
export const INPUT_GAP = spacing.lg;

/** Semantic spacing helpers - use for consistent UI patterns */
export const ICON_TEXT_GAP = spacing.sm;

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
export const LIST_ITEM_PADDING_H = spacing.lg;
export const LIST_ITEM_PADDING_V = spacing.md;
export const CARD_INTERNAL_PADDING = spacing.lg;
export const BADGE_PADDING_H = spacing.sm;
export const BADGE_PADDING_V = spacing.xs;

export const GLASS_CARD_STYLES = {
  borderRadius: borderRadius.lg,
  backdropFilter: BLUR.xl,
  WebkitBackdropFilter: BLUR.xl,
  borderBase: '1px solid',
};
