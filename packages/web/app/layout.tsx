import type { ReactNode } from 'react';

/**
 * Minimal root layout — required for the root-level not-found page.
 * All user-facing content lives under app/[locale]/layout.tsx which
 * provides the <html>, <body>, providers, and NextIntlClientProvider.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
