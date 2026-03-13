import { createMarketingMetadata } from '@/lib/marketing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createMarketingMetadata({ locale, pageKey: 'comingSoon', path: '/coming-soon' });
}

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
