'use client';

import React from 'react';
import { useTheme } from '@/theme';
import { spacing, BLUR, HEADER_PADDING_X_RESPONSIVE } from '@/theme';
import { LEGAL_CONFIG } from '@/config/legal';
import { WellnessDisclaimer } from '@/components/legal/WellnessDisclaimer';
import { Link } from '@/i18n/navigation';
import { PageShareButtons } from './PageShareButtons';
import { useTranslations } from 'next-intl';

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
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: BLUR.lg,
        WebkitBackdropFilter: BLUR.lg,
      }}
    >
      <div
        className="footer-inner"
        style={{
          width: '100%',
          paddingTop: spacing.xxxl,
          paddingBottom: spacing.xl,
          paddingLeft: HEADER_PADDING_X_RESPONSIVE,
          paddingRight: HEADER_PADDING_X_RESPONSIVE,
        }}
      >
        {/* Row 1: brand | product | for professionals | company | legal */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr',
            gap: spacing.xxxl,
            marginBottom: spacing.xl,
            alignItems: 'start',
          }}
          className="footer-grid"
        >
          {/* Brand + button below logo */}
          <div className="footer-brand" style={{ marginBottom: spacing.lg }}>
            <div style={{ fontSize: 24, fontWeight: 300, color: colors.text.primary, letterSpacing: '-0.5px', marginBottom: spacing.sm }}>
              wa<span style={{ color: colors.accent.tertiary }}>Q</span>up
            </div>
            <p style={{ fontSize: 14, color: colors.text.tertiary, lineHeight: 1.65, maxWidth: 260, margin: `0 0 ${spacing.lg}` }}>
              {t('footerTagline')}
            </p>
            <Link
              href="/waitlist"
              style={{
                display: 'inline-flex',
                padding: `${spacing.sm} ${spacing.lg}`,
                borderRadius: 24,
                background: colors.gradients.primary,
                color: '#fff',
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.92'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              {t('footerMailingList')}
            </Link>
          </div>

          {/* Product */}
          <div className="footer-column">
            <div style={{ fontSize: 11, fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing.md }}>
              {t('footerProduct')}
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {internalLinks('/how-it-works', t('footerHowItWorks'))}
              {internalLinks('/about', t('footerWhatNew'))}
              {internalLinks('/explanation', t('footerTheScience'))}
              {internalLinks('/pricing', t('footerPricing'))}
              {internalLinks('/marketplace', t('footerMarketplace'))}
              {internalLinks('/get-qs', t('footerBuyCredits'))}
            </nav>
          </div>

          {/* For Professionals */}
          <div className="footer-column">
            <div style={{ fontSize: 11, fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing.md }}>
              {t('footerForProfessionals')}
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {internalLinks('/for-teachers', t('landing.forTeachers'))}
              {internalLinks('/for-coaches', t('landing.forCoaches'))}
              {internalLinks('/for-creators', t('landing.forCreators'))}
              {internalLinks('/for-studios', t('landing.forStudios'))}
            </nav>
          </div>

          {/* Company */}
          <div className="footer-column">
            <div style={{ fontSize: 11, fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing.md }}>
              {t('footerCompany')}
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {internalLinks('/our-story', t('footerOurStory'))}
              {internalLinks('/community', t('footerCommunity'))}
              {internalLinks('/investors', t('footerInvestors'))}
              {internalLinks('/join', t('footerFoundingMembers'))}
            </nav>
          </div>

          {/* Legal */}
          <div className="footer-column footer-legal">
            <div style={{ fontSize: 11, fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing.md }}>
              {t('footerLegal')}
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {internalLinks('/privacy', t('footerPrivacyPolicy'))}
              {internalLinks('/terms', t('footerTerms'))}
              {internalLinks('/data-deletion', t('footerDataDeletion'))}
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

        {/* Bottom bar — Row 1: centered share; Row 2: text (UX: share prominent, centered per best practices) */}
        <div
          className="footer-bottom"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: spacing.xs,
            borderTop: `1px solid ${colors.glass.border}`,
          }}
        >
          <div
            className="footer-share-row"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <PageShareButtons />
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              fontSize: 11,
              color: colors.text.tertiary,
            }}
          >
            <WellnessDisclaimer variant="inline" />
            <span style={{ opacity: 0.5 }}>·</span>
            <span style={{ opacity: 0.9 }}>{t('footerPaymentNote')}</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <a
              href="https://innerflect.tech"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 11,
                color: colors.text.tertiary,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                opacity: 0.9,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = colors.text.secondary; e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = colors.text.tertiary; e.currentTarget.style.opacity = '0.9'; }}
            >
              Developed by Innerflect
            </a>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; gap: 40px !important; }
          .page-share-buttons { flex-wrap: wrap !important; justify-content: center; }
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; justify-items: center; text-align: center; align-items: start; }
          .footer-brand { display: flex; flex-direction: column; align-items: center; text-align: center; }
          .footer-brand p { margin-left: auto; margin-right: auto; }
          .footer-column { display: flex; flex-direction: column; align-items: center; text-align: center; }
          .footer-column nav { align-items: center; }
          .page-share-buttons { flex-wrap: wrap !important; justify-content: center; }
          .footer-bottom { flex-direction: column !important; align-items: center !important; text-align: center !important; justify-content: center !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; justify-items: center; text-align: center; }
          .footer-brand { margin-bottom: 48px !important; }
          .footer-legal { margin-bottom: 48px !important; }
          .page-share-buttons { justify-content: center; flex-wrap: wrap !important; }
        }
      ` }} />
    </footer>
  );
}
