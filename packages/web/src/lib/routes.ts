/**
 * Canonical route data — single source of truth for /pages and /sitemap-view
 */

export type RouteStatus = 'exists' | 'to_create' | 'to_delete' | 'to_change';

export type RouteCompleteness = 'complete' | 'stub' | 'placeholder' | 'mock' | 'wired' | 'to_change';

export interface RouteEntry {
  path: string;
  section: string;
  description?: string;
  status?: RouteStatus;
  completeness?: RouteCompleteness;
  note?: string;
}

export const APP_ROUTES: RouteEntry[] = [
  // ── Landing & Marketing ────────────────────────────────────────────────────
  { path: '/', section: 'Landing', description: 'Landing page (default locale)', status: 'exists', completeness: 'complete' },
  { path: '/launch', section: 'Landing', description: 'Primary marketing landing page', status: 'exists', completeness: 'complete' },
  { path: '/how-it-works', section: 'Marketing', description: 'How it works (step-by-step)', status: 'exists', completeness: 'complete' },
  { path: '/pricing', section: 'Marketing', description: 'Pricing & plans', status: 'exists', completeness: 'complete' },
  { path: '/explanation', section: 'Marketing', description: 'The Science — why voice + affirmations work', status: 'exists', completeness: 'complete' },
  { path: '/our-story', section: 'Marketing', description: 'Our Story — founder narrative', status: 'exists', completeness: 'complete' },
  { path: '/community', section: 'Marketing', description: 'Community — collective intention', status: 'exists', completeness: 'complete' },
  { path: '/join', section: 'Marketing', description: 'Founding member sign-up', status: 'exists', completeness: 'complete' },
  { path: '/waitlist', section: 'Marketing', description: 'Join the waitlist (multi-step form)', status: 'exists', completeness: 'complete' },
  { path: '/get-qs', section: 'Marketing', description: 'Public Q packs — view without login; sign in required to purchase', status: 'exists', completeness: 'wired' },
  { path: '/funnels', section: 'Marketing', description: 'Sales funnels & ROI (internal)', status: 'exists', completeness: 'complete', note: 'Internal — not in public nav' },
  { path: '/investors', section: 'Marketing', description: 'Investor pitch deck page', status: 'exists', completeness: 'complete', note: 'Footer only — not in header' },
  { path: '/play/[id]', section: 'Marketing', description: 'Public audio player (SSR + OG)', status: 'exists', completeness: 'complete' },
  { path: '/for-coaches', section: 'Marketing', description: 'For coaches (audience page)', status: 'exists', completeness: 'complete' },
  { path: '/for-creators', section: 'Marketing', description: 'For creators', status: 'exists', completeness: 'complete' },
  { path: '/for-studios', section: 'Marketing', description: 'For studios', status: 'exists', completeness: 'complete' },
  { path: '/for-teachers', section: 'Marketing', description: 'For teachers', status: 'exists', completeness: 'complete' },

  // ── Legal ──────────────────────────────────────────────────────────────────
  { path: '/privacy', section: 'Legal', description: 'Privacy policy', status: 'exists', completeness: 'complete', note: 'Full GDPR/CCPA content' },
  { path: '/terms', section: 'Legal', description: 'Terms of service', status: 'exists', completeness: 'complete', note: 'Full terms with wellness disclaimer' },
  { path: '/data-deletion', section: 'Legal', description: 'User data deletion', status: 'exists', completeness: 'complete', note: 'Required for Meta/Facebook app submission' },

  // ── Auth ───────────────────────────────────────────────────────────────────
  { path: '/login', section: 'Auth', description: 'Sign in', status: 'exists', completeness: 'complete' },
  { path: '/signup', section: 'Auth', description: 'Sign up', status: 'exists', completeness: 'complete' },
  { path: '/forgot-password', section: 'Auth', description: 'Forgot password', status: 'exists', completeness: 'complete' },
  { path: '/reset-password', section: 'Auth', description: 'Reset password', status: 'exists', completeness: 'complete' },
  { path: '/confirm-email', section: 'Auth', description: 'Confirm email', status: 'exists', completeness: 'complete' },
  { path: '/coming-soon', section: 'Auth', description: 'Access gate — shown to logged-in users pending waitlist approval', status: 'exists', completeness: 'complete' },

  // ── Onboarding ─────────────────────────────────────────────────────────────
  { path: '/onboarding', section: 'Onboarding', description: 'Why + Intention selector', status: 'exists', completeness: 'complete' },
  { path: '/onboarding/voice', section: 'Onboarding', description: 'Voice cloning (IVC)', status: 'exists', completeness: 'complete' },
  { path: '/onboarding/profile', section: 'Onboarding', description: 'Profile setup', status: 'exists', completeness: 'complete' },
  { path: '/onboarding/preferences', section: 'Onboarding', description: 'Preferences', status: 'exists', completeness: 'placeholder' },
  { path: '/onboarding/guide', section: 'Onboarding', description: 'Getting started guide', status: 'exists', completeness: 'placeholder' },
  { path: '/onboarding/role', section: 'Onboarding', description: 'Role selection', status: 'exists', completeness: 'placeholder' },

  // ── Main App ───────────────────────────────────────────────────────────────
  { path: '/library', section: 'Main App', description: 'Content library', status: 'exists', completeness: 'wired' },
  { path: '/create', section: 'Main App', description: 'Create — content type selector', status: 'exists', completeness: 'complete' },
  { path: '/create/conversation', section: 'Main App', description: 'Text conversational creation', status: 'exists', completeness: 'mock' },
  { path: '/create/orb', section: 'Main App', description: 'Voice orb creation', status: 'exists', completeness: 'wired' },
  { path: '/profile', section: 'Main App', description: 'User profile', status: 'exists', completeness: 'complete' },

  // ── Voice & Speak ──────────────────────────────────────────────────────────
  { path: '/speak', section: 'Voice', description: 'Speak — real-time voice AI conversation', status: 'exists', completeness: 'complete' },
  { path: '/speak/test', section: 'Voice', description: 'Speak — dev test harness', status: 'exists', completeness: 'complete', note: 'Dev only' },

  // ── Sanctuary ──────────────────────────────────────────────────────────────
  { path: '/sanctuary', section: 'Sanctuary', description: 'Sanctuary home dashboard', status: 'exists', completeness: 'complete' },
  { path: '/sanctuary/settings', section: 'Sanctuary', description: 'Account settings', status: 'exists', completeness: 'stub' },
  { path: '/sanctuary/settings/about', section: 'Sanctuary', description: 'About & acknowledgments (version, changelog, credits)', status: 'exists', completeness: 'complete' },
  { path: '/sanctuary/voice', section: 'Sanctuary', description: 'Voice cloning setup', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/voices', section: 'Sanctuary', description: 'Voice library browser', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/progress', section: 'Sanctuary', description: 'Progress tracking & XP', status: 'exists', completeness: 'stub' },
  { path: '/sanctuary/reminders', section: 'Sanctuary', description: 'Reminders manager', status: 'exists', completeness: 'stub' },
  { path: '/sanctuary/referral', section: 'Sanctuary', description: 'Referral & rewards', status: 'exists', completeness: 'stub' },
  { path: '/sanctuary/learn', section: 'Sanctuary', description: 'Educational content', status: 'exists', completeness: 'stub' },
  { path: '/sanctuary/help', section: 'Sanctuary', description: 'Help & support', status: 'exists', completeness: 'stub' },
  { path: '/sanctuary/plan', section: 'Sanctuary', description: 'Subscription plan picker', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/series', section: 'Sanctuary', description: 'Series list', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/series/[id]', section: 'Sanctuary', description: 'Series detail', status: 'exists', completeness: 'wired' },

  // ── Credits ────────────────────────────────────────────────────────────────
  { path: '/sanctuary/credits', section: 'Credits', description: 'Credit balance overview', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/credits/buy', section: 'Credits', description: 'Buy Qs (in-app)', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/credits/transactions', section: 'Credits', description: 'Transaction history', status: 'exists', completeness: 'wired' },

  // ── Affirmations ───────────────────────────────────────────────────────────
  { path: '/sanctuary/affirmations', section: 'Affirmations', description: 'List', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/affirmations/[id]', section: 'Affirmations', description: 'Detail / player', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/affirmations/[id]/edit', section: 'Affirmations', description: 'Edit metadata', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/affirmations/[id]/edit-audio', section: 'Affirmations', description: 'Edit audio layers', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/affirmations/create', section: 'Affirmations', description: 'Create redirect → init', status: 'exists', completeness: 'to_change' },
  { path: '/sanctuary/affirmations/create/init', section: 'Affirmations', description: 'Create — step overview + mode select', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/affirmations/create/intent', section: 'Affirmations', description: 'Create — intention', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/affirmations/create/script', section: 'Affirmations', description: 'Create — AI-generated script', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/affirmations/create/voice', section: 'Affirmations', description: 'Create — voice selection', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/affirmations/create/audio', section: 'Affirmations', description: 'Create — audio mixing', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/affirmations/create/review', section: 'Affirmations', description: 'Create — review before save', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/affirmations/create/complete', section: 'Affirmations', description: 'Create — success screen', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/affirmations/record', section: 'Affirmations', description: 'Record voice for affirmation', status: 'exists', completeness: 'placeholder', note: 'Placeholder' },

  // ── Meditations ────────────────────────────────────────────────────────────
  { path: '/sanctuary/meditations', section: 'Meditations', description: 'List', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/meditations/[id]', section: 'Meditations', description: 'Detail / player', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/meditations/[id]/edit', section: 'Meditations', description: 'Edit metadata', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/meditations/[id]/edit-audio', section: 'Meditations', description: 'Edit audio layers', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/meditations/create', section: 'Meditations', description: 'Create redirect → init', status: 'exists', completeness: 'to_change' },
  { path: '/sanctuary/meditations/create/init', section: 'Meditations', description: 'Create — step overview + mode select', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/meditations/create/intent', section: 'Meditations', description: 'Create — intention', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/meditations/create/context', section: 'Meditations', description: 'Create — emotional context', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/meditations/create/script', section: 'Meditations', description: 'Create — AI-generated script', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/meditations/create/voice', section: 'Meditations', description: 'Create — voice selection', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/meditations/create/audio', section: 'Meditations', description: 'Create — audio mixing', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/meditations/create/review', section: 'Meditations', description: 'Create — review before save', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/meditations/create/complete', section: 'Meditations', description: 'Create — success screen', status: 'exists', completeness: 'wired' },

  // ── Rituals ────────────────────────────────────────────────────────────────
  { path: '/sanctuary/rituals', section: 'Rituals', description: 'List', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/rituals/recordings', section: 'Rituals', description: 'Ritual recordings', status: 'exists', completeness: 'stub' },
  { path: '/sanctuary/rituals/[id]', section: 'Rituals', description: 'Detail / player', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/rituals/[id]/edit', section: 'Rituals', description: 'Edit metadata', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/rituals/[id]/edit-audio', section: 'Rituals', description: 'Edit audio layers', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/rituals/create', section: 'Rituals', description: 'Create redirect → init', status: 'exists', completeness: 'to_change' },
  { path: '/sanctuary/rituals/create/init', section: 'Rituals', description: 'Create — step overview + mode select', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/rituals/create/goals', section: 'Rituals', description: 'Create — goal selection', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/rituals/create/context', section: 'Rituals', description: 'Create — emotional context', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/rituals/create/personalization', section: 'Rituals', description: 'Create — deep personalization', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/rituals/create/script', section: 'Rituals', description: 'Create — AI-generated script', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/rituals/create/voice', section: 'Rituals', description: 'Create — voice selection', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/rituals/create/audio', section: 'Rituals', description: 'Create — audio mixing', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/rituals/create/review', section: 'Rituals', description: 'Create — review before save', status: 'exists', completeness: 'wired' },
  { path: '/sanctuary/rituals/create/complete', section: 'Rituals', description: 'Create — success screen', status: 'exists', completeness: 'wired' },

  // ── Marketplace ────────────────────────────────────────────────────────────
  { path: '/marketplace', section: 'Marketplace', description: 'Browse / discovery', status: 'exists', completeness: 'mock' },
  { path: '/marketplace/[id]', section: 'Marketplace', description: 'Item detail + player', status: 'exists', completeness: 'mock' },
  { path: '/marketplace/creator', section: 'Marketplace', description: 'Creator dashboard', status: 'exists', completeness: 'stub' },

  // ── Superadmin ─────────────────────────────────────────────────────────────
  { path: '/admin', section: 'Superadmin', description: 'Superadmin dashboard hub', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/admin/oracle', section: 'Superadmin', description: 'Oracle AI config', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/admin/users', section: 'Superadmin', description: 'User management', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/admin/waitlist', section: 'Superadmin', description: 'Waitlist signups dashboard', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/admin/ios-release', section: 'Superadmin', description: 'iOS release management', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/system', section: 'Superadmin', description: 'System & schema overview', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/system/creation-steps', section: 'Superadmin', description: 'Creation pipeline step status', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/system/pipelines', section: 'Superadmin', description: 'Pipelines reference (scientific foundations)', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/system/audio', section: 'Superadmin', description: 'Audio & TTS reference', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/system/conversation', section: 'Superadmin', description: 'Conversation flow (LLM state machine)', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/system/schema', section: 'Superadmin', description: 'Schema live status', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/admin/content', section: 'Superadmin', description: 'Content overview (counts, activity)', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/health', section: 'Superadmin', description: 'API health dashboard', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/showcase', section: 'Superadmin', description: 'Design system component showcase', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/pages', section: 'Superadmin', description: 'Pages index (all routes)', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/sitemap-view', section: 'Superadmin', description: 'Visual sitemap', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  // ── Updates (Superadmin) ───────────────────────────────────────────────────
  { path: '/updates', section: 'Updates', description: 'Updates & how-to guides index', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/updates/beta-readiness-implementation', section: 'Updates', description: 'Beta readiness implementation: what was done, migrations, prompts for copyrights', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/updates/beta-tester-recruitment', section: 'Updates', description: 'Beta tester recruitment guide', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/updates/audio-system-implementation', section: 'Updates', description: 'Audio system audit: own-voice recording, atmosphere presets, migrations, prompts', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/updates/multilingual-i18n-implementation', section: 'Updates', description: 'Multilingual i18n implementation guide', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
  { path: '/updates/open-items', section: 'Updates', description: 'Unresolved work requiring attention before launch', status: 'exists', completeness: 'complete', note: 'Superadmin only' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Path to clickable href (replace [id] etc) */
export function pathToHref(path: string): string {
  return path.replace(/\[id\]/g, '1').replace(/\[[\w-]+\]/g, '1');
}

/** Routes without dynamic params — for sitemap links */
export const SITEMAP_ROUTES = APP_ROUTES.filter((r) => !r.path.includes('['));

/** Group by section for sitemap display */
export function routesBySection(): Record<string, string[]> {
  return SITEMAP_ROUTES.reduce<Record<string, string[]>>((acc, r) => {
    if (!acc[r.section]) acc[r.section] = [];
    acc[r.section].push(r.path);
    return acc;
  }, {});
}

const PUBLIC_SECTIONS = ['Landing', 'Marketing', 'Legal', 'Auth', 'Onboarding'];
const PROTECTED_SECTIONS = ['Main App', 'Voice', 'Sanctuary', 'Credits', 'Affirmations', 'Meditations', 'Rituals', 'Marketplace'];
const SUPERADMIN_SECTIONS = ['Superadmin', 'Updates'];

export function getPublicRoutes(): RouteEntry[] {
  return APP_ROUTES.filter((r) => PUBLIC_SECTIONS.includes(r.section));
}

export function getProtectedRoutes(): RouteEntry[] {
  return APP_ROUTES.filter((r) => PROTECTED_SECTIONS.includes(r.section));
}

export function getSuperadminRoutes(): RouteEntry[] {
  return APP_ROUTES.filter((r) => SUPERADMIN_SECTIONS.includes(r.section));
}

// ── Pages index ──────────────────────────────────────────────────────────────

export interface RouteGroup {
  title: string;
  routes: Array<{ path: string; description: string; status: RouteStatus; completeness?: RouteCompleteness; note?: string }>;
}

const SECTION_TO_GROUP: Record<string, string> = {
  Landing: 'Landing & Marketing',
  Marketing: 'Landing & Marketing',
  Legal: 'Legal',
  Auth: 'Auth',
  Onboarding: 'Onboarding',
  Superadmin: 'Superadmin',
  'Main App': 'Main App',
  Voice: 'Voice & Speak',
  Sanctuary: 'Sanctuary',
  Credits: 'Credits',
  Affirmations: 'Affirmations',
  Meditations: 'Meditations',
  Rituals: 'Rituals',
  Marketplace: 'Marketplace',
  Updates: 'Updates',
};

export function getRouteGroupsForPages(): { public: RouteGroup[]; protected: RouteGroup[]; superadmin: RouteGroup[] } {
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
        completeness: r.completeness,
        note: r.note,
      })),
    }));
  };
  return {
    public: toGroups(getPublicRoutes()),
    protected: toGroups(getProtectedRoutes()),
    superadmin: toGroups(getSuperadminRoutes()),
  };
}
