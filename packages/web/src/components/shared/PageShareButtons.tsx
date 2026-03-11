'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MessageCircle, Copy, Check, Twitter } from 'lucide-react';
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
    justifyContent: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: 6,
    border: `1px solid ${colors.glass.border}`,
    background: colors.glass.light,
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: 500,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.15s ease, border-color 0.15s ease, background 0.15s ease',
    minWidth: 32,
    minHeight: 28,
  };

  return (
    <div className="page-share-buttons" style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, flexWrap: 'nowrap' }}>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        style={buttonStyle}
        aria-label="Share on WhatsApp"
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#25d366';
          e.currentTarget.style.borderColor = '#25d36640';
          e.currentTarget.style.background = 'rgba(37,211,102,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.text.secondary;
          e.currentTarget.style.borderColor = colors.glass.border;
          e.currentTarget.style.background = colors.glass.light;
        }}
      >
        <MessageCircle size={12} strokeWidth={2} />
        <span>WhatsApp</span>
      </a>
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        style={buttonStyle}
        aria-label="Share on X"
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#1d9bf0';
          e.currentTarget.style.borderColor = '#1d9bf040';
          e.currentTarget.style.background = 'rgba(29,155,240,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.text.secondary;
          e.currentTarget.style.borderColor = colors.glass.border;
          e.currentTarget.style.background = colors.glass.light;
        }}
      >
        <Twitter size={12} strokeWidth={2} />
        <span>X</span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        style={buttonStyle}
        aria-label={copied ? 'Copied' : 'Copy link'}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = colors.text.primary;
          e.currentTarget.style.borderColor = colors.glass.border;
          e.currentTarget.style.background = colors.glass.light;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.text.secondary;
          e.currentTarget.style.borderColor = colors.glass.border;
          e.currentTarget.style.background = colors.glass.light;
        }}
      >
        {copied ? (
          <>
            <Check size={12} color="#22c55e" strokeWidth={2.5} />
            <span style={{ color: '#22c55e' }}>Copied</span>
          </>
        ) : (
          <>
            <Copy size={12} strokeWidth={2} />
            <span>Copy link</span>
          </>
        )}
      </button>
    </div>
  );
}
