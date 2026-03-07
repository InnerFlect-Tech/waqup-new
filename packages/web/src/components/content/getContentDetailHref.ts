import type { ContentItemType } from './ContentItem';

export function getContentDetailHref(type: ContentItemType, id: string): string {
  switch (type) {
    case 'affirmation':
      return `/sanctuary/affirmations/${id}`;
    case 'ritual':
      return `/sanctuary/rituals/${id}`;
    case 'meditation':
      return `/sanctuary/meditations/${id}`;
    default:
      return `/library`;
  }
}
