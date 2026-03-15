'use client';

import { useQuery } from '@tanstack/react-query';
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

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('role, access_granted')
    .eq('id', userId)
    .single();

  if (!error && data) {
    const profile = data as { role: string; access_granted: boolean };
    return { role: profile.role, accessGranted: profile.access_granted };
  }
  return { role: null, accessGranted: false };
}

/**
 * Returns the current user's profile role and access state.
 * Uses React Query with 5min staleTime to avoid redundant fetches on navigation.
 * When viewAsRole is set (superadmin only), returns *effective* values as if the user had that role.
 * - `isSuperAdmin`: effective role === 'superadmin'
 * - `hasAccess`: effective access (true for user/creator/admin view-as)
 * - `actualIsSuperAdmin`: always the real role === 'superadmin' (for View-as button visibility)
 */
export function useSuperAdmin(): UseSuperAdminResult {
  const user = useAuthStore((s) => s.user);
  const viewAsRole = useRoleOverrideStore((s) => s.viewAsRole);

  const { data, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user && !user.id?.startsWith('override-'),
    staleTime: 5 * 60 * 1000, // 5 minutes — reduce refetch on navigation
  });

  // E2E / dev: override user has no profile in DB; grant access so tests can reach protected routes
  if (user?.id?.startsWith('override-')) {
    return {
      isSuperAdmin: false,
      hasAccess: true,
      role: 'user',
      isLoading: false,
      actualIsSuperAdmin: false,
    };
  }

  if (!user) {
    return {
      isSuperAdmin: false,
      hasAccess: false,
      role: null,
      isLoading: false,
      actualIsSuperAdmin: false,
    };
  }

  const role = data?.role ?? null;
  const accessGranted = data?.accessGranted ?? false;
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
