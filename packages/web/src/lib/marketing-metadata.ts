import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
const OG_IMAGE = '/android-chrome-512x512.png';

const AUTH_PAGE_KEYS = new Set([
  'login',
  'signup',
  'forgotPassword',
  'resetPassword',
  'confirmEmail',
]);

const OG_LOCALE_MAP: Record<Locale, string> = {
  en: 'en_US',
  pt: 'pt_BR',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
};

export interface CreateMarketingMetadataOptions {
  locale: string;
  pageKey: string;
  path: string;
  /** Override description (e.g. for terms/privacy with LEGAL_CONFIG dates) */
  descriptionOverride?: string;
}

/**
 * Builds full page metadata (title, description, openGraph, twitter) for public marketing/auth pages.
 * Use in generateMetadata for layouts. Supports both pages.* and auth.* keys.
 */
export async function createMarketingMetadata({
  locale,
  pageKey,
  path,
  descriptionOverride,
}: CreateMarketingMetadataOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const titleKey = AUTH_PAGE_KEYS.has(pageKey)
    ? `auth.${pageKey}` as const
    : `pages.${pageKey}` as const;
  const pageTitle = t(titleKey);
  const fullTitle = `${pageTitle} | waQup`;

  let desc = descriptionOverride ?? t('defaultDescription');
  try {
    const d = t(`descriptions.${pageKey}`);
    if (typeof d === 'string' && !d.startsWith('descriptions.') && d.length > 10) {
      desc = d;
    }
  } catch {
    /* use default */
  }

  const canonicalPath = locale === routing.defaultLocale ? path : `/${locale}${path}`;
  const url = `${SITE_URL.replace(/\/$/, '')}${canonicalPath === '/' ? '' : canonicalPath}`;

  return {
    title: fullTitle,
    description: desc,
    openGraph: {
      type: 'website',
      url,
      siteName: 'waQup',
      title: fullTitle,
      description: desc,
      locale: OG_LOCALE_MAP[locale as Locale] ?? 'en_US',
      images: [{ url: OG_IMAGE, width: 512, height: 512, alt: 'waQup' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [OG_IMAGE],
    },
  };
}
