import { createMarketingMetadata } from '@/lib/marketing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createMarketingMetadata({ locale, pageKey: 'investors', path: '/investors' });
}

export default function InvestorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
