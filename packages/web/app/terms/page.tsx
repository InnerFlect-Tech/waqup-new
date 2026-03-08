import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Our Terms of Service are being finalized and will be published here before the public launch.',
  openGraph: {
    title: 'Terms of Service — waQup',
    description:
      'Our Terms of Service are being finalized and will be published here before the public launch.',
    url: '/terms',
  },
};

export default function TermsPage() {
  return (
    <PlaceholderPage
      title="Terms of Service"
      description="Our Terms of Service are being finalized and will be published here before the public launch. Please check back soon."
      backHref="/"
      backLabel="Back to Home"
    />
  );
}
