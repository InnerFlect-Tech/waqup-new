import type { Metadata, Viewport } from 'next';
import './globals.css';
import '../src/styles/animations.css';
import { ThemeProvider } from '@/theme';

export const metadata: Metadata = {
  title: 'waQup',
  description: 'Transform your mind through voice and sacred frequencies',
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
      <body>
        <ThemeProvider defaultThemeName="mystical-purple">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
