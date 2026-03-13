# Forms, Automation & Email Audit — waQup

**Date**: 2026-03-13  
**Purpose**: Full list of all forms that need proper automation and email notifications (user confirmation + internal team notification). Target: n8n for automation.

---

## Summary

| # | Form | API / Target | User Email | Team Email | Notes |
|---|------|--------------|------------|------------|-------|
| 1 | Waitlist (full) | `POST /api/waitlist` | ❌ | ❌ | Multi-step, `waitlist_signups` |
| 2 | Waitlist CTA (inline) | `POST /api/waitlist` | ❌ | ❌ | Email-only, same table |
| 3 | Founding Members (Join) | `POST /api/founding-members` | ❌ | ❌ | `waitlist_signups` + `is_founding_member` |
| 4 | Investor Contact | `POST /api/investors/contact` | ❌ | ❌ | `investor_inquiries` |
| 5 | Creator Proposal | `POST /api/marketplace/proposals` | ❌ | ❌ | `creator_proposals` |
| 6 | Feedback (Help) | `POST /api/feedback` | ❌ | ❌ | `feedback` + ClickUp |
| 7 | For Teachers | `POST /api/waitlist` | ❌ | ❌ | Role-specific waitlist |
| 8 | For Coaches | `POST /api/waitlist` | ❌ | ❌ | Role-specific waitlist |
| 9 | For Creators | `POST /api/waitlist` | ❌ | ❌ | Role-specific waitlist |
| 10 | For Studios | `POST /api/waitlist` | ❌ | ❌ | Role-specific waitlist |
| 11 | Signup (Auth) | Supabase Auth | ✅ (Supabase) | ❌ | Built-in verification |
| 12 | Forgot Password | Supabase Auth | ✅ (Supabase) | ❌ | Built-in reset link |

---

## 1. Waitlist (Full Form)

| Field | Value |
|-------|-------|
| **Page** | `/waitlist` |
| **API** | `POST /api/waitlist` |
| **Table** | `waitlist_signups` |
| **Fields** | `name`, `email`, `intentions[]`, `is_beta_tester`, `referral_source`, `message` |
| **Triggers** | User submits multi-step form (3 steps) |

**Automation needed**:
- [ ] **User**: Confirmation email — "You're on the list! Here's what happens next…"
- [ ] **Team**: Internal notification — "New waitlist signup: {name}, {email}, intentions, beta flag"

---

## 2. Waitlist CTA (Inline / Banner)

| Field | Value |
|-------|-------|
| **Locations** | Landing, Launch, How-it-works, For-professionals, footer, etc. |
| **Component** | `WaitlistCTA` (inline or banner variant) |
| **API** | `POST /api/waitlist` |
| **Table** | `waitlist_signups` |
| **Fields** | `name` (derived from email), `email`, `intentions: []` |

**Automation needed**:
- [ ] Same as #1 — user confirmation + team notification
- Can reuse same n8n workflow as full waitlist (same API, same table)

---

## 3. Founding Members (Join Page)

| Field | Value |
|-------|-------|
| **Page** | `/join` |
| **API** | `POST /api/founding-members` |
| **Table** | `waitlist_signups` (with `is_founding_member: true`) |
| **Fields** | `name`, `email` |

**Automation needed**:
- [ ] **User**: Confirmation email — "You're in! Founding member perks, next steps, activation link info"
- [ ] **Team**: Internal notification — "New founding member claim: {name}, {email}"

**Note**: Success message says "We'll send your activation link to {email}" — currently no email is sent. This is a gap.

---

## 4. Investor Contact (Founding Partner)

| Field | Value |
|-------|-------|
| **Page** | `/investors` |
| **API** | `POST /api/investors/contact` |
| **Table** | `investor_inquiries` |
| **Fields** | `name`, `email`, `interest`, `phone`, `company`, `referral_source`, `message` |

