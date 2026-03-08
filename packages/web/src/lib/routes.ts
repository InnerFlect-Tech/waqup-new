/**
 * Canonical route data - single source for /pages and /sitemap-view
 */

export type RouteStatus = 'exists' | 'to_create' | 'to_delete' | 'to_change';

export interface RouteEntry {
  path: string;
  section: string;
  description?: string;
  status?: RouteStatus;
  note?: string;
}

export const APP_ROUTES: RouteEntry[] = [
  { path: '/', section: 'Landing', description: 'Homepage', status: 'exists' },
  { path: '/how-it-works', section: 'Marketing', description: 'How it works', status: 'exists' },
  { path: '/pricing', section: 'Marketing', description: 'Pricing', status: 'exists' },
  { path: '/funnels', section: 'Marketing', description: 'Sales funnels & ROI', status: 'exists' },
  { path: '/investors', section: 'Marketing', description: 'Investors', status: 'exists' },
  { path: '/system', section: 'Utility', description: 'System & schema docs', status: 'exists' },
  { path: '/login', section: 'Auth', description: 'Sign in', status: 'exists' },
  { path: '/signup', section: 'Auth', description: 'Sign up', status: 'exists' },
  { path: '/forgot-password', section: 'Auth', description: 'Forgot password', status: 'exists' },
  { path: '/reset-password', section: 'Auth', description: 'Reset password', status: 'exists' },
  { path: '/confirm-email', section: 'Auth', description: 'Confirm email', status: 'exists' },
  { path: '/auth/beta-signup', section: 'Auth', description: 'Beta signup', status: 'exists' },
  { path: '/onboarding', section: 'Onboarding', description: 'Onboarding', status: 'exists' },
  { path: '/onboarding/profile', section: 'Onboarding', description: 'Profile', status: 'exists' },
  { path: '/onboarding/preferences', section: 'Onboarding', description: 'Preferences', status: 'exists' },
  { path: '/onboarding/guide', section: 'Onboarding', description: 'Guide', status: 'exists' },
  { path: '/showcase', section: 'Utility', description: 'Design system', status: 'exists' },
  { path: '/pages', section: 'Utility', description: 'Pages index', status: 'exists' },
  { path: '/sitemap-view', section: 'Utility', description: 'Sitemap', status: 'exists' },
  { path: '/home', section: 'Main App', description: 'Dashboard', status: 'exists', note: 'Clarify vs /sanctuary' },
  { path: '/library', section: 'Main App', description: 'Library', status: 'exists' },
  { path: '/create', section: 'Main App', description: 'Create', status: 'exists' },
  { path: '/profile', section: 'Main App', description: 'Profile', status: 'exists' },
  { path: '/sanctuary', section: 'Sanctuary', description: 'Sanctuary home', status: 'exists', note: 'Clarify vs /home' },
  { path: '/sanctuary/settings', section: 'Sanctuary', description: 'Settings', status: 'exists' },
  { path: '/sanctuary/credits', section: 'Sanctuary', description: 'Credits', status: 'exists' },
  { path: '/sanctuary/voice', section: 'Sanctuary', description: 'My Voice', status: 'exists' },
  { path: '/sanctuary/progress', section: 'Sanctuary', description: 'Progress', status: 'exists' },
  { path: '/sanctuary/referral', section: 'Sanctuary', description: 'Referral', status: 'exists' },
  { path: '/sanctuary/reminders', section: 'Sanctuary', description: 'Reminders', status: 'exists' },
  { path: '/sanctuary/learn', section: 'Sanctuary', description: 'Learn', status: 'exists' },
  { path: '/sanctuary/affirmations', section: 'Affirmations', description: 'List', status: 'exists' },
  { path: '/sanctuary/affirmations/[id]', section: 'Affirmations', description: 'Detail', status: 'exists' },
  { path: '/sanctuary/affirmations/[id]/edit', section: 'Affirmations', description: 'Edit', status: 'exists' },
  { path: '/sanctuary/affirmations/create', section: 'Affirmations', description: 'Create', status: 'to_change', note: 'Make conversational' },
  { path: '/sanctuary/affirmations/record', section: 'Affirmations', description: 'Record', status: 'exists' },
  { path: '/sanctuary/affirmations/[id]/edit-audio', section: 'Affirmations', description: 'Edit sound/script', status: 'exists' },
  { path: '/sanctuary/rituals', section: 'Rituals', description: 'List', status: 'exists' },
  { path: '/sanctuary/rituals/[id]', section: 'Rituals', description: 'Detail', status: 'exists' },
  { path: '/sanctuary/rituals/[id]/edit', section: 'Rituals', description: 'Edit', status: 'exists' },
  { path: '/sanctuary/rituals/create', section: 'Rituals', description: 'Create', status: 'to_change', note: 'Make conversational' },
  { path: '/sanctuary/rituals/recordings', section: 'Rituals', description: 'Recordings', status: 'exists' },
  { path: '/sanctuary/rituals/[id]/edit-audio', section: 'Rituals', description: 'Edit sound/script', status: 'exists' },
  { path: '/sanctuary/meditations', section: 'Meditations', description: 'List', status: 'exists' },
  { path: '/sanctuary/meditations/[id]', section: 'Meditations', description: 'Detail', status: 'exists' },
  { path: '/sanctuary/meditations/[id]/edit', section: 'Meditations', description: 'Edit', status: 'exists' },
  { path: '/sanctuary/meditations/create', section: 'Meditations', description: 'Create', status: 'to_change', note: 'Make conversational' },
  { path: '/sanctuary/meditations/[id]/edit-audio', section: 'Meditations', description: 'Edit sound/script', status: 'exists' },
  { path: '/speak', section: 'Voice', description: 'Orb that speaks', status: 'exists' },
  { path: '/create/conversation', section: 'Voice', description: 'Conversational creation', status: 'exists' },
  { path: '/marketplace', section: 'Marketplace', description: 'Discovery', status: 'exists' },
  { path: '/marketplace/creator', section: 'Marketplace', description: 'Creator dashboard', status: 'exists' },
];

