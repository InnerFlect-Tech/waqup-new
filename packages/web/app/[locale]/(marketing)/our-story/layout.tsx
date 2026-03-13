import { createMarketingMetadata } from '@/lib/marketing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createMarketingMetadata({ locale, pageKey: 'ourStory', path: '/our-story' });
}

export default function OurStoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
