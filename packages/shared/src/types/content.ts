/**
 * Content types - shared across web, iOS, Android
 */

export type ContentItemType = 'affirmation' | 'ritual' | 'meditation';

export interface ContentItem {
  id: string;
  type: ContentItemType;
  title: string;
  description: string;
  duration: string;
  frequency?: string;
  lastPlayed?: string;
  script?: string;
}
