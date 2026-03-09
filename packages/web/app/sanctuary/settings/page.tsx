'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typography, Button, AvatarOrb, AVATAR_SWATCHES } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { useAuthStore } from '@/stores';
import { clearCreateInitSeen, useAvatarColors, useSubscription } from '@/hooks';
import { getPlanById } from '@waqup/shared/constants';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';

const STORAGE_KEY = 'waqup_notification_prefs';

interface NotificationPrefs {
  dailyReminder: boolean;
  streakAlerts: boolean;
  newContent: boolean;
  weeklyReport: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  dailyReminder: true,
  streakAlerts: true,
  newContent: false,
  weeklyReport: false,
};

const NOTIFICATION_OPTIONS: { key: keyof NotificationPrefs; label: string; description: string }[] = [
  { key: 'dailyReminder', label: 'Daily reminder', description: 'Get nudged to practice at your preferred time' },
  { key: 'streakAlerts', label: 'Streak alerts', description: 'Warnings before your streak breaks' },
  { key: 'newContent', label: 'New community content', description: 'Discover new affirmations and rituals from creators' },
  { key: 'weeklyReport', label: 'Weekly summary', description: 'A digest of your practice insights' },
];

const THEME_DISPLAY: Record<string, { label: string; dot: string }> = {
  'mystical-purple': { label: 'Mystical', dot: '#9333EA' },
  'professional-blue': { label: 'Professional', dot: '#3B82F6' },
  'serene-green': { label: 'Serene', dot: '#10B981' },
  'golden-sunset': { label: 'Golden', dot: '#F59E0B' },
  'cosmic-dark': { label: 'Cosmic', dot: '#8B5CF6' },
  'minimalist-light': { label: 'Light', dot: '#2563EB' },
};

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        background: value ? colors.gradients.primary : colors.glass.medium,
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s ease',
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          position: 'absolute',
          top: 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, themeName, setTheme, availableThemes } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { user } = useAuthStore();
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const { colors: avatarColors, setColor: setAvatarColor } = useAvatarColors();
  const { data: subscription, isLoading: isLoadingSubscription } = useSubscription();
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const handleManageBilling = async () => {
    try {
      setPortalLoading(true);
      setPortalError(null);
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to open portal');
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setPortalLoading(false);
    }
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User';
  const displayEmail = user?.email || '';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as NotificationPrefs;
        queueMicrotask(() => setPrefs(parsed));
      }
    } catch {}
  }, []);

  const handleToggle = (key: keyof NotificationPrefs) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const sectionStyle: React.CSSProperties = {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    background: colors.glass.light,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${colors.glass.border}`,
    marginBottom: spacing.lg,
  };

  return (
    <PageShell intensity="medium">
      <PageContent width="narrow">

        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300, textAlign: 'center' }}>
          Settings
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textAlign: 'center' }}>
          Customize your sanctuary experience
        </Typography>

        {/* Profile section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={sectionStyle}>
          <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            Profile
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <div>
              <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.xs, display: 'block' }}>
                Name
              </Typography>
              <Typography variant="body" style={{ color: colors.text.primary }}>
                {displayName}
              </Typography>
            </div>
            <div>
              <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.xs, display: 'block' }}>
                Email
              </Typography>
              <Typography variant="body" style={{ color: colors.text.primary }}>
                {displayEmail}
              </Typography>
            </div>
          </div>
          <Typography variant="small" style={{ color: colors.text.secondary, marginTop: spacing.md, opacity: 0.7 }}>
            Profile editing coming soon
          </Typography>
        </motion.div>

        {/* Billing section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={sectionStyle}>
          <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            Billing & Subscription
          </Typography>
          
          {isLoadingSubscription ? (
            <Typography variant="small" style={{ color: colors.text.secondary }}>Loading...</Typography>
          ) : subscription ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <div>
                <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.xs, display: 'block' }}>
                  Current Plan
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 500 }}>
                    {getPlanById(subscription.plan_id as any)?.name || subscription.plan_id}
                  </Typography>
                  <div style={{ 
                    padding: '2px 8px', 
                    borderRadius: 12, 
                    fontSize: 11, 
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    background: subscription.status === 'active' || subscription.status === 'trialing' ? `${colors.success}20` : `${colors.error}20`,
                    color: subscription.status === 'active' || subscription.status === 'trialing' ? colors.success : colors.error
                  }}>
                    {subscription.status}
                  </div>
                </div>
              </div>
              
              {subscription.cancel_at_period_end && (
                <Typography variant="small" style={{ color: colors.warning }}>
                  Cancels at end of billing period
                </Typography>
              )}

              {portalError && (
                <Typography variant="small" style={{ color: colors.error }}>
                  {portalError}
                </Typography>
              )}

              <Button 
                variant="outline" 
                size="sm" 
                loading={portalLoading} 
                onClick={handleManageBilling}
                style={{ alignSelf: 'flex-start', marginTop: spacing.sm }}
              >
                Manage Billing
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <Typography variant="body" style={{ color: colors.text.secondary }}>
                You are currently on the free practice tier.
              </Typography>
              <Link href="/pricing" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm">
                  View Plans
                </Button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Avatar section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={sectionStyle}>
          <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            Avatar
          </Typography>

          {/* Live preview */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: spacing.lg }}>
            <AvatarOrb colors={avatarColors} size="lg" pulse />
          </div>

          {/* 3 swatch rows */}
          {(['Core', 'Ring', 'Glow'] as const).map((label, slot) => (
            <div key={label} style={{ marginBottom: spacing.lg }}>
              <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm, display: 'block' }}>
                {label}
              </Typography>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                {AVATAR_SWATCHES.map((swatch) => {
                  const isActive = avatarColors[slot as 0 | 1 | 2] === swatch.hex;
                  return (
                    <button
                      key={swatch.hex}
                      title={swatch.name}
                      onClick={() => setAvatarColor(slot as 0 | 1 | 2, swatch.hex)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: swatch.hex,
                        border: isActive ? '2.5px solid #fff' : '2.5px solid transparent',
                        boxShadow: isActive ? `0 0 0 1.5px ${swatch.hex}` : `0 0 6px ${swatch.hex}55`,
                        cursor: 'pointer',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        transform: isActive ? 'scale(1.18)' : 'scale(1)',
                        flexShrink: 0,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Theme section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={sectionStyle}>
          <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            Theme
          </Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.md }}>
            {availableThemes.map((name) => {
              const info = THEME_DISPLAY[name] ?? { label: name, dot: colors.accent.primary };
              const isActive = name === themeName;
              return (
                <button
                  key={name}
                  onClick={() => setTheme(name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderRadius: borderRadius.full,
                    border: `1px solid ${isActive ? info.dot : colors.glass.border}`,
                    background: isActive ? `${info.dot}20` : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: info.dot,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="small" style={{ color: isActive ? info.dot : colors.text.secondary, margin: 0 }}>
                    {info.label}
                  </Typography>
                  {isActive && <Check size={12} color={info.dot} />}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Notifications section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={sectionStyle}>
          <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            Notifications
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {NOTIFICATION_OPTIONS.map((opt) => (
              <div key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                <div style={{ flex: 1 }}>
                  <Typography variant="body" style={{ color: colors.text.primary, margin: 0, marginBottom: spacing.xs }}>
                    {opt.label}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                    {opt.description}
                  </Typography>
                </div>
                <Toggle value={prefs[opt.key]} onChange={() => handleToggle(opt.key)} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Show create-flow tips again (for testing first-time UX) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={sectionStyle}>
          <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            Testing
          </Typography>
          <Typography variant="body" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
            Show create-flow tips again on your next visit to any create flow. Use this to test the first-time experience.
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  clearCreateInitSeen();
                }}
              >
                Show create-flow tips again
              </Button>
              <Link href="/sanctuary/affirmations/create/init" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="md" onClick={() => clearCreateInitSeen()}>
                  Try it now →
                </Button>
              </Link>
            </div>
            <Link href="/speak/test" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="md" style={{ color: colors.text.secondary, alignSelf: 'flex-start' }}>
                Orb test mode →
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: spacing.lg,
            borderRadius: borderRadius.xl,
            border: `1px solid ${colors.error}30`,
            background: `${colors.error}08`,
          }}
        >
          <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            Danger zone
          </Typography>
          <Button
            variant="outline"
            size="md"
            fullWidth
            style={{ borderColor: colors.error, color: colors.error }}
            onClick={async () => {
              await useAuthStore.getState().logout();
              router.push('/');
            }}
          >
            Sign Out
          </Button>
        </motion.div>
      </PageContent>
    </PageShell>
  );
}
