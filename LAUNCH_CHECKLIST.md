# waQup Launch Checklist — Going Fully Live

This checklist covers all steps needed to go from current state to fully selling. Items are ordered by dependency where possible. **Bold** items are required before taking payments.

---

## 1. Business Setup (Sole Proprietor Path)

- [ ] **Register DBA (Fictitious Business Name)** if operating as "waQup" instead of your legal name
  - File with county clerk or state office
  - Typical cost: $10–100
- [ ] **Obtain EIN** from IRS (free, online)
  - Required for Stripe, business bank account
- [ ] **Open business bank account**
  - Keep personal and business finances separate
- [ ] **Update legal config** in `packages/web/src/config/legal.ts`
  - `entityName`: Your legal entity (e.g. "waQup" or "waQup, LLC")
  - `contactEmail`: Legal/privacy inquiries
  - `supportEmail`: General support (used in footer)
  - `lastUpdated`, `privacyEffectiveDate`, `termsEffectiveDate`

---

## 2. Stripe Payment Integration

- [ ] **Stripe account** verified and in live mode
- [ ] **Environment variables** set in production:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`
  - `NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID`
  - `NEXT_PUBLIC_STRIPE_DEVOTION_PRICE_ID`
- [ ] **Webhook endpoint** configured for subscription/checkout events
  - URL: `https://your-domain.com/api/stripe/webhook` (or equivalent)
  - Events: `checkout.session.completed`, `customer.subscription.*`, etc.
- [ ] **Success/cancel URLs** point to production
- [ ] **Test full purchase flow** (subscription + one-time credits)

---

## 3. Bitcoin Payment Integration (Optional)

- [ ] Choose processor: **BitPay**, **Coinbase Commerce**, or **OpenNode**
  - All handle MSB compliance; no license needed for you
- [ ] Create merchant account with chosen processor
- [ ] Integrate API into checkout flow (web only — app stores require IAP)
- [ ] Add Bitcoin option to pricing/get-qs pages
- [ ] **Record USD value** at time of each Bitcoin payment for tax/accounting
- [ ] Update footer text: remove "Bitcoin coming soon", add "Bitcoin" to payment methods

---

## 4. Legal Documents

- [x] **Privacy Policy** — Implemented at `/privacy`
- [x] **Terms of Service** — Implemented at `/terms` (includes wellness disclaimer)
- [x] **Cookie consent** — Implemented (GDPR Consent Mode v2)
- [x] **Wellness disclaimer** — In Terms + `WellnessDisclaimer` component in sanctuary
- [ ] **Review with lawyer** (recommended before launch)
- [ ] Ensure `legal.ts` contact emails are real, monitored inboxes

---

## 5. Tax & Compliance

- [ ] **Sales tax**: Determine nexus (physical + economic) in US states
  - Register in states where required
  - Integrate tax calculation (Stripe Tax or similar) if selling digital goods
  - See `rebuild-roadmap/` and state rules for digital products
- [ ] **VAT**: If selling to EU/UK, register for One-Stop Shop (OSS) if over threshold
- [ ] **Quarterly estimated taxes** (US sole proprietor)

---

## 6. App Store / Web Deployment

### Web
- [ ] **Production deploy** (Vercel or chosen host)
- [ ] **Custom domain** configured
- [ ] **HTTPS** enabled
- [ ] **Environment variables** all set in production
- [ ] **Supabase** project in production mode

### Mobile (when ready)
- [ ] Apple Developer account ($99/year)
- [ ] Google Play Console ($25 one-time)
- [ ] In-app purchases configured (subscriptions via App Store / Play Store)
- [ ] Privacy nutrition labels / data safety forms completed
- [ ] Note: Bitcoin cannot be used for in-app purchases; only web checkout

---

## 7. Analytics & Conversion Tracking

- [ ] **GA4** measurement ID in production (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- [ ] **Conversion events** marked in GA4 Admin
  - e.g. `sign_up`, `purchase`, `begin_checkout`, `onboarding_step_completed`
- [ ] **Stripe → GA4** (optional): Send purchase events for attribution

---

## 8. Operational Readiness

- [ ] **Support email** (`support@waqup.com` or equivalent) set up and monitored
- [ ] **Legal email** (`legal@waqup.com`) for privacy/terms requests
- [ ] **Refund policy** documented (internal) and communicated in Terms
- [ ] **Data export/deletion** process defined (GDPR/CCPA compliance)
- [ ] **Error monitoring** (e.g. Sentry) for production

---

## 9. Pre-Launch Verification

- [ ] Full signup → onboarding → purchase flow works
- [ ] Password reset works
- [ ] Cookie banner appears, Accept/Decline both work
- [ ] Privacy and Terms pages load and display correctly
- [ ] Footer links work (Privacy, Terms, Contact)
- [ ] Wellness disclaimer visible in sanctuary

---

## 10. Post-Launch

- [ ] Monitor first payments
- [ ] Respond to support/legal emails within SLA
- [ ] Track analytics for conversion funnel
- [ ] Revisit LLC formation when revenue justifies it (~$30K+ annually)
- [ ] Consider liability insurance for wellness/product claims

---

## Quick Reference: Files Touched for Launch Prep

| File | Purpose |
|------|---------|
| `packages/web/src/config/legal.ts` | Entity name, contact emails, dates |
| `packages/web/app/privacy/page.tsx` | Privacy Policy |
| `packages/web/app/terms/page.tsx` | Terms of Service |
| `packages/web/src/components/legal/WellnessDisclaimer.tsx` | Sanctuary disclaimer |
| `packages/web/src/components/shared/AppLayout.tsx` | Footer links, copyright, payment note |
| `packages/web/src/components/analytics/CookieConsentBanner.tsx` | Cookie consent |

---

## Status Summary

| Category | Status |
|----------|--------|
| Legal pages (Privacy, Terms) | ✅ Implemented |
| Cookie consent | ✅ Implemented |
| Wellness disclaimer | ✅ Implemented |
| Footer / contact | ✅ Implemented |
| Stripe integration | ⏳ Verify production config |
| Bitcoin | ⏳ Not yet integrated |
| Business setup | ⏳ Pending |
| Tax registration | ⏳ Pending |
| App store listing | ⏳ Future (mobile) |

---

*Last updated: 2026-03-09*
