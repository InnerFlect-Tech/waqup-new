import { createMarketingMetadata } from '@/lib/marketing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createMarketingMetadata({ locale, pageKey: 'signup', path: '/signup' });
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
