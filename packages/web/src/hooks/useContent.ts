'use client';

import { createContentService } from '@waqup/shared/services';
import { createContentHooks, contentKeys } from '@waqup/shared/hooks';
import { supabase } from '@/lib/supabase';
import type { ContentItem, ContentItemType } from '@waqup/shared/types';
import type { UpdateContentInput } from '@waqup/shared/services';

export { contentKeys };

/**
 * Ensures content ID is a string. Next.js/next-intl params.id can sometimes be
 * string[] in edge cases; Supabase expects a plain string for UUID columns.
 */
function ensureContentId(id: unknown): string {
  if (typeof id === 'string') return id;
  if (Array.isArray(id) && id.length > 0 && typeof id[0] === 'string') return id[0];
  return String(id);
}

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
  const errorMessage =
    error instanceof Error ? error.message : error != null ? String(error) : null;
  return {
    items: Array.isArray(data) ? data : [],
    isLoading,
    error: errorMessage,
    refetch: () => { void refetch(); },
  };
}

interface UseContentItemResult {
  item: ContentItem | null;
  isLoading: boolean;
  error: string | null;
  update: (input: UpdateContentInput) => Promise<boolean>;
  remove: (idOverride?: string) => Promise<boolean>;
  recordPlay: () => Promise<boolean>;
  refetch: () => void;
}

export function useContentItem(id: string | string[] | undefined): UseContentItemResult {
  const resolvedId = ensureContentId(id ?? '');
  const { data, isLoading, error, refetch } = useContentItemQuery(resolvedId);
  const updateMutation = useUpdateContent(resolvedId);
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
    remove: async (idOverride?: string) => {
      try {
        const targetId = ensureContentId(idOverride ?? resolvedId);
        await deleteMutation.mutateAsync(targetId);
        return true;
      } catch {
        return false;
      }
    },
    recordPlay: async () => {
      try {
        await recordPlayMutation.mutateAsync(resolvedId);
        return true;
      } catch {
        return false;
      }
    },
  };
}

export { contentService };
