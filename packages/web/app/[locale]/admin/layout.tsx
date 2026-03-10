'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Analytics } from '@waqup/shared/utils';
import { useAuthStore } from '@/stores';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!pathname?.includes('/admin')) return;
    const match = pathname.match(/\/admin\/?([^/]*)/);
    const page = match?.[1] ?? 'dashboard';
    Analytics.adminPageAccessed(page, user?.id);
  }, [pathname, user?.id]);

  return <>{children}</>;
}
