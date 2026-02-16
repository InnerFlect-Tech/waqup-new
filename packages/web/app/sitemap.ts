import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://waqup.com';

const STATIC_ROUTES = [
  '',
  '/how-it-works',
  '/pricing',
  '/login',
  '/signup',
  '/confirm-email',
  '/auth/beta-signup',
  '/onboarding',
  '/onboarding/profile',
  '/onboarding/preferences',
  '/onboarding/guide',
  '/home',
  '/library',
  '/create',
  '/profile',
  '/sanctuary',
  '/sanctuary/settings',
  '/sanctuary/credits',
  '/sanctuary/progress',
  '/sanctuary/referral',
  '/sanctuary/reminders',
  '/sanctuary/learn',
  '/sanctuary/affirmations',
  '/sanctuary/affirmations/create',
  '/sanctuary/affirmations/record',
  '/sanctuary/rituals',
  '/sanctuary/rituals/create',
  '/sanctuary/rituals/recordings',
  '/sanctuary/meditations/create',
  '/showcase',
  '/pages',
  '/sitemap-view',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((path) => ({
    url: path ? `${BASE_URL}${path}` : BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: !path ? 1 : 0.8,
  }));
}
