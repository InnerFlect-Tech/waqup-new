import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ContentItem, ContentItemType } from '../types';
import type { CreateContentInput, UpdateContentInput } from '../services/supabase/content';

interface ContentService {
  getUserContent: (type?: ContentItemType) => Promise<{ success: boolean; data: ContentItem[] | null; error: string | null }>;
  getContentById: (id: string) => Promise<{ success: boolean; data: ContentItem | null; error: string | null }>;
  createContent: (input: CreateContentInput) => Promise<{ success: boolean; data: ContentItem | null; error: string | null }>;
  updateContent: (id: string, input: UpdateContentInput) => Promise<{ success: boolean; data: ContentItem | null; error: string | null }>;
  deleteContent: (id: string) => Promise<{ success: boolean; error: string | null }>;
  recordPlay: (id: string, durationSeconds?: number) => Promise<{ success: boolean; error: string | null }>;
}

// ─── Query keys ──────────────────────────────────────────────────────────────

export const contentKeys = {
  all: ['content'] as const,
  lists: () => [...contentKeys.all, 'list'] as const,
  list: (type?: ContentItemType) => [...contentKeys.lists(), { type }] as const,
  details: () => [...contentKeys.all, 'detail'] as const,
  detail: (id: string) => [...contentKeys.details(), id] as const,
};

// ─── Hook factory ─────────────────────────────────────────────────────────────
// Call once at module level with the platform's contentService instance.
// The returned hooks behave identically to regular React hooks.

export function createContentHooks(contentService: ContentService) {
  function useContentQuery(type?: ContentItemType) {
    return useQuery({
      queryKey: contentKeys.list(type),
      queryFn: async (): Promise<ContentItem[]> => {
        const result = await contentService.getUserContent(type);
        if (!result.success) throw new Error(result.error ?? 'Failed to load content');
        return result.data ?? [];
      },
    });
  }

  function useContentItemQuery(id: string) {
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

  function useCreateContent() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (input: CreateContentInput): Promise<ContentItem> => {
        const result = await contentService.createContent(input);
        if (!result.success || !result.data) throw new Error(result.error ?? 'Failed to create content');
        return result.data;
      },
      onSuccess: (newItem) => {
        queryClient.setQueryData<ContentItem[]>(contentKeys.list(), (prev) => [newItem, ...(prev ?? [])]);
        queryClient.setQueryData<ContentItem[]>(contentKeys.list(newItem.type), (prev) => [newItem, ...(prev ?? [])]);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
      },
    });
  }

  function useUpdateContent(id: string) {
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

  function useDeleteContent() {
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

  function useRecordPlay() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({
        id,
        durationSeconds,
      }: { id: string; durationSeconds?: number }): Promise<void> => {
        const result = await contentService.recordPlay(id, durationSeconds);
        if (!result.success) throw new Error(result.error ?? 'Failed to record play');
      },
      onSettled: (_void, _err, variables) => {
        if (variables) queryClient.invalidateQueries({ queryKey: contentKeys.detail(variables.id) });
      },
    });
  }

  return {
    useContentQuery,
    useContentItemQuery,
    useCreateContent,
    useUpdateContent,
    useDeleteContent,
    useRecordPlay,
  };
}
