'use client';

import React, { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

export default function AffirmationsCreatePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sanctuary/affirmations/create/init');
  }, [router]);

  return null;
}
