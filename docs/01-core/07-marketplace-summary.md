# Marketplace Summary

**Purpose**: Discovery, creator tools, verification, viral, revenue.

---

## Features

| Area | Description |
|------|-------------|
| **Discovery** | Search, filter (type, price, rating, creator), browse, trending |
| **Creator tools** | Publish, pricing management, analytics dashboard, content management |
| **Verification** | Submission flow, review, badges, quality standards |
| **Viral** | Shareable links, embeddable player, social sharing, viral analytics |
| **Revenue** | Payments (Stripe), 70/30 split, creator payouts |

---

## Schema (from Phase 14)

| Table / field | Purpose |
|---------------|---------|
| `content_items.marketplace_enabled` | Boolean — can be listed |
| `content_items.verified` | Boolean — verified badge |
| `content_items.price` | Decimal — listing price |
| `marketplace_items` | Listing metadata |
| `marketplace_purchases` | Purchase records |
| `creator_profiles` | Creator dashboard |
| `marketplace_analytics` | Analytics |

---

## Routes (to create)

- `/marketplace` — Discovery
- `/marketplace/creator` — Creator dashboard
- Content detail with purchase option

---

## Reference

- **Phase 14**: [rebuild-roadmap/02-phases/14-phase-14-marketplace-platform.md](../../rebuild-roadmap/02-phases/14-phase-14-marketplace-platform.md)
- **Pages comparison**: [docs/04-reference/04-pages-comparison.md](../04-reference/04-pages-comparison.md)
