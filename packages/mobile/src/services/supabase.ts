import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSupabaseClient } from '@waqup/shared/services/supabase/client';
import Constants from 'expo-constants';

const supabaseUrl = 
  Constants.expoConfig?.extra?.supabaseUrl || 
  process.env.EXPO_PUBLIC_SUPABASE_URL;

const supabaseKey = 
  Constants.expoConfig?.extra?.supabasePublishableKey || 
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createSupabaseClient({
  url: supabaseUrl,
  key: supabaseKey,
  storage: AsyncStorage,
});
