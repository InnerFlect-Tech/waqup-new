'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MessageCircle, Copy, Check } from 'lucide-react';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';
import { routing } from '@/i18n/routing';

/** Map pathname (locale-stripped) to share translation key */
function pathToShareKey(pathname: string | null): string {
  if (!pathname) return 'home';
  const normalized = pathname
    .replace(new RegExp(`^/(${routing.locales.join('|')})(/|$)`), '/')
    .replace(/\/$/, '') || '/';
  const map: Record<string, string> = {
    '/': 'home',
    '/how-it-works': 'howItWorks',
    '/explanation': 'explanation',
    '/pricing': 'pricing',
    '/marketplace': 'marketplace',
    '/get-qs': 'getQs',
    '/for-teachers': 'forTeachers',
    '/for-coaches': 'forCoaches',
    '/for-creators': 'forCreators',
    '/for-studios': 'forStudios',
    '/our-story': 'ourStory',
    '/investors': 'investors',
    '/join': 'join',
    '/launch': 'launch',
    '/funnels': 'funnels',
    '/waitlist': 'waitlist',
  };
  return map[normalized] ?? 'home';
}

function getShareUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return 'https://waqup.app';
}

export function PageShareButtons() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const pathname = usePathname();
  const t = useTranslations('marketing.share');
  const [copied, setCopied] = useState(false);

  const key = pathToShareKey(pathname);
  const shareText = t(key);
  const shareUrl = getShareUrl();
  const fullText = `${shareText}\n${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: try sharing URL only
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // ignore
      }
    }
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
  const twitterHref = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: 8,
    border: `1px solid ${colors.glass.border}`,
    background: colors.glass.light,
    color: colors.text.secondary,
    fontSize: 12,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.15s ease, border-color 0.15s ease',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#25d366';
          e.currentTarget.style.borderColor = '#25d36640';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.text.secondary;
          e.currentTarget.style.borderColor = colors.glass.border;
        }}
      >
        <MessageCircle size={14} />
        WhatsApp
      </a>
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#1d9bf0';
          e.currentTarget.style.borderColor = '#1d9bf040';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.text.secondary;
          e.currentTarget.style.borderColor = colors.glass.border;
        }}
      >
        X
      </a>
      <button
        type="button"
        onClick={handleCopy}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = colors.text.primary;
          e.currentTarget.style.borderColor = colors.glass.border;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.text.secondary;
          e.currentTarget.style.borderColor = colors.glass.border;
        }}
      >
        {copied ? (
          <>
            <Check size={14} color="#22c55e" />
            <span style={{ color: '#22c55e' }}>Copied</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
