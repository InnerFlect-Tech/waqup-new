import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'waQup',
  description: 'waQup - Transform your mind through voice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
