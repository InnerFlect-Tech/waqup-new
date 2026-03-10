'use client';

import { SuperAdminGate } from '@/components';

/**
 * Updates — superadmin-only documentation of product changes, features, and how-to guides.
 * Only users with profile.role = 'superadmin' can access.
 */
export default function UpdatesLayout({ children }: { children: React.ReactNode }) {
  return <SuperAdminGate>{children}</SuperAdminGate>;
}
