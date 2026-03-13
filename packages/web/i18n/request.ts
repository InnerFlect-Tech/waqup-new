import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is supported, fall back to default
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  // Load all namespace message files and merge them into a single messages object
  const namespaces = [
    'common',
    'nav',
    'auth',
    'onboarding',
    'create',
    'sanctuary',
    'pricing',
    'settings',
    'audio',
    'errors',
    'metadata',
    'marketing',
    'legal',
  ];

  const messages: Record<string, unknown> = {};
  for (const ns of namespaces) {
    try {
      const nsMessages = (await import(`../messages/${locale}/${ns}.json`)).default;
      messages[ns] = nsMessages;
    } catch {
      // Fall back to English if locale file is missing
      try {
        const fallback = (await import(`../messages/en/${ns}.json`)).default;
        messages[ns] = fallback;
      } catch {
        messages[ns] = {};
      }
    }
  }

  return {
    locale,
    messages,
  };
});
