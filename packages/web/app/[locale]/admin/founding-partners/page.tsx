'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageShell, SuperAdminGate } from '@/components';
import { spacing, borderRadius } from '@/theme';
import {
  RefreshCw,
  Search,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { formatDate, formatDateRelative } from '@waqup/shared/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface FoundingPartnerInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  interest: string;
  referral_source: string | null;
  message: string | null;
  status: 'pending' | 'contacted' | 'qualified' | 'rejected';
  created_at: string;
}

type StatusFilter = 'all' | 'pending' | 'contacted' | 'qualified' | 'rejected';

// ── Helpers ───────────────────────────────────────────────────────────────────

const INTEREST_LABELS: Record<string, string> = {
  seed: 'Seed',
  production: 'Production Partner',
  marketing: 'Marketing Partner',
  promotion: 'Promotion',
  influencer: 'Influencer',
  'content-creator': 'Content Creator',
  other: 'Other',
};

function StatusBadge({ status }: { status: FoundingPartnerInquiry['status'] }) {
  const map: Record<string, { bg: string; color: string }> = {
    pending: { bg: 'rgba(250,204,21,0.12)', color: '#fbbf24' },
    contacted: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
    qualified: { bg: 'rgba(52,211,153,0.12)', color: '#34d399' },
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
        padding: spacing.lg,
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

// ── Status update dropdown ─────────────────────────────────────────────────────

function StatusDropdown({
  inquiryId,
  currentStatus,
  onStatusChange,
}: {
  inquiryId: string;
  currentStatus: FoundingPartnerInquiry['status'];
  onStatusChange: (id: string, status: FoundingPartnerInquiry['status']) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open]);

  const STATUSES: FoundingPartnerInquiry['status'][] = ['pending', 'contacted', 'qualified', 'rejected'];

  const doUpdate = async (status: FoundingPartnerInquiry['status']) => {
    setBusy(true);
    setOpen(false);
    try {
      const res = await fetch(`/api/admin/investors/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        onStatusChange(inquiryId, status);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        disabled={busy}
        title="Change status"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '5px 12px',
          borderRadius: borderRadius.md,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 11,
          cursor: busy ? 'not-allowed' : 'pointer',
          opacity: busy ? 0.5 : 1,
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        <StatusBadge status={currentStatus} />
        <ChevronDown size={12} />
      </button>
      {open && (
        <div
          role="menu"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            marginTop: 4,
            zIndex: 10,
            minWidth: 140,
            padding: 4,
            borderRadius: borderRadius.md,
            background: 'rgba(15,5,35,0.98)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void doUpdate(s)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: borderRadius.sm,
                background: currentStatus === s ? 'rgba(147,51,234,0.2)' : 'transparent',
                border: 'none',
                color: currentStatus === s ? '#A855F7' : 'rgba(255,255,255,0.8)',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
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

function FoundingPartnersDashboard() {
  const [inquiries, setInquiries] = useState<FoundingPartnerInquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch('/api/admin/investors', { credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data.error ?? 'Failed to load inquiries.');
        return;
      }
      setInquiries(data.inquiries ?? []);
    } catch {
      setFetchError('Network error.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInquiries();
  }, [fetchInquiries]);

  const handleStatusChange = (id: string, status: FoundingPartnerInquiry['status']) => {
    setInquiries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
  };

  // ── Derived stats ──────────────────────────────────────────────────────────

  const pendingCount = inquiries.filter((q) => q.status === 'pending').length;
  const contactedCount = inquiries.filter((q) => q.status === 'contacted').length;
  const qualifiedCount = inquiries.filter((q) => q.status === 'qualified').length;
  const rejectedCount = inquiries.filter((q) => q.status === 'rejected').length;

  // ── Filtered list ──────────────────────────────────────────────────────────

  const filtered = inquiries
    .filter((q) => {
      if (statusFilter !== 'all' && q.status !== statusFilter) return false;
      if (!search) return true;
      const qq = search.toLowerCase();
      return (
        q.name.toLowerCase().includes(qq) ||
        q.email.toLowerCase().includes(qq) ||
        (q.company?.toLowerCase().includes(qq) ?? false)
      );
    })
    .sort((a, b) => {
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      return sortAsc ? ta - tb : tb - ta;
    });

  return (
    <PageShell intensity="light" maxWidth={1100} allowDocumentScroll>
      <div style={{ paddingTop: spacing.xxxl, paddingBottom: spacing.xxxl }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xxl, flexWrap: 'wrap', gap: spacing.md }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(147,51,234,0.8)', marginBottom: 6 }}>
              Admin
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 300, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
              Founding Partners
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
              onClick={() => void fetchInquiries()}
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
          <StatCard label="Total inquiries" value={inquiries.length} icon={Users} accent="#9333EA" />
          <StatCard label="Pending" value={pendingCount} icon={Clock} accent="#fbbf24" />
          <StatCard label="Contacted" value={contactedCount} icon={MessageCircle} accent="#60a5fa" />
          <StatCard label="Qualified" value={qualifiedCount} icon={CheckCircle} accent="#34d399" />
          <StatCard label="Rejected" value={rejectedCount} icon={XCircle} accent="#ef4444" />
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: spacing.lg, flexWrap: 'wrap' }}>
          <FilterTab label="All" count={inquiries.length} active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
          <FilterTab label="Pending" count={pendingCount} active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')} />
          <FilterTab label="Contacted" count={contactedCount} active={statusFilter === 'contacted'} onClick={() => setStatusFilter('contacted')} />
          <FilterTab label="Qualified" count={qualifiedCount} active={statusFilter === 'qualified'} onClick={() => setStatusFilter('qualified')} />
          <FilterTab label="Rejected" count={rejectedCount} active={statusFilter === 'rejected'} onClick={() => setStatusFilter('rejected')} />
        </div>

        {/* Search + sort */}
        <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.lg, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 200 }}>
            <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by name, email, or company…"
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
            {inquiries.length === 0 ? 'No inquiries yet.' : 'No results match your search.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Column headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1.5fr 1fr 90px 160px',
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
              <span>Interest</span>
              <span>Company</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            {filtered.map((inquiry) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ borderRadius: borderRadius.md, overflow: 'hidden' }}
              >
                {/* Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1.5fr 1fr 90px 160px',
                    gap: spacing.md,
                    padding: '13px 16px',
                    width: '100%',
                    background: expandedId === inquiry.id ? 'rgba(147,51,234,0.07)' : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${expandedId === inquiry.id ? 'rgba(147,51,234,0.25)' : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: expandedId === inquiry.id ? `${borderRadius.md}px ${borderRadius.md}px 0 0` : `${borderRadius.md}px`,
                    cursor: 'pointer',
                    alignItems: 'center',
                  }}
                  onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                >
                  <span style={{ fontSize: 13, color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inquiry.name}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inquiry.email}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {INTEREST_LABELS[inquiry.interest] ?? inquiry.interest}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inquiry.company ?? '—'}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                    {formatDateRelative(inquiry.created_at, { compact: true })}
                  </span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown
                      inquiryId={inquiry.id}
                      currentStatus={inquiry.status}
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expandedId === inquiry.id && (
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
                            <StatusBadge status={inquiry.status} />
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Submitted</div>
                            <div style={{ fontSize: 13, color: '#fff' }}>{formatDate(inquiry.created_at)}</div>
                          </div>
                          {inquiry.phone && (
                            <div>
                              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Phone</div>
                              <div style={{ fontSize: 13, color: '#fff' }}>{inquiry.phone}</div>
                            </div>
                          )}
                          {inquiry.referral_source && (
                            <div>
                              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Referral</div>
                              <div style={{ fontSize: 13, color: '#fff' }}>{inquiry.referral_source}</div>
                            </div>
                          )}
                        </div>
                        {inquiry.message && (
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
                              {inquiry.message}
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
          Showing {filtered.length} of {inquiries.length} inquiries
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

export default function AdminFoundingPartnersPage() {
  return (
    <SuperAdminGate>
      <FoundingPartnersDashboard />
    </SuperAdminGate>
  );
}
