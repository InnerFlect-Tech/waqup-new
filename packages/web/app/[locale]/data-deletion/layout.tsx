import { createMarketingMetadata } from '@/lib/marketing-metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return createMarketingMetadata({
    locale,
    pageKey: 'dataDeletion',
    path: '/data-deletion',
  });
}

export default function DataDeletionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
