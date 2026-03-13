# Email Template Variables and Instructions

Reference for waQup's automated email system. Use this document when configuring drip sequences, newsletters, or transactional emails.

---

## A. Variable Reference

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `{{first_name}}` | string | Yes | Recipient first name | "Indias" |
| `{{email}}` | string | Yes | Recipient email | "user@example.com" |
| `{{role}}` | enum | Yes | Audience role for personalization | "investor", "creator", "teacher", "coach", "studio", "user" |
| `{{source}}` | string | No | Signup origin | "for-teachers", "waitlist", "investors" |
| `{{unsubscribe_url}}` | url | Yes | One-click unsubscribe | Required by CAN-SPAM/GDPR |
| `{{preferences_url}}` | url | No | Manage preferences | Optional |
| `{{cta_url}}` | url | No | Primary CTA destination | |
| `{{cta_text}}` | string | No | Primary button label | "Get started" |
| `{{preheader}}` | string | No | Inbox preview text (40–130 chars) | Per-email |
| `{{preheader}}` | string | No | Inbox preview text (40–130 chars) | Per-email |
| `{{headline}}` | string | No | Main heading | Per-email |
| `{{body_html}}` | html | No | Main content block | Per-email |
| `{{year}}` | number | No | Current year | 2026 |
| `{{locale}}` | string | No | Language code | "en", "de" |

---

## B. Role Definitions

Use `{{role}}` to tailor messaging and CTAs. Fallback to `"user"` when role is unknown.

| Role | Description | Messaging focus |
|------|-------------|-----------------|
| **investor** | Founding partner inquiries, pitch deck viewers | Revenue share, no equity dilution, traction |
| **creator** | Teachers, coaches, studios, marketplace creators | Monetization, content creation, share-earnings |
| **teacher** | Educators | Student practices, classroom use, personalized voice |
| **coach** | Coaches | Client practices, private sharing |
| **studio** | Studios | QR codes, savasana, nidra, breathwork |
| **user** | General waitlist / founding members | Personal practice, onboarding, product value |

---

## C. Flow Types

### Sequence (drip)

Emails 1, 2, 3… sent on a schedule (e.g. day 0, 3, 7). Each email has its own `headline`, `body_html`, `cta_url`, and `cta_text`.

**Stop conditions** (halt the sequence):

- Reply from recipient
- Purchase / conversion
- Unsubscribe
- Hard bounce

### Regular (recurring)

Newsletter, digests, product updates. Same template, different content. Typically weekly or monthly.

---

## D. Fallback Rules

| Variable | Fallback | Notes |
|----------|----------|-------|
| `{{first_name}}` | "there" | Or split from full `name` if available |
| `{{role}}` | "user" | Use generic messaging when role unknown |
| `{{unsubscribe_url}}` | — | **Must** be provided; required by law |
| `{{year}}` | Current year | Auto-populate |
| `{{locale}}` | "en" | waQup supports en, de, es, fr, pt |

---

## E. Technical Notes

### Deliverability

- **Subject lines**: Under 50 characters for better open rates
- **Preheader**: 40–130 characters (first line visible in inbox preview)
- **From name**: "waQup" or "waQup team"
- **Reply-to**: Support address (e.g. hello@waqup.app)

### Testing

Test across:

- Gmail (web, mobile)
- Outlook (desktop, web)
- Apple Mail
- Yahoo Mail
- Mobile clients (iOS Mail, Gmail app)

### Accessibility

- Maintain at least 4.5:1 contrast between text and background
- Use descriptive link text (avoid "click here")
- Ensure emails make sense with images blocked (alt text, text fallbacks)

### Template syntax

- Variable format: `{{variable_name}}`
- Conditionals: `{{#if cta_url}}...{{/if}}` and `{{#if preferences_url}}...{{/if}}` for optional CTA and preferences link (Handlebars; supported by SendGrid, Resend, Customer.io)
- Compatible with Resend, SendGrid, Amazon SES, and most ESPs

---

## F. Related Files

- **HTML template**: [`email-template.html`](./email-template.html)
- **Example with sample content**: [`email-template-example.html`](./email-template-example.html) — richer design, more color
- **waQup brand colors**: `packages/shared/src/theme/colors.ts`
- **ESP recommendation**: Resend or Postmark (see multilingual i18n update)
