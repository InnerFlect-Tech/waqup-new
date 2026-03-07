/**
 * Web-specific content helpers (icons require lucide-react)
 */

import { Music, Sparkles, Brain, type LucideIcon } from 'lucide-react';
import type { ContentItemType } from '@waqup/shared/types';

export function getContentTypeIcon(type: ContentItemType): LucideIcon {
  switch (type) {
    case 'ritual':
      return Music;
    case 'affirmation':
      return Sparkles;
    case 'meditation':
      return Brain;
    default:
      return Sparkles;
  }
}
