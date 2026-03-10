'use client';

import React, { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

export default function RitualsCreatePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sanctuary/rituals/create/init');
  }, [router]);

  return null;
}
