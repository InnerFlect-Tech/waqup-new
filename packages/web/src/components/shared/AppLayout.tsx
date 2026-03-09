'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Library,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
  Share2,
  Mic,
  CreditCard,
  HelpCircle,
  Shield,
  Check,
  Users,
  ListChecks,
  Cpu,
  FileText,
  Activity,
  Layout,
  Map,
  Store,
} from 'lucide-react';
import { Button, Logo, QCoin, AvatarOrb } from '@/components';
import { useTheme, spacing, MAX_WIDTH_7XL, NAV_HEIGHT, NAV_TOP_OFFSET, PAGE_PADDING, HEADER_PADDING_X, BLUR } from '@/theme';
import { LEGAL_CONFIG } from '@/config/legal';
import { useAuthStore, useRoleOverrideStore } from '@/stores';
import { useCreditBalance, useAvatarColors, useSuperAdmin } from '@/hooks';
import type { ViewAsRole } from '@/stores';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface UserMenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  showBalance?: boolean;
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Sanctuary', path: '/sanctuary', icon: <Home className="w-5 h-5" /> },
  { name: 'Speak', path: '/speak', icon: <Mic className="w-5 h-5" /> },
  { name: 'Marketplace', path: '/marketplace', icon: <Store className="w-5 h-5" /> },
  {
    name: 'Reminders',
    path: '/sanctuary/reminders',
    icon: <Bell className="w-5 h-5" />,
  },
];

const USER_MENU_ITEMS: UserMenuItem[] = [
  { name: 'My Library', path: '/library', icon: <Library className="w-4 h-4" /> },
  { name: 'Plan', path: '/sanctuary/plan', icon: <CreditCard className="w-4 h-4" /> },
  { name: 'Settings', path: '/sanctuary/settings', icon: <Settings className="w-4 h-4" /> },
];

const USER_MENU_ITEMS_SECONDARY: UserMenuItem[] = [
  {
    name: 'Share & Earn',
    path: '/sanctuary/referral',
    icon: <Share2 className="w-4 h-4" />,
    highlight: true,
  },
  { name: 'Help & Feedback', path: '/sanctuary/help', icon: <HelpCircle className="w-4 h-4" /> },
];

const ONBOARDING_ROUTES = [
  '/explanation',
  '/onboarding',
  '/onboarding/profile',
  '/onboarding/preferences',
  '/onboarding/guide',
];
const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/confirm-email',
  '/auth/',
];

const SUPERADMIN_ROUTE_PREFIXES = ['/admin', '/system', '/health', '/showcase', '/pages', '/sitemap-view'];

function isSuperadminRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return SUPERADMIN_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

const VIEW_AS_OPTIONS: { value: ViewAsRole; label: string }[] = [
  { value: 'user', label: 'User' },
  { value: 'creator', label: 'Creator' },
  { value: 'admin', label: 'Admin' },
  { value: null, label: 'Superadmin' },
];

