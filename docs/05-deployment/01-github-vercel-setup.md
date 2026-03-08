# GitHub CI & Vercel Deployment Setup

Production-level setup for waQup Web CI/CD and deployment.

---

## Overview

- **CI**: Build, lint, type-check on every push/PR (main)
- **Deploy**: Automatic Vercel production deploy after successful build on `main`

---

## Option A: Vercel Git Integration (Recommended)

Vercel's built-in GitHub integration deploys automatically on every push.

1. **Connect repo**: [Vercel Dashboard](https://vercel.com/new) → Import `InnerFlect-Tech/waqup-new`
2. **Configure project**:
   - **Root Directory**: `packages/web`
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: Uses `packages/web/vercel.json` (builds shared first)
3. **Environment variables**: Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL` in Vercel Project Settings
4. **Production branch**: `main` (default)

GitHub Actions CI still runs for validation; Vercel handles deployment.

---

## Option B: Deploy via GitHub Actions

Use when you need deploy in GitHub (e.g. GitHub Enterprise Server, single pipeline).

### Required secrets

Add these in **GitHub** → **Settings** → **Secrets and variables** → **Actions**:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | [Create a token](https://vercel.com/account/tokens) with deploy scope |
| `VERCEL_ORG_ID` | From `.vercel/project.json` after `vercel link` locally |
| `VERCEL_PROJECT_ID` | From `.vercel/project.json` after `vercel link` locally |

### Obtaining org and project IDs

```bash
cd packages/web
npx vercel link
# Follow prompts; .vercel/project.json will contain orgId and projectId
cat .vercel/project.json  # Copy values to GitHub secrets
```

---

## Workflow steps (Web CI)

### Build job (every push/PR)

1. **Checkout** – `actions/checkout@v4`
2. **Node.js** – v24 with npm cache
3. **Cache** – node_modules, Next.js `.next/cache`
4. **Install** – `npm ci --ignore-scripts`
5. **Build shared** – `npm run build:shared`
6. **Lint** – `npm run lint` (packages/web)
7. **Type-check** – `npx tsc --noEmit`
8. **Build web** – `npm run build` (with placeholder env)

### Deploy job (main only, after build)

Runs only when `build` succeeds on `main`:

1. **vercel pull** – Fetch env and project config
2. **vercel build** – Install + build (shared + web via `vercel.json`)
3. **vercel deploy --prebuilt --prod** – Deploy production

---

## Concurrency & permissions

- **Concurrency**: Cancels in-progress runs when a new push happens on the same branch
- **Permissions**: Least privilege (`contents: read`, `deployments: write`)
- **Environment**: Deploy job uses GitHub Environment `production` for protection rules

---

## Monorepo config

`packages/web/vercel.json`:

```json
{
  "installCommand": "cd ../.. && npm ci",
  "buildCommand": "cd ../.. && npm run build:shared && npm run build:web"
}
```

Vercel project **Root Directory** must be `packages/web` for this to work.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails: "shared not found" | Ensure Root Directory = `packages/web` and vercel.json is present |
| Deploy job fails: "Missing token" | Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets |
| Lock file conflict | `rm -f packages/web/.next/lock` and retry locally |
| p5 module not found | Resolved: VoiceOrbP5 uses loose typing to avoid static p5 resolution |
