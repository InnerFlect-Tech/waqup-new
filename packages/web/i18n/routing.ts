import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'pt', 'es', 'fr', 'de'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Hide the default locale prefix (/en/...) — English users see clean URLs
  localePrefix: 'as-needed',
});
