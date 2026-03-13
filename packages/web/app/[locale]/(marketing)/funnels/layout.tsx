import { createMarketingMetadata } from '@/lib/marketing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createMarketingMetadata({ locale, pageKey: 'funnels', path: '/funnels' });
}

export default function FunnelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
