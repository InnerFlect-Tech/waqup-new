# Local Development Setup

This guide explains how to run waQup fully on localhost using Supabase CLI, so you can test everything before deploying.

## Prerequisites

- **Node.js** >= 20.9 (or 22+)
- **Docker** (Desktop, OrbStack, or Podman) — required for Supabase local stack
- **npm** >= 10

## Quick Start

1. **Start local Supabase** (Postgres, Auth, Storage, Studio):

   ```bash
   npm run supabase:start
   ```

2. **Copy local credentials** from the terminal output into `packages/web/.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` → `http://127.0.0.1:54321`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → the `anon key` from the output

   Use `packages/web/.env.local.example` as a template.

3. **Start the web app**:

   ```bash
   npm run dev:web
   ```

4. **Open** http://localhost:3000

## NPM Scripts

| Script | Purpose |
|--------|---------|
| `npm run supabase:start` | Start local Supabase stack |
| `npm run supabase:stop` | Stop local Supabase |
| `npm run supabase:status` | Show URLs and keys |
| `npm run supabase:reset` | Reset DB (apply migrations + seed) |
| `npm run dev:local` | Start Supabase, then web app |
| `npm run dev:web` | Start Next.js dev server |

## Local Services

After `supabase start`, these URLs are available:

| Service | URL |
|---------|-----|
| API (Supabase URL) | http://127.0.0.1:54321 |
| Studio (DB UI) | http://127.0.0.1:54323 |
| Inbucket (email testing) | http://127.0.0.1:54324 |

## Auth Options

### Email/password

Works by default. Sign up via the app at `/signup`.

### Override login (dev only)

Set in `.env.local`:

```
OVERRIDE_LOGIN_EMAIL=dev@local.test
OVERRIDE_LOGIN_PASSWORD=devpassword
```

Sign in without Supabase; useful when DB is down.

### Test login (dev only)

Set `NEXT_PUBLIC_ENABLE_TEST_LOGIN=true` to show a "Test login (no DB)" button for quick UI testing.

### OAuth (Google, GitHub, etc.)

1. Edit `supabase/config.toml` and enable the provider, e.g.:

   ```toml
   [auth.external.google]
   enabled = true
   client_id = "env(SUPABASE_AUTH_GOOGLE_CLIENT_ID)"
   secret = "env(SUPABASE_AUTH_GOOGLE_SECRET)"
   redirect_uri = "http://localhost:54321/auth/v1/callback"
   ```

2. Create `supabase/.env` (gitignored) with your OAuth client ID and secret.

3. Restart: `supabase stop` then `supabase start`.

## Stripe Local Testing

- Use **test mode** keys (`pk_test_...`, `sk_test_...`) in `.env.local`.
- For webhooks, use [Stripe CLI](https://stripe.com/docs/stripe-cli):

  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```

## Mobile Local Development

1. Copy `packages/mobile/.env.local.example` to `packages/mobile/.env.local`.
2. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to your local Supabase values.
3. **Emulator access**: Use `localhost` or `10.0.2.2` (Android) so the emulator can reach `127.0.0.1:54321`.

## Database Migrations

- Migrations live in `supabase/migrations/`.
- Apply locally: `npm run supabase:reset` (resets DB and runs migrations + seed).
- Deploy to Supabase Cloud: `supabase link --project-ref <id>` then `supabase db push`.

## Seed Data

`supabase/seed.sql` creates a dev user (`dev@local.test` / `password123`) and sample content. Run `supabase db reset` to apply.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Docker not running | Start Docker Desktop (or OrbStack/Podman) |
| Port 54321 in use | Stop other Supabase instances: `supabase stop --no-backup` |
| "Missing Supabase env vars" | Copy values from `supabase start` output into `packages/web/.env.local` |
| Auth redirect fails | Ensure `NEXT_PUBLIC_APP_URL=http://localhost:3000` and URL is in `supabase/config.toml` `additional_redirect_urls` |

## Deployment Sync

- **Production**: Use Supabase Cloud URL and anon key in Vercel env vars.
- **Schema**: Push migrations with `supabase db push` after linking your remote project.
