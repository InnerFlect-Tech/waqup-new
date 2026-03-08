import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Our Privacy Policy is being finalized and will be published here before the public launch.',
  openGraph: {
    title: 'Privacy Policy — waQup',
    description:
      'Our Privacy Policy is being finalized and will be published here before the public launch.',
    url: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      title="Privacy Policy"
      description="Our Privacy Policy is being finalized and will be published here before the public launch. Please check back soon."
      backHref="/"
      backLabel="Back to Home"
    />
  );
}