**Automation needed**:
- [ ] **User**: Confirmation email — "We received your inquiry. We'll be in touch."
- [ ] **Team**: Internal notification — "New investor inquiry: {name}, {email}, interest, message" (to `legal@waqup.com` or ops email)

---

## 5. Creator Proposal (CreatorGate)

| Field | Value |
|-------|-------|
| **Location** | Marketplace creator gate (when user hasn't unlocked Creator Marketplace) |
| **Component** | `CreatorGate` → `ProposalForm` |
| **API** | `POST /api/marketplace/proposals` |
| **Table** | `creator_proposals` |
| **Fields** | `name`, `email`, `contentTypes[]`, `bio`, `instagram`, `tiktok` |

**Automation needed**:
- [ ] **User**: Confirmation email — "We received your creator proposal. We'll review and get back to you."
- [ ] **Team**: Internal notification — "New creator proposal: {name}, {email}, content types, bio, social handles"

---

## 6. Feedback (Help & Feedback)

| Field | Value |
|-------|-------|
| **Page** | `/sanctuary/help` |
| **API** | `POST /api/feedback` |
| **Table** | `feedback` |
| **External** | ClickUp (if `CLICKUP_API_KEY` + `CLICKUP_FEEDBACK_LIST_ID` set) |
| **Fields** | `message`, `category`, `platform`, `browser`, `os`, `viewport`, `url`, `device` |

**Automation needed**:
- [ ] **User**: Optional confirmation — "Thanks for your feedback. We read every message."
- [ ] **Team**: Internal notification — "New feedback [{category}]: {message} — from {url}" (or rely on ClickUp; n8n could also listen to DB/webhook)

---

## 7–10. Role-Specific Waitlist Forms (For Teachers, Coaches, Creators, Studios)

| Form | Page | API | Notes |
|------|------|-----|-------|
| For Teachers | `/for-teachers` | `POST /api/waitlist` | Sends `{ email, role: 'teacher', source: 'for-teachers' }` — API ignores `role`/`source`, requires `name` (may fail) |
| For Coaches | `/for-coaches` | `POST /api/waitlist` | Same pattern |
| For Creators | `/for-creators` | `POST /api/waitlist` | Same pattern |
| For Studios | `/for-studios` | `POST /api/waitlist` | Same pattern |

**Automation needed**:
- [ ] Same as #1/#2 — user confirmation + team notification
- [ ] **Fix**: Ensure these forms send `name` (or API accepts optional name for role-specific flows)

---

## 11. Signup (Auth)

| Field | Value |
|-------|-------|
| **Pages** | `/signup` (web), `SignupScreen` (mobile) |
| **Provider** | Supabase Auth |
| **Flow** | Email + password → Supabase sends verification email |

**Automation**:
- ✅ **User**: Supabase sends verification email (built-in)
- [ ] **Team**: Optional — "New signup: {email}" (n8n can listen to Supabase Auth webhook or `auth.users` insert)

---

## 12. Forgot Password

| Field | Value |
|-------|-------|
| **Provider** | Supabase Auth |
| **Flow** | Email → Supabase sends reset link |

**Automation**:
- ✅ **User**: Supabase sends reset email (built-in)
- No team notification needed

---

## Non-Form Flows (No User Input Form)

| Flow | Notes |
|------|-------|
| Login | No form submission to our backend; Supabase handles |
| Account delete | `POST /api/account/delete` — user-initiated; consider confirmation email before/after |
| Stripe checkout | Webhook-driven; no form |
| Content creation | Conversational flow, not traditional form |

---

## Recommended Team Email Addresses

From `packages/web/src/config/legal.ts`:
- `legal@waqup.com` — privacy/legal
- `support@waqup.com` — support/general

**Suggested**:
- **Waitlist / Founding / Creator / Role-specific**: `ops@waqup.com` or `hello@waqup.com`
- **Investor inquiries**: `legal@waqup.com` or dedicated `investors@waqup.com`
- **Feedback**: `support@waqup.com` or `feedback@waqup.com`

---

## n8n Integration Strategy

### Auth flows (Signup, Forgot Password) — different from custom forms

**Signup and Forgot Password are NOT handled by our API routes.** Supabase Auth processes them directly. Our Next.js API never receives these requests.

| Flow | User email | Team notification | Best approach |
|------|------------|-------------------|---------------|
| **Signup verification** | Supabase sends (or Send Email Hook) | — | Keep Supabase built-in; do NOT route through n8n |
| **Password reset** | Supabase sends (or Send Email Hook) | — | Same |
| **"New user signed up"** (team) | — | ✅ | Supabase DB Webhook on `auth.users` INSERT → n8n |

**Why not n8n for auth emails?** Supabase Auth Hooks (Send Email) are purpose-built. Routing signup/reset through n8n adds latency and failure points to a critical path. Use Supabase’s native flow or a Send Email Hook (Edge Function + Resend) for user-facing auth emails.

---

### Custom forms (Waitlist, Founding, Investor, Creator, Feedback)

Two viable options:

#### Option A: Supabase Database Webhooks → n8n
- Configure webhooks in Supabase Dashboard on INSERT for:
  - `waitlist_signups`
  - `investor_inquiries`
  - `creator_proposals`
  - `feedback`
- n8n Webhook node receives payload → sends user confirmation + team email
- **Pros**: No code changes, single source of truth, works for any insert path
- **Cons**: Less control over payload shape, can’t easily skip in dev

#### Option B: API route calls n8n webhook
- After successful insert in each API route, `fetch(N8N_WEBHOOK_URL, ...)` with payload
- **Pros**: Full control, can add dev guards, custom payload
- **Cons**: Requires code changes in each route

**Recommendation**: **Option A (Database Webhooks)** for custom forms — simpler, no app code changes, aligns with Supabase’s design. Use Option B only if you need custom logic before triggering.

---

### Option C: Polling (avoid)
- n8n cron polls DB for new rows
- Higher latency, more load, not recommended

---

## Will they all work with n8n?

| Form / flow | n8n via API webhook? | n8n via DB webhook? | Notes |
|-------------|----------------------|----------------------|-------|
| Waitlist, Founding, Investor, Creator, Feedback | ✅ Yes | ✅ Yes | Either approach works |
| Signup (user verification email) | ❌ N/A | ❌ No | Supabase Auth sends it; don’t route through n8n |
| Forgot password (reset email) | ❌ N/A | ❌ No | Same as signup |
| "New user signed up" (team) | ❌ N/A | ✅ Yes | DB webhook on `auth.users` INSERT |

**Summary**: Custom forms work well with n8n (API or DB webhook). Auth emails (signup, password reset) should stay in Supabase; use n8n only for team notifications (e.g. new signup) via a DB webhook on `auth.users`.

---

## Checklist for Implementation

### Phase 1: User Confirmation Emails
- [ ] Waitlist (full + CTA)
- [ ] Founding Members
- [ ] Investor Contact
- [ ] Creator Proposal
- [ ] Feedback (optional)
- [ ] Role-specific waitlist (For Teachers, Coaches, Creators, Studios)

### Phase 2: Team Notification Emails
- [ ] Waitlist → ops/hello
- [ ] Founding Members → ops/hello
- [ ] Investor Contact → legal/investors
- [ ] Creator Proposal → ops/creators
- [ ] Feedback → support (or rely on ClickUp)
- [ ] New signup (optional) → ops

### Phase 3: n8n Workflows
- [ ] Create n8n workflow(s) for each form type
- [ ] Configure email provider (Resend, SendGrid, SMTP, etc.)
- [ ] Add webhook endpoints to API routes
- [ ] Test end-to-end for each form

---

## Data Flow (Current vs Target)

```
CURRENT:
User submits form → API → DB → (nothing) → User sees success UI

TARGET:
User submits form → API → DB → n8n webhook → {
  User: confirmation email
  Team: internal notification email
}
```

---

*Last updated: 2026-03-13*
