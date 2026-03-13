import { createMarketingMetadata } from '@/lib/marketing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createMarketingMetadata({ locale, pageKey: 'getQs', path: '/get-qs' });
}

export default function GetQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
