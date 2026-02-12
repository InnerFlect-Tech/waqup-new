import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSupabaseClient } from '@waqup/shared/services';
import Constants from 'expo-constants';

// process.env is inlined by Metro; Constants.extra from app.config.js as fallback
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  Constants.expoConfig?.extra?.supabaseUrl ||
  '';

const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  Constants.expoConfig?.extra?.supabasePublishableKey ||
  '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase env. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in packages/mobile/.env'
  );
}

export const supabase = createSupabaseClient({
  url: supabaseUrl,
  key: supabaseKey,
  storage: AsyncStorage,
});
