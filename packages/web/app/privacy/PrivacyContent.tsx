'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { PageShell, PageContent, Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';
import { LEGAL_CONFIG } from '@/config/legal';

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: spacing.xl }}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: spacing.sm,
          marginTop: 0,
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: 'inherit' }}>
        {children}
      </div>
    </section>
  );
}

function LegalLink({ href, children }: { href: string; children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <a
      href={href}
      style={{
        color: theme.colors.accent.tertiary,
        textDecoration: 'underline',
      }}
    >
      {children}
    </a>
  );
}

export function PrivacyContent() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { entityName, contactEmail, lastUpdated, privacyEffectiveDate } =
    LEGAL_CONFIG;

  return (
    <PageShell intensity="medium">
      <PageContent style={{ maxWidth: 680 }}>
        <Typography
          variant="h1"
          style={{
            marginBottom: spacing.xs,
            fontSize: 28,
            fontWeight: 300,
          }}
        >
          Privacy Policy
        </Typography>
        <Typography
          variant="body"
          style={{ marginBottom: spacing.xl, color: colors.text.tertiary ?? 'rgba(255,255,255,0.55)' }}
        >
          Last updated: {lastUpdated} · Effective: {privacyEffectiveDate}
        </Typography>

        <LegalSection title="1. Data Controller">
          <p>
            {entityName} (“we”, “us”, “our”) operates the waQup platform. For
            privacy-related inquiries, contact us at{' '}
            <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
          </p>
        </LegalSection>

        <LegalSection title="2. Data We Collect">
          <p>
            <strong>Account data:</strong> Email, display name, and password (if
            you sign up with email). OAuth sign-in (Google, Apple) provides
            email and basic profile data.
          </p>
          <p>
            <strong>Payment data:</strong> We use Stripe for subscriptions and
            credit purchases. We do not store card numbers; Stripe processes
            payments and stores payment details on our behalf.
          </p>
          <p>
            <strong>Usage data:</strong> Content you create (affirmations,
            meditations, rituals), playback history, and general usage within the
            app.
          </p>
          <p>
            <strong>Voice and audio data:</strong> When you record or clone your
            voice, we process this data through our voice providers (e.g.
            ElevenLabs) to create personalized audio. Voice recordings used for
            cloning are stored securely and used only to provide the service you
            requested.
          </p>
          <p>
            <strong>Technical data:</strong> IP address, device type, browser,
            and similar data for security and analytics.
          </p>
        </LegalSection>

        <LegalSection title="3. How We Use Your Data">
          <p>We use your data to:</p>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>Provide and improve the waQup service</li>
            <li>Process payments and manage subscriptions</li>
            <li>Authenticate you and manage your account</li>
            <li>Generate personalized content (scripts, voice, audio) via AI</li>
            <li>Analyze usage (with your consent) to improve the product</li>
            <li>Send transactional emails (e.g. password reset, order
              confirmations)</li>
            <li>Comply with legal obligations</li>
          </ul>
        </LegalSection>

        <LegalSection title="4. Third-Party Processors">
          <p>We share data only with trusted processors:</p>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>
              <strong>Supabase</strong> — Authentication, database, and hosting
            </li>
            <li>
              <strong>Stripe</strong> — Payment processing
            </li>
            <li>
              <strong>OpenAI</strong> — AI-generated scripts and conversational
              assistance
            </li>
            <li>
              <strong>ElevenLabs</strong> — Text-to-speech and voice cloning
            </li>
            <li>
              <strong>Google Analytics</strong> — Usage analytics (only after you
              accept cookies)
            </li>
          </ul>
          <p>
            Each processor has appropriate safeguards and data processing
            agreements. We do not sell your personal data.
          </p>
        </LegalSection>

        <LegalSection title="5. Cookies and Similar Technologies">
          <p>
            We use cookies and local storage for: session management,
            authentication, and (with your consent) analytics. Essential cookies
            are required for the app to function. Analytics cookies are only set
            after you accept via our cookie banner.
          </p>
          <p>
            You can change your cookie preferences at any time. Note: clearing
            cookies may affect your session and analytics settings.
          </p>
        </LegalSection>

        <LegalSection title="6. Legal Basis (GDPR)">
          <p>
            For users in the EEA/UK, we process data based on: (a) contract —
            to provide the service you requested; (b) consent — for analytics
            and optional features; (c) legitimate interests — security, fraud
            prevention, and service improvement where balanced with your rights.
          </p>
        </LegalSection>

        <LegalSection title="7. Your Rights">
          <p>You have the right to:</p>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>
              <strong>Access</strong> — Request a copy of your data
            </li>
            <li>
              <strong>Rectification</strong> — Correct inaccurate data
            </li>
            <li>
              <strong>Erasure</strong> — Request deletion of your data
            </li>
            <li>
              <strong>Portability</strong> — Receive your data in a structured,
              machine-readable format
            </li>
            <li>
              <strong>Object</strong> — Object to processing based on legitimate
              interests
            </li>
            <li>
              <strong>Withdraw consent</strong> — Where we rely on consent
            </li>
          </ul>
          <p>
            To exercise these rights, contact us at{' '}
            <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
            We will respond within 30 days. You may also lodge a complaint with
            a supervisory authority.
          </p>
          <p>
            <strong>California (CCPA/CPRA):</strong> We do not sell or share
            personal information. You have the right to know, delete, correct,
            and limit the use of your personal information.
          </p>
        </LegalSection>

        <LegalSection title="8. Data Retention">
          <p>
            We retain your data for as long as your account is active. After
            account deletion, we delete or anonymize data within 30 days, except
            where required for legal, tax, or fraud-prevention purposes.
          </p>
        </LegalSection>

        <LegalSection title="9. International Transfers">
          <p>
            Our servers and processors may be located outside your country. We
            rely on appropriate safeguards (e.g. adequacy decisions, standard
            contractual clauses) for transfers from the EEA/UK.
          </p>
        </LegalSection>

        <LegalSection title="10. Children">
          <p>
            waQup is not intended for users under 16. We do not knowingly
            collect data from children. If you believe we have collected data
            from a child, contact us at <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink> and we will delete it.
          </p>
        </LegalSection>

        <LegalSection title="11. Changes">
          <p>
            We may update this policy. We will notify you of material changes
            by email or in-app notice. Continued use after changes constitutes
            acceptance.
          </p>
        </LegalSection>

        <div style={{ marginTop: spacing.xl, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="md">
              Back to Home
            </Button>
          </Link>
          <Link href="/terms" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="md">
              Terms of Service
            </Button>
          </Link>
        </div>
      </PageContent>
    </PageShell>
  );
}
