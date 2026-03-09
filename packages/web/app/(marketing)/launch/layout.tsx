import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'waQup — Your Mind Transformation, In Your Own Voice',
  description:
    'waQup creates personalized affirmations, meditations, and rituals — voiced by you — that rewire your subconscious. Not generic content. Your story. Your voice.',
  openGraph: {
    title: 'waQup — Your Mind Transformation, In Your Own Voice',
    description:
      'waQup creates personalized affirmations, meditations, and rituals — voiced by you — that rewire your subconscious.',
    url: '/launch',
  },
  twitter: {
    title: 'waQup — Your Mind Transformation, In Your Own Voice',
    description:
      'waQup creates personalized affirmations, meditations, and rituals — voiced by you — that rewire your subconscious.',
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
