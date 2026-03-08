import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Explore waQup pricing plans. Choose the subscription that fits your transformation journey.',
  openGraph: {
    title: 'Pricing — waQup',
    description:
      'Explore waQup pricing plans. Choose the subscription that fits your transformation journey.',
    url: '/pricing',
  },
  twitter: {
    title: 'Pricing — waQup',
    description:
      'Explore waQup pricing plans. Choose the subscription that fits your transformation journey.',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
