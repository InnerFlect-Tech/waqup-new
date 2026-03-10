import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

/**
 * Root path "/" — redirect to default locale so all content is served under [locale]
 * with ThemeProvider and other providers. Avoids prerender error where "/" was
 * attempted without the [locale] layout's provider tree.
 */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
