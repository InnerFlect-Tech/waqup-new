'use client';

import { useState, useEffect, useCallback } from 'react';
import { createContentService } from '@waqup/shared/services';
import { supabase } from '@/lib/supabase';
import type { ContentItem, ContentItemType } from '@waqup/shared/types';
import type { UpdateContentInput } from '@waqup/shared/services';

const contentService = createContentService(supabase);

interface UseContentResult {
  items: ContentItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContent(type?: ContentItemType): UseContentResult {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await contentService.getUserContent(type);
    if (result.success && result.data) {
      setItems(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }, [type]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { items, isLoading, error, refetch: fetch };
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
  const [item, setItem] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    const result = await contentService.getContentById(id);
    if (result.success && result.data) {
      setItem(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const update = useCallback(
    async (input: UpdateContentInput): Promise<boolean> => {
      const result = await contentService.updateContent(id, input);
      if (result.success && result.data) {
        setItem(result.data);
        return true;
      }
      setError(result.error);
      return false;
    },
    [id]
  );

  const remove = useCallback(async (): Promise<boolean> => {
    const result = await contentService.deleteContent(id);
    if (result.success) return true;
    setError(result.error);
    return false;
  }, [id]);

  const recordPlay = useCallback(async (): Promise<boolean> => {
    const result = await contentService.recordPlay(id);
    if (result.success) {
      await fetch();
      return true;
    }
    return false;
  }, [id, fetch]);

  return { item, isLoading, error, update, remove, recordPlay, refetch: fetch };
}

export { contentService };
