'use client';

import { useEffect, useState } from 'react';

type ConsentValue = 'granted' | 'denied';
type ConsentDecision = 'accepted' | 'declined' | null;

const STORAGE_KEY = 'waqup_cookie_consent';

function updateGtagConsent(analytics: ConsentValue, ads: ConsentValue) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    analytics_storage: analytics,
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
}

function getStoredDecision(): ConsentDecision {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'accepted' || stored === 'declined') return stored;
  } catch {
    // localStorage unavailable (private browsing, SSR)
  }
  return null;
}

function storeDecision(decision: 'accepted' | 'declined') {
  try {
    localStorage.setItem(STORAGE_KEY, decision);
  } catch {
    // ignore
  }
}

/**
 * GDPR Consent Mode v2 cookie banner.
 *
 * On mount:
 *  - If consent was previously given → silently update gtag consent state
 *  - If no decision yet → show the banner
 *
 * Accept → grants analytics + ads consent, hides banner, fires gtag update
 * Decline → denies analytics + ads consent, hides banner, fires gtag update
 *
 * The inline script in layout.tsx already sets defaults to 'denied',
 * so GA4 data is withheld until this component grants consent.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const decision = getStoredDecision();

    if (decision === 'accepted') {
      updateGtagConsent('granted', 'granted');
    } else if (decision === 'declined') {
      updateGtagConsent('denied', 'denied');
    } else {
      // No stored decision — show banner
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    storeDecision('accepted');
    updateGtagConsent('granted', 'granted');
    setVisible(false);
  }

  function handleDecline() {
    storeDecision('declined');
    updateGtagConsent('denied', 'denied');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#0f0a1e]/95 p-5 shadow-2xl backdrop-blur-xl sm:flex sm:items-center sm:gap-6">
        {/* Icon */}
        <div className="mb-3 flex-shrink-0 sm:mb-0">
          <span className="text-2xl" aria-hidden>🍪</span>
        </div>

        {/* Copy */}
        <div className="flex-1 text-sm text-white/70">
          <p>
            We use cookies to understand how you use waQup and to improve your experience.
            Your data is never sold.{' '}
            <a
              href="/privacy"
              className="text-purple-400 underline underline-offset-2 hover:text-purple-300"
            >
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-3 sm:mt-0 sm:flex-shrink-0">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:border-white/40 hover:text-white/80"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#0f0a1e]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
