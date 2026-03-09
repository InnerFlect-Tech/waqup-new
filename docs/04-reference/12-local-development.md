# Local Development Setup

Complete guide for running waQup locally with Supabase — covers two development modes, Google OAuth setup, environment variables, and how to switch between local and remote databases safely.

---

## Prerequisites

- **Node.js** >= 24.0.0
- **npm** >= 10
- **Docker** (Desktop, OrbStack, or Podman) — only required for Mode B

---

## How Environment Variables Work in This Monorepo

The `next.config.js` sets `turbopack.root` to the monorepo root (`../..`). This means **Next.js picks up the root `.env` file** as a baseline. To override it for local development, create `packages/web/.env.local` — Next.js always prioritises `.env.local` over `.env`.

```
Priority order (highest first):
  packages/web/.env.local       ← your local overrides (gitignored)
  root .env                     ← shared defaults (tracked in git)
```

**Always create `packages/web/.env.local` for local development.** See [packages/web/.env.local.example](../../packages/web/.env.local.example) for the template.

---

## Two Development Modes

| | Mode A: Remote Supabase | Mode B: Local Supabase |
|---|---|---|
| **Database** | Cloud (production project) | Local Docker container |
| **Auth / OAuth** | Remote (real Google OAuth) | Local (needs Google creds in supabase/.env) |
| **Docker required** | No | Yes |
| **Affects production data** | Yes — same DB | No — fully isolated |
| **Best for** | Testing real features with real data | Schema changes, migrations, seed data |
| **Setup time** | ~5 min | ~10 min (first time) |

---

## Mode A: Remote Supabase from Localhost

Run the Next.js app locally while connected to the Supabase cloud project.

### 1. Create `packages/web/.env.local`

```bash
cp packages/web/.env.local.example packages/web/.env.local
```

Open `packages/web/.env.local` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zkhnmidxpyfedrtvogwf.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_1W0cEZu06Vt70KBL_3UCHg_no418h0V
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> `NEXT_PUBLIC_APP_URL` tells the OAuth redirect builder to use `localhost:3000` instead of guessing from the browser. Without it, Google OAuth redirects may fail.

### 2. Add localhost to Supabase redirect URLs (one-time, dashboard)

Go to: **https://supabase.com/dashboard/project/zkhnmidxpyfedrtvogwf/auth/url-configuration**

Under **"Redirect URLs"**, add:
```
http://localhost:3000/**
```

The `**` wildcard matches any path including `/auth/callback?next=...`.

### 3. Add localhost to Google Cloud Console (one-time, if using Google OAuth)

Go to: **https://console.cloud.google.com → APIs & Services → Credentials → your OAuth 2.0 client**

Add to **Authorized JavaScript origins**:
```
http://localhost:3000
```

Add to **Authorized redirect URIs**:
```
http://localhost:3000/auth/callback
```

> Changes in Google Cloud Console can take up to 5 minutes to propagate.

### 4. Start the web app

```bash
npm run dev:web
```

Open http://localhost:3000. Google OAuth and email/password login will now work from localhost.

---

## Mode B: Local Supabase (Fully Isolated)

Run a complete Supabase stack locally in Docker — no cloud DB, no production risk.

### 1. Create `packages/web/.env.local`

```bash
cp packages/web/.env.local.example packages/web/.env.local
```

Start local Supabase first to get the keys:

```bash
npm run supabase:start
```

The output will print something like:

```
API URL:     http://127.0.0.1:54321
anon key:    eyJhbGci...
```

