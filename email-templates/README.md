# waQup Email Templates — Single Source of Truth

**All email design, HTML, and copy for form automation live here.**

When you change a template, update the corresponding n8n workflow so it uses the new content. See `docs/04-reference/30-n8n-supabase-email-setup-guide.md` for the full setup.

## Structure

| File | Used for |
|------|-----------|
| `base.css` | Shared design tokens (colors, fonts) — canonical source |
| `subjects.json` | Email subject lines for each type |
| `waitlist-confirmation.html` | Waitlist (full + CTA), For Teachers/Coaches/Creators/Studios |
| `founding-confirmation.html` | Founding Members (Join page) |
| `investor-confirmation.html` | Investor contact form |
| `creator-confirmation.html` | Creator proposal (CreatorGate) |
| `feedback-confirmation.html` | Help & Feedback form |
| `team-notification.html` | Internal team notifications (generic) |

## Variables

Templates use `{{variable}}` placeholders. n8n replaces these with values from the Supabase payload:

- `{{name}}` — from `record.name`
- `{{email}}` — from `record.email`
- `{{table}}` — payload table name (for team emails)
- `{{recordSummary}}` — formatted record (for team emails)
- `{{timestamp}}` — submission time

## n8n workflow export

**`n8n-waqup-form-emails.json`** — Import this into n8n to get the full workflow:

1. In n8n: **Workflows** → **Import from File** → select `n8n-waqup-form-emails.json`
2. Add **Resend** credentials: **Credentials** → **Add** → **Header Auth**
   - Name: `Authorization`
   - Value: `Bearer re_xxxxxxxx` (your Resend API key)
3. In both **Send User Email** and **Send Team Email** nodes, select this credential
4. Update the `from` address in the Build nodes if needed (default: `hello@waqup.com`)
5. Activate the workflow and copy the **Production Webhook URL** into Supabase

## Sync to n8n

After editing a template in this folder:

1. Open the n8n workflow `waQup Form Emails`
2. Update the corresponding **Build X Emails** Code node with the new HTML
3. Save and test
