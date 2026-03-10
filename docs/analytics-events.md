# waQup Analytics Event Taxonomy

Single source of truth for product analytics events. All events use GA4 naming (snake_case, &lt; 40 chars). **Never send PII** (email, name, phone) in event properties.

---

## Privacy & GDPR

- **No PII**: Never include `email`, `name`, `phone`, or similar in event properties. `user_id` is acceptable (opaque Supabase UUID).
- **Consent Mode v2**: GA4 Consent Mode defaults to `denied`; data is withheld until user accepts via CookieConsentBanner.
- **Anonymization**: All events use `user_id` for attribution; no personally identifiable data is stored in GA4 event payloads.

---

## USER

| Event | Helper | When to Fire | Properties |
|-------|--------|--------------|------------|
| `sign_up` | `Analytics.signupCompleted(method, referralCode?, userId?)` | After successful signup | `method`: 'email' \| 'google' \| 'apple' |
| `login` | `Analytics.loginCompleted(method, userId?)` | After successful login | `method` |
| `logout` | `Analytics.logoutCompleted(userId?)` | After logout | — |

---

## ONBOARDING

| Event | Helper | When to Fire | Properties |
|-------|--------|--------------|------------|
| `onboarding_step_completed` | `Analytics.onboardingStepCompleted(step, userId?)` | Each onboarding step | `step`: 'intention' \| 'profile' \| 'role' \| 'preferences' \| 'guide' \| 'guide-create' |

---

## PRODUCT

| Event | Helper | When to Fire | Properties |
|-------|--------|--------------|------------|
| `content_created` | `Analytics.contentCreated(type, mode, userId?)` | Content created (affirmation, meditation, ritual) | `content_type`, `mode`: 'form' \| 'conversation' |
| `content_played` | `Analytics.contentPlayed(contentId, type, userId?)` | User presses play | `content_id`, `content_type` |
| `content_completed` | `Analytics.contentCompleted(contentId, type, durationSeconds, userId?)` | Audio finishes | `content_id`, `content_type`, `duration_seconds` |
| `ritual_started` | `Analytics.ritualStarted(userId?)` | User enters ritual creation flow | — |
| `voice_recorded` | `Analytics.voiceRecorded(contentType, userId?)` | User finishes recording step | `content_type` |
| `ai_voice_generated` | `Analytics.aiVoiceGenerated(contentType, userId?)` | TTS completes | `content_type` |

---

## CREDITS

| Event | Helper | When to Fire | Properties |
|-------|--------|--------------|------------|
| `purchase` (credits) | `Analytics.creditsPurchased(packId, amount, currency, userId?)` | Checkout success (credits) | `item_id`, `value`, `currency`, `item_category: 'credits'` |
| `credits_spent` | `Analytics.creditsSpent(amount, contentType, userId?)` | Creation consumes credits | `amount`, `content_type` |
| `credits_low` | `Analytics.creditsLow(balance, threshold, userId?)` | Balance &lt; threshold | `balance`, `threshold` |

---

## SUBSCRIPTIONS

| Event | Helper | When to Fire | Properties |
|-------|--------|--------------|------------|
| `purchase` (subscription) | `Analytics.subscriptionStarted(planId, amount, currency, userId?)` | Checkout success (subscription) | `item_id`, `value`, `currency`, `item_category: 'subscription'` |

---

## ENGAGEMENT

| Event | Helper | When to Fire | Properties |
|-------|--------|--------------|------------|
| `share` | `Analytics.contentShared(contentId, platform, userId?)` | User shares content | `content_id`, `method`, `content_type` |
| `referral_shared` | `Analytics.referralShared(platform, userId?)` | User shares referral link | `platform` |
| `view_item` | `Analytics.marketplaceItemViewed(itemId, userId?)` | User views marketplace item | `item_id`, `item_category` |

---

## MARKETING

| Event | Helper | When to Fire | Properties |
|-------|--------|--------------|------------|
| `cta_clicked` | `Analytics.ctaClicked(ctaId, page, userId?)` | User clicks CTA | `cta_id`, `page` |
| `waitlist_joined` | `Analytics.waitlistJoined(userId?)` | Waitlist submit success | — |
| `begin_checkout` | `Analytics.paymentStarted(type, amount, currency, userId?)` | User initiates checkout | `payment_type`, `value`, `currency` |

---

## FUNNEL

| Event | Helper | When to Fire |
|-------|--------|--------------|
| `funnel_signup_started` | `Analytics.funnelSignupStarted(userId?)` | User lands on signup or clicks "Get started" |
| `funnel_signup_completed` | `Analytics.funnelSignupCompleted(method, userId?)` | Alias for sign_up at funnel level |
| `funnel_first_ritual` | `Analytics.funnelFirstRitual(contentId, userId?)` | First ritual created |
| `funnel_paid_conversion` | `Analytics.funnelPaidConversion(type, value?, userId?)` | First purchase (credits or subscription) |

---

## ADMIN

| Event | Helper | When to Fire | Properties |
|-------|--------|--------------|------------|
| `admin_page_accessed` | `Analytics.adminPageAccessed(page, userId?)` | Authorized user opens admin page | `page` |

---

## SESSION & ERRORS

| Event | Helper | When to Fire |
|-------|--------|--------------|
| `session_start` | `Analytics.sessionStarted(userId?)` | Authenticated session begins |
| `app_error` | `Analytics.errorOccurred(errorCode, page)` | User-facing error |

---

## GA4 Mapping

- `sign_up` → GA4 recommended (mark as conversion)
- `login` → GA4 recommended
- `purchase` → GA4 recommended ecommerce (mark as conversion)
- `begin_checkout` → GA4 recommended ecommerce
- `share` → GA4 recommended
- `view_item` → GA4 recommended ecommerce

Mark conversions in GA4 Admin → Events → "Mark as conversion".
