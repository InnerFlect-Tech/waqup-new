import type { Metadata } from 'next';
import { LEGAL_CONFIG } from '@/config/legal';
import { TermsContent } from './TermsContent';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms governing use of waQup. Effective ${LEGAL_CONFIG.termsEffectiveDate}.`,
  openGraph: {
    title: 'Terms of Service — waQup',
    description: `Terms governing use of waQup. Effective ${LEGAL_CONFIG.termsEffectiveDate}.`,
    url: '/terms',
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
