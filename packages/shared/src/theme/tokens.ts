/**
 * Design Tokens - Canonical numeric values
 * Platform-agnostic: Web converts to px strings, RN uses numbers directly
 */

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 } as const;
export const borderRadius = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, full: 9999 } as const;

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
  /** Dense UIs: health, system, progress */
  label: { fontSize: 13, fontWeight: 500, lineHeight: 18, letterSpacing: 0 },
  /** Very dense UIs */
  micro: { fontSize: 10, fontWeight: 500, lineHeight: 14, letterSpacing: 0 },
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
  /** Icon-only button size (px) — 44pt minimum per Apple HIG / Android touch target guidelines */
  iconOnlySize: 44,
} as const;

/** Auth/onboarding screen tokens - SSOT for login, signup, setup screens */
export const authTokens = {
  /** Logo font size on login/signup form screens */
  logoFontSizeLogin: 48,
  /** Hero logo font size on setup/landing screens */
  logoFontSizeHero: 64,
  /** Feature card icon container (setup screen) */
  featureIconSize: 56,
  /** Feature card icon glyph size */
  featureIconGlyphSize: 28,
  /** Social (Google) button min height - matches buttonTokens.minHeight.lg */
  socialButtonMinHeight: 52,
} as const;

/** Home/dashboard tokens - SSOT for RitualHomeScreen, main tab UI */
export const homeTokens = {
  /** Headline line height (h2 variant with extra breathing room) */
  headlineLineHeight: 34,
  /** Greeting label letter spacing */
  greetingLetterSpacing: 0.5,
  /** Primary CTA min height — touch-friendly, prominent */
  ctaMinHeight: 56,
  /** Tip card icon size */
  tipIconSize: 18,
} as const;

/** Drawer/sidebar tokens - Material Design 280dp mobile, 320dp tablet */
export const drawerTokens = {
  width: 280,
  widthTablet: 320,
  padding: 24,
  swipeEdgeWidth: 28,
} as const;

/** Motion tokens - durations (ms) and easing for animations */
export const motionTokens = {
  fast: 120,
  normal: 180,
  slow: 240,
  sheet: 300,
  easing: { standard: 'ease-in-out' as const },
} as const;

/** Icon size tokens - for nav, list, and standalone icons */
export const iconTokens = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

/** Layout constants (px) - Web uses as CSS, Mobile may scale */
export const layout = {
  /** Tab bar height — bottom navigation */
  tabBarHeight: 60,
  /** Tab bar vertical padding */
  tabBarPaddingY: 8,
  /** Header right element margin (e.g. Q balance badge) */
  headerRightMargin: 16,
  /** Reserved for wide layouts; primary content uses maxWidth7xl (1280) */
  contentMaxWidth: 1400,
  /** Auth screens (login, signup) - max width for card */
  authCardMaxWidth: 480,
  contentNarrow: 800,
  contentMedium: 600,
  /** Max width for readable text blocks and narrow modals */
  contentReadable: 400,
  /** Max height for script-read scroll area (idle + recording) — enough lines visible, stable scroll */
  scriptReadMaxHeight: 280,
  navHeight: 64,
  gridCardMin: 300,
  searchInputMaxWidth: 400,
  pageTopPadding: 48,
  maxWidth7xl: 1280,
  /** Header horizontal padding — lateral space for logo and nav buttons */
  headerPaddingX: 96,
  /** Speak page bottom UI panel height — SSOT for orb centering area */
  speakBottomUiHeight: 220,
  /** Landing page section vertical padding — min (mobile), max (desktop); use with clamp(..., 10vh, ...) */
  landingSectionPaddingYMin: 60,
  landingSectionPaddingYMax: 140,
  /** Section title (h2) — min/max for clamp(..., 4vw, ...) */
  sectionTitleFontSizeMin: 24,
  sectionTitleFontSizeMax: 32,
  /** Section subtitle — min/max for clamp(..., 1.8vw, ...) */
  sectionSubtitleFontSizeMin: 15,
  sectionSubtitleFontSizeMax: 17,
  /** Hero h1 — min/max for clamp(..., 5.5vw, ...) */
  heroH1FontSizeMin: 36,
  heroH1FontSizeMax: 68,
  /** Hero body/subheadline — min/max for clamp(..., 2vw, ...) */
  heroBodyFontSizeMin: 16,
  heroBodyFontSizeMax: 20,
  /** Hero min height — almost full viewport for marketing pages (for-teachers, for-coaches, for-creators, for-studios) */
  heroMinHeightVh: 90,
  heroMinHeightCap: 800,
} as const;
