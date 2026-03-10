import type { Metadata } from 'next';
import { LEGAL_CONFIG } from '@/config/legal';
import { PrivacyContent } from './PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How waQup collects, uses, and protects your data. Effective ${LEGAL_CONFIG.privacyEffectiveDate}.`,
  openGraph: {
    title: 'Privacy Policy — waQup',
    description: `How waQup collects, uses, and protects your data. Effective ${LEGAL_CONFIG.privacyEffectiveDate}.`,
    url: '/privacy',
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
