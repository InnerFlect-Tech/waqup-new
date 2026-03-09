import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores';
import { createSupabaseClient } from '@/lib/supabase';
import { type Subscription } from '@waqup/shared/types';

export function useSubscription() {
  const { user } = useAuthStore();
  // Using the shared instance client correctly exported by our web app's lib/supabase.ts
  const supabase = createSupabaseClient();

  return useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async (): Promise<Subscription | null> => {
      if (!user) return null;

      const { data, error } = await supabase.rpc('get_user_subscription');
      
      if (error) {
        console.error('Error fetching subscription:', error);
        throw error;
      }
      
      return data as Subscription | null;
    },
    enabled: !!user,
  });
}
