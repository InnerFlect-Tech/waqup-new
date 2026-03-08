import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conversion Funnels',
  description:
    'Understand waQup\'s conversion funnel and growth strategy — from awareness to retention.',
  openGraph: {
    title: 'Conversion Funnels — waQup',
    description:
      'Understand waQup\'s conversion funnel and growth strategy — from awareness to retention.',
    url: '/funnels',
  },
  twitter: {
    title: 'Conversion Funnels — waQup',
    description:
      'Understand waQup\'s conversion funnel and growth strategy — from awareness to retention.',
  },
};

export default function FunnelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
