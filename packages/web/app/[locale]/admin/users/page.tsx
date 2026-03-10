'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageShell, SuperAdminGate } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { QCoin } from '@/components';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  source: string;
  created_at: string;
}

interface Subscription {
  plan_id: string;
  status: string;
  current_period_end: string;
  trial_end: string | null;
  cancel_at_period_end: boolean;
}

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  stripe_customer_id: string | null;
  subscription: Subscription | null;
  credit_balance: number;
  recent_transactions: Transaction[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatRelative(dateStr: string | null) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(dateStr);
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    active: '#34d399',
    trialing: '#60a5fa',
    past_due: '#f97316',
    canceled: '#6b7280',
    unpaid: '#ef4444',
  };
  const color = colorMap[status] ?? '#6b7280';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 999,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        fontSize: 11,
        fontWeight: 600,
        color,
        textTransform: 'capitalize',
        letterSpacing: '0.02em',
      }}
    >
      {status.replace('_', ' ')}
    </span>
  );
}

// ── Row component ──────────────────────────────────────────────────────────────

function UserRow({ user, index }: { user: AdminUser; index: number }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: Math.min(index * 0.03, 0.5) }}
        onClick={() => setExpanded((v) => !v)}
        style={{
          cursor: 'pointer',
          background: expanded ? colors.glass.medium : 'transparent',
          transition: 'background 0.15s ease',
        }}
      >
        <td style={{ padding: `10px ${spacing.md}`, minWidth: 220 }}>
          <div style={{ fontSize: 13, color: colors.text.primary, fontWeight: 500 }}>
            {user.email}
          </div>
          <div style={{ fontSize: 11, color: colors.text.secondary, marginTop: 2 }}>
            {user.id.slice(0, 8)}…
          </div>
        </td>
        <td style={{ padding: `10px ${spacing.md}` }}>
          {user.subscription ? (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.text.primary, textTransform: 'capitalize' }}>
                {user.subscription.plan_id}
              </div>
              <div style={{ marginTop: 3 }}>
                <StatusBadge status={user.subscription.status} />
              </div>
            </div>
          ) : (
            <span style={{ fontSize: 12, color: colors.text.secondary }}>—</span>
          )}
        </td>
        <td style={{ padding: `10px ${spacing.md}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <QCoin size="sm" />
            <span style={{ fontSize: 14, fontWeight: 600, color: colors.accent.primary }}>
              {user.credit_balance}
            </span>
          </div>
        </td>
        <td style={{ padding: `10px ${spacing.md}` }}>
          <span style={{ fontSize: 12, color: colors.text.secondary }}>
            {formatDate(user.created_at)}
          </span>
        </td>
        <td style={{ padding: `10px ${spacing.md}` }}>
          <span style={{ fontSize: 12, color: colors.text.secondary }}>
            {formatRelative(user.last_sign_in_at)}
          </span>
        </td>
        <td style={{ padding: `10px ${spacing.sm}`, textAlign: 'center' }}>
          {expanded ? (
            <ChevronDown size={14} color={colors.text.secondary} />
          ) : (
            <ChevronRight size={14} color={colors.text.secondary} />
          )}
        </td>
      </motion.tr>

      <AnimatePresence>
        {expanded && (
          <motion.tr
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <td
              colSpan={6}
              style={{
                padding: `0 ${spacing.md} ${spacing.md}`,
                background: colors.glass.medium,
                borderBottom: `1px solid ${colors.glass.border}`,
              }}
            >
              {/* Subscription detail */}
              {user.subscription && (
                <div style={{ marginBottom: spacing.md }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.text.secondary, marginBottom: spacing.xs }}>
                    Subscription
                  </div>
                  <div style={{ display: 'flex', gap: spacing.xl, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: 11, color: colors.text.secondary }}>Period end</div>
                      <div style={{ fontSize: 13, color: colors.text.primary }}>{formatDate(user.subscription.current_period_end)}</div>
                    </div>
                    {user.subscription.trial_end && (
                      <div>
                        <div style={{ fontSize: 11, color: colors.text.secondary }}>Trial end</div>
                        <div style={{ fontSize: 13, color: colors.text.primary }}>{formatDate(user.subscription.trial_end)}</div>
                      </div>
                    )}
                    {user.subscription.cancel_at_period_end && (
                      <div>
                        <div style={{ fontSize: 11, color: '#f97316' }}>Cancels at period end</div>
                      </div>
                    )}
                    {user.stripe_customer_id && (
                      <div>
                        <div style={{ fontSize: 11, color: colors.text.secondary }}>Stripe customer</div>
                        <div style={{ fontSize: 12, color: colors.text.primary, fontFamily: 'monospace' }}>
                          {user.stripe_customer_id}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recent transactions */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.text.secondary, marginBottom: spacing.xs }}>
                  Recent transactions
                </div>
                {user.recent_transactions.length === 0 ? (
                  <div style={{ fontSize: 12, color: colors.text.secondary }}>No transactions yet</div>
                ) : (
                  <div
                    style={{
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.glass.border}`,
                      overflow: 'hidden',
                    }}
                  >
                    {user.recent_transactions.map((tx, i) => (
                      <div
                        key={tx.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                          padding: `8px ${spacing.md}`,
                          borderBottom: i < user.recent_transactions.length - 1
                            ? `1px solid ${colors.glass.border}`
                            : 'none',
                          background: 'transparent',
                        }}
                      >
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: tx.amount >= 0 ? `${colors.success}18` : `${colors.error}12`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {tx.amount >= 0 ? (
                            <ArrowDownLeft size={11} color={colors.success} />
                          ) : (
                            <ArrowUpRight size={11} color={colors.error} />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, color: colors.text.primary, lineHeight: 1.3 }}>
                            {tx.description || (tx.amount >= 0 ? 'Credit' : 'Debit')}
                          </div>
                          <div style={{ fontSize: 11, color: colors.text.secondary, marginTop: 1 }}>
                            {tx.source} · {formatRelative(tx.created_at)}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: tx.amount >= 0 ? colors.success : colors.error,
                            flexShrink: 0,
                          }}
                        >
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/admin/users', { credentials: 'same-origin' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data.users ?? []);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()),
  );

  const totalBalance = users.reduce((sum, u) => sum + u.credit_balance, 0);
  const activeSubscriptions = users.filter((u) => u.subscription?.status === 'active' || u.subscription?.status === 'trialing').length;

  return (
    <SuperAdminGate>
    <PageShell intensity="medium">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: `${spacing.xxl} ${spacing.xl}` }}>
        {/* Header */}
        <div style={{ marginBottom: spacing.xl }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.text.secondary, marginBottom: spacing.xs }}>
            Superadmin
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 200, color: colors.text.primary, margin: 0, letterSpacing: '-0.02em' }}>
            Users
          </h1>
        </div>

        <AnimatePresence mode="wait">
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Stats bar */}
              <div
                style={{
                  display: 'flex',
                  gap: spacing.lg,
                  marginBottom: spacing.xl,
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { label: 'Total users', value: users.length },
                  { label: 'Active subscribers', value: activeSubscriptions },
                  { label: 'Total Qs in circulation', value: totalBalance },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: `${spacing.md} ${spacing.xl}`,
                      borderRadius: borderRadius.lg,
                      background: colors.glass.light,
                      backdropFilter: BLUR.lg,
                      WebkitBackdropFilter: BLUR.lg,
                      border: `1px solid ${colors.glass.border}`,
                      minWidth: 140,
                    }}
                  >
                    <div style={{ fontSize: 11, color: colors.text.secondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 200, color: colors.text.primary, letterSpacing: '-0.02em' }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Toolbar */}
              <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.md, alignItems: 'center' }}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by email or ID…"
                  style={{
                    flex: 1,
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderRadius: borderRadius.md,
                    background: colors.glass.medium,
                    border: `1px solid ${colors.glass.border}`,
                    color: colors.text.primary,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => void fetchUsers()}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderRadius: borderRadius.md,
                    background: colors.glass.medium,
                    border: `1px solid ${colors.glass.border}`,
                    color: colors.text.secondary,
                    fontSize: 13,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                  Refresh
                </button>
              </div>

              {/* Error */}
              {fetchError && (
                <div
                  style={{
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    background: `${colors.error}15`,
                    border: `1px solid ${colors.error}30`,
                    color: colors.error,
                    fontSize: 13,
                    marginBottom: spacing.md,
                  }}
                >
                  {fetchError}
                </div>
              )}

              {/* Table */}
              <div
                style={{
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  backdropFilter: BLUR.lg,
                  WebkitBackdropFilter: BLUR.lg,
                  border: `1px solid ${colors.glass.border}`,
                  overflow: 'hidden',
                  overflowX: 'auto',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                      {['User', 'Plan / Status', 'Balance', 'Joined', 'Last active', ''].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: `${spacing.sm} ${spacing.md}`,
                            textAlign: 'left',
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: colors.text.secondary,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading && filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: spacing.xxl, textAlign: 'center', color: colors.text.secondary, fontSize: 13 }}>
                          Loading…
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: spacing.xxl, textAlign: 'center', color: colors.text.secondary, fontSize: 13 }}>
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <UserRow key={user.id} user={user} index={index} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ fontSize: 11, color: colors.text.secondary, marginTop: spacing.md, textAlign: 'right' }}>
                {filteredUsers.length} of {users.length} users
              </div>
            </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </PageShell>
    </SuperAdminGate>
  );
}
