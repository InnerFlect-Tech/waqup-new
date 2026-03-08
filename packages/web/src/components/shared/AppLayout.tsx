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
  User,
  CreditCard,
  Share2,
  Mic,
} from 'lucide-react';
import { Button, TestLoginButton } from '@/components';
import { useTheme, spacing, MAX_WIDTH_7XL, NAV_HEIGHT } from '@/theme';
import { useAuthStore } from '@/stores';
import { SANCTUARY_MENU_ITEMS } from '@/lib';

const CREDITS_BALANCE = SANCTUARY_MENU_ITEMS.find((m) => m.name === 'Credits')?.count ?? 50;

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
  { name: 'Library', path: '/library', icon: <Library className="w-5 h-5" /> },
  {
    name: 'Reminders',
    path: '/sanctuary/reminders',
    icon: <Bell className="w-5 h-5" />,
  },
];

const USER_MENU_ITEMS: UserMenuItem[] = [
  {
    name: 'Credits',
    path: '/sanctuary/credits',
    icon: <CreditCard className="w-4 h-4" />,
    showBalance: true,
  },
  {
    name: 'Share & Earn',
    path: '/sanctuary/referral',
    icon: <Share2 className="w-4 h-4" />,
    highlight: true,
  },
  { name: 'Settings', path: '/sanctuary/settings', icon: <Settings className="w-4 h-4" /> },
];

const PUBLIC_ROUTES = ['/', '/pricing', '/how-it-works'];
const ONBOARDING_ROUTES = [
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

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- close menus on route change */
    setIsMobileMenuOpen(false);
    setShowProfileMenu(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  useEffect(() => {
    if (user && pathname && PUBLIC_ROUTES.includes(pathname)) {
      router.push('/sanctuary');
    }
  }, [user, pathname, router]);

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
          style={isScrolled
            ? { background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: `0 1px 0 ${colors.glass.border}` }
            : { background: 'transparent' }
          }
        >
          <div
            className="mx-auto px-4 sm:px-6 lg:px-8"
            style={{ maxWidth: MAX_WIDTH_7XL }}
          >
            <div
              className="flex items-center justify-between"
              style={{ height: NAV_HEIGHT }}
            >
              <div
                className="flex-shrink-0 cursor-pointer"
                onClick={() => router.push('/sanctuary')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === 'Enter' && router.push('/sanctuary')
                }
              >
                <h1
                  className="text-2xl font-light tracking-widest"
                  style={{ color: colors.text.primary }}
                >
                  wa<span style={{ color: colors.accent.tertiary }}>Q</span>up
                </h1>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-4">
                  {NAV_ITEMS.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(item.path)}
                      className="flex items-center gap-2"
                    style={
                      pathname === item.path
                        ? { color: colors.text.primary, background: colors.glass.border }
                        : { color: colors.text.secondary }
                    }
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
                    className="flex items-center gap-3"
                  >
                    <User className="w-5 h-5" style={{ color: colors.text.primary }} />
                    <span className="hidden sm:inline" style={{ color: colors.text.primary }}>
                      {user?.email}
                    </span>
                    <span
                      className="rounded-full text-sm"
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        background: `${colors.accent.tertiary}30`,
                        color: colors.accent.tertiary,
                      }}
                    >
                      {CREDITS_BALANCE} Credits
                    </span>
                  </Button>

                  {showProfileMenu && (
                    <div
                      className="absolute right-0 mt-2 w-64 rounded-lg py-1 shadow-lg backdrop-blur-lg"
                      style={{
                        background: 'rgba(0,0,0,0.9)',
                        border: `1px solid ${colors.glass.border}`,
                      }}
                    >
                      {USER_MENU_ITEMS.map((item) => (
                        <Button
                          key={item.path}
                          variant="ghost"
                          className="w-full justify-between px-4 py-2 text-sm"
                          style={{
                            color: item.highlight
                              ? colors.accent.tertiary
                              : colors.text.secondary,
                          }}
                          onClick={() => {
                            router.push(item.path);
                            setShowProfileMenu(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <span>{item.name}</span>
                          </div>
                          {item.showBalance && (
                            <span
                              style={{ color: colors.accent.tertiary }}
                            >
                              {CREDITS_BALANCE} Credits
                            </span>
                          )}
                        </Button>
                      ))}

                      <div
                        className="my-2"
                        style={{ height: 1, background: colors.glass.border }}
                      />

                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 text-sm"
                        style={{ color: colors.text.secondary }}
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </Button>
                    </div>
                  )}
                </div>

                {user?.id?.startsWith?.('override-') && <TestLoginButton />}
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
            className="md:hidden overflow-hidden backdrop-blur-lg"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {NAV_ITEMS.map((item) => (
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
                className="my-2"
                style={{ height: 1, background: colors.glass.border }}
              />

              {USER_MENU_ITEMS.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-between px-4 py-2 text-sm"
                  style={{
                    color: item.highlight ? colors.accent.tertiary : colors.text.secondary,
                  }}
                  onClick={() => {
                    router.push(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.showBalance && (
                    <span style={{ color: colors.accent.tertiary }}>{CREDITS_BALANCE} Credits</span>
                  )}
                </Button>
              ))}

              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                style={{ color: colors.text.secondary }}
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </div>
          </motion.div>
        </motion.nav>

        <main>{children}</main>
      </div>
    );
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
        style={isScrolled
          ? { background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: `0 1px 0 ${colors.glass.border}` }
          : { background: 'transparent' }
        }
      >
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: MAX_WIDTH_7XL }}
        >
          <div
            className="flex items-center justify-between"
            style={{ height: NAV_HEIGHT }}
          >
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => router.push('/')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && router.push('/')}
            >
              <h1
                className="text-2xl font-light tracking-widest"
                style={{ color: colors.text.primary }}
              >
                wa<span style={{ color: colors.accent.tertiary }}>Q</span>up
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-4">
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
                variant="primary"
                size="sm"
                onClick={() => router.push('/login')}
                style={{ background: colors.gradients.primary }}
              >
                Sign In
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
          className="md:hidden overflow-hidden backdrop-blur-lg"
          style={{ background: 'rgba(0,0,0,0.8)' }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
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
              variant="primary"
              onClick={() => router.push('/login')}
              className="w-full justify-start"
              style={{ background: colors.gradients.primary }}
            >
              Sign In
            </Button>
          </div>
        </motion.div>
      </motion.nav>
      <main>{children}</main>
    </>
  );
}
