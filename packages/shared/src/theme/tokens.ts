/**
 * Design Tokens - Canonical numeric values
 * Platform-agnostic: Web converts to px strings, RN uses numbers directly
 */

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 } as const;
export const borderRadius = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 } as const;

export const typography = {
  h1: { fontSize: 32, fontWeight: 300, lineHeight: 40, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: 300, lineHeight: 32, letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: 300, lineHeight: 28, letterSpacing: -0.2 },
  h4: { fontSize: 18, fontWeight: 600, lineHeight: 24, letterSpacing: 0 },
  body: { fontSize: 16, fontWeight: 400, lineHeight: 24, letterSpacing: 0 },
  bodyBold: { fontSize: 16, fontWeight: 600, lineHeight: 24, letterSpacing: 0 },
  caption: { fontSize: 14, fontWeight: 400, lineHeight: 20, letterSpacing: 0 },
  captionBold: { fontSize: 14, fontWeight: 600, lineHeight: 20, letterSpacing: 0 },
  small: { fontSize: 12, fontWeight: 400, lineHeight: 16, letterSpacing: 0 },
  smallBold: { fontSize: 12, fontWeight: 600, lineHeight: 16, letterSpacing: 0 },
} as const;

/** Backdrop blur values (px) - SSOT for glass/backdrop effects */
export const blurTokens = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 20,
} as const;

/** Semantic shadow values - platforms build CSS string or RN StyleSheet object */
export const shadowTokens = {
  sm: { y: 1, blur: 2, opacity: 0.05 },
  md: { y: 2, blur: 4, opacity: 0.08 },
  lg: { y: 4, blur: 8, opacity: 0.1 },
  xl: { y: 8, blur: 16, opacity: 0.12 },
} as const;

/**
 * Button design tokens - SSOT for all button variants
 * Used by primary, secondary, and CTA buttons across Web and Mobile
 */
export const buttonTokens = {
  /** Border radius - pill-like rounded corners */
  borderRadius: 16,
  /** Gap between icon and text (matches spacing.sm) */
  iconGap: 8,
  /** Icon size (px) per button size - proportionate to text */
  iconSize: { sm: 14, md: 16, lg: 20 } as const,
  /** Horizontal padding (px) per size */
  paddingX: { sm: 16, md: 24, lg: 32 } as const,
  /** Vertical padding (px) per size */
  paddingY: { sm: 8, md: 12, lg: 16 } as const,
  /** Minimum height (px) per size - touch-friendly targets (44pt for md/lg) */
  minHeight: { sm: 32, md: 44, lg: 52 } as const,
  /** Icon-only button size (px) */
  iconOnlySize: 40,
} as const;

/** Layout constants (px) - Web uses as CSS, Mobile may scale */
export const layout = {
  contentMaxWidth: 1400,
  authCardMaxWidth: 480,
  contentNarrow: 800,
  contentMedium: 600,
  navHeight: 64,
  gridCardMin: 300,
  searchInputMaxWidth: 400,
  pageTopPadding: 48,
  maxWidth7xl: 1280,
  /** Header horizontal padding — lateral space for logo and nav buttons */
  headerPaddingX: 80,
} as const;
