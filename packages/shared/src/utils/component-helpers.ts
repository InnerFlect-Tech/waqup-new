/**
 * Component Helper Utilities
 * 
 * Shared helper functions for UI components across platforms.
 * These functions provide consistent behavior for text colors, variants, and styles.
 */

/**
 * Determines the appropriate text color based on button/badge variant
 */
export function getTextColor(variant: string): 'primary' | 'inverse' {
  switch (variant) {
    case 'primary':
      return 'inverse';
    default:
      return 'primary';
  }
}

/**
 * Determines the appropriate typography variant based on component size
 */
export function getTextVariant(size: string): 'small' | 'body' | 'bodyBold' {
  switch (size) {
    case 'sm':
      return 'small';
    case 'lg':
      return 'bodyBold';
    default:
      return 'body';
  }
}
