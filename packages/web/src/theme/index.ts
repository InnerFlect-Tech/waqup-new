/**
 * Web theme - re-exports shared + platform adapters
 */

export { colors, themes, defaultTheme } from '@waqup/shared/theme';
export type { Theme, ThemeVariables } from '@waqup/shared/theme';
export { spacing, borderRadius, typography, shadows, BLUR, CONTENT_MAX_WIDTH, AUTH_CARD_MAX_WIDTH, CONTENT_NARROW, CONTENT_MEDIUM, NAV_HEIGHT, NAV_TOP_OFFSET, GRID_CARD_MIN, SEARCH_INPUT_MAX_WIDTH, PAGE_TOP_PADDING, PAGE_VERTICAL_PADDING_PX, MAX_WIDTH_7XL, HEADER_PADDING_X, SPEAK_BOTTOM_UI_HEIGHT, PAGE_PADDING, CARD_PADDING, CARD_PADDING_AUTH, CARD_PADDING_CONTENT, GLASS_CARD_STYLES, BUTTON_TOKENS } from './format';
export { ThemeProvider, useTheme } from './ThemeProvider';
