import { createContentService } from '@waqup/shared/services';
import { createContentHooks, contentKeys } from '@waqup/shared/hooks';
import { supabase } from '@/services/supabase';

export { contentKeys };

const contentService = createContentService(supabase);

export const {
  useContentQuery,
  useContentItemQuery,
  useCreateContent,
  useUpdateContent,
  useDeleteContent,
  useRecordPlay,
} = createContentHooks(contentService);

/** Alias for backward compat */
export const useContent = useContentQuery;
export const useContentItem = useContentItemQuery;
