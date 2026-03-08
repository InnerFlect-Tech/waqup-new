import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createContentService } from '@waqup/shared/services';
import { supabase } from '@/services/supabase';
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

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useContent(type?: ContentItemType) {
  return useQuery({
    queryKey: contentKeys.list(type),
    queryFn: async (): Promise<ContentItem[]> => {
      const result = await contentService.getUserContent(type);
      if (!result.success) throw new Error(result.error ?? 'Failed to load content');
      return result.data ?? [];
    },
  });
}

export function useContentItem(id: string) {
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
