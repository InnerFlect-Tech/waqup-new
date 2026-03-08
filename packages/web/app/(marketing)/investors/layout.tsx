import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investor Proposition',
  description:
    'Clear numbers. Real returns. One-time opportunity — get in before launch. Strategic partners who bring expertise and capital earn revenue share with no equity dilution.',
  openGraph: {
    title: 'Investor Proposition — waQup',
    description:
      'Clear numbers. Real returns. One-time opportunity — get in before launch. Strategic partners who bring expertise and capital earn revenue share with no equity dilution.',
    url: '/investors',
  },
  twitter: {
    title: 'Investor Proposition — waQup',
    description:
      'Clear numbers. Real returns. One-time opportunity — get in before launch. Strategic partners who bring expertise and capital earn revenue share with no equity dilution.',
  },
};

export default function InvestorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
