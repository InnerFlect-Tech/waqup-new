'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Button, Card } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { useAuthStore } from '@/stores';
import { clearStoredOverride } from '@/lib/auth-override';
import Link from 'next/link';
import { 
  User,
  Settings,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface MenuItem {
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  href: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    name: 'Preferences',
    description: 'Customize your experience',
    icon: Settings,
    href: '/sanctuary/settings',
  },
  {
    name: 'Notifications',
    description: 'Manage your notification settings',
    icon: Bell,
    href: '/sanctuary/reminders',
  },
  {
    name: 'Credits',
    description: 'View and manage your credits',
    icon: CreditCard,
    href: '/sanctuary/credits',
  },
  {
    name: 'Privacy & Security',
    description: 'Manage your privacy settings',
    icon: Shield,
    href: '/sanctuary/settings',
  },
];

export default function ProfilePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();

  // TODO: Get actual user data from auth context/store
  const user = {
    name: 'User Name',
    email: 'user@example.com',
  };

  return (
    <PageShell intensity="medium">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: spacing.xl }}>
            <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
              Profile & Settings
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Manage your account and preferences
            </Typography>
          </div>

          {/* User Info Card */}
          <Card
            variant="elevated"
            style={{
              padding: spacing.xl,
              marginBottom: spacing.xl,
              background: colors.glass.opaque,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: `1px solid ${colors.glass.border}`,
              boxShadow: `0 8px 32px ${colors.mystical.glow}40`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: borderRadius.full,
                  background: colors.gradients.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${colors.mystical.glow}60`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at center, ${colors.mystical.glow}40, transparent)`,
                    opacity: 0.6,
                  }}
                />
                <span style={{ position: 'relative', zIndex: 1 }}>
                <User size={40} color={colors.text.onDark} strokeWidth={2.5} />
              </span>
              </div>
              <div style={{ flex: 1 }}>
                <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                  {user.name}
                </Typography>
                <Typography variant="body" style={{ color: colors.text.secondary }}>
                  {user.email}
                </Typography>
              </div>
            </div>
          </Card>

          {/* Menu Items */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: spacing.lg,
              marginBottom: spacing.xl,
            }}
          >
            {MENU_ITEMS.map((item, index) => {
              const IconComponent = item.icon;
              // First two: more opaque (darker), last two: more transparent (lighter)
              const isOpaque = index < 2;
              const cardBackground = isOpaque ? colors.glass.opaque : colors.glass.transparent;
              const textColor = isOpaque ? colors.text.onDark : colors.text.primary;
              const secondaryTextColor = isOpaque ? colors.text.onDark : colors.text.secondary;
              
              return (
                <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                  <Card
                    variant="default"
                    pressable
                    style={{
                      padding: spacing.lg,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      background: cardBackground,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `1px solid ${colors.glass.border}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: borderRadius.full,
                          background: isOpaque 
                            ? colors.gradients.primary 
                            : colors.background.tertiary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: `radial-gradient(circle at center, ${colors.mystical.glow}30, transparent)`,
                            opacity: isOpaque ? 0.5 : 0.3,
                          }}
                        />
                        <span style={{ position: 'relative', zIndex: 1 }}>
                          <IconComponent 
                            size={20} 
                            color={isOpaque ? colors.text.onDark : colors.accent.primary}
                            strokeWidth={2.5}
                          />
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Typography variant="h4" style={{ color: textColor, marginBottom: spacing.xs }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body" style={{ color: secondaryTextColor }}>
                          {item.description}
                        </Typography>
                      </div>
                      <ChevronRight size={20} color={colors.text.secondary} />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <Card
            variant="default"
            style={{
              padding: spacing.lg,
              background: colors.glass.opaque,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: `1px solid ${colors.glass.border}`,
            }}
          >
            <Button
              variant="outline"
              size="lg"
              fullWidth
              style={{
                borderColor: colors.error,
                color: colors.error,
              }}
              onClick={async () => {
                clearStoredOverride();
                await useAuthStore.getState().logout();
                router.push('/login');
              }}
            >
              <LogOut size={20} color={colors.error} style={{ marginRight: spacing.sm }} />
              Sign Out
            </Button>
          </Card>

          {/* Back Link */}
          <div style={{ marginTop: spacing.xl, textAlign: 'center' }}>
            <Link href="/home" style={{ textDecoration: 'none' }}>
              <Button
                variant="ghost"
                size="md"
                style={{
                  color: colors.text.secondary,
                }}
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
    </PageShell>
  );
}
