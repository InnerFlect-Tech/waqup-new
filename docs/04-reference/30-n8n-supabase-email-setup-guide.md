# n8n + Supabase Email Automation — Complete Setup Guide

**For**: John (and anyone setting up form automation)  
**Last updated**: 2026-03-13  
**Purpose**: Single document explaining how to configure Supabase Database Webhooks and n8n workflows for form submission emails (user confirmation + team notification). **All email design, HTML, and copy live in one place** (see [Email templates](#part-3-email-templates-single-source-of-truth)).

---

## Table of contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Part 1: Supabase Database Webhooks](#part-1-supabase-database-webhooks)
4. [Part 2: n8n Workflows](#part-2-n8n-workflows)
5. [Part 3: Email templates (single source of truth)](#part-3-email-templates-single-source-of-truth)
6. [Payload reference](#payload-reference)
7. [Troubleshooting](#troubleshooting)

---

## Overview

When a user submits a form (waitlist, founding member, investor contact, creator proposal, feedback), the data is saved to Supabase. We want to:

1. **Send a confirmation email to the user** — "We received your submission."
2. **Send a notification email to the team** — "New submission: [details]."

We use **Supabase Database Webhooks** to trigger **n8n** when a row is inserted. n8n then sends both emails.

**Important**: Signup and Forgot Password emails are handled by Supabase Auth directly — do not route those through n8n. This guide covers only the custom forms.

---

## Architecture

```
User submits form
       ↓
Next.js API → Supabase (INSERT row)
       ↓
Supabase Database Webhook fires (async)
       ↓
n8n Webhook node receives payload
       ↓
n8n: IF table = X THEN
  → Load email template from single source
  → Send user confirmation email
  → Send team notification email
```

**Tables that trigger webhooks**:

| Table | Schema | Forms |
|-------|--------|-------|
| `waitlist_signups` | `public` | Waitlist (full + CTA), Founding Members, For Teachers/Coaches/Creators/Studios |
| `investor_inquiries` | `public` | Investor contact |
| `creator_proposals` | `public` | Creator proposal |
| `feedback` | `public` | Help & Feedback |
| `auth.users` | `auth` | New user signup (team notification only) |

---

## Part 1: Supabase Database Webhooks

### Prerequisites

- Supabase project (waQup production)
- n8n instance running (cloud or self-hosted)
- n8n Webhook URLs for each workflow (you’ll create these in Part 2 first)

### Step 1: Open Database Webhooks

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select the waQup project
3. In the left sidebar: **Database** → **Webhooks**
   - Or: **Project Settings** → **Integrations** → **Webhooks** (path may vary by Supabase version)
   - Direct link pattern: `https://supabase.com/dashboard/project/<PROJECT_ID>/database/hooks`

### Step 2: Create a webhook for each table

Create **5 webhooks** (one per table). For each:

1. Click **Create a new hook** (or **New webhook**)
2. Fill in:

| Field | Value |
|-------|-------|
| **Name** | Descriptive, e.g. `waitlist_signups → n8n` |
| **Table** | Select schema + table (e.g. `public.waitlist_signups`) |
| **Events** | Check **Insert** (and optionally Update if needed) |
| **Type** | HTTP |
| **Method** | POST |
| **URL** | Your n8n webhook URL (see Part 2) |
| **Headers** | `Content-Type: application/json` (usually default) |

3. Click **Create**

### Webhooks to create

| # | Name | Schema | Table | Events | n8n URL (example) |
|---|------|--------|-------|--------|--------------------|
| 1 | `waitlist_signups → n8n` | `public` | `waitlist_signups` | Insert | `https://your-n8n.com/webhook/waqup-forms` |
| 2 | `investor_inquiries → n8n` | `public` | `investor_inquiries` | Insert | `https://your-n8n.com/webhook/waqup-forms` |
| 3 | `creator_proposals → n8n` | `public` | `creator_proposals` | Insert | `https://your-n8n.com/webhook/waqup-forms` |
| 4 | `feedback → n8n` | `public` | `feedback` | Insert | `https://your-n8n.com/webhook/waqup-forms` |
| 5 | `auth_users → n8n` | `auth` | `users` | Insert | `https://your-n8n.com/webhook/waqup-new-signup` |

**Note**: You can use one n8n webhook URL for all form tables and branch inside n8n by `table` in the payload. Or use separate URLs per table — your choice.

### Step 3: Verify

- Insert a test row in each table (via Supabase Table Editor or your app)
- Check n8n **Executions** to see if the webhook fired
- Check Supabase: **Database** → **Extensions** → `pg_net` logs, or query `net._http_response` for webhook delivery status

### Local development

If running Supabase locally, the webhook URL must be reachable from the Supabase Docker container:

- Use `http://host.docker.internal:5678/webhook/...` if n8n runs on port 5678 on your host
- Or use a tunnel (ngrok, cloudflared) to expose your local n8n

---

## Part 2: n8n Workflows

### Prerequisites

- n8n instance (cloud or self-hosted)
- Email credentials in n8n (Resend, SendGrid, Gmail, or SMTP)
- Access to the email template folder (see Part 3)

### Option A: One workflow, multiple tables (recommended)

One webhook receives all form payloads. Use a **Switch** or **IF** node to branch by `table`.

### Step 1: Create the workflow

1. In n8n: **Workflows** → **Add workflow**
2. Name it: `waQup Form Emails`

### Step 2: Add Webhook trigger

1. Add node: **Webhook**
2. Configure:
   - **Webhook URLs**: Production (and Test if needed)
   - **HTTP Method**: POST
   - **Path**: `waqup-forms` (or similar)
   - **Response Mode**: "When last node finishes" or "Immediately" (faster response to Supabase)
3. Copy the **Production URL** — this is what you put in Supabase
4. Activate the workflow (toggle **Active**)

### Step 3: Add Switch node (route by table)

1. Add node: **Switch**
2. Connect: Webhook → Switch
3. Configure **Rules**:
   - Rule 1: `{{ $json.body.table }}` equals `waitlist_signups` → output 1
   - Rule 2: `{{ $json.body.table }}` equals `investor_inquiries` → output 2
   - Rule 3: `{{ $json.body.table }}` equals `creator_proposals` → output 3
   - Rule 4: `{{ $json.body.table }}` equals `feedback` → output 4
   - Fallback: for unknown tables

**Note**: Supabase sends the payload in `body`. The structure is `{ type, table, schema, record, old_record }`. Use `$json.body` or `$json` depending on how n8n parses the request.

### Step 4: Add email logic per branch

For each branch (waitlist, investor, creator, feedback):

1. **Set node** (optional): Extract `record` into cleaner variables, e.g. `email`, `name`, etc.
2. **Send Email node** (user confirmation):
   - To: `{{ $json.record.email }}` (or `$json.body.record.email`)
   - Subject: From template (see Part 3)
   - HTML: From template (see Part 3)
3. **Send Email node** (team notification):
   - To: Team email (e.g. `ops@waqup.com`, `hello@waqup.com`)
   - Subject: e.g. `[waQup] New {{ table }} submission`
   - Body: Summary of the record (name, email, key fields)

### Step 5: Separate workflow for new signups (optional)

1. Create workflow: `waQup New Signup Notification`
2. Webhook path: `waqup-new-signup`
3. Trigger: Supabase webhook on `auth.users` INSERT
4. Logic: Send one email to team: "New user signed up: {email}"

### Step 6: Configure email credentials

1. **Credentials** → **Add credential** → choose your provider (Resend, SendGrid, Gmail, SMTP)
2. In each **Send Email** node, select this credential
3. Set **From** address (e.g. `hello@waqup.com` or `noreply@waqup.com`)

---

## Part 3: Email templates (single source of truth)

**Rule**: All email design, HTML, and copy are defined in **one place** — the `email-templates/` folder in this repo. n8n workflows load from here or stay in sync manually.

### Folder structure

```
waqup-new/
  email-templates/
    README.md           # Usage notes, sync instructions
    base.css           # Shared design tokens (canonical source for colors, fonts)
    subjects.json      # Email subject lines for each type
    waitlist-confirmation.html
    founding-confirmation.html
    investor-confirmation.html
    creator-confirmation.html
    feedback-confirmation.html
    team-notification.html   # Generic template for internal emails
```

All templates are self-contained HTML with inlined styles (for email client compatibility). `base.css` is the canonical design source — when you change colors or fonts, update `base.css` and propagate to the inline `<style>` blocks in each template.

### Base layout and styles

**`base.css`** — shared design tokens:

```css
/* waQup email base — single source for all transactional emails */
:root {
  --color-bg: #0f0a1a;
  --color-surface: rgba(255,255,255,0.05);
  --color-text: #f5f5f5;
  --color-text-muted: #a0a0a0;
  --color-accent: #a855f7;
  --color-accent-secondary: #c084fc;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --radius: 12px;
  --max-width: 480px;
}
body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); margin: 0; padding: 24px; }
.container { max-width: var(--max-width); margin: 0 auto; }
.card { background: var(--color-surface); border-radius: var(--radius); padding: 24px; border: 1px solid rgba(255,255,255,0.1); }
h1 { font-size: 24px; font-weight: 600; margin: 0 0 16px; }
p { margin: 0 0 12px; line-height: 1.6; color: var(--color-text-muted); }
.accent { color: var(--color-accent); }
.footer { margin-top: 32px; font-size: 12px; color: var(--color-text-muted); }
```

**`base-layout.html`** — shared wrapper (conceptual):

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>{{BASE_CSS}}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      {{CONTENT}}
    </div>
    <div class="footer">
      waQup · {{SUPPORT_LINK}}
    </div>
  </div>
</body>
</html>
```

### Per-type templates

Each template uses the base layout and defines only the inner `{{CONTENT}}` and subject line. Variables in `{{CURLY}}` are replaced by n8n (e.g. via Code node or expression).

**`waitlist-confirmation.html`**:

```html
<h1>You're on the list</h1>
<p>Hi {{name}},</p>
<p>Thanks for joining the waQup waitlist. We'll reach out when we're ready for you.</p>
<p>In the meantime, follow us for updates.</p>
<p class="accent">— The waQup team</p>
```

**Subject**: `You're on the waQup waitlist`

---

**`founding-confirmation.html`**:

```html
<h1>You're in, {{name}}</h1>
<p>Welcome to the founding circle. We'll send your activation link to <strong>{{email}}</strong> — check your inbox.</p>
<p>Your founding member perks:</p>
<ul>
  <li>50 credits on activation</li>
  <li>Founding Member badge — permanent</li>
  <li>1 month free, then €6.99/month forever</li>
</ul>
<p class="accent">— The waQup team</p>
```

**Subject**: `Welcome to waQup Founding Members`

---

**`investor-confirmation.html`**:

```html
<h1>We received your inquiry</h1>
<p>Hi {{name}},</p>
<p>Thanks for reaching out. We'll review your message and get back to you soon.</p>
<p class="accent">— The waQup team</p>
```

**Subject**: `We received your waQup inquiry`

---

**`creator-confirmation.html`**:

```html
<h1>We received your creator proposal</h1>
<p>Hi {{name}},</p>
<p>Thanks for your interest in the waQup Creator Marketplace. We'll review your proposal and be in touch.</p>
<p class="accent">— The waQup team</p>
```

**Subject**: `We received your waQup creator proposal`

---

**`feedback-confirmation.html`**:

```html
<h1>Thanks for your feedback</h1>
<p>We read every message. Your input helps us improve waQup.</p>
<p class="accent">— The waQup team</p>
```

**Subject**: `Thanks for your feedback — waQup`

---

**`team-notification.html`** (internal, plain text or simple HTML):

```html
<h2>New {{table}} submission</h2>
<pre>{{recordSummary}}</pre>
<p><small>Received at {{timestamp}}</small></p>
```

**Subject**: `[waQup] New {{table}} — {{name}}`

### How n8n uses the templates

**Option 1: Store in n8n, sync from repo**

- Copy the HTML from `email-templates/*.html` into n8n **HTML** or **Code** nodes
- When you change a template in the repo, update the corresponding n8n node
- Document in `email-templates/README.md`: "Template changes must be synced to n8n"

**Option 2: Fetch from URL (if templates are served)**

- Add an API route or static route in the app: `/api/email-templates/[name]`
- n8n uses **HTTP Request** to fetch the template, then a **Code** node to substitute variables
- Ensures n8n always uses the latest template from the repo

**Option 3: Code node with embedded template**

- In n8n, use a **Code** node that contains the template string (copied from repo)
- Replace `{{name}}`, `{{email}}`, etc. with `$input.item.json.record.name`, etc.
- Simpler but requires manual sync when templates change

**Recommended for waQup**: Option 1 or 3 — keep templates in `email-templates/` as the source of truth, and sync to n8n when you change them. Add a note in the README.

---

## Payload reference

Supabase sends a JSON body like:

```json
{
  "type": "INSERT",
  "table": "waitlist_signups",
  "schema": "public",
  "record": {
    "id": "uuid",
    "name": "Jane",
    "email": "jane@example.com",
    "intentions": ["create", "practice"],
    "is_beta_tester": true,
    "is_founding_member": false,
    "referral_source": "socialMedia",
    "message": "Optional message",
    "created_at": "2026-03-13T12:00:00Z"
  },
  "old_record": null
}
```

### Field mapping by table

| Table | User email field | Key fields for team email |
|-------|------------------|---------------------------|
| `waitlist_signups` | `record.email` | name, email, intentions, is_beta_tester, is_founding_member, referral_source, message |
| `investor_inquiries` | `record.email` | name, email, interest, phone, company, message |
| `creator_proposals` | `record.email` | name, email, content_types, bio, instagram_handle, tiktok_handle |
| `feedback` | (optional; may need `user_id` lookup) | message, category, url, platform |
| `auth.users` | `record.email` | email (for team "new signup" only) |

### Branching: waitlist vs founding member

Both use `waitlist_signups`. Differentiate by `record.is_founding_member`:

- `is_founding_member === true` → use `founding-confirmation.html`
- `is_founding_member === false` (or null) → use `waitlist-confirmation.html`

---

## Troubleshooting

### Webhook not firing

- Check Supabase **Database** → **Webhooks** — webhook is enabled and URL is correct
- Check `net._http_response` in Supabase SQL Editor for delivery status
- Ensure n8n workflow is **Active** and the webhook path matches

### n8n not receiving payload

- Verify Content-Type: `application/json`
- In n8n Webhook node: enable "Listen for Test Event" and submit a form to capture the raw payload
- Check if Supabase wraps the payload (e.g. under `body` or at root)

### Emails not sending

- Verify email credentials in n8n
- Check n8n **Executions** for errors
- Verify "From" address is allowed by your email provider (e.g. Resend domain verification)

### Wrong template or missing data

- Confirm variable paths: `$json.body.record.email` vs `$json.record.email`
- Add a **Set** node to log `record` and debug
- Ensure template variables match the record fields (e.g. `name` vs `full_name`)

### Local development

- Use `host.docker.internal` for webhook URL if n8n runs on host
- Or use ngrok/cloudflared to expose n8n and use the public URL in Supabase

---

## Quick reference: team emails

| Form | Team recipient |
|------|----------------|
| Waitlist, Founding, Creator, Role-specific | `ops@waqup.com` or `hello@waqup.com` |
| Investor | `legal@waqup.com` or `investors@waqup.com` |
| Feedback | `support@waqup.com` |
| New signup | `ops@waqup.com` |

---

*This is the single reference for n8n + Supabase form email setup. Keep it updated when tables, templates, or flows change.*
