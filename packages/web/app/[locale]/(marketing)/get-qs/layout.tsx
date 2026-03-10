import { PRACTICE_IS_FREE_ONE_LINER } from '@waqup/shared/constants';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('pages.getQs'),
  };
}


const getQsDescription = `Buy Qs to create affirmations, meditations, and rituals. One-time packs — never expire. ${PRACTICE_IS_FREE_ONE_LINER}`;


export default function GetQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
