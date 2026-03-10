import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('pages.launch'),
  };
}



export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
