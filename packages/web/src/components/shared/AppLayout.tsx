'use client';

import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Handshake,
  Cpu,
  FileText,
  Activity,
  Layout,
  Map,
  Store,
  BarChart3,
  Info,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { Button, Logo, QCoin, AvatarOrb, PublicFooter, LanguageSwitcher, MenuDivider } from '@/components';
import { useTheme, spacing, borderRadius, MAX_WIDTH_7XL, NAV_HEIGHT, NAV_TOP_OFFSET, HEADER_PADDING_X_RESPONSIVE, BLUR, MENU_PANEL_BG, MENU_PANEL_BG_OPAQUE, MENU_PANEL_SHADOW, MENU_DRAWER_SHADOW, NAV_SCROLLED_BG } from '@/theme';
import { withOpacity } from '@waqup/shared/theme';
import { useAuthStore, useRoleOverrideStore } from '@/stores';
import { useCreditBalance, useAvatarColors, useSuperAdmin } from '@/hooks';
import type { ViewAsRole } from '@/stores';
import { createProgressService } from '@waqup/shared/services';
import { xpToLevel, LEVEL_COLORS } from '@waqup/shared/types';
import type { ProgressStats } from '@waqup/shared/types';
import { supabase } from '@/lib/supabase';

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
  '/onboarding',
  '/onboarding/voice',
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

const SUPERADMIN_ROUTE_PREFIXES = ['/admin', '/system', '/updates', '/health', '/showcase', '/pages', '/sitemap-view'];

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

const VIEW_AS_LABELS: Record<Exclude<ViewAsRole, null>, string> = {
  user: 'User',
  creator: 'Creator',
  admin: 'Admin',
};

const VIEW_AS_BANNER_HEIGHT = 44;

