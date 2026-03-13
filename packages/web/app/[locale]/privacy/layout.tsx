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
    pageKey: 'privacy',
    path: '/privacy',
    descriptionOverride: `How waQup collects, uses, and protects your data. Effective ${LEGAL_CONFIG.privacyEffectiveDate}.`,
  });
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
