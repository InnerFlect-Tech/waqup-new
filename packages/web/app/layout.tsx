import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import './globals.css';
import '../src/styles/animations.css';
import { ThemeProvider } from '@/theme';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { AppLayout } from '@/components';
import { ToastProvider } from '@/components/ui/Toast';
import { QueryProvider } from '@/components/shared/QueryProvider';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import { GoogleAnalyticsTracker, CookieConsentBanner } from '@/components/analytics';

/** System font stack — avoids Google Fonts fetch (ETIMEDOUT on slow/unreliable networks) */
const FONT_CLASS = 'font-sans antialiased';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
      <head>
        {/*
         * GA4 Consent Mode v2 — must run BEFORE the gtag.js script loads.
         * Defaults all consent types to 'denied' so no data is collected
         * until the user accepts via CookieConsentBanner.
         * wait_for_update: 500ms gives the consent banner time to restore
         * a prior decision from localStorage before the first event fires.
         */}
        {GA_ID && (
          <Script id="ga4-consent-defaults" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500,
              });
              gtag('set', 'url_passthrough', true);
              gtag('set', 'ads_data_redaction', true);
            `}
          </Script>
        )}
      </head>
      <body className={FONT_CLASS}>
        {/*
         * GA4 gtag.js — loaded only in production with afterInteractive
         * strategy so it never blocks the initial render or hydration.
         * Consent Mode v2 (set above) prevents data collection until
         * the user grants consent via CookieConsentBanner.
         */}
        {GA_ID && process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  send_page_view: false,
                  cookie_flags: 'SameSite=None;Secure',
                });
              `}
            </Script>
          </>
        )}

        <ServiceWorkerRegistration />
        {/* Headless: wires shared analytics transport to window.gtag */}
        <AnalyticsProvider />
        {/*
         * Tracks page views on every client-side route change.
         * Wrapped in Suspense because useSearchParams() requires it.
         */}
        <Suspense fallback={null}>
          <GoogleAnalyticsTracker />
        </Suspense>
        {/* GDPR Consent Mode v2 banner */}
        <CookieConsentBanner />

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
