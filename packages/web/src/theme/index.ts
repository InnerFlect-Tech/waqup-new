/**
 * Web theme - re-exports shared + platform adapters
 */

export { colors, themes, defaultTheme } from '@waqup/shared/theme';
export type { Theme, ThemeVariables } from '@waqup/shared/theme';
export { spacing, borderRadius, typography, shadows, CONTENT_MAX_WIDTH, AUTH_CARD_MAX_WIDTH, CONTENT_NARROW, CONTENT_MEDIUM, NAV_HEIGHT, GRID_CARD_MIN, SEARCH_INPUT_MAX_WIDTH, PAGE_TOP_PADDING, MAX_WIDTH_7XL, PAGE_PADDING, SECTION_GAP, CARD_PADDING_AUTH, CARD_PADDING_CONTENT, INPUT_GAP, GLASS_CARD_STYLES } from './format';
export { ThemeProvider, useTheme } from './ThemeProvider';
