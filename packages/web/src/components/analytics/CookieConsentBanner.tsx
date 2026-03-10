'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { HEADER_PADDING_X, MAX_WIDTH_7XL, spacing, borderRadius, BLUR } from '@/theme';
import { DEFAULT_BRAND_COLORS } from '@waqup/shared/theme';

/**
 * NOTE: This component is rendered in layout.tsx OUTSIDE <ThemeProvider>,
 * so it must NOT call useTheme(). Uses DEFAULT_BRAND_COLORS from shared (SSOT).
 *
 * Responsive: compact layout on small screens (reduced padding, stacked buttons).
 */

const STORAGE_KEY = 'waqup_cookie_consent';
const SMALL_SCREEN_BREAKPOINT = 640;

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
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const mountedRef = useRef(true);

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

  useLayoutEffect(() => {
    mountedRef.current = true;
    const mq = window.matchMedia(`(max-width: ${SMALL_SCREEN_BREAKPOINT}px)`);
    const handler = () => {
      if (mountedRef.current) setIsSmallScreen(mq.matches);
    };
    handler();
    mq.addEventListener('change', handler);
    return () => {
      mountedRef.current = false;
      mq.removeEventListener('change', handler);
    };
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

  const paddingX = isSmallScreen ? spacing.md : HEADER_PADDING_X;
  const paddingBottom = isSmallScreen ? spacing.md : spacing.lg;
  const innerPadding = isSmallScreen ? `${spacing.sm} ${spacing.md}` : `${spacing.md} ${spacing.xl}`;
  const gap = isSmallScreen ? spacing.sm : spacing.lg;
  const flexDirection = isSmallScreen ? 'column' : 'row';
  const alignItems = isSmallScreen ? 'stretch' : 'center';
  const fontSize = isSmallScreen ? 13 : 14;
  const buttonPaddingX = isSmallScreen ? spacing.sm : spacing.md;
  const acceptPaddingX = isSmallScreen ? spacing.md : spacing.lg;

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
        padding: `0 ${paddingX} ${paddingBottom}`,
      }}
    >
      <div
        style={{
          maxWidth: MAX_WIDTH_7XL,
          margin: '0 auto',
          display: 'flex',
          flexDirection,
          alignItems,
          gap,
          padding: innerPadding,
          borderRadius: borderRadius.lg,
          background: `${DEFAULT_BRAND_COLORS.background}e6`,
          backdropFilter: BLUR.xl,
          WebkitBackdropFilter: BLUR.xl,
          border: `1px solid ${DEFAULT_BRAND_COLORS.border}`,
          boxShadow: `0 -4px 40px rgba(0,0,0,0.4), 0 0 0 1px ${DEFAULT_BRAND_COLORS.accent}1a`,
        }}
      >
        <p
          style={{
            flex: isSmallScreen ? undefined : 1,
            fontSize,
            lineHeight: 1.5,
            color: DEFAULT_BRAND_COLORS.textMuted,
            margin: 0,
          }}
        >
          We use cookies to understand how you use waQup and to improve your experience. Your data is never sold.{' '}
          <Link
            href="/privacy"
            style={{
              color: DEFAULT_BRAND_COLORS.accent,
              textDecoration: 'underline',
              textUnderlineOffset: 2,
            }}
          >
            Privacy Policy
          </Link>
        </p>

        <div style={{ display: 'flex', gap: spacing.sm, flexShrink: 0 }}>
          <button
            onClick={handleDecline}
            style={{
              padding: `${spacing.sm} ${buttonPaddingX}`,
              borderRadius: borderRadius.md,
              border: `1px solid ${DEFAULT_BRAND_COLORS.border}`,
              background: 'transparent',
              color: DEFAULT_BRAND_COLORS.textMuted,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = DEFAULT_BRAND_COLORS.borderHover;
              el.style.color = 'rgba(255,255,255,0.85)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = DEFAULT_BRAND_COLORS.border;
              el.style.color = DEFAULT_BRAND_COLORS.textMuted;
            }}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            style={{
              padding: `${spacing.sm} ${acceptPaddingX}`,
              borderRadius: borderRadius.md,
              border: 'none',
              background: DEFAULT_BRAND_COLORS.gradient,
              color: DEFAULT_BRAND_COLORS.textOnDark,
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
