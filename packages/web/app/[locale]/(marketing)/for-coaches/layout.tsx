import { createMarketingMetadata } from '@/lib/marketing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createMarketingMetadata({ locale, pageKey: 'forCoaches', path: '/for-coaches' });
}

export default function ForCoachesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
