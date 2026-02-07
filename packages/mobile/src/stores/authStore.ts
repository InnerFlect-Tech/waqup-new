import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAuthStore } from '@waqup/shared/stores';
import { supabase } from '@/services/supabase';

/**
 * Mobile Auth Store Instance
 * Creates the auth store with mobile-specific Supabase client and AsyncStorage
 */
export const useAuthStore = createAuthStore({
  client: supabase,
  storage: AsyncStorage,
});
