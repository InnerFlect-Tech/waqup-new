/**
 * Mobile i18n setup using i18next + expo-localization.
 * Messages mirror packages/web/messages/ structure; keep in sync for consistency.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import enAuth from '../../messages/en/auth.json';
import enCommon from '../../messages/en/common.json';
import enNav from '../../messages/en/nav.json';

const resources = {
  en: {
    auth: enAuth as Record<string, unknown>,
    common: enCommon as Record<string, unknown>,
    nav: enNav as Record<string, unknown>,
  },
};

const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en';
const supportedLocales = ['en'];
const fallbackLocale = 'en';
const locale = supportedLocales.includes(deviceLocale) ? deviceLocale : fallbackLocale;

i18n.use(initReactI18next).init({
  resources,
  lng: locale,
  fallbackLng: fallbackLocale,
  defaultNS: 'common',
  ns: ['auth', 'common', 'nav'],
  interpolation: {
    escapeValue: false,
    defaultVariables: { destination: '' },
  },
});

export default i18n;
export { locale, supportedLocales };