/** Path to clickable href (replace [id] etc) */
export function pathToHref(path: string): string {
  return path.replace(/\[id\]/g, '1').replace(/\[[\w-]+\]/g, '1');
}

/** Routes without dynamic params - for sitemap links */
export const SITEMAP_ROUTES = APP_ROUTES.filter((r) => !r.path.includes('['));

/** Group by section for sitemap display */
export function routesBySection(): Record<string, string[]> {
  return SITEMAP_ROUTES.reduce<Record<string, string[]>>((acc, r) => {
    if (!acc[r.section]) acc[r.section] = [];
    acc[r.section].push(r.path);
    return acc;
  }, {});
}

/** Group by auth: public (no login) vs protected */
const PUBLIC_SECTIONS = ['Landing', 'Marketing', 'Auth', 'Onboarding', 'Utility'];
const PROTECTED_SECTIONS = ['Main App', 'Sanctuary', 'Affirmations', 'Rituals', 'Meditations', 'Voice', 'Marketplace'];

export function getPublicRoutes(): RouteEntry[] {
  return APP_ROUTES.filter((r) => PUBLIC_SECTIONS.includes(r.section));
}

export function getProtectedRoutes(): RouteEntry[] {
  return APP_ROUTES.filter((r) => PROTECTED_SECTIONS.includes(r.section));
}

/** Pages index format: group by title, map to RouteEntry with path/description/status */
export interface RouteGroup {
  title: string;
  routes: Array<{ path: string; description: string; status: RouteStatus; note?: string }>;
}

const SECTION_TO_GROUP: Record<string, string> = {
  Landing: 'Landing & Marketing',
  Marketing: 'Landing & Marketing',
  Auth: 'Auth',
  Onboarding: 'Onboarding',
  Utility: 'Utility (public by exception)',
  'Main App': 'Main',
  Sanctuary: 'Sanctuary',
  Affirmations: 'Affirmations',
  Rituals: 'Rituals',
  Meditations: 'Meditations',
  Voice: 'Voice & conversation',
  Marketplace: 'Marketplace (Phase 14)',
};

export function getRouteGroupsForPages(): { public: RouteGroup[]; protected: RouteGroup[] } {
  const toGroups = (routes: RouteEntry[]) => {
    const byGroup = new Map<string, typeof routes>();
    for (const r of routes) {
      const key = SECTION_TO_GROUP[r.section] ?? r.section;
      if (!byGroup.has(key)) byGroup.set(key, []);
      byGroup.get(key)!.push(r);
    }
    return Array.from(byGroup.entries()).map(([title, rs]) => ({
      title,
      routes: rs.map((r) => ({
        path: r.path,
        description: r.description ?? r.path,
        status: (r.status ?? 'exists') as RouteStatus,
        note: r.note,
      })),
    }));
  };
  return { public: toGroups(getPublicRoutes()), protected: toGroups(getProtectedRoutes()) };
}
