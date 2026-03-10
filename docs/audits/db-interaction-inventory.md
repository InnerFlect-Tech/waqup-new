# Database Interaction Inventory — waQup

**Date**: 2026-03-10  
**Purpose**: Single source of truth for every DB touchpoint. Use for audit, onboarding, and drift detection.

---

## 1. Supabase client setup

| File | Client type | Notes |
|------|-------------|-------|
| `packages/shared/src/services/supabase/client.ts` | `createClient` | Shared factory; profiles select for connection test |
| `packages/mobile/src/services/supabase.ts` | `createSupabaseClient` (from shared) | Mobile client with AsyncStorage |
| `packages/web/src/lib/supabase.ts` | `createBrowserClient` (@supabase/ssr) | Browser client |
| `packages/web/src/lib/supabase-server.ts` | `createServerClient` + `createClient` | Server client + token-based client |
| `packages/web/src/lib/stripe.ts` | `createClient` (service role) | Admin client for webhooks |

---

## 2. Shared services (packages/shared/src/services)

| File | Domain | Operation | Tables |
|------|--------|-----------|--------|
| `supabase/content.ts` | Content | select, insert, update, delete | content_items, practice_sessions |
| `supabase/credits.ts` | Credits | RPC, select | get_credit_balance, credit_transactions |
| `supabase/progress.ts` | Progress | RPC, select, insert | get_progress_stats, practice_sessions, reflection_entries |
| `supabase/reminders.ts` | Reminders | CRUD | user_reminders |
| `supabase/voices.ts` | Voices | CRUD | user_voices |
| `supabase/storage.ts` | Storage | upload, signedUrl | bucket `audio` |
| `supabase/client.ts` | Health | select | profiles (connection test) |

---

## 3. API routes (packages/web/app/api)

| Route | Operation | Table(s) / RPC |
|-------|-----------|-----------------|
| account/delete | Auth | admin.auth.admin.deleteUser |
| admin/content | select | profiles, content_items |
| admin/schema | select | profiles + many tables |
| admin/users | select | profiles, subscriptions, credit_transactions |
| admin/waitlist/[id] | select, update | profiles, waitlist_signups |
| ai/agent | RPC | deduct_credits, get_credit_balance |
| ai/render | select, update, storage | content_items, audio bucket, deduct_credits |
| ai/tts | RPC | deduct_credits, get_credit_balance |
| conversation | RPC | deduct_credits, get_credit_balance |
| credits/welcome | select, RPC | credit_transactions, add_credits |
| feedback | insert | feedback |
| founding-members | select, upsert | waitlist_signups |
| founding-members/remaining | select | waitlist_signups |
| generate-script | RPC | deduct_credits, get_credit_balance |
| health | select | content_items |
| investors/contact | insert | investor_inquiries |
| marketplace/items | select, insert | marketplace_items, content_items |
| marketplace/proposals | select, insert | creator_proposals, profiles |
| marketplace/share | RPC | record_share_and_award_credit |
| orb/chat | RPC, select | deduct_credits, get_credit_balance, user_profiles, content_items |
| orb/config | select, RPC | orb_config, user_orb_settings, get_credit_balance |
| oracle/* | RPC, select, insert | oracle_sessions, deduct_credits, consume_oracle_reply |
| progress/stats | (shared) | get_progress_stats |
| reflection | (shared) | reflection_entries |
| stripe/* | various | stripe_webhook_events, subscriptions, profiles |
| voice/* | select, update, upsert | profiles |
| voices/* | select, insert, update, delete, RPC | user_voices, credit_transactions |
| waitlist | upsert, select | waitlist_signups, profiles |
| waitlist/count | select | waitlist_signups |
| webhooks/revenuecat | RPC | grant_iap_credits |

---

## 4. RPCs used

| RPC | Usage |
|-----|-------|
| deduct_credits | conversation, ai/agent, ai/render, ai/tts, generate-script, oracle/session, orb/chat |
| get_credit_balance | shared credits, orb/config, ai/*, oracle/session, orb/chat, voices |
| add_credits | credits/welcome, stripe/webhook |
| grant_iap_credits | webhooks/revenuecat |
| consume_oracle_reply | oracle/route, oracle/stream |
| get_progress_stats | shared progress |
| get_user_subscription | useSubscription |
| record_share_and_award_credit | marketplace/share |
| increment_play_count | marketplace/[id] page |

---

## 5. Tables referenced

| Table | Operations |
|-------|------------|
| profiles | select, update, upsert |
| content_items | select, insert, update, delete |
| content_series | select, insert, update, delete |
| content_series_items | select, update, delete |
| credit_transactions | select, insert |
| practice_sessions | select, insert |
| reflection_entries | select, insert |
| user_reminders | select, insert, update, delete |
| user_voices | select, insert, update, delete |
| user_profiles | select (Orb context) |
| user_orb_settings | select |
| orb_config | select |
| oracle_sessions | select, insert |
| waitlist_signups | select, upsert |
| stripe_webhook_events | insert, delete |
| subscriptions | select, insert, update |
| marketplace_items | select, insert, update |
| sanctuary_saves | upsert |
| creator_proposals | select, insert |
| feedback | insert |
| investor_inquiries | insert |

---

## 6. Auth for API routes

| Auth pattern | Routes | Caller |
|--------------|--------|--------|
| `getAuthenticatedUserForApi(req)` | credits/welcome, oracle/session, oracle/route, stripe/checkout, conversation, generate-script, ai/agent, ai/render | Web (cookies) + Mobile (Bearer) |
| `createSupabaseServerClient()` | Pages, other API routes | Web only (cookies) |
| Service role | stripe/webhook, founding-members, admin | Server-only |
