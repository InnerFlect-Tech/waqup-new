import { createMarketingMetadata } from '@/lib/marketing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createMarketingMetadata({ locale, pageKey: 'forStudios', path: '/for-studios' });
}

export default function ForStudiosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
