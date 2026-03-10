import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { getThemeInitData, DEFAULT_BRAND_COLORS } from '@waqup/shared/theme';
import '../globals.css';
import '../../src/styles/animations.css';
import { AppProviders } from '@/components/AppProviders';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { Analytics } from '@vercel/analytics/react';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import { GoogleAnalyticsTracker } from '@/components/analytics';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';

/** System font stack — avoids Google Fonts fetch (ETIMEDOUT on slow/unreliable networks) */
const FONT_CLASS = 'font-sans antialiased';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
const OG_IMAGE = '/android-chrome-512x512.png';

/** Map locale codes to BCP 47 / OG format */
const OG_LOCALE_MAP: Record<Locale, string> = {
  en: 'en_US',
  pt: 'pt_BR',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: 'waQup', template: '%s — waQup' },
    description: t('defaultDescription'),
    openGraph: {
      type: 'website',
      locale: OG_LOCALE_MAP[locale as Locale] ?? 'en_US',
      url: SITE_URL,
      siteName: 'waQup',
      title: 'waQup',
      description: t('defaultDescription'),
      images: [{ url: OG_IMAGE, width: 512, height: 512, alt: 'waQup' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'waQup',
      description: t('defaultDescription'),
      images: [OG_IMAGE],
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.json',
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: DEFAULT_BRAND_COLORS.accent,
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale — show 404 for invalid locale segments
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const themeInitData = getThemeInitData();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="facebook-domain-verification" content="ufejcx83dtydqoxm9x3gfysksrq6kb" />
        {/*
         * Theme init — runs before body to prevent flash of wrong theme.
         * URL ?theme= wins (for shared links), then localStorage, then default.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=${JSON.stringify(themeInitData)};var p=new URLSearchParams(window.location.search);var u=p.get("theme");var s=typeof localStorage!=="undefined"?localStorage.getItem("waqup-theme"):null;var n=(u&&t[u])?u:(s&&t[s])?s:"mystical-purple";var c=t[n]||t["mystical-purple"];if(!c)return;var r=document.documentElement;Object.keys(c).forEach(function(k){r.style.setProperty("--theme-"+k.replace(/([A-Z])/g,"-$1").toLowerCase().replace(/^-/,""),c[k]);});})();`,
          }}
        />
        {/*
         * GA4 Consent Mode v2 — MUST run synchronously in <head> before
         * gtag.js loads, so GA never collects data without user consent.
         * Sets all consent types to 'denied' by default.
         * CookieConsentBanner calls gtag('consent','update',...) on user decision.
         */}
        {GA_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});gtag('set','url_passthrough',true);gtag('set','ads_data_redaction',true);`,
            }}
          />
        )}
      </head>
      <body className={FONT_CLASS}>
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
        <AnalyticsProvider />
        <Suspense fallback={null}>
          <GoogleAnalyticsTracker />
        </Suspense>
        <Analytics />

        <NextIntlClientProvider messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
