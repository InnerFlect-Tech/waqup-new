import { createMarketingMetadata } from '@/lib/marketing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createMarketingMetadata({ locale, pageKey: 'forCreators', path: '/for-creators' });
}

export default function ForCreatorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
