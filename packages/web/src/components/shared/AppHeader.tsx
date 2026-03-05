'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo, Typography, Button, TestLoginButton } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';
import { useAuthStore } from '@/stores';
import { LogOut } from 'lucide-react';

export type AppHeaderVariant = 'public' | 'authenticated' | 'simplified';

export interface AppHeaderProps {
  /** Override variant - if not set, uses user auth state for public vs authenticated */
  variant?: AppHeaderVariant;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ variant: variantOverride }) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const variant: AppHeaderVariant =
    variantOverride ?? (user ? 'authenticated' : 'public');

  const navStyle: React.CSSProperties = {
    padding: `${spacing.lg} ${spacing.xl}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const isActive = (href: string, pathPrefix?: boolean): boolean => {
    if (pathname === href) return true;
    if (pathPrefix && href === '/home' && pathname.startsWith('/sanctuary')) return true;
    return false;
  };

  const linkStyle = (href: string, pathPrefix?: boolean): React.CSSProperties => ({
    textDecoration: 'none',
    color: isActive(href, pathPrefix) ? colors.accent.primary : colors.text.secondary,
    fontWeight: isActive(href, pathPrefix) ? 600 : 400,
  });

  if (variant === 'simplified') {
    return (
      <nav style={navStyle}>
        <Logo size="md" href="/" />
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.sm,
            color: colors.text.secondary,
            textDecoration: 'none',
            fontSize: '14px',
          }}
        >
          <span>Back</span>
        </Link>
      </nav>
    );
  }

  if (variant === 'authenticated') {
    return (
      <nav style={navStyle}>
        <Logo size="md" href="/home" />
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
          <Link href="/home" style={linkStyle('/home', true)}>
            <Typography variant="body">Home</Typography>
          </Link>
          <Link href="/library" style={linkStyle('/library', false)}>
            <Typography variant="body">Library</Typography>
          </Link>
          <Link href="/create" style={linkStyle('/create', false)}>
            <Typography variant="body">Create</Typography>
          </Link>
          <Link href="/profile" style={linkStyle('/profile', false)}>
            <Typography variant="body">Profile</Typography>
          </Link>
          {user?.id?.startsWith?.('override-') && <TestLoginButton />}
          <button
            onClick={() => logout()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: colors.text.secondary,
              padding: 0,
              fontFamily: 'inherit',
              fontSize: '16px',
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    );
  }

  // public
  return (
    <nav style={navStyle}>
      <Logo size="md" href="/" />
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
        <Link href="/how-it-works" style={linkStyle('/how-it-works', false)}>
          <Typography variant="body">How It Works</Typography>
        </Link>
        <Link href="/pricing" style={linkStyle('/pricing', false)}>
          <Typography variant="body">Pricing</Typography>
        </Link>
        <Link href="/login" style={{ textDecoration: 'none' }}>
          <Button variant="outline" size="md" style={{ borderColor: colors.glass.border }}>
            Sign In
          </Button>
        </Link>
        <Link href="/signup" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
};
