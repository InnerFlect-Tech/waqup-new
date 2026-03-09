'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores';
import { useRoleOverrideStore } from '@/stores';

export interface UseSuperAdminResult {
  isSuperAdmin: boolean;
  hasAccess: boolean;
  role: string | null;
  isLoading: boolean;
  /** Real role from DB, ignoring view-as override. Use for showing View-as UI. */
  actualIsSuperAdmin: boolean;
}

/**
 * Returns the current user's profile role and access state.
 * When viewAsRole is set (superadmin only), returns *effective* values as if the user had that role.
 * - `isSuperAdmin`: effective role === 'superadmin'
 * - `hasAccess`: effective access (true for user/creator/admin view-as)
 * - `actualIsSuperAdmin`: always the real role === 'superadmin' (for View-as button visibility)
 */
export function useSuperAdmin(): UseSuperAdminResult {
  const user = useAuthStore((s) => s.user);
  const viewAsRole = useRoleOverrideStore((s) => s.viewAsRole);
  const [role, setRole] = useState<string | null>(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      if (!user) {
        setRole(null);
        setAccessGranted(false);
        setIsLoading(false);
        return;
      }

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

  const realIsAdminRole = role === 'admin' || role === 'superadmin';
  const realIsSuperAdmin = role === 'superadmin';

  // Effective values when view-as is active
  let effectiveRole: string | null = role;
  let effectiveHasAccess = accessGranted || realIsAdminRole;
  let effectiveIsSuperAdmin = realIsSuperAdmin;

  if (viewAsRole !== null) {
    effectiveRole = viewAsRole;
    effectiveIsSuperAdmin = false;
    effectiveHasAccess = true; // user/creator/admin all see the app
  }

  return {
    isSuperAdmin: effectiveIsSuperAdmin,
    hasAccess: effectiveHasAccess,
    role: effectiveRole,
    isLoading,
    actualIsSuperAdmin: realIsSuperAdmin,
  };
}
