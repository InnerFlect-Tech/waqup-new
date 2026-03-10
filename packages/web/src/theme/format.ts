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

/**
 * Unified frosted glass for hero overlay cards (testimonial, voice cloning).
 * SSOT: Voice cloning overlay. Solid tint + blur + saturate — no two-squares artifact.
 * Mask softens edges so the card dissolves into the background.
 */
export const FROSTED_GLASS_HERO = {
  background: 'rgba(6,2,20,0.42)',
  backdropFilter: `blur(${blurTokens.xl}px) saturate(140%)`,
  WebkitBackdropFilter: `blur(${blurTokens.xl}px) saturate(140%)`,
  /** Radial mask — center opaque, edges fade to transparent; card soft-gradients into image */
  maskImage: 'radial-gradient(ellipse 95% 85% at center, black 35%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0.5) 75%, transparent 100%)',
  WebkitMaskImage: 'radial-gradient(ellipse 95% 85% at center, black 35%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0.5) 75%, transparent 100%)',
} as const;

/** Fader exterior: preto (fora) → transparente (para dentro). Apenas isto. */
export const imageEdgeFades = (bgColor: string) => ({
  top: {
    position: 'absolute' as const,
    top: -80,
    left: 0,
    right: 0,
    height: 120,
    pointerEvents: 'none' as const,
    background: `linear-gradient(to bottom, ${bgColor} 0%, transparent 100%)`,
  },
  bottom: {
    position: 'absolute' as const,
    bottom: -80,
    left: 0,
    right: 0,
    height: 120,
    pointerEvents: 'none' as const,
    background: `linear-gradient(to top, ${bgColor} 0%, transparent 100%)`,
  },
  left: {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    left: -60,
    width: 100,
    pointerEvents: 'none' as const,
    background: `linear-gradient(to right, ${bgColor} 0%, transparent 100%)`,
  },
  right: {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    right: -60,
    width: 100,
    pointerEvents: 'none' as const,
    background: `linear-gradient(to left, ${bgColor} 0%, transparent 100%)`,
  },
});

/** Typography for hero overlay cards (quote, voice cloning) — squary, cool letters, no italic */
export const HERO_OVERLAY_QUOTE = {
  fontSize: 'clamp(22px, 3vw, 42px)',
  fontWeight: 400,
  letterSpacing: '-1px',
  lineHeight: 1.35,
  color: '#fff',
  textShadow: '0 2px 24px rgba(0,0,0,0.5), 0 0 1px rgba(0,0,0,0.3)',
} as const;

/** Layout design tokens (CSS values). Primary content max-width; contentMaxWidth (1400) reserved for wide layouts. */
export const CONTENT_MAX_WIDTH = px(layout.maxWidth7xl);
export const AUTH_CARD_MAX_WIDTH = px(layout.authCardMaxWidth);
export const CONTENT_NARROW = px(layout.contentNarrow);
export const CONTENT_MEDIUM = px(layout.contentMedium);
export const NAV_HEIGHT = px(layout.navHeight);
/** Distance from top of viewport to where page content starts (nav clearance). Use for main paddingTop and fixed layouts (e.g. speak page). */
export const NAV_TOP_OFFSET = `calc(${NAV_HEIGHT} + max(${spacing.sm}, env(safe-area-inset-top, 0px)))`;
export const GRID_CARD_MIN = px(layout.gridCardMin);
export const SEARCH_INPUT_MAX_WIDTH = px(layout.searchInputMaxWidth);
export const CONTENT_READABLE = px(layout.contentReadable);
export const PAGE_TOP_PADDING = px(layout.pageTopPadding);
/** Vertical padding (top + bottom) for full-height layouts - use in calc(100dvh - PAGE_VERTICAL_PADDING_PX) */
export const PAGE_VERTICAL_PADDING_PX = layout.pageTopPadding + 32;
export const MAX_WIDTH_7XL = px(layout.maxWidth7xl);
/**
 * Header horizontal padding — SSOT: packages/shared/src/theme/tokens.ts → layout.headerPaddingX
 * Same value for left and right so logo and nav buttons align symmetrically.
 */
export const HEADER_PADDING_X = px(layout.headerPaddingX);
/** Responsive header padding — clamp for mobile; matches CookieConsentBanner pattern at 640px. */
export const HEADER_PADDING_X_RESPONSIVE = `clamp(${spacing.md}, 5vw, ${px(layout.headerPaddingX)})`;
/** Speak page bottom UI height — SSOT for orb centering area. Responsive: shrinks on small viewports to avoid trapping content. */
export const SPEAK_BOTTOM_UI_HEIGHT = `min(${px(layout.speakBottomUiHeight)}, 35vh)`;
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

/** Landing section vertical padding — responsive: 60px mobile → 140px desktop */
export const LANDING_SECTION_PADDING_Y = `clamp(${layout.landingSectionPaddingYMin}px, 10vh, ${layout.landingSectionPaddingYMax}px)`;

/** Section title fontSize — matches LandingSection h2 */
export const SECTION_TITLE_FONT_SIZE = `clamp(${layout.sectionTitleFontSizeMin}px, 4vw, ${layout.sectionTitleFontSizeMax}px)`;
/** Section subtitle fontSize — matches LandingSection p */
export const SECTION_SUBTITLE_FONT_SIZE = `clamp(${layout.sectionSubtitleFontSizeMin}px, 1.8vw, ${layout.sectionSubtitleFontSizeMax}px)`;
/** Hero h1 fontSize — marketing pages (for-teachers, for-coaches, for-creators, for-studios) */
export const HERO_H1_FONT_SIZE = `clamp(${layout.heroH1FontSizeMin}px, 5.5vw, ${layout.heroH1FontSizeMax}px)`;
/** Hero body/subheadline fontSize */
export const HERO_BODY_FONT_SIZE = `clamp(${layout.heroBodyFontSizeMin}px, 2vw, ${layout.heroBodyFontSizeMax}px)`;
/** Hero min height — avoids excessive gap below CTA */
export const HERO_MIN_HEIGHT = `min(${layout.heroMinHeightVh}dvh, ${layout.heroMinHeightCap}px)`;

export const GLASS_CARD_STYLES = {
  borderRadius: borderRadius.lg,
  backdropFilter: BLUR.xl,
  WebkitBackdropFilter: BLUR.xl,
  borderBase: '1px solid',
};
