import type { Metadata } from 'next';
import { DataDeletionContent } from './DataDeletionContent';

export const metadata: Metadata = {
  title: 'User Data Deletion',
  description: 'How to request deletion of your data from waQup.',
  openGraph: {
    title: 'User Data Deletion — waQup',
    description: 'How to request deletion of your data from waQup.',
    url: '/data-deletion',
  },
};

export default function DataDeletionPage() {
  return <DataDeletionContent />;
}
