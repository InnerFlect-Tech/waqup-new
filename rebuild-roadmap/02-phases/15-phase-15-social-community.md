# Phase 15: Social & Community

## Overview

Phase 15 introduces the viral growth and community layer: referral system, shareable content links, creator rewards, and social discovery. These features turn waQup users into growth vectors while deepening community connection.

---

## NOW State (Analysis Against Codebase)

### What Already Exists

| Feature | Status | Location |
|---|---|---|
| Referral page UI | ✅ Complete | `packages/web/app/sanctuary/referral/page.tsx` |
| Referral code generator | ✅ Client-side | `generateReferralCode()` in referral page |
| Share Modal component | ✅ Complete | `packages/web/src/components/marketplace/ShareModal.tsx` |
| Share from content complete | ✅ Wired (this phase) | `ContentCompleteStep.tsx` |
| Referral nav link | ✅ In sidebar | `AppLayout.tsx` line 58 |
| `/api/marketplace/share` endpoint | ✅ Exists | Records shares with creator credit |
| Public play page routing | ✅ | `/play/[id]` |
| Marketplace page | ✅ | `/marketplace` |

### What Was Missing (Fixed This Phase)

1. **Share button on ContentCompleteStep** — Added Share2 button + ShareModal after creation
2. **Phase 15 documentation** — This document

### What Still Needs Backend Work (Future)

- **DB referral_codes table** — Currently code is generated client-side from email hash; not persisted to DB
- **Referral attribution webhook** — Track when a referred user completes onboarding and trigger credit grants
- **Server-side referral validation** — `/api/referral/validate?ref=CODE` route to look up referrer and grant Qs
- **Referral stats API** — Count how many friends joined, total credits earned from referrals

---

## AFTER State (Target)

### Viral Growth Loops

```
User creates content
  → Share button on completion screen ✅
  → Content gets /play/:id public URL ✅
  → Visitor lands on play page
  → "Create your own" CTA → joins with ref code
  → Both earn 10 Qs (requires DB referral table)
```

### Share Flow

1. User finishes creating content ✅
2. "Share" button opens ShareModal ✅
3. User picks platform (X, WhatsApp, Instagram, link copy) ✅
4. Share recorded via `/api/marketplace/share` ✅
5. Creator earns credits per share (requires DB implementation)

### Referral Flow

1. User visits `/sanctuary/referral` ✅
2. Unique referral link displayed ✅
3. Friend clicks link → lands on `/join?ref=CODE`
4. Friend signs up → referral attributed (requires DB)
5. Both earn 10 Qs (requires credit grant webhook)

---

## Implementation Status

### Completed ✅

- `packages/web/app/sanctuary/referral/page.tsx` — Full referral UI with copy & social share
- `packages/web/src/components/marketplace/ShareModal.tsx` — Multi-platform share modal
- `packages/web/src/components/content/ContentCompleteStep.tsx` — Share button after creation
- Navigation wired in `AppLayout.tsx`

### Easy Wins Still Available

- [ ] Add share button to `ContentListPage.tsx` on hover/actions menu
- [ ] Add referral entry point in mobile `ProfileScreen.tsx`
- [ ] `supabase/migrations/` — Add `referral_codes` table and `referral_events` table
- [ ] `/api/referral/validate` route — look up referrer, grant credits on signup

### Future (Phase 14+ Marketplace)

- Creator dashboard showing share counts
- Creator credit earnings from shares
- Community feed of popular content
- Follow/unfollow creators

---

## Database Schema Required

```sql
-- Stores one row per user's referral code
create table referral_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null unique,
  created_at timestamptz default now()
);

-- Tracks each referral signup event
create table referral_events (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references auth.users(id),
  referred_user_id uuid not null references auth.users(id),
  referral_code text not null,
  status text not null default 'pending', -- pending | completed | credited
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- RLS
alter table referral_codes enable row level security;
create policy "Users can read own referral code" on referral_codes for select using (auth.uid() = user_id);
create policy "Users can insert own referral code" on referral_codes for insert with check (auth.uid() = user_id);

alter table referral_events enable row level security;
create policy "Referrer can view own events" on referral_events for select using (auth.uid() = referrer_user_id);
```

---

## Success Metrics

- Referral page visited: > 30% of active users
- Content shared per week: > 20% of published content
- Referral conversion rate: > 15% of link clicks to signup
- Viral coefficient (K-factor): > 0.3

---

**Status**: 🟡 Partially Complete — UI done, DB persistence pending
**Priority**: High (viral growth)
**Dependencies**: Phase 14 (Marketplace) for creator rewards
