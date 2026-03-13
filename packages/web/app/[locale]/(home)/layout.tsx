import { createMarketingMetadata } from '@/lib/marketing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createMarketingMetadata({ locale, pageKey: 'home', path: '/' });
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
