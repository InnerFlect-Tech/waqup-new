'use client';

import { createContentService } from '@waqup/shared/services';
import { createContentHooks, contentKeys } from '@waqup/shared/hooks';
import { supabase } from '@/lib/supabase';
import type { ContentItem, ContentItemType } from '@waqup/shared/types';
import type { UpdateContentInput } from '@waqup/shared/services';

export { contentKeys };

const contentService = createContentService(supabase);

const {
  useContentQuery,
  useContentItemQuery,
  useCreateContent,
  useUpdateContent,
  useDeleteContent,
  useRecordPlay,
} = createContentHooks(contentService);

export { useContentQuery, useContentItemQuery, useCreateContent, useUpdateContent, useDeleteContent, useRecordPlay };

// ─── Backward-compatible hooks (legacy API) ───────────────────────────────────
// These wrap React Query but expose the original { items, isLoading, error, refetch } shape
// so existing pages don't need to be rewritten.

interface UseContentResult {
  items: ContentItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContent(type?: ContentItemType): UseContentResult {
  const { data, isLoading, error, refetch } = useContentQuery(type);
  return {
    items: data ?? [],
    isLoading,
    error: error ? error.message : null,
    refetch: () => { void refetch(); },
  };
}

interface UseContentItemResult {
  item: ContentItem | null;
  isLoading: boolean;
  error: string | null;
  update: (input: UpdateContentInput) => Promise<boolean>;
  remove: () => Promise<boolean>;
  recordPlay: () => Promise<boolean>;
  refetch: () => void;
}

export function useContentItem(id: string): UseContentItemResult {
  const { data, isLoading, error, refetch } = useContentItemQuery(id);
  const updateMutation = useUpdateContent(id);
  const deleteMutation = useDeleteContent();
  const recordPlayMutation = useRecordPlay();

  return {
    item: data ?? null,
    isLoading,
    error: error ? error.message : null,
    refetch: () => { void refetch(); },
    update: async (input) => {
      try {
        await updateMutation.mutateAsync(input);
        return true;
      } catch {
        return false;
      }
    },
    remove: async () => {
      try {
        await deleteMutation.mutateAsync(id);
        return true;
      } catch {
        return false;
      }
    },
    recordPlay: async () => {
      try {
        await recordPlayMutation.mutateAsync(id);
        return true;
      } catch {
        return false;
      }
    },
  };
}

export { contentService };
