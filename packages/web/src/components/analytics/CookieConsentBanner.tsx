'use client';

import { useEffect, useState } from 'react';
import { HEADER_PADDING_X, MAX_WIDTH_7XL, spacing, borderRadius } from '@/theme';

/**
 * NOTE: This component is rendered in layout.tsx OUTSIDE <ThemeProvider>,
 * so it must NOT call useTheme(). All colours are hardcoded to the dark brand
 * palette — the banner is always dark regardless of theme.
 */

const STORAGE_KEY = 'waqup_cookie_consent';

type ConsentValue = 'granted' | 'denied';
type ConsentDecision = 'accepted' | 'declined' | null;

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
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: `0 ${HEADER_PADDING_X} ${spacing.lg}`,
      }}
    >
      <div
        style={{
          maxWidth: MAX_WIDTH_7XL,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: spacing.lg,
          padding: `${spacing.md} ${spacing.xl}`,
          borderRadius: borderRadius.lg,
          background: 'rgba(10, 4, 28, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(168,85,247,0.1)',
        }}
      >
        <p
          style={{
            flex: 1,
            fontSize: 14,
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.65)',
            margin: 0,
          }}
        >
          We use cookies to understand how you use waQup and to improve your experience. Your data is never sold.{' '}
          <a
            href="/privacy"
            style={{
              color: '#A855F7',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
            }}
          >
            Privacy Policy
          </a>
        </p>

        <div style={{ display: 'flex', gap: spacing.sm, flexShrink: 0 }}>
          <button
            onClick={handleDecline}
            style={{
              padding: `${spacing.sm} ${spacing.md}`,
              borderRadius: borderRadius.md,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.55)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = 'rgba(255,255,255,0.3)';
              el.style.color = 'rgba(255,255,255,0.85)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = 'rgba(255,255,255,0.12)';
              el.style.color = 'rgba(255,255,255,0.55)';
            }}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            style={{
              padding: `${spacing.sm} ${spacing.lg}`,
              borderRadius: borderRadius.md,
              border: 'none',
              background: 'linear-gradient(135deg, #9333EA, #7C3AED)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