const SUPERADMIN_MENU_ITEMS: UserMenuItem[] = [
  { name: 'Admin Dashboard', path: '/admin', icon: <Shield className="w-4 h-4" /> },
  { name: 'Company Strategy', path: '/admin/company-strategy', icon: <Compass className="w-4 h-4" /> },
  { name: 'Restart onboarding', path: '/admin/onboarding/reset', icon: <RotateCcw className="w-4 h-4" /> },
  { name: 'About & Acknowledgments', path: '/sanctuary/settings/about', icon: <Info className="w-4 h-4" /> },
  { name: 'Updates', path: '/updates', icon: <FileText className="w-4 h-4" /> },
  { name: 'Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
  { name: 'Waitlist', path: '/admin/waitlist', icon: <ListChecks className="w-4 h-4" /> },
  { name: 'Founding Partners', path: '/admin/founding-partners', icon: <Handshake className="w-4 h-4" /> },
  { name: 'Content Overview', path: '/admin/content', icon: <BarChart3 className="w-4 h-4" /> },
  { name: 'Oracle / AI', path: '/admin/oracle', icon: <Cpu className="w-4 h-4" /> },
  { name: 'System', path: '/system', icon: <Settings className="w-4 h-4" /> },
  { name: 'Creation Steps', path: '/system/creation-steps', icon: <Layout className="w-4 h-4" /> },
  { name: 'API Health', path: '/health', icon: <Activity className="w-4 h-4" /> },
  { name: 'All Pages', path: '/pages', icon: <FileText className="w-4 h-4" /> },
  { name: 'Showcase', path: '/showcase', icon: <Layout className="w-4 h-4" /> },
  { name: 'Sitemap', path: '/sitemap-view', icon: <Map className="w-4 h-4" /> },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('marketing');
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
  const [profileProgressStats, setProfileProgressStats] = useState<ProgressStats | null>(null);
  const [profileMenuPosition, setProfileMenuPosition] = useState<{ top: number; right: number } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  const navItems: NavItem[] = [
    ...NAV_ITEMS,
    ...(isSuperAdmin
      ? [{ name: 'Admin', path: '/admin', icon: <Shield className="w-5 h-5" /> }]
      : []),
  ];

  const navScrolledStyle = useMemo(
    () => ({
      background: NAV_SCROLLED_BG,
      backdropFilter: BLUR.lg,
      WebkitBackdropFilter: BLUR.lg,
      boxShadow: `0 1px 0 ${colors.glass.border}`,
    }),
    [colors.glass.border]
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    const handleScroll = () => {
      const scrollTop = container ? container.scrollTop : window.scrollY;
      setIsScrolled(scrollTop > 0);
    };
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowProfileMenu(false);
    setProfileMenuPosition(null);
  }, [pathname]);

  useLayoutEffect(() => {
    if (!showProfileMenu || typeof document === 'undefined') return;
    const el = avatarButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gapPx = 8; /* matches spacing.sm */
    setProfileMenuPosition({
      top: rect.bottom + gapPx,
      right: window.innerWidth - rect.right,
    });
  }, [showProfileMenu]);

  useEffect(() => {
    if (!showProfileMenu) return;
    const progressService = createProgressService(supabase);
    progressService.getProgressStats().then(({ data }) => setProfileProgressStats(data));
  }, [showProfileMenu]);

  // Reset scroll on route change — Next.js scrolls window only; custom scroll containers need manual reset
  useEffect(() => {
    const reset = () => {
      scrollContainerRef.current?.scrollTo(0, 0);
      window.scrollTo(0, 0);
    };
    reset();
    // Run again after paint to override focus-triggered scroll
    const rafId = requestAnimationFrame(() => requestAnimationFrame(reset));
    return () => cancelAnimationFrame(rafId);
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
      router.refresh();
    }
  };

  /** Footer hidden on: landing, marketing pages with own footer, auth pages, coming-soon, onboarding, sanctuary create flows.
   * See docs/04-reference/16-route-map.md (Footer section) for full page list. */
  const showPublicFooter =
    pathname !== '/' &&
    !pathname?.includes('/for-teachers') &&
    !pathname?.includes('/for-creators') &&
    !pathname?.includes('/for-coaches') &&
    !pathname?.includes('/for-studios') &&
    !pathname?.includes('/community') &&
    !pathname?.includes('/login') &&
    !pathname?.includes('/signup') &&
    !pathname?.includes('/forgot-password') &&
    !pathname?.includes('/reset-password') &&
    !pathname?.includes('/confirm-email') &&
    !pathname?.includes('/coming-soon') &&
    !pathname?.includes('/onboarding') &&
    !pathname?.includes('/sanctuary/affirmations/create') &&
    !pathname?.includes('/sanctuary/meditations/create') &&
    !pathname?.includes('/sanctuary/rituals/create');

  if (user) {
    return (
      <div
        style={{
          height: '100dvh',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          background: colors.gradients.background,
          overflow: 'hidden',
        }}
      >
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
          style={{
            paddingTop: `max(${spacing.md}, env(safe-area-inset-top, 0px))`,
            paddingLeft: HEADER_PADDING_X_RESPONSIVE,
            paddingRight: HEADER_PADDING_X_RESPONSIVE,
            ...(isScrolled ? navScrolledStyle : { background: 'transparent' }),
          }}
        >
          <div
            className="mx-auto"
            style={{
              maxWidth: MAX_WIDTH_7XL,
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <div
              className="flex items-center justify-between flex-nowrap"
              style={{ height: NAV_HEIGHT, minHeight: NAV_HEIGHT, gap: spacing.xl }}
            >
              <div className="flex-shrink-0">
                <Logo size="md" href="/sanctuary" />
              </div>

              <div className="hidden md:flex items-center flex-shrink-0" style={{ gap: spacing.md }}>
                <div className="flex items-center" style={{ gap: spacing.lg }}>
                  {navItems.map((item) => {
                    const testId =
                      item.path === '/sanctuary' ? 'nav-sanctuary' :
                      item.path === '/speak' ? 'nav-speak' :
                      item.path === '/marketplace' ? 'nav-marketplace' :
                      item.path === '/library' ? 'nav-library' : undefined;
                    return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(item.path)}
                      data-testid={testId}
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
                  );
                  })}
                </div>
                <LanguageSwitcher compact />

                <div className="relative" style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <Link
                    href="/sanctuary/credits"
                    data-testid="credit-balance-display"
                    className="rounded-full shrink-0 inline-flex"
                    style={{
                      padding: '2px 7px 2px 4px',
                      background: withOpacity(colors.accent.primary, 0.15),
                      border: `1px solid ${withOpacity(colors.accent.tertiary, 0.25)}`,
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <QCoin size="sm" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: colors.accent.tertiary, lineHeight: 1 }}>
                      {creditsBalance}
                    </span>
                  </Link>
                  <Button
                    ref={avatarButtonRef}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <AvatarOrb colors={avatarColors} size="sm" />
                  </Button>

                  {showProfileMenu &&
                    profileMenuPosition &&
                    typeof document !== 'undefined' &&
                    createPortal(
                      <>
                        <div
                          role="button"
                          tabIndex={-1}
                          aria-label="Close menu"
                          className="fixed inset-0 z-[59]"
                          style={{ cursor: 'default' }}
                          onClick={() => setShowProfileMenu(false)}
                        />
                        <div
                          className="fixed shadow-2xl z-[60]"
                        style={{
                          top: profileMenuPosition.top,
                          right: profileMenuPosition.right,
                          width: actualIsSuperAdmin && viewAsRole === null ? 380 : 288,
                          maxHeight: 'min(85vh, 560px)',
                          borderRadius: borderRadius.xl,
                          background: MENU_PANEL_BG,
                          backdropFilter: BLUR.xl,
                          WebkitBackdropFilter: BLUR.xl,
                          border: `1px solid ${colors.glass.border}`,
                          boxShadow: MENU_PANEL_SHADOW,
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          isolation: 'isolate',
                          transform: 'translateZ(0)',
                        }}
                      >
                      {/* Account card */}
                      <div
                        style={{
                          padding: `${spacing.lg} ${spacing.xl}`,
                          background: withOpacity(colors.accent.primary, 0.08),
                          borderBottom: `1px solid ${withOpacity(colors.accent.tertiary, 0.15)}`,
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
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs, alignItems: 'center' }}>
                            <button
                              type="button"
                              className="inline-flex items-center rounded-full border-0 cursor-pointer"
                              style={{
                                padding: `${spacing.xs} ${spacing.sm}`,
                                gap: spacing.xs,
                                background: withOpacity(colors.accent.primary, 0.2),
                                border: `1px solid ${withOpacity(colors.accent.tertiary, 0.3)}`,
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
                            {profileProgressStats && (
                              <Link
                                href="/sanctuary/progress"
                                onClick={() => setShowProfileMenu(false)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  padding: `${spacing.xs} ${spacing.sm}`,
                                  borderRadius: 9999,
                                  border: `1px solid ${LEVEL_COLORS[xpToLevel(profileProgressStats.totalXp)]}40`,
                                  background: `${LEVEL_COLORS[xpToLevel(profileProgressStats.totalXp)]}18`,
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: LEVEL_COLORS[xpToLevel(profileProgressStats.totalXp)],
                                  textDecoration: 'none',
                                  textTransform: 'capitalize',
                                }}
                              >
                                {xpToLevel(profileProgressStats.totalXp)}
                                <span style={{ color: colors.text.secondary, fontWeight: 500 }}> · </span>
                                <span style={{ color: colors.text.secondary, fontWeight: 500 }}>{profileProgressStats.totalXp} XP</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Primary items */}
                      <div style={{ padding: `${spacing.sm} ${spacing.sm}` }}>
                        {USER_MENU_ITEMS.map((item) => (
                          <button
                            key={item.path}
                            type="button"
                            className="w-full flex items-center text-sm rounded-lg border-0 cursor-pointer transition-all nav-menu-item-btn"
                            style={{
                              padding: `${spacing.md} ${spacing.lg}`,
                              gap: spacing.md,
                              color: colors.text.onDark,
                              background: 'transparent',
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

                      <MenuDivider background={withOpacity(colors.accent.tertiary, 0.12)} margin={`0 ${spacing.lg}`} />

                      {/* Secondary items */}
                      <div style={{ padding: `${spacing.sm} ${spacing.sm}` }}>
                        {USER_MENU_ITEMS_SECONDARY.map((item) => (
                          <button
                            key={item.path}
                            type="button"
                            className="w-full flex items-center text-sm rounded-lg border-0 cursor-pointer transition-all nav-menu-item-btn"
                            style={{
                              padding: `${spacing.md} ${spacing.lg}`,
                              gap: spacing.md,
                              color: item.highlight ? colors.accent.tertiary : colors.text.onDark,
                              background: 'transparent',
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

                      {actualIsSuperAdmin && viewAsRole === null && (
                        <>
                          <MenuDivider background={withOpacity(colors.accent.tertiary, 0.12)} margin={`0 ${spacing.lg}`} />
                          <div style={{ padding: `${spacing.sm} ${spacing.lg}` }}>
                            <p
                              className="text-xs font-medium"
                              style={{ color: colors.text.tertiary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            >
                              Super Admin
                            </p>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 2,
                              }}
                            >
                              {SUPERADMIN_MENU_ITEMS.map((item) => (
                                <button
                                  key={item.path}
                                  type="button"
                                  className={`flex items-center text-sm rounded-lg border-0 cursor-pointer transition-all nav-menu-item-btn ${pathname === item.path ? 'active' : ''}`}
                                  style={{
                                    padding: `${spacing.sm} ${spacing.md}`,
                                    gap: spacing.md,
                                    color: pathname === item.path ? colors.accent.tertiary : colors.text.onDark,
                                    background: pathname === item.path ? withOpacity(colors.accent.tertiary, 0.12) : 'transparent',
                                  }}
                                  onClick={() => {
                                    router.push(item.path);
                                    setShowProfileMenu(false);
                                  }}
                                >
                                  {item.icon}
                                  <span className="truncate">{item.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <MenuDivider background={withOpacity(colors.accent.tertiary, 0.12)} margin={`0 ${spacing.lg}`} />
                        </>
                      )}
                      {actualIsSuperAdmin && (
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
                                    className={`w-full flex items-center justify-between text-sm rounded-lg border-0 cursor-pointer transition-all nav-menu-item-btn ${isActive ? 'active' : ''}`}
                                    style={{
                                      padding: `${spacing.sm} ${spacing.md}`,
                                      gap: spacing.md,
                                      color: isActive ? colors.accent.tertiary : colors.text.onDark,
                                      background: isActive ? withOpacity(colors.accent.tertiary, 0.12) : 'transparent',
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
                      )}

                      <MenuDivider background={withOpacity(colors.accent.tertiary, 0.12)} margin={`0 ${spacing.lg}`} />

                      {/* Sign out */}
                      <div style={{ padding: `${spacing.sm} ${spacing.sm}` }}>
                        <button
                          type="button"
                          className="w-full flex items-center text-sm rounded-lg border-0 cursor-pointer transition-all nav-menu-item-btn"
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
                    </div>
                      </>,
                    document.body
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

            {viewAsRole !== null && actualIsSuperAdmin && (
              <div
                style={{
                  width: '100%',
                  padding: `${spacing.sm} ${HEADER_PADDING_X_RESPONSIVE}`,
                  background: withOpacity(colors.accent.primary, 0.12),
                  borderBottom: `1px solid ${colors.glass.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.md,
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: 13, color: colors.text.secondary }}>
                  Viewing as <strong style={{ color: colors.accent.tertiary }}>{VIEW_AS_LABELS[viewAsRole]}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setViewAsRole(null)}
                  style={{
                    padding: `${spacing.xs} ${spacing.sm}`,
                    fontSize: 12,
                    fontWeight: 600,
                    color: colors.accent.tertiary,
                    background: withOpacity(colors.accent.tertiary, 0.2),
                    border: `1px solid ${colors.accent.tertiary}40`,
                    borderRadius: borderRadius.md,
                    cursor: 'pointer',
                  }}
                >
                  Back to Superadmin
                </button>
              </div>
            )}
          </div>
        </motion.nav>

        {/* Authenticated mobile menu: portaled to body to prevent scroll-induced clipping on mobile browsers */}
        <AnimatePresence>
          {isMobileMenuOpen && typeof document !== 'undefined' && createPortal(
            <div className="md:hidden fixed inset-0 z-[45]" style={{ pointerEvents: 'auto' }} aria-hidden="false">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="auth-menu-backdrop"
                transition={{ duration: 0.2 }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: colors.overlay,
                  backdropFilter: BLUR.sm,
                  WebkitBackdropFilter: BLUR.sm,
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                key="auth-menu-panel"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'fixed',
                  top: viewAsRole !== null && actualIsSuperAdmin ? `calc(${NAV_TOP_OFFSET} + ${VIEW_AS_BANNER_HEIGHT}px)` : NAV_TOP_OFFSET,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: NAV_SCROLLED_BG,
                  backdropFilter: BLUR.lg,
                  WebkitBackdropFilter: BLUR.lg,
                  padding: `${spacing.sm} ${HEADER_PADDING_X_RESPONSIVE} ${spacing.md}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.sm,
                  maxHeight: 'min(80vh, 520px)',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch',
                }}
                onClick={(e) => e.stopPropagation()}
              >
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

                <MenuDivider background={colors.glass.border} />

                <button
                  type="button"
                  className="w-full text-left rounded-lg border-0 cursor-pointer"
                  style={{
                    padding: `${spacing.md} ${spacing.lg}`,
                    background: withOpacity(colors.accent.primary, 0.08),
                    border: `1px solid ${withOpacity(colors.accent.tertiary, 0.15)}`,
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
                      background: withOpacity(colors.accent.primary, 0.2),
                      border: `1px solid ${withOpacity(colors.accent.tertiary, 0.3)}`,
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

                <MenuDivider background={colors.glass.border} />

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

                {actualIsSuperAdmin && viewAsRole === null && (
                  <>
                    <MenuDivider background={colors.glass.border} />
                    <div>
                      <p
                        className="text-xs font-medium"
                        style={{ color: colors.text.tertiary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                      >
                        Super Admin
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        {SUPERADMIN_MENU_ITEMS.map((item) => (
                          <button
                            key={item.path}
                            type="button"
                            className="flex items-center rounded-lg border-0 cursor-pointer"
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
                            <span className="truncate">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <MenuDivider background={colors.glass.border} />
                  </>
                )}
                {actualIsSuperAdmin && (
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
                              background: isActive ? withOpacity(colors.accent.tertiary, 0.12) : 'transparent',
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
                )}

                <MenuDivider background={colors.glass.border} />

                <div style={{ padding: spacing.lg }}>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors.text.tertiary, marginBottom: spacing.sm }}>
                    {t('language')}
                  </p>
                  <LanguageSwitcher compact />
                </div>

                <MenuDivider background={colors.glass.border} />

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
              </motion.div>
            </div>,
            document.body
          )}
        </AnimatePresence>

        {/* Single scroll container — matches guest layout; prevents nested scroll / "scroll twice" bug */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <main
            style={{
              paddingTop:
                viewAsRole !== null && actualIsSuperAdmin
                  ? `calc(${NAV_TOP_OFFSET} + ${VIEW_AS_BANNER_HEIGHT}px)`
                  : NAV_TOP_OFFSET,
              paddingBottom: `max(${spacing.xl}, env(safe-area-inset-bottom, 0px))`,
              minWidth: 0,
            }}
          >
            {children}
          </main>
          {showPublicFooter && <PublicFooter />}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100dvh',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: colors.gradients.background,
        overflow: 'hidden',
      }}
    >
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
          style={{
            paddingTop: `max(${spacing.md}, env(safe-area-inset-top, 0px))`,
            paddingLeft: HEADER_PADDING_X_RESPONSIVE,
            paddingRight: HEADER_PADDING_X_RESPONSIVE,
            ...(isScrolled ? navScrolledStyle : { background: 'transparent' }),
          }}
        >
          <div
            className="mx-auto"
            style={{
              maxWidth: MAX_WIDTH_7XL,
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
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
                {t('footerHowItWorks')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/explanation')}
                style={{
                  color: pathname === '/explanation' ? colors.text.primary : colors.text.secondary,
                  background: pathname === '/explanation' ? colors.glass.border : undefined,
                }}
              >
                {t('footerTheScience')}
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
                {t('footerPricing')}
              </Button>
              <LanguageSwitcher compact />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/login')}
                style={{ color: colors.text.secondary }}
              >
                {t('signIn')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/waitlist')}
              >
                {t('joinWaitlist')}
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

        {/* Mobile menu: slide-in drawer from right */}
        <AnimatePresence>
          {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-40"
            style={{ pointerEvents: 'auto' }}
            aria-hidden="false"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="drawer-backdrop"
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: colors.overlay,
                backdropFilter: BLUR.sm,
                WebkitBackdropFilter: BLUR.sm,
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              key="drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(320px, 88vw)',
                maxWidth: 320,
                background: MENU_PANEL_BG_OPAQUE,
                backdropFilter: BLUR.xl,
                WebkitBackdropFilter: BLUR.xl,
                borderLeft: `1px solid ${colors.glass.border}`,
                boxShadow: MENU_DRAWER_SHADOW,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `${spacing.md} ${spacing.xl}`,
                  minHeight: NAV_HEIGHT,
                  flexShrink: 0,
                  borderBottom: `1px solid ${colors.glass.border}`,
                }}
              >
                <Logo size="sm" href="/" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2"
                  aria-label={t('closeMenu')}
                >
                  <X className="w-5 h-5" style={{ color: colors.text.primary }} />
                </Button>
              </div>
              {/* Nav + CTA */}
              <div
                style={{
                  flex: 1,
                  padding: `${spacing.lg} ${spacing.xl}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.xs,
                }}
              >
                <Button
                  variant="ghost"
                  onClick={() => { router.push('/how-it-works'); setIsMobileMenuOpen(false); }}
                  className="w-full justify-start"
                  style={{ color: pathname === '/how-it-works' ? colors.text.primary : colors.text.secondary }}
                >
                  {t('footerHowItWorks')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { router.push('/explanation'); setIsMobileMenuOpen(false); }}
                  className="w-full justify-start"
                  style={{ color: pathname === '/explanation' ? colors.text.primary : colors.text.secondary }}
                >
                  {t('footerTheScience')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { router.push('/pricing'); setIsMobileMenuOpen(false); }}
                  className="w-full justify-start"
                  style={{ color: pathname === '/pricing' ? colors.text.primary : colors.text.secondary }}
                >
                  {t('footerPricing')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { router.push('/login'); setIsMobileMenuOpen(false); }}
                  className="w-full justify-start"
                  style={{ color: colors.text.secondary }}
                >
                  {t('signIn')}
                </Button>
                <div style={{ marginTop: spacing.md }}>
                  <Button
                    variant="primary"
                    onClick={() => { router.push('/waitlist'); setIsMobileMenuOpen(false); }}
                    className="w-full justify-center"
                  >
                    {t('joinWaitlist')}
                  </Button>
                </div>
                <div style={{ marginTop: spacing.lg, paddingTop: spacing.lg, borderTop: `1px solid ${colors.glass.border}` }}>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: colors.text.tertiary,
                      marginBottom: spacing.sm,
                    }}
                  >
                    {t('language')}
                  </p>
                  <LanguageSwitcher compact />
                </div>
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Single scroll container: main + footer scroll together, one scrollbar */}
      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          ...(pathname === '/' && {
            scrollSnapType: 'y proximity',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }),
        }}
      >
        <main style={{ paddingTop: NAV_TOP_OFFSET, paddingBottom: `max(${spacing.xl}, env(safe-area-inset-bottom, 0px))`, minWidth: 0 }}>
          {children}
        </main>
        {/* Footer — hidden on landing, auth, coming-soon, onboarding, marketing (own footer), create flows */}
        {pathname !== '/' &&
          !pathname?.includes('/login') &&
          !pathname?.includes('/signup') &&
          !pathname?.includes('/forgot-password') &&
          !pathname?.includes('/reset-password') &&
          !pathname?.includes('/confirm-email') &&
          !pathname?.includes('/coming-soon') &&
          !pathname?.includes('/onboarding') &&
          !pathname?.includes('/for-teachers') &&
          !pathname?.includes('/for-creators') &&
          !pathname?.includes('/for-coaches') &&
          !pathname?.includes('/for-studios') &&
          !pathname?.includes('/community') &&
          !pathname?.includes('/sanctuary/affirmations/create') &&
          !pathname?.includes('/sanctuary/meditations/create') &&
          !pathname?.includes('/sanctuary/rituals/create') && <PublicFooter />}
      </div>
    </div>
  );
}
