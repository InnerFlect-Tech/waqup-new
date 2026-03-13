/**
 * Acknowledgments — people, services, and libraries that help build waQup.
 * Used on the About page (/sanctuary/settings/about).
 * Add beta testers, contributors, and services here.
 */

export interface PersonEntry {
  name: string;
  role?: string;
  url?: string;
}

export interface ServiceEntry {
  name: string;
  description?: string;
  url: string;
}

export interface AcknowledgmentsConfig {
  people: PersonEntry[];
  betaTesters: PersonEntry[];
  services: ServiceEntry[];
  libraries: string[];
}

export const ACKNOWLEDGMENTS: AcknowledgmentsConfig = {
  people: [
    { name: 'InnerFlect Tech', role: 'Development & product', url: 'https://innerflect.tech' },
    // Add advisors, early contributors, etc.
  ],
  betaTesters: [
    // Add beta tester names as they join (or keep empty until ready to credit).
    // Example: { name: 'Alex M.', role: 'Beta tester' },
  ],
  services: [
    { name: 'Supabase', description: 'Database & auth', url: 'https://supabase.com' },
    { name: 'Stripe', description: 'Payments (web)', url: 'https://stripe.com' },
    { name: 'RevenueCat', description: 'In-app purchases (mobile)', url: 'https://revenuecat.com' },
    { name: 'ElevenLabs', description: 'Voice cloning & TTS', url: 'https://elevenlabs.io' },
    { name: 'OpenAI', description: 'Conversation & scripts', url: 'https://openai.com' },
    { name: 'Vercel', description: 'Web hosting', url: 'https://vercel.com' },
    { name: 'Expo', description: 'Mobile framework', url: 'https://expo.dev' },
  ],
  libraries: [
    'React',
    'Next.js',
    'React Native',
    'Supabase',
    'Stripe',
    'Framer Motion',
    'Tailwind CSS',
    'Zustand',
    'React Query',
  ],
};
