import { createMarketingMetadata } from '@/lib/marketing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createMarketingMetadata({ locale, pageKey: 'theScience', path: '/explanation' });
}

export default function ExplanationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
