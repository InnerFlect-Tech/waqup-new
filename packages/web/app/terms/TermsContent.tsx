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

export function TermsContent() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { entityName, contactEmail, lastUpdated, termsEffectiveDate, jurisdiction } =
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
          Terms of Service
        </Typography>
        <Typography
          variant="body"
          style={{ marginBottom: spacing.xl, color: colors.text.tertiary ?? 'rgba(255,255,255,0.55)' }}
        >
          Last updated: {lastUpdated} · Effective: {termsEffectiveDate}
        </Typography>

        <LegalSection title="1. Welcome">
          <p>
            These Terms of Service (“Terms”) govern your use of the waQup
            platform and services (“Service”) provided by {entityName} (“we”,
            “us”, “our”). By creating an account or using the Service, you agree
            to these Terms. Our <LegalLink href="/privacy">Privacy Policy</LegalLink> describes how we collect and use your data.
          </p>
        </LegalSection>

        <LegalSection title="2. Wellness Disclaimer — Important">
          <p style={{ fontWeight: 600, color: colors.text.primary }}>
            waQup is a wellness and personal growth tool. It does not provide
            medical, psychiatric, or psychological advice, diagnosis, or
            treatment.
          </p>
          <p>
            The content (affirmations, meditations, rituals) is for informational
            and self-development purposes only. It is not a substitute for
            professional medical or mental health care. If you have a medical or
            mental health condition, consult a qualified healthcare provider.
          </p>
          <p>
            Do not rely on waQup for self-diagnosis or self-treatment. If you are
            in crisis or have a medical emergency, contact emergency services or
            a mental health professional immediately.
          </p>
          <p>
            By using waQup, you acknowledge that you assume responsibility for
            your own wellbeing and health decisions. We are not liable for any
            outcomes resulting from your use of the Service.
          </p>
        </LegalSection>

        <LegalSection title="3. Eligibility">
          <p>
            You must be at least 16 years old to use waQup. By using the
            Service, you represent that you meet this requirement and that you
            are not prohibited from using the Service under applicable law.
          </p>
        </LegalSection>

        <LegalSection title="4. Account and Security">
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials. You are responsible for all activity under
            your account. Notify us immediately at{' '}
            <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink> if you
            suspect unauthorized access.
          </p>
        </LegalSection>

        <LegalSection title="5. Subscriptions and Payments">
          <p>
            <strong>Subscriptions:</strong> Some plans are billed on a recurring
            basis (monthly or annually). You will be charged at the start of
            each billing period. You may cancel before the next billing date;
            cancellation stops future charges but does not refund the current
            period.
          </p>
          <p>
            <strong>Credits (Qs):</strong> Subscription plans include a monthly
            allocation of Qs. One-time credit packs may also be purchased. Qs are
            used when you create affirmations, meditations, or rituals. Practice
            (replaying content) is always free and does not consume Qs.
          </p>
          <p>
            <strong>Payment methods:</strong> We accept credit cards and debit
            cards via Stripe. We may also accept Bitcoin and other
            cryptocurrencies through third-party processors. Payment processing
            is subject to our processors’ terms.
          </p>
          <p>
            <strong>Refunds:</strong> Refund policy varies by product. Contact us
            at <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink> with your order details to request a refund.
            Refunds are at our discretion and may not be available for
            subscription periods already used.
          </p>
        </LegalSection>

        <LegalSection title="6. Acceptable Use">
          <p>You agree not to:</p>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>Violate any applicable law or regulation</li>
            <li>Infringe the intellectual property or rights of others</li>
            <li>Transmit harmful, abusive, or illegal content</li>
            <li>Attempt to gain unauthorized access to our systems or user
              accounts</li>
            <li>Use the Service for any purpose that could harm, disable, or
              overload it</li>
          </ul>
          <p>
            We may suspend or terminate your account if you violate these
            Terms or engage in conduct we determine to be harmful.
          </p>
        </LegalSection>

        <LegalSection title="7. Intellectual Property">
          <p>
            waQup and its content (except user-created content) are owned by us
            or our licensors. You retain ownership of content you create. You
            grant us a license to store, display, and process your content to
            provide the Service.
          </p>
        </LegalSection>

        <LegalSection title="8. Limitation of Liability">
          <p>
            THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT
            WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT
            PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES INCLUDING
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </p>
          <p>
            IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOSS OF PROFITS,
            DATA, OR GOODWILL. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT
            YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM (OR $100, IF
            GREATER).
          </p>
          <p>
            Some jurisdictions do not allow limitation of implied warranties or
            exclusion of certain damages; in such cases, the above limitations may
            not apply to you.
          </p>
        </LegalSection>

        <LegalSection title="9. Indemnification">
          <p>
            You agree to indemnify and hold us harmless from any claims, damages,
            or expenses arising from your use of the Service, your content, or
            your violation of these Terms.
          </p>
        </LegalSection>

        <LegalSection title="10. Termination">
          <p>
            You may close your account at any time. We may suspend or terminate
            your access for violation of these Terms or for operational
            reasons. Upon termination, your right to use the Service ends. We will
            handle your data in accordance with our <LegalLink href="/privacy">Privacy Policy</LegalLink>.
          </p>
        </LegalSection>

        <LegalSection title="11. Dispute Resolution">
          <p>
            These Terms are governed by the laws of {jurisdiction}, without
            regard to conflict of law principles. Any disputes shall be resolved
            through good-faith negotiation. If negotiation fails, disputes may be
            resolved through binding arbitration or in the courts of our
            jurisdiction, as applicable.
          </p>
        </LegalSection>

        <LegalSection title="12. Changes">
          <p>
            We may update these Terms from time to time. We will notify you of
            material changes by email or in-app notice. Continued use after
            changes constitutes acceptance. If you do not agree, you must stop
            using the Service and close your account.
          </p>
        </LegalSection>

        <LegalSection title="13. Contact">
          <p>
            For questions about these Terms, contact us at{' '}
            <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
          </p>
        </LegalSection>

        <div style={{ marginTop: spacing.xl, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="md">
              Back to Home
            </Button>
          </Link>
          <Link href="/privacy" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="md">
              Privacy Policy
            </Button>
          </Link>
        </div>
      </PageContent>
    </PageShell>
  );
}
