'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores';

export interface UseSuperAdminResult {
  isSuperAdmin: boolean;
  hasAccess: boolean;
  role: string | null;
  isLoading: boolean;
}

/**
 * Returns the current user's profile role and access state.
 * - `isSuperAdmin`: role === 'superadmin'
 * - `hasAccess`: access_granted === true OR role is 'admin'/'superadmin'
 */
export function useSuperAdmin(): UseSuperAdminResult {
  const user = useAuthStore((s) => s.user);
  const [role, setRole] = useState<string | null>(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setAccessGranted(false);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProfile = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('role, access_granted')
        .eq('id', user.id)
        .single();

      if (!cancelled) {
        if (!error && data) {
          const profile = data as { role: string; access_granted: boolean };
          setRole(profile.role);
          setAccessGranted(profile.access_granted);
        } else {
          setRole(null);
          setAccessGranted(false);
        }
        setIsLoading(false);
      }
    };

    void fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const isAdminRole = role === 'admin' || role === 'superadmin';

  return {
    isSuperAdmin: role === 'superadmin',
    hasAccess: accessGranted || isAdminRole,
    role,
    isLoading,
  };
}
