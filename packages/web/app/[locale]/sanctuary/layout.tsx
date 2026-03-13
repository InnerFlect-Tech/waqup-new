import type { Metadata } from 'next';
import React from 'react';
import { getTranslations } from 'next-intl/server';

// All sanctuary pages require auth/Supabase — opt out of static generation.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('pages.sanctuary'),
  };
}

export default function SanctuaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
