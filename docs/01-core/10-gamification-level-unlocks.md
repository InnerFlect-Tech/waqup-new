# Gamification & Level Unlocks

**Purpose**: Define level-based unlocks, XP thresholds, and product philosophy (rituals as backbone; affirmations and meditations for all).

**Reference**: `packages/shared/src/types/progress.ts` (LEVEL_THRESHOLDS, xpToLevel); `CreatorGate.tsx`.

---

## Product Philosophy

| Concept | Meaning |
|--------|---------|
| **Rituals = backbone** | The product is built on ritual structure (intention, repetition, space) — the framework that makes change stick |
| **Affirmations + Meditations = for all** | Available from day one. No hierarchy of worth; different tools for different moments |
| **No cancelling out** | Affirmation-only users and meditation-only users are valid. Ritual is the frame; users choose what goes inside |

**Marketing**: "Built on ritual. Works for moments." — Ritual can be 2 minutes or 20.

---

## Level Unlocks (Current Spec)

| Level | XP | Unlocks |
|-------|-----|---------|
| **Seeker** | 0 | Affirmations, Meditations, Rituals (create + play), Library, Speak/Orb, Marketplace discovery, Progress, Credits, Settings |
| **Practitioner** | 150 | + Creator Dashboard |
| **Alchemist** | 500 | + Voice cloning (IVC), + Advanced audio (waves, presets) |
| **Master** | 1000 | + Creator verification, + Early access to new features |

---

## Implemented vs Pending

| Feature | Gated | Status |
|--------|-------|--------|
| Creator Dashboard | Practitioner (150 XP) | ✅ Implemented (`CreatorGate`) |
| IVC / Voice cloning | Alchemist (500 XP) | ⏳ Pending |
| Advanced audio (waves, presets) | Alchemist (500 XP) | ⏳ Pending |
| Creator verification | Master (1000 XP) | ⏳ Pending |

---

## XP Thresholds

| Level | XP required |
|-------|-------------|
| Seeker | 0 |
| Practitioner | 150 |
| Alchemist | 500 |
| Master | 1000 |

**XP per session** (by content type): Affirmation 5, Meditation 10, Ritual 15.

---

## See also

- [00-product-overview.md](../00-product-overview.md) — Principles, practice vs creation
- [05-pipelines-overview.md](./05-pipelines-overview.md) — Content pipelines
- [07-marketplace-summary.md](./07-marketplace-summary.md) — Creator, discovery
