import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Discover how waQup works: personalized morning rituals, daily reminders, and AI-powered guidance for your transformation journey.',
  openGraph: {
    title: 'How It Works — waQup',
    description:
      'Discover how waQup works: personalized morning rituals, daily reminders, and AI-powered guidance for your transformation journey.',
    url: '/how-it-works',
  },
  twitter: {
    title: 'How It Works — waQup',
    description:
      'Discover how waQup works: personalized morning rituals, daily reminders, and AI-powered guidance for your transformation journey.',
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
