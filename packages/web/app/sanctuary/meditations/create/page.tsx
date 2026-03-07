'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MeditationsCreatePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sanctuary/meditations/create/init');
  }, [router]);

  return null;
}
