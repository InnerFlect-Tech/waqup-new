'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Typography, Button, Input } from '@/components';
import { spacing, borderRadius, BLUR } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import { useAuthStore } from '@/stores';
import { useCreditBalance } from '@/hooks';
import { Analytics } from '@waqup/shared/utils';
import { supabase } from '@/lib/supabase';
import { Link } from '@/i18n/navigation';
import { LogOut, ChevronRight, Edit2, Check, X } from 'lucide-react';
import { PROFILE_MENU_ITEMS } from '@/lib';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { user: authUser } = useAuthStore();
  const { balance, isLoading: balanceLoading } = useCreditBalance();

  const [contentCount, setContentCount] = useState<number | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [bioValue, setBioValue] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [savingBio, setSavingBio] = useState(false);

  const displayName =
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    authUser?.user_metadata?.display_name ||
    authUser?.email?.split('@')[0] ||
    'User';
  const displayEmail = authUser?.email || '';
  const bio = (authUser?.user_metadata?.bio as string | undefined) ?? '';
  const initials = getInitials(displayName);
  const memberSince = authUser?.created_at
    ? new Date(authUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  const fetchContentCount = useCallback(async () => {
    if (!authUser) return;
    const { count } = await supabase
      .from('content_items')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', authUser.id);
    setContentCount(count ?? 0);
  }, [authUser]);

  useEffect(() => {
    setNameValue(displayName);
    setBioValue(bio);
    fetchContentCount();
  }, [displayName, bio, fetchContentCount]);

  const saveName = async () => {
    if (!nameValue.trim()) return;
    setSavingName(true);
    await supabase.auth.updateUser({ data: { full_name: nameValue.trim() } });
    setSavingName(false);
    setEditingName(false);
  };

  const saveBio = async () => {
    setSavingBio(true);
    await supabase.auth.updateUser({ data: { bio: bioValue.trim().slice(0, 160) } });
    setSavingBio(false);
    setEditingBio(false);
  };

  const STATS = [
    {
      label: 'Content',
      value: contentCount === null ? '—' : String(contentCount),
      href: '/library',
    },
    {
      label: 'Qs',
      value: balanceLoading ? '—' : String(balance),
      href: '/sanctuary/credits',
    },
    { label: 'Member since', value: memberSince, href: null },
  ];

  return (
    <PageShell intensity="medium">
      <PageContent>
        {/* Avatar + name card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: spacing.xxl,
            borderRadius: borderRadius.xl,
            background: `linear-gradient(145deg, ${colors.accent.primary}18, ${colors.glass.light})`,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${colors.accent.primary}30`,
            boxShadow: `0 16px 48px ${colors.accent.primary}20`,
            marginBottom: spacing.xl,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.xl }}>
            {/* Initials avatar */}
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: borderRadius.full,
                background: colors.gradients.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 8px 24px ${colors.accent.primary}50`,
                fontSize: 28,
                fontWeight: 600,
                color: colors.text.onDark,
                letterSpacing: '0.05em',
              }}
            >
              {initials}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {editingName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                  <input
                    autoFocus
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveName();
                      if (e.key === 'Escape') { setEditingName(false); setNameValue(displayName); }
                    }}
                    style={{
                      background: colors.glass.light,
                      border: `1px solid ${colors.accent.primary}50`,
                      borderRadius: borderRadius.md,
                      color: colors.text.primary,
                      fontSize: 22,
                      fontWeight: 300,
                      padding: `${spacing.xs} ${spacing.sm}`,
                      outline: 'none',
                      flex: 1,
                      minWidth: 0,
                    }}
                  />
                  <button type="button" onClick={saveName} disabled={savingName} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.xs }}>
                    <Check size={18} color={colors.accent.primary} />
                  </button>
                  <button type="button" onClick={() => { setEditingName(false); setNameValue(displayName); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.xs }}>
                    <X size={18} color={colors.text.secondary} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                  <Typography variant="h2" style={{ color: colors.text.primary, margin: 0, fontWeight: 300 }}>
                    {displayName}
                  </Typography>
                  <button
                    type="button"
                    onClick={() => setEditingName(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.xs, opacity: 0.5 }}
                  >
                    <Edit2 size={14} color={colors.text.secondary} />
                  </button>
                </div>
              )}

              <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
                {displayEmail}
              </Typography>

              {/* Marketplace bio */}
              {editingBio ? (
                <div>
                  <Input
                    multiline
                    rows={2}
                    autoFocus
                    value={bioValue}
                    onChange={(e) => setBioValue(e.target.value.slice(0, 160))}
                    placeholder="How you show up in the marketplace…"
                    wrapperStyle={{ marginBottom: spacing.xs }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, justifyContent: 'space-between' }}>
                    <Typography variant="small" style={{ color: colors.text.secondary, opacity: 0.5, margin: 0, fontSize: 11 }}>
                      {bioValue.length}/160
                    </Typography>
                    <div style={{ display: 'flex', gap: spacing.xs }}>
                      <button type="button" onClick={saveBio} disabled={savingBio} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.xs }}>
                        <Check size={16} color={colors.accent.primary} />
                      </button>
                      <button type="button" onClick={() => { setEditingBio(false); setBioValue(bio); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.xs }}>
                        <X size={16} color={colors.text.secondary} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingBio(true)}
                  style={{
                    background: 'none',
                    border: `1px dashed ${colors.glass.border}`,
                    borderRadius: borderRadius.md,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Typography
                    variant="small"
                    style={{ color: bio ? colors.text.secondary : `${colors.text.secondary}60`, margin: 0, lineHeight: 1.4, fontSize: 13 }}
                  >
                    {bio || 'Add a short bio — how you show up in the marketplace'}
                  </Typography>
                </button>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: spacing.md,
              marginTop: spacing.xl,
              paddingTop: spacing.xl,
              borderTop: `1px solid ${colors.glass.border}`,
            }}
          >
            {STATS.map((stat) => {
              const inner = (
                <div key={stat.label} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                  <Typography variant="h3" style={{ color: colors.text.primary, margin: 0, fontWeight: 500 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="small" style={{ color: stat.href ? colors.accent.tertiary : colors.text.secondary, margin: 0, fontSize: 12 }}>
                    {stat.label}
                  </Typography>
                </div>
              );

              return stat.href ? (
                <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
                  {inner}
                </Link>
              ) : inner;
            })}
          </div>
        </motion.div>

        {/* Menu Items */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gridAutoRows: 'minmax(88px, 1fr)',
            gap: spacing.md,
            marginBottom: spacing.xl,
          }}
        >
          {PROFILE_MENU_ITEMS.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <Link key={item.name} href={item.href} style={{ textDecoration: 'none', display: 'flex' }}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.06 }}
                  whileHover={{ scale: 1.015 }}
                  style={{
                    padding: spacing.lg,
                    borderRadius: borderRadius.lg,
                    background: colors.glass.light,
                    backdropFilter: BLUR.lg,
                    WebkitBackdropFilter: BLUR.lg,
                    border: `1px solid ${colors.glass.border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                    transition: 'border-color 0.2s ease',
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: borderRadius.md,
                      background: index < 2 ? colors.gradients.primary : colors.glass.medium,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent size={20} color={index < 2 ? colors.text.onDark : colors.accent.primary} strokeWidth={2.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h4" style={{ color: colors.text.primary, margin: 0, marginBottom: spacing.xs }}>
                      {item.name}
                    </Typography>
                    <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                      {item.description}
                    </Typography>
                  </div>
                  <ChevronRight size={18} color={colors.text.secondary} style={{ opacity: 0.5, flexShrink: 0 }} />
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Sign out */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.error}30`,
            background: `${colors.error}08`,
          }}
        >
          <Button
            variant="outline"
            size="lg"
            fullWidth
            style={{ borderColor: colors.error, color: colors.error }}
            onClick={async () => {
              const userId = useAuthStore.getState().user?.id;
              await useAuthStore.getState().logout();
              Analytics.logoutCompleted(userId);
              router.push('/');
            }}
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </motion.div>

      </PageContent>
    </PageShell>
  );
}
