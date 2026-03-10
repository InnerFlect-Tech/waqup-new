'use client';

import React, { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

export default function MeditationsCreatePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sanctuary/meditations/create/init');
  }, [router]);

  return null;
}
