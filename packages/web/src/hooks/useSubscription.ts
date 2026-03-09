import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores';
// use supabase instead of supabase-browser for client side rendering compatibility in next.js
import { supabase } from '@/lib/supabase';

// use alias type mapping
import { type Subscription } from '@waqup/shared/types';

export function useSubscription() {
  const { user } = useAuthStore();

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









