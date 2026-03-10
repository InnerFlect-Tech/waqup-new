'use client';

import React from 'react';
import { useTheme } from '@/theme';
import { spacing, BLUR, PAGE_PADDING } from '@/theme';
import { LEGAL_CONFIG } from '@/config/legal';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

export function PublicFooter() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const t = useTranslations('marketing');
  const tc = useTranslations('common');

  const linkStyle: React.CSSProperties = {
    fontSize: 14,
    color: colors.text.secondary,
    textDecoration: 'none',
  };

  const internalLinks = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      style={linkStyle}
      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = colors.text.primary; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = colors.text.secondary; }}
    >
      {label}
    </Link>
  );

  return (
    <footer
      style={{
        borderTop: `1px solid ${colors.glass.border}`,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: BLUR.lg,
        WebkitBackdropFilter: BLUR.lg,
      }}
    >
      <div
        className="footer-inner"
        style={{
          width: '100%',
          padding: `${spacing.xxxl} ${PAGE_PADDING} ${PAGE_PADDING}`,
        }}
      >
        {/* Top row: brand + columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
            gap: spacing.xxl,
            marginBottom: spacing.xxl,
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ fontSize: 24, fontWeight: 300, color: colors.text.primary, letterSpacing: '-0.5px', marginBottom: spacing.sm }}>
              wa<span style={{ color: colors.accent.tertiary }}>Q</span>up
            </div>
            <p style={{ fontSize: 14, color: colors.text.tertiary, lineHeight: 1.65, maxWidth: 260, margin: `0 0 ${spacing.lg}` }}>
              {t('footerTagline')}
            </p>
            <div style={{ display: 'flex', gap: spacing.sm }}>
              <Link
                href="/waitlist"
                style={{
                  display: 'inline-block',
                  padding: `${spacing.sm} ${spacing.lg}`,
                  borderRadius: 20,
                  background: colors.gradients.primary,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                {t('joinWaitlist')}
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing.md }}>
              {t('footerProduct')}
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {internalLinks('/how-it-works', t('footerHowItWorks'))}
              {internalLinks('/explanation', t('footerTheScience'))}
              {internalLinks('/pricing', t('footerPricing'))}
              {internalLinks('/marketplace', t('footerMarketplace'))}
              {internalLinks('/get-qs', t('footerBuyCredits'))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing.md }}>
              {t('footerCompany')}
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {internalLinks('/our-story', t('footerOurStory'))}
              {internalLinks('/investors', t('footerInvestors'))}
              {internalLinks('/join', t('footerFoundingMembers'))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing.md }}>
              {t('footerLegal')}
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {internalLinks('/privacy', t('footerPrivacyPolicy'))}
              {internalLinks('/terms', t('footerTerms'))}
              <a
                href={`mailto:${LEGAL_CONFIG.supportEmail}`}
                style={linkStyle}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = colors.text.primary; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = colors.text.secondary; }}
              >
                {tc('contact')}
              </a>
            </nav>
          </div>
        </div>

        {/* Language switcher row */}
        <div
          style={{
            paddingBottom: spacing.lg,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
          }}
        >
          <LanguageSwitcher compact={false} />
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: spacing.lg,
            borderTop: `1px solid ${colors.glass.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: spacing.sm,
          }}
        >
          <span style={{ fontSize: 13, color: colors.text.tertiary }}>
            © {new Date().getFullYear()} waQup · {tc('allRightsReserved')}
          </span>
          <span style={{ fontSize: 13, color: colors.text.tertiary }}>
            {t('footerPaymentNote')}
          </span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </footer>
  );
}
