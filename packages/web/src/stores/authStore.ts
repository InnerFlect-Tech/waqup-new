import { createAuthStore } from '@waqup/shared/stores';
import { supabase } from '@/lib/supabase';

/**
 * Web Auth Store Instance
 * Creates the auth store with web-specific Supabase client
 * Uses browser localStorage automatically (no storage adapter needed)
 */
export const useAuthStore = createAuthStore({
  client: supabase,
  // No storage needed - Supabase uses browser localStorage by default
});