Set in `packages/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon-key-from-output>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Apply migrations and seed data

```bash
npm run supabase:reset
```

This drops and recreates the local database, runs all migrations in `supabase/migrations/`, and seeds from `supabase/seed.sql`.

Default seed user: `dev@local.test` / `password123`

### 3. (Optional) Enable Google OAuth locally

For Google OAuth with local Supabase you need to add your Google client credentials and tell the local auth server to use them.

**a. Create `supabase/.env`** (gitignored — never commit this):

```bash
cp supabase/.env.example supabase/.env
```

Open `supabase/.env` and fill in real values:

```env
SUPABASE_AUTH_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
SUPABASE_AUTH_GOOGLE_SECRET=your-client-secret
```

**b. Uncomment the Google section in `supabase/config.toml`:**

```toml
[auth.external.google]
enabled = true
client_id = "env(SUPABASE_AUTH_GOOGLE_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_GOOGLE_SECRET)"
redirect_uri = "http://127.0.0.1:54321/auth/v1/callback"
skip_nonce_check = true
```

**c. Add the local callback URI to Google Cloud Console:**

Add to **Authorized redirect URIs**:
```
http://127.0.0.1:54321/auth/v1/callback
```

**d. Restart the local stack:**

```bash
npm run supabase:stop
npm run supabase:start
```

### 4. Start the web app

```bash
npm run dev:web
```

---

## NPM Scripts Reference

| Script | Purpose |
|--------|---------|
| `npm run supabase:start` | Start local Supabase stack |
| `npm run supabase:stop` | Stop local Supabase |
| `npm run supabase:status` | Show URLs and anon key |
| `npm run supabase:reset` | Drop DB, apply migrations + seed |
| `npm run supabase:diff` | Diff local schema vs linked remote |
| `npm run dev:local` | Start Supabase then web app |
| `npm run dev:web` | Start Next.js dev server only |

---

## Local Services (Mode B)

After `supabase start`:

| Service | URL |
|---------|-----|
| API (Supabase URL) | http://127.0.0.1:54321 |
| Studio (DB UI) | http://127.0.0.1:54323 |
| Inbucket (email testing) | http://127.0.0.1:54324 |

---

## Auth Options

### Email/password

Works in both modes. Sign up at `/signup` or use the seed user in Mode B (`dev@local.test` / `password123`).

### Google OAuth

Works in Mode A after the dashboard + Google Cloud Console steps above. Works in Mode B after configuring `supabase/.env` and `config.toml`.

The login page sends `prompt: 'select_account consent'` — this forces the Google account picker to appear every time, preventing the "wrong account" issue when you have multiple Google accounts in your browser.

### Override login (dev shortcut)

Bypasses Supabase entirely. Set in `packages/web/.env.local`:

```env
OVERRIDE_LOGIN_EMAIL=dev@local.test
OVERRIDE_LOGIN_PASSWORD=password123
```

Use at `/login` — useful when the DB is down or you need instant access without auth flow.

### Test login (no DB)

Shows a one-click login button without any database call. Enable with:

```env
NEXT_PUBLIC_ENABLE_TEST_LOGIN=true
```

---

## Database Migrations

All schema changes live in `supabase/migrations/`. Local and production use the same migration files — only environment variables differ.

### Workflow

```
1. Develop locally
   └── supabase migration new <name>
   └── Write SQL in the new file
   └── npm run supabase:reset  ← apply locally

2. Verify
   └── Check schema in Studio (http://127.0.0.1:54323)
   └── npm run supabase:diff   ← confirm parity with remote

3. Deploy to production
   └── supabase link --project-ref zkhnmidxpyfedrtvogwf  (first time)
   └── supabase db push
```

### Checking for schema drift

```bash
npm run supabase:diff
```

This diffs your local schema against the linked remote project. Run before any deployment to ensure no unapplied migrations.

---

## Switching Between Modes

To switch from Mode A to Mode B (or back):

1. Edit `packages/web/.env.local` — change `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
2. Restart the dev server: stop `npm run dev:web`, then start again

That's it. No code changes needed.

---

## Health Check

```
GET /api/health
```

Returns:
```json
{ "ok": true, "supabase": "connected" }
```

or an error if Supabase is unreachable. Use this to verify your env vars are correct after setup.

---

## Mobile Local Development

1. Copy `packages/mobile/.env.local.example` to `packages/mobile/.env.local`
2. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. For Android emulator: use `http://10.0.2.2:54321` instead of `http://127.0.0.1:54321`

---

## Stripe Local Testing

Use test-mode keys (`pk_test_...`, `sk_test_...`) in `packages/web/.env.local`. For webhooks:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Google OAuth lands on "another account" | Fixed — `select_account` prompt now forces account picker |
| Google OAuth redirects to production instead of localhost | Add `http://localhost:3000/**` to Supabase dashboard redirect URLs |
| Google OAuth error after adding redirect URL | Wait up to 5 min for Google Cloud Console changes to propagate |
| `Missing Supabase env vars` warning | Create `packages/web/.env.local` from `.env.local.example` |
| App shows blank / loads with placeholder data | `.env.local` not created, or URL/key is wrong — check `/api/health` |
| Docker not running | Start Docker Desktop (or OrbStack/Podman) before `supabase start` |
| Port 54321 already in use | Run `supabase stop --no-backup` to free the port |
| DB empty after `supabase reset` | Seed runs automatically — ensure `supabase/seed.sql` exists |
| `supabase db push` fails with permission error | Run the grant query in the Supabase SQL editor (see Supabase docs) |
| OAuth doesn't work in Mode B | Ensure `supabase/.env` has credentials and `config.toml` is uncommented, then restart |

---

## Production Deployment

- Set env vars in Vercel: **Project Settings → Environment Variables** (Production scope)
- Use the remote Supabase URL and publishable key (same as Mode A values)
- Deploy migrations: `supabase link --project-ref <id>` then `supabase db push`
- The `NEXT_PUBLIC_APP_URL` should be your production domain (e.g. `https://waqup.com`)
- Supabase redirect URLs must include your production domain: `https://waqup.com/**`

---

## Environment Variables Reference

### `packages/web/.env.local`

| Variable | Mode A value | Mode B value |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://...supabase.co` | `http://127.0.0.1:54321` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` | anon key from `supabase start` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `http://localhost:3000` |

### `supabase/.env` (Mode B only, gitignored)

| Variable | Where to get it |
|----------|----------------|
| `SUPABASE_AUTH_GOOGLE_CLIENT_ID` | Google Cloud Console → Credentials |
| `SUPABASE_AUTH_GOOGLE_SECRET` | Google Cloud Console → Credentials |
