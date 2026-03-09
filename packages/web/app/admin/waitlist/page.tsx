'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageShell, SuperAdminGate } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import {
  RefreshCw,
  Search,
  Users,
  FlaskConical,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Check,
  X,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

const ADMIN_PASS = process.env.NEXT_PUBLIC_ORACLE_ADMIN_PASS ?? 'waQup-admin';

// ── Types ─────────────────────────────────────────────────────────────────────

interface WaitlistSignup {
  id: string;
  name: string;
  email: string;
  intentions: string[];
  is_beta_tester: boolean;
  referral_source: string | null;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

// ── Helpers ───────────────────────────────────────────────────────────────────

const INTENTION_LABELS: Record<string, string> = {
  create: 'Create',
  practice: 'Practice',
  share: 'Share',
  monetise: 'Monetise',
  gift: 'Gift',
  research: 'Research',
  reflect: 'Reflect',
  curious: 'Curious',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatRelative(dateStr: string) {
  const d = new Date(dateStr);
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

function StatusBadge({ status }: { status: WaitlistSignup['status'] }) {
  const map: Record<string, { bg: string; color: string }> = {
    pending: { bg: 'rgba(250,204,21,0.12)', color: '#fbbf24' },
    approved: { bg: 'rgba(52,211,153,0.12)', color: '#34d399' },
    rejected: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  };
  const s = map[status] ?? map.pending;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 999,
        background: s.bg,
        color: s.color,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  );
}

function IntentionTag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        padding: '2px 8px',
        borderRadius: 999,
        background: 'rgba(147,51,234,0.12)',
        border: '1px solid rgba(147,51,234,0.25)',
        color: '#A855F7',
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div
      style={{
        padding: `${spacing.lg}px`,
        borderRadius: borderRadius.lg,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${accent}18`,
          border: `1px solid ${accent}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={16} color={accent} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 300, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

// ── Action button ─────────────────────────────────────────────────────────────

function ActionButton({
  signupId,
  currentStatus,
  onStatusChange,
}: {
  signupId: string;
  currentStatus: WaitlistSignup['status'];
  onStatusChange: (id: string, status: WaitlistSignup['status']) => void;
}) {
  const [busy, setBusy] = useState(false);

  const doAction = async (action: 'approve' | 'reject') => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/waitlist/${signupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        onStatusChange(signupId, action === 'approve' ? 'approved' : 'rejected');
      }
    } finally {
      setBusy(false);
    }
  };

  if (currentStatus === 'approved') {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); void doAction('reject'); }}
        disabled={busy}
        title="Revoke access"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 12px',
          borderRadius: borderRadius.md,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          color: '#ef4444',
          fontSize: 11,
          cursor: busy ? 'not-allowed' : 'pointer',
          opacity: busy ? 0.5 : 1,
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        <X size={11} /> Revoke
      </button>
    );
  }

  if (currentStatus === 'rejected') {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); void doAction('approve'); }}
        disabled={busy}
        title="Approve access"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 12px',
          borderRadius: borderRadius.md,
          background: 'rgba(52,211,153,0.08)',
          border: '1px solid rgba(52,211,153,0.2)',
          color: '#34d399',
          fontSize: 11,
          cursor: busy ? 'not-allowed' : 'pointer',
          opacity: busy ? 0.5 : 1,
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        <Check size={11} /> Approve
      </button>
    );
  }

  // Pending — show both buttons
  return (
    <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => void doAction('approve')}
        disabled={busy}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 12px',
          borderRadius: borderRadius.md,
          background: 'rgba(52,211,153,0.08)',
          border: '1px solid rgba(52,211,153,0.2)',
          color: '#34d399',
          fontSize: 11,
          cursor: busy ? 'not-allowed' : 'pointer',
          opacity: busy ? 0.5 : 1,
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        <Check size={11} /> Approve
      </button>
      <button
        onClick={() => void doAction('reject')}
        disabled={busy}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 12px',
          borderRadius: borderRadius.md,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          color: '#ef4444',
          fontSize: 11,
          cursor: busy ? 'not-allowed' : 'pointer',
          opacity: busy ? 0.5 : 1,
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        <X size={11} /> Reject
      </button>
    </div>
  );
}

