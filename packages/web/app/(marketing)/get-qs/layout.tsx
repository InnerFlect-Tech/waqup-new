import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Q packs',
  description:
    'Buy Qs to create affirmations, meditations, and rituals. One-time packs — never expire. Practice is always free.',
  openGraph: {
    title: 'Q packs — waQup',
    description:
      'Buy Qs to create affirmations, meditations, and rituals. One-time packs — never expire. Practice is always free.',
    url: '/get-qs',
  },
  twitter: {
    title: 'Q packs — waQup',
    description:
      'Buy Qs to create affirmations, meditations, and rituals. One-time packs — never expire. Practice is always free.',
  },
};

export default function GetQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
