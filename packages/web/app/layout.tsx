import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../src/styles/animations.css';
import { ThemeProvider } from '@/theme';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { AppLayout } from '@/components';
import { ToastProvider } from '@/components/ui/Toast';
import { QueryProvider } from '@/components/shared/QueryProvider';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';

const inter = Inter({ subsets: ['latin'] });

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
const DEFAULT_TITLE = 'waQup';
const DEFAULT_DESCRIPTION = 'Transform your mind through voice and sacred frequencies';
const OG_IMAGE = '/android-chrome-512x512.png';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: '%s — waQup' },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: DEFAULT_TITLE,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 512, height: 512, alt: 'waQup' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#A855F7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ServiceWorkerRegistration />
        <AnalyticsProvider />
        <QueryProvider>
          <ThemeProvider defaultThemeName="mystical-purple">
            <AuthProvider>
              <ToastProvider>
                <AppLayout>{children}</AppLayout>
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