const SUPERADMIN_MENU_ITEMS: UserMenuItem[] = [
  { name: 'Admin Dashboard', path: '/admin', icon: <Shield className="w-4 h-4" /> },
  { name: 'Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
  { name: 'Waitlist', path: '/admin/waitlist', icon: <ListChecks className="w-4 h-4" /> },
  { name: 'Oracle / AI', path: '/admin/oracle', icon: <Cpu className="w-4 h-4" /> },
  { name: 'All Pages', path: '/pages', icon: <FileText className="w-4 h-4" /> },
  { name: 'System', path: '/system', icon: <Settings className="w-4 h-4" /> },
  { name: 'Creation Steps', path: '/system/creation-steps', icon: <Layout className="w-4 h-4" /> },
  { name: 'API Health', path: '/health', icon: <Activity className="w-4 h-4" /> },
  { name: 'Showcase', path: '/showcase', icon: <Layout className="w-4 h-4" /> },
  { name: 'Sitemap', path: '/sitemap-view', icon: <Map className="w-4 h-4" /> },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    null;
  const router = useRouter();
  const pathname = usePathname();
  const { balance: creditsBalance } = useCreditBalance();
  const { colors: avatarColors } = useAvatarColors();
  const { isSuperAdmin, actualIsSuperAdmin } = useSuperAdmin();
  const viewAsRole = useRoleOverrideStore((s) => s.viewAsRole);
  const setViewAsRole = useRoleOverrideStore((s) => s.setViewAsRole);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems: NavItem[] = [
    ...NAV_ITEMS,
    ...(actualIsSuperAdmin
      ? [{ name: 'Admin', path: '/admin', icon: <Shield className="w-5 h-5" /> }]
      : []),
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
     
    setIsMobileMenuOpen(false);
    setShowProfileMenu(false);
     
  }, [pathname]);

  const isOnboardingRoute =
    pathname && ONBOARDING_ROUTES.some((route) => pathname.startsWith(route));

  const isAuthRoute =
    pathname && AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r));

  if (isAuthRoute || isOnboardingRoute) {
    return <main>{children}</main>;
  }

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleViewAsSelect = (role: ViewAsRole) => {
    setViewAsRole(role);
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
    if (role !== null && isSuperadminRoute(pathname)) {
      router.replace('/sanctuary');
    }
  };

  if (user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: colors.gradients.background,
        }}
      >
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
          style={{
            paddingTop: `max(${spacing.sm}, env(safe-area-inset-top, 0px))`,
            paddingLeft: HEADER_PADDING_X,
            paddingRight: HEADER_PADDING_X,
            ...(isScrolled
              ? { background: 'rgba(0,0,0,0.8)', backdropFilter: BLUR.lg, WebkitBackdropFilter: BLUR.lg, boxShadow: `0 1px 0 ${colors.glass.border}` }
              : { background: 'transparent' }),
          }}
        >
          <div
            className="mx-auto"
            style={{
              maxWidth: MAX_WIDTH_7XL,
              width: '100%',
            }}
          >
            <div
              className="flex items-center justify-between flex-nowrap"
              style={{ height: NAV_HEIGHT, minHeight: NAV_HEIGHT, gap: spacing.xl }}
            >
              <div className="flex-shrink-0">
                <Logo size="md" href="/sanctuary" />
              </div>

              <div className="hidden md:flex items-center flex-shrink-0" style={{ gap: spacing.xl }}>
                <div className="flex items-center" style={{ gap: spacing.lg }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(item.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.sm,
                        ...(pathname === item.path
                          ? { color: colors.text.primary, background: colors.glass.border }
                          : { color: colors.text.secondary }),
                      }}
                    >
                    {item.icon}
                    <span>{item.name}</span>
                  </Button>
                  ))}
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}
                  >
                    <AvatarOrb colors={avatarColors} size="sm" />
                    <span
                      className="rounded-full shrink-0"
                      style={{
                        padding: '2px 7px 2px 4px',
                        background: 'rgba(147,51,234,0.15)',
                        border: '1px solid rgba(168,85,247,0.25)',
                        flexShrink: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <QCoin size="sm" />
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#C084FC', lineHeight: 1 }}>
                        {creditsBalance}
                      </span>
                    </span>
                  </Button>

                  {showProfileMenu && (
                    <div
                      className="absolute right-0 w-72 rounded-xl shadow-2xl"
                      style={{
                        marginTop: spacing.sm,
                        background: 'rgba(15,5,35,0.88)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(168,85,247,0.20)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(168,85,247,0.08)',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Account card */}
                      <div
                        style={{
                          padding: `${spacing.lg} ${spacing.xl}`,
                          background: 'rgba(147,51,234,0.08)',
                          borderBottom: '1px solid rgba(168,85,247,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.md,
                        }}
                      >
                        <AvatarOrb colors={avatarColors} size="md" pulse />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {displayName && (
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: colors.text.primary, marginBottom: 2 }}
                            >
                              {displayName}
                            </p>
                          )}
                          <p
                            className="text-xs truncate"
                            style={{ color: colors.text.secondary, marginBottom: spacing.xs }}
                          >
                            {user?.email}
                          </p>
                          <button
                            type="button"
                            className="inline-flex items-center rounded-full border-0 cursor-pointer"
                            style={{
                              padding: `${spacing.xs} ${spacing.sm}`,
                              gap: spacing.xs,
                              background: 'rgba(147,51,234,0.20)',
                              border: '1px solid rgba(168,85,247,0.30)',
                              fontSize: '0.75rem',
                              color: colors.text.secondary,
                            }}
                            onClick={() => {
                              router.push('/sanctuary/credits');
                              setShowProfileMenu(false);
                            }}
                          >
                            <QCoin size="sm" showAmount={creditsBalance} />
                            <span style={{ marginLeft: spacing.xs }}>Qs</span>
                          </button>
                        </div>
                      </div>

                      {/* Primary items */}
                      <div style={{ padding: `${spacing.sm} ${spacing.sm}` }}>
                        {USER_MENU_ITEMS.map((item) => (
                          <button
                            key={item.path}
                            type="button"
                            className="w-full flex items-center text-sm rounded-lg border-0 cursor-pointer transition-all"
                            style={{
                              padding: `${spacing.md} ${spacing.lg}`,
                              gap: spacing.md,
                              color: colors.text.onDark,
                              background: 'transparent',
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                            onClick={() => {
                              router.push(item.path);
                              setShowProfileMenu(false);
                            }}
                          >
                            {item.icon}
                            {item.name}
                          </button>
                        ))}
                      </div>

                      <div style={{ height: 1, background: 'rgba(168,85,247,0.12)', margin: `0 ${spacing.lg}` }} />

                      {/* Secondary items */}
                      <div style={{ padding: `${spacing.sm} ${spacing.sm}` }}>
                        {USER_MENU_ITEMS_SECONDARY.map((item) => (
                          <button
                            key={item.path}
                            type="button"
                            className="w-full flex items-center text-sm rounded-lg border-0 cursor-pointer transition-all"
                            style={{
                              padding: `${spacing.md} ${spacing.lg}`,
                              gap: spacing.md,
                              color: item.highlight ? colors.accent.tertiary : colors.text.onDark,
                              background: 'transparent',
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                            onClick={() => {
                              router.push(item.path);
                              setShowProfileMenu(false);
                            }}
                          >
                            {item.icon}
                            {item.name}
                          </button>
                        ))}
                      </div>

                      {actualIsSuperAdmin && (
                        <>
                          <div style={{ height: 1, background: 'rgba(168,85,247,0.12)', margin: `0 ${spacing.lg}` }} />
                          <div style={{ padding: `${spacing.sm} ${spacing.lg}` }}>
                            <p
                              className="text-xs font-medium"
                              style={{ color: colors.text.tertiary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            >
                              Super Admin
                            </p>
                            {SUPERADMIN_MENU_ITEMS.map((item) => (
                              <button
                                key={item.path}
                                type="button"
                                className="w-full flex items-center text-sm rounded-lg border-0 cursor-pointer transition-all"
                                style={{
                                  padding: `${spacing.sm} ${spacing.md}`,
                                  gap: spacing.md,
                                  color: pathname === item.path ? colors.accent.tertiary : colors.text.onDark,
                                  background: pathname === item.path ? 'rgba(168,85,247,0.12)' : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                  if (pathname !== item.path) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                                }}
                                onMouseLeave={(e) => {
                                  if (pathname !== item.path) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                                }}
                                onClick={() => {
                                  router.push(item.path);
                                  setShowProfileMenu(false);
                                }}
                              >
                                {item.icon}
                                {item.name}
                              </button>
                            ))}
                          </div>
                          <div style={{ height: 1, background: 'rgba(168,85,247,0.12)', margin: `0 ${spacing.lg}` }} />
                          <div style={{ padding: `${spacing.sm} ${spacing.lg}` }}>
                            <p
                              className="text-xs font-medium"
                              style={{ color: colors.text.tertiary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            >
                              View as
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              {VIEW_AS_OPTIONS.map((opt) => {
                                const isActive = viewAsRole === opt.value;
                                return (
                                  <button
                                    key={opt.label}
                                    type="button"
                                    className="w-full flex items-center justify-between text-sm rounded-lg border-0 cursor-pointer transition-all"
                                    style={{
                                      padding: `${spacing.sm} ${spacing.md}`,
                                      gap: spacing.md,
                                      color: isActive ? colors.accent.tertiary : colors.text.onDark,
                                      background: isActive ? 'rgba(168,85,247,0.12)' : 'transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                                    }}
                                    onClick={() => handleViewAsSelect(opt.value)}
                                  >
                                    <span>{opt.label}</span>
                                    {isActive && <Check className="w-4 h-4" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}

                      <div style={{ height: 1, background: 'rgba(168,85,247,0.12)', margin: `0 ${spacing.lg}` }} />

                      {/* Sign out */}
                      <div style={{ padding: `${spacing.sm} ${spacing.sm}` }}>
                        <button
                          type="button"
                          className="w-full flex items-center text-sm rounded-lg border-0 cursor-pointer transition-all"
                          style={{
                            padding: `${spacing.md} ${spacing.lg}`,
                            gap: spacing.md,
                            color: colors.text.secondary,
                            background: 'transparent',
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          onClick={handleSignOut}
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" style={{ color: colors.text.primary }} />
                  ) : (
                    <Menu className="w-6 h-6" style={{ color: colors.text.primary }} />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <motion.div
            initial={false}
            animate={{
              height: isMobileMenuOpen ? 'auto' : 0,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
          className="md:hidden overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: BLUR.lg, WebkitBackdropFilter: BLUR.lg }}
        >
          <div style={{ padding: `${spacing.sm} ${HEADER_PADDING_X} ${spacing.md}`, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => router.push(item.path)}
                  className="w-full justify-start"
                  style={{
                    color: pathname === item.path ? colors.text.primary : colors.text.secondary,
                    background: pathname === item.path ? colors.glass.border : undefined,
                  }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Button>
              ))}

              <div
                style={{ height: 1, background: colors.glass.border, margin: `${spacing.sm} 0` }}
              />

              {/* Account card (mobile) */}
              <button
                type="button"
                className="w-full text-left rounded-lg border-0 cursor-pointer"
                style={{
                  padding: `${spacing.md} ${spacing.lg}`,
                  background: 'rgba(147,51,234,0.08)',
                  border: '1px solid rgba(168,85,247,0.15)',
                }}
                onClick={() => {
                  router.push('/sanctuary/credits');
                  setIsMobileMenuOpen(false);
                }}
              >
                {displayName && (
                  <p className="text-sm font-medium truncate" style={{ color: colors.text.primary, marginBottom: 2 }}>
                    {displayName}
                  </p>
                )}
                <p className="text-xs truncate" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>
                  {user?.email}
                </p>
                <span
                  className="inline-flex items-center rounded-full"
                  style={{
                    padding: `${spacing.xs} ${spacing.sm}`,
                    gap: spacing.xs,
                    background: 'rgba(147,51,234,0.20)',
                    border: '1px solid rgba(168,85,247,0.30)',
                    fontSize: '0.75rem',
                    color: colors.text.secondary,
                  }}
                >
                  <QCoin size="sm" showAmount={creditsBalance} />
                  <span style={{ marginLeft: spacing.xs }}>Qs</span>
                </span>
              </button>

              {USER_MENU_ITEMS.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  className="w-full flex items-center rounded-lg border-0 cursor-pointer"
                  style={{
                    padding: `${spacing.md} ${spacing.lg}`,
                    gap: spacing.md,
                    color: colors.text.onDark,
                    background: 'transparent',
                  }}
                  onClick={() => {
                    router.push(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}

              <div style={{ height: 1, background: colors.glass.border, margin: `${spacing.sm} 0` }} />

              {USER_MENU_ITEMS_SECONDARY.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  className="w-full flex items-center rounded-lg border-0 cursor-pointer"
                  style={{
                    padding: `${spacing.md} ${spacing.lg}`,
                    gap: spacing.md,
                    color: item.highlight ? colors.accent.tertiary : colors.text.onDark,
                    background: 'transparent',
                  }}
                  onClick={() => {
                    router.push(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}

              {actualIsSuperAdmin && (
                <>
                  <div style={{ height: 1, background: colors.glass.border, margin: `${spacing.sm} 0` }} />
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: colors.text.tertiary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Super Admin
                    </p>
                    {SUPERADMIN_MENU_ITEMS.map((item) => (
                      <button
                        key={item.path}
                        type="button"
                        className="w-full flex items-center rounded-lg border-0 cursor-pointer"
                        style={{
                          padding: `${spacing.sm} ${spacing.md}`,
                          gap: spacing.md,
                          color: pathname === item.path ? colors.accent.tertiary : colors.text.onDark,
                          background: 'transparent',
                        }}
                        onClick={() => {
                          router.push(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {item.icon}
                        {item.name}
                      </button>
                    ))}
                  </div>
                  <div style={{ height: 1, background: colors.glass.border, margin: `${spacing.sm} 0` }} />
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: colors.text.tertiary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      View as
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {VIEW_AS_OPTIONS.map((opt) => {
                        const isActive = viewAsRole === opt.value;
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            className="w-full flex items-center justify-between text-sm rounded-lg border-0 cursor-pointer"
                            style={{
                              padding: `${spacing.sm} ${spacing.md}`,
                              gap: spacing.md,
                              color: isActive ? colors.accent.tertiary : colors.text.onDark,
                              background: isActive ? 'rgba(168,85,247,0.12)' : 'transparent',
                            }}
                            onClick={() => handleViewAsSelect(opt.value)}
                          >
                            <span>{opt.label}</span>
                            {isActive && <Check className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <div style={{ height: 1, background: colors.glass.border, margin: `${spacing.sm} 0` }} />

              <button
                type="button"
                className="w-full flex items-center text-sm rounded-lg border-0 cursor-pointer"
                style={{
                  padding: `${spacing.md} ${spacing.lg}`,
                  gap: spacing.md,
                  color: colors.text.secondary,
                  background: 'transparent',
                }}
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        </motion.nav>

        <main style={{ paddingTop: NAV_TOP_OFFSET }}>
          {children}
        </main>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: colors.gradients.background,
      }}
    >
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
          style={{
            paddingTop: `max(${spacing.sm}, env(safe-area-inset-top, 0px))`,
            paddingLeft: HEADER_PADDING_X,
            paddingRight: HEADER_PADDING_X,
            ...(isScrolled
              ? { background: 'rgba(0,0,0,0.8)', backdropFilter: BLUR.lg, WebkitBackdropFilter: BLUR.lg, boxShadow: `0 1px 0 ${colors.glass.border}` }
              : { background: 'transparent' }),
          }}
        >
          <div
            className="mx-auto"
            style={{
              maxWidth: MAX_WIDTH_7XL,
              width: '100%',
            }}
          >
          <div
            className="flex items-center justify-between"
            style={{ height: NAV_HEIGHT, minHeight: NAV_HEIGHT, gap: spacing.xl }}
          >
            <div className="flex-shrink-0">
              <Logo size="md" href="/" />
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/how-it-works')}
                style={{
                  color: pathname === '/how-it-works' ? colors.text.primary : colors.text.secondary,
                  background: pathname === '/how-it-works' ? colors.glass.border : undefined,
                }}
              >
                How It Works
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/pricing')}
                style={{
                  color: pathname === '/pricing' ? colors.text.primary : colors.text.secondary,
                  background: pathname === '/pricing' ? colors.glass.border : undefined,
                }}
              >
                Pricing
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/login')}
                style={{ color: colors.text.secondary }}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/waitlist')}
              >
                Join Waitlist
              </Button>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" style={{ color: colors.text.primary }} />
                ) : (
                  <Menu className="w-6 h-6" style={{ color: colors.text.primary }} />
                )}
              </Button>
            </div>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          className="md:hidden overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: BLUR.lg, WebkitBackdropFilter: BLUR.lg }}
        >
          <div style={{ padding: `${spacing.sm} ${HEADER_PADDING_X} ${spacing.md}`, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            <Button
              variant="ghost"
              onClick={() => router.push('/how-it-works')}
              className="w-full justify-start"
              style={{ color: colors.text.secondary }}
            >
              How It Works
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/pricing')}
              className="w-full justify-start"
              style={{ color: colors.text.secondary }}
            >
              Pricing
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/login')}
              className="w-full justify-start"
              style={{ color: colors.text.secondary }}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push('/waitlist')}
              className="w-full justify-start"
            >
              Join Waitlist
            </Button>
          </div>
        </motion.div>
      </motion.nav>
      <main style={{ flex: 1, paddingTop: NAV_TOP_OFFSET }}>
        {children}
      </main>

      {/* ── Public Footer ──────────────────────────────────────── */}
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
            maxWidth: MAX_WIDTH_7XL,
            margin: '0 auto',
            padding: `64px ${PAGE_PADDING} ${PAGE_PADDING}`,
          }}
        >
          {/* Top row: brand + columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
              gap: 48,
              marginBottom: 48,
            }}
            className="footer-grid"
          >
            {/* Brand */}
            <div>
              <div style={{ fontSize: 24, fontWeight: 300, color: colors.text.primary, letterSpacing: '-0.5px', marginBottom: 12 }}>
                wa<span style={{ color: colors.accent.tertiary }}>Q</span>up
              </div>
              <p style={{ fontSize: 14, color: colors.text.tertiary, lineHeight: 1.65, maxWidth: 260, margin: '0 0 20px' }}>
                Your voice. Your transformation. Scientifically designed to rewire the subconscious patterns that shape who you are.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href="/waitlist"
                  style={{
                    display: 'inline-block',
                    padding: '8px 18px',
                    borderRadius: 20,
                    background: colors.gradients.primary,
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  Join Waitlist
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Product</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['How It Works', '/how-it-works'],
                  ['Pricing', '/pricing'],
                  ['Marketplace', '/marketplace'],
                  ['Buy Credits', '/get-qs'],
                ].map(([label, href]) => (
                  <a key={href} href={href} style={{ fontSize: 14, color: colors.text.secondary, textDecoration: 'none' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = colors.text.primary; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = colors.text.secondary; }}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Company */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Company</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Our Story', '/explanation'],
                  ['Investors', '/investors'],
                  ['Founding Members', '/join'],
                ].map(([label, href]) => (
                  <a key={href} href={href} style={{ fontSize: 14, color: colors.text.secondary, textDecoration: 'none' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = colors.text.primary; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = colors.text.secondary; }}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Legal</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Privacy Policy', '/privacy'],
                  ['Terms of Service', '/terms'],
                  ['Contact', `mailto:${LEGAL_CONFIG.supportEmail}`],
                ].map(([label, href]) => (
                  <a key={href} href={href} style={{ fontSize: 14, color: colors.text.secondary, textDecoration: 'none' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = colors.text.primary; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = colors.text.secondary; }}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              paddingTop: 24,
              borderTop: `1px solid ${colors.glass.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 13, color: colors.text.tertiary }}>
              © {new Date().getFullYear()} waQup · All rights reserved
            </span>
            <span style={{ fontSize: 13, color: colors.text.tertiary }}>
              Practice is always free. Payment: cards (Stripe) · Bitcoin coming
              soon
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
    </div>
  );
}
