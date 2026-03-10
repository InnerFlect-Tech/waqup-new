import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('pages.home'),
  };
}



export default function FunnelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
