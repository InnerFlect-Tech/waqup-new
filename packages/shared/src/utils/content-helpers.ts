/**
 * Content type helpers - shared across platforms
 */

import type { ContentItemType } from '../types/content';

export type ContentTypeBadgeVariant = 'default' | 'success' | 'info';

export function getContentTypeBadgeVariant(type: ContentItemType): ContentTypeBadgeVariant {
  switch (type) {
    case 'ritual':
      return 'default';
    case 'affirmation':
      return 'success';
    case 'meditation':
      return 'info';
    default:
      return 'default';
  }
}
