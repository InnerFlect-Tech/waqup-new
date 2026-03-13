import { createMarketingMetadata } from '@/lib/marketing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createMarketingMetadata({ locale, pageKey: 'forTeachers', path: '/for-teachers' });
}

export default function ForTeachersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