// ── Filter tabs ───────────────────────────────────────────────────────────────

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        borderRadius: 999,
        background: active ? 'rgba(147,51,234,0.15)' : 'transparent',
        border: active ? '1px solid rgba(147,51,234,0.35)' : '1px solid transparent',
        color: active ? '#A855F7' : 'rgba(255,255,255,0.4)',
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.15s',
      }}
    >
      {label}
      <span
        style={{
          fontSize: 10,
          padding: '1px 6px',
          borderRadius: 999,
          background: active ? 'rgba(147,51,234,0.2)' : 'rgba(255,255,255,0.06)',
          color: active ? '#A855F7' : 'rgba(255,255,255,0.3)',
        }}
      >
        {count}
      </span>
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

function WaitlistDashboard() {
  const [signups, setSignups] = useState<WaitlistSignup[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const fetchSignups = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch('/api/waitlist', {
        headers: { 'X-Admin-Pass': ADMIN_PASS },
      });
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data.error ?? 'Failed to load waitlist.');
        return;
      }
      setSignups(data.signups ?? []);
    } catch {
      setFetchError('Network error.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSignups();
  }, [fetchSignups]);

  const handleStatusChange = (id: string, status: WaitlistSignup['status']) => {
    setSignups((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  // ── Derived stats ──────────────────────────────────────────────────────────

  const betaCount = signups.filter((s) => s.is_beta_tester).length;
  const pendingCount = signups.filter((s) => s.status === 'pending').length;
  const approvedCount = signups.filter((s) => s.status === 'approved').length;
  const rejectedCount = signups.filter((s) => s.status === 'rejected').length;

  const intentionCounts = signups.reduce<Record<string, number>>((acc, s) => {
    for (const i of s.intentions) {
      acc[i] = (acc[i] ?? 0) + 1;
    }
    return acc;
  }, {});

  const topIntention = Object.entries(intentionCounts).sort((a, b) => b[1] - a[1])[0];

  // ── Filtered list ──────────────────────────────────────────────────────────

  const filtered = signups
    .filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      return sortAsc ? ta - tb : tb - ta;
    });

  return (
    <PageShell intensity="light" maxWidth={1100}>
      <div style={{ paddingTop: spacing.xxxl, paddingBottom: spacing.xxxl }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xxl, flexWrap: 'wrap', gap: spacing.md }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(147,51,234,0.8)', marginBottom: 6 }}>
              Admin
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 300, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
              Waitlist & Access
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <Link
              href="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: borderRadius.md,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={14} />
              Dashboard
            </Link>
            <button
              onClick={() => void fetchSignups()}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: borderRadius.md,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 13,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                fontFamily: 'inherit',
              }}
            >
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: spacing.md,
            marginBottom: spacing.xxl,
          }}
        >
          <StatCard label="Total signups" value={signups.length} icon={Users} accent="#9333EA" />
          <StatCard label="Beta testers" value={betaCount} icon={FlaskConical} accent="#6366F1" />
          <StatCard label="Pending" value={pendingCount} icon={Clock} accent="#fbbf24" />
          <StatCard
            label="Top intention"
            value={topIntention ? `${INTENTION_LABELS[topIntention[0]] ?? topIntention[0]} (${topIntention[1]})` : '—'}
            icon={TrendingUp}
            accent="#A855F7"
          />
        </div>

        {/* Intention breakdown */}
        {Object.keys(intentionCounts).length > 0 && (
          <div
            style={{
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: spacing.xl,
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: spacing.md }}>
              Intention breakdown
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
              {Object.entries(intentionCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([key, count]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      borderRadius: 999,
                      background: 'rgba(147,51,234,0.08)',
                      border: '1px solid rgba(147,51,234,0.2)',
                    }}
                  >
                    <span style={{ color: '#A855F7', fontSize: 12, fontWeight: 500 }}>
                      {INTENTION_LABELS[key] ?? key}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.4)',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: 999,
                        padding: '1px 7px',
                      }}
                    >
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: spacing.lg, flexWrap: 'wrap' }}>
          <FilterTab label="All" count={signups.length} active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
          <FilterTab label="Pending" count={pendingCount} active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')} />
          <FilterTab label="Approved" count={approvedCount} active={statusFilter === 'approved'} onClick={() => setStatusFilter('approved')} />
          <FilterTab label="Rejected" count={rejectedCount} active={statusFilter === 'rejected'} onClick={() => setStatusFilter('rejected')} />
        </div>

        {/* Search + sort */}
        <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.lg, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 200 }}>
            <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 34px',
                borderRadius: borderRadius.md,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            onClick={() => setSortAsc((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '10px 14px',
              borderRadius: borderRadius.md,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            {sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {sortAsc ? 'Oldest first' : 'Newest first'}
          </button>
        </div>

        {/* Error */}
        {fetchError && (
          <div style={{ color: '#ef4444', marginBottom: spacing.lg, fontSize: 14 }}>{fetchError}</div>
        )}

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xxxl, color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: spacing.xxxl,
              borderRadius: borderRadius.lg,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.3)',
              fontSize: 14,
            }}
          >
            {signups.length === 0 ? 'No signups yet.' : 'No results match your search.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Column headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 3fr 80px 100px 90px 180px',
                gap: spacing.md,
                padding: '8px 16px',
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              <span>Name</span>
              <span>Email</span>
              <span>Intentions</span>
              <span>Beta</span>
              <span>Source</span>
              <span>Date</span>
              <span>Actions</span>
            </div>

            {filtered.map((signup) => (
              <motion.div
                key={signup.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ borderRadius: borderRadius.md, overflow: 'hidden' }}
              >
                {/* Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 3fr 80px 100px 90px 180px',
                    gap: spacing.md,
                    padding: '13px 16px',
                    width: '100%',
                    background: expandedId === signup.id ? 'rgba(147,51,234,0.07)' : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${expandedId === signup.id ? 'rgba(147,51,234,0.25)' : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: expandedId === signup.id ? `${borderRadius.md}px ${borderRadius.md}px 0 0` : `${borderRadius.md}px`,
                    cursor: 'pointer',
                    alignItems: 'center',
                  }}
                  onClick={() => setExpandedId(expandedId === signup.id ? null : signup.id)}
                >
                  <span style={{ fontSize: 13, color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {signup.name}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {signup.email}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {signup.intentions.slice(0, 3).map((i) => (
                      <IntentionTag key={i} label={INTENTION_LABELS[i] ?? i} />
                    ))}
                    {signup.intentions.length > 3 && (
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }}>
                        +{signup.intentions.length - 3}
                      </span>
                    )}
                  </div>
                  <div>
                    {signup.is_beta_tester ? (
                      <span style={{ fontSize: 11, color: '#60a5fa', background: 'rgba(96,165,250,0.1)', padding: '2px 8px', borderRadius: 999, border: '1px solid rgba(96,165,250,0.2)' }}>
                        Beta
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>—</span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {signup.referral_source ?? '—'}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                    {formatRelative(signup.created_at)}
                  </span>
                  <ActionButton
                    signupId={signup.id}
                    currentStatus={signup.status}
                    onStatusChange={handleStatusChange}
                  />
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expandedId === signup.id && (
                    <motion.div
                      key="detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          padding: '16px 20px',
                          background: 'rgba(147,51,234,0.05)',
                          border: '1px solid rgba(147,51,234,0.2)',
                          borderTop: 'none',
                          borderRadius: `0 0 ${borderRadius.md}px ${borderRadius.md}px`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12,
                        }}
                      >
                        <div style={{ display: 'flex', gap: spacing.xl, flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Status</div>
                            <StatusBadge status={signup.status} />
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Joined</div>
                            <div style={{ fontSize: 13, color: '#fff' }}>{formatDate(signup.created_at)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>All intentions</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {signup.intentions.length > 0
                                ? signup.intentions.map((i) => <IntentionTag key={i} label={INTENTION_LABELS[i] ?? i} />)
                                : <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>None selected</span>}
                            </div>
                          </div>
                        </div>
                        {signup.message && (
                          <div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Message</div>
                            <div
                              style={{
                                fontSize: 13,
                                color: 'rgba(255,255,255,0.7)',
                                lineHeight: 1.6,
                                padding: '10px 14px',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: borderRadius.sm,
                                border: '1px solid rgba(255,255,255,0.06)',
                              }}
                            >
                              {signup.message}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        <div style={{ marginTop: spacing.xl, fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'right' }}>
          Showing {filtered.length} of {signups.length} signups
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </PageShell>
  );
}

export default function AdminWaitlistPage() {
  return (
    <SuperAdminGate>
      <WaitlistDashboard />
    </SuperAdminGate>
  );
}
