import { createMarketingMetadata } from '@/lib/marketing-metadata';
import { LEGAL_CONFIG } from '@/config/legal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return createMarketingMetadata({
    locale,
    pageKey: 'terms',
    path: '/terms',
    descriptionOverride: `Terms governing use of waQup. Effective ${LEGAL_CONFIG.termsEffectiveDate}.`,
  });
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
