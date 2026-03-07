'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RitualsCreatePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sanctuary/rituals/create/init');
  }, [router]);

  return null;
}
