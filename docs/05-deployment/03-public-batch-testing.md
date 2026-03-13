# Public Pages — Batch Testing Before Deploy

**Goal**: Ship to production only after public pages pass tests, in batches, to catch errors early without blocking.

---

## Workflow

```
1. Push to feature branch  →  Vercel creates preview URL
2. Run batch tests locally (or in CI) against preview URL
3. Fix any failures
4. Merge to main  →  Production deploy
```

---

## Batches (Public Pages Only)

| Batch | Spec | Pages Covered | Command |
|-------|------|---------------|---------|
| **1** | Landing + funnel | `/`, `/join`, `/pricing`, `/how-it-works`, mobile viewports | `npm run test:e2e:public:batch1` |
| **2** | Marketing + legal | `/launch`, `/waitlist`, `/explanation`, `/our-story`, `/privacy`, `/data-deletion` | `npm run test:e2e:public:batch2` |
| **3** | For-professionals | `/for-teachers`, `/for-coaches`, `/for-creators`, `/for-studios`, `/investors` | `npm run test:e2e:public:batch3` |
| **4** | Auth | `/login`, `/signup`, `/forgot-password` (forms, validation, links) | `npm run test:e2e:public:batch4` |
| **5** | i18n | Locale routing, footer language switcher | `npm run test:e2e:public:batch5` |
| **All** | — | All public batches above | `npm run test:e2e:public` |

---

## How to Use

### Option A: Local dev server (default)

```bash
# Start dev (in one terminal)
npm run dev:web

# Run batches (in another terminal) — uses localhost:3000
npm run test:e2e:public:batch1
# If OK, continue
npm run test:e2e:public:batch2
# … etc
```

### Option B: Preview URL (before merge)

Test the exact build that will go to production:

```bash
PLAYWRIGHT_BASE_URL=https://your-preview-abc.vercel.app npm run test:e2e:public:batch1
# Repeat for other batches or:
PLAYWRIGHT_BASE_URL=https://your-preview-abc.vercel.app npm run test:e2e:public
```

### Option C: Production URL

Sanity-check live site:

```bash
PLAYWRIGHT_BASE_URL=https://waqup.io npm run test:e2e:public
```

---

## Suggested Order

1. **Batch 1** — Core landing/funnel (most traffic)
2. **Batch 2** — Marketing + legal (SEO, conversion)
3. **Batch 4** — Auth (signup/login must work)
4. **Batch 3** — For-professionals (lower traffic)
5. **Batch 5** — i18n (if you ship multiple locales)

---

## Pre-Push Checklist

- [ ] `npm run type-check` passes
- [ ] `npm run build:web` succeeds
- [ ] At least Batch 1 + Batch 2 pass
- [ ] (Optional) Run full `npm run test:e2e:public` before merge to main

---

## References

- Route map: [docs/04-reference/16-route-map.md](../04-reference/16-route-map.md)
- Release workflow: [02-releases.md](./02-releases.md)
- Vercel setup: [01-github-vercel-setup.md](./01-github-vercel-setup.md)
