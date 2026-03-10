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

## Level Unlocks (Spec)

| Level | XP | New unlocks at this level |
|-------|-----|---------------------------|
| **Seeker** | 0 | Affirmations, Meditations, Rituals (create + play), Library, Speak/Orb, Marketplace discovery, Progress, Credits, Settings |
| **Initiate** | 25 | + Voice cloning (IVC) — *a few tryouts and it’s yours* (~5 affirmations or 2–3 meditations) |
| **Explorer** | 50 | + Export audio, + Reflection AI summaries (post-session insights) |
| **Practitioner** | 100 | + Creator Dashboard (publish to marketplace) |
| **Adept** | 200 | + Advanced audio (wave presets, custom waves) |
| **Alchemist** | 400 | + Custom ambience / soundscapes |
| **Sage** | 600 | + Creator analytics dashboard, + Featured in discovery |
| **Master** | 1000 | + Creator verification badge, + Early access to new features |

---

## XP Math (Quick reference)

| Content type | XP per session |
|--------------|----------------|
| Affirmation | 5 |
| Meditation | 10 |
| Ritual | 15 |

**“A few tryouts”** ≈ 25 XP: 5 affirmations, or 2–3 meditations, or 2 rituals — voice cloning unlocks quickly.

---

## Implemented vs Pending

| Feature | Level | Status |
|---------|-------|--------|
| Voice cloning (IVC) | Initiate (25 XP) | ✅ Implemented (`VoiceGate`) |
| Creator Dashboard | Practitioner (100 XP) | ✅ Implemented (`CreatorGate`) |
| Export audio | Explorer (50 XP) | ✅ Hook `useExportAudioGate` ready — wire to Export button when implemented |
| Reflection AI summaries | Explorer (50 XP) | ⏳ Pending |
| Advanced audio (waves, presets) | Adept (200 XP) | ⏳ Pending |
| Custom ambience / soundscapes | Alchemist (400 XP) | ⏳ Pending |
| Creator analytics, Featured | Sage (600 XP) | ⏳ Pending |
| Creator verification | Master (1000 XP) | ⏳ Pending |

---

## XP Thresholds

| Level | XP required | ~Sessions to reach |
|-------|-------------|--------------------|
| Seeker | 0 | — |
| Initiate | 25 | ~5 affirmations or 2–3 meditations |
| Explorer | 50 | ~10 affirmations or 5 meditations |
| Practitioner | 100 | ~20 affirmations or 10 meditations |
| Adept | 200 | ~40 affirmations or 20 meditations |
| Alchemist | 400 | ~80 affirmations or 40 meditations |
| Sage | 600 | ~120 affirmations or 60 meditations |
| Master | 1000 | ~200 affirmations or 100 meditations |

---

## Code Migration — Done (2026-03-10)

Implemented:

1. **`packages/shared/src/types/progress.ts`**: 8 levels, `LEVEL_THRESHOLDS`, `LEVEL_COLORS`, `UNLOCK_THRESHOLDS`, `xpToLevel`, `xpToNextLevel`, `xpProgressPercent`.
2. **`CreatorGate.tsx`**: Threshold 100 XP (Practitioner) via `UNLOCK_THRESHOLDS.creator`.
3. **`UserProgressCard.tsx`**: 8 levels with colors, icons, taglines.
4. **`VoiceGate.tsx`**: New gate for `/sanctuary/voice` at 25 XP (Initiate).
5. **`useExportAudioGate.ts`**: Hook for Export audio at 50 XP (Explorer).
6. **`AppLayout.tsx`**: Level + XP in avatar dropdown account card.
7. **`supabase/migrations/20260326000001_level_unlock_function.sql`**: `get_user_practice_level()` for future server-side gating.

**Future gates**: Reflection AI (50), Advanced audio (200), Custom ambience (400), Creator analytics (600), Creator verification (1000).

---

## See also

- [00-product-overview.md](../00-product-overview.md) — Principles, practice vs creation
- [05-pipelines-overview.md](./05-pipelines-overview.md) — Content pipelines
- [07-marketplace-summary.md](./07-marketplace-summary.md) — Creator, discovery
