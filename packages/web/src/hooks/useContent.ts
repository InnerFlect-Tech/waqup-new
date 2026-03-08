'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createContentService } from '@waqup/shared/services';
import { supabase } from '@/lib/supabase';
import type { ContentItem, ContentItemType } from '@waqup/shared/types';
import type { CreateContentInput, UpdateContentInput } from '@waqup/shared/services';

const contentService = createContentService(supabase);

// ─── Query keys ──────────────────────────────────────────────────────────────

export const contentKeys = {
  all: ['content'] as const,
  lists: () => [...contentKeys.all, 'list'] as const,
  list: (type?: ContentItemType) => [...contentKeys.lists(), { type }] as const,
  details: () => [...contentKeys.all, 'detail'] as const,
  detail: (id: string) => [...contentKeys.details(), id] as const,
};

// ─── React Query hooks (new API) ─────────────────────────────────────────────

/** Fetch all content for the authenticated user, optionally filtered by type */
export function useContentQuery(type?: ContentItemType) {
  return useQuery({
    queryKey: contentKeys.list(type),
    queryFn: async (): Promise<ContentItem[]> => {
      const result = await contentService.getUserContent(type);
      if (!result.success) throw new Error(result.error ?? 'Failed to load content');
      return result.data ?? [];
    },
  });
}

/** Fetch a single content item by ID */
export function useContentItemQuery(id: string) {
  return useQuery({
    queryKey: contentKeys.detail(id),
    queryFn: async (): Promise<ContentItem> => {
      const result = await contentService.getContentById(id);
      if (!result.success || !result.data) throw new Error(result.error ?? 'Content not found');
      return result.data;
    },
    enabled: !!id,
  });
}

/** Create a new content item */
export function useCreateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateContentInput): Promise<ContentItem> => {
      const result = await contentService.createContent(input);
      if (!result.success || !result.data) throw new Error(result.error ?? 'Failed to create content');
      return result.data;
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData<ContentItem[]>(
        contentKeys.list(),
        (prev) => [newItem, ...(prev ?? [])],
      );
      queryClient.setQueryData<ContentItem[]>(
        contentKeys.list(newItem.type),
        (prev) => [newItem, ...(prev ?? [])],
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
    },
  });
}

/** Update a content item */
export function useUpdateContent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateContentInput): Promise<ContentItem> => {
      const result = await contentService.updateContent(id, input);
      if (!result.success || !result.data) throw new Error(result.error ?? 'Failed to update content');
      return result.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(contentKeys.detail(id), updated);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
    },
  });
}

/** Delete a content item */
export function useDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const result = await contentService.deleteContent(id);
      if (!result.success) throw new Error(result.error ?? 'Failed to delete content');
    },
    onSuccess: (_void, id) => {
      queryClient.removeQueries({ queryKey: contentKeys.detail(id) });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
    },
  });
}

/** Record a play event */
export function useRecordPlay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const result = await contentService.recordPlay(id);
      if (!result.success) throw new Error(result.error ?? 'Failed to record play');
    },
    onSettled: (_void, _err, id) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(id) });
    },
  });
}

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
  const queryClient = useQueryClient();
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
