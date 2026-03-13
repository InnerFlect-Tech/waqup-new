/**
 * Canonical product copy — single source of truth for user-facing messaging.
 * Use these constants across web and mobile to ensure consistency.
 */

/** Canonical definition: what practice/training means (for help, FAQ, onboarding) */
export const PRACTICE_DEFINITION =
  'Practice means listening to and replaying your affirmations, meditations, and rituals.';

/** One-line practice-is-free message (for CTAs, tips, footers) */
export const PRACTICE_IS_FREE_SHORT =
  'Practice is free. Replay your content as often as you like. Qs are only used when you create something new.';

/** Shorter variant — makes clear that listening/replay is free (for tight spaces) */
export const PRACTICE_IS_FREE_ONE_LINER =
  'Listening to your content is always free — Qs only power creation.';

/** Qs explanations */
export const QS_EXPLANATION = {
  short: 'Qs power creation — affirmations, meditations, rituals. Each creation uses a few Qs. Replay is always free.',
  medium:
    'Qs are credits used to create new content. You earn them when you sign up and can purchase more. Listening to and practicing your existing content is always 100% free. Qs are only spent during creation.',
  faq: 'Qs are the credits used to create new content. You earn Qs when you sign up and can purchase more. One thing worth knowing: listening to and practicing your existing content is always 100% free. Qs are only spent during creation.',
} as const;

/** Voice cloning — canonical description */
export const VOICE_CLONING_COPY =
  'Record 60 seconds of your voice. waQup clones it — or choose from professional voices. Your choice.';

/** Orb introduction — what it is and when to use it */
export const ORB_INTRO =
  'The Orb is your voice AI. Speak to it — ask for guidance, reflect, or get help creating content. Each reply uses Qs from your balance.';

/** Shorter variant for compact UI (e.g. Speak page) */
export const ORB_INTRO_SHORT = 'Speak naturally. The Orb responds with guidance, insight, or creation help. Each reply uses Qs.';
