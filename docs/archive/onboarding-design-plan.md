# Onboarding Design Plan — Science-Backed, Super Clear

**Purpose**: Define all onboarding steps with super-clear design, science-backed messaging, and waQup's mission. Includes image specs for any visuals.

**References**: `docs/01-core/` (pipelines, affirmations, rituals, audio), `docs/04-reference/17-explanation-vs-our-story.md`, `packages/web/messages/en/marketing.json` (explanation copy), waQup mission from Our Story.

**Last Updated**: 2026-03-12

---

## 1. Onboarding Flow — All Steps (7 total)

| # | Step | Route | Purpose |
|---|------|-------|---------|
| 1 | Welcome & Why | `/onboarding` | Set the frame: science + mission. Live your dream self. |
| 2 | Intention | `/onboarding` (same page, or step 2) | What matters most — 6 intentions. |
| 3 | Voice | `/onboarding/voice` | Clone your voice (IVC). Your voice = personalized authority. |
| 4 | Profile | `/onboarding/profile` | Name, intention stored. |
| 5 | When you'll listen | `/onboarding/when` | Morning & night — hypnagogic/hypnopompic. Science-backed. |
| 6 | Preferences | `/onboarding/preferences` | Notifications, etc. |
| 7 | Guide | `/onboarding/guide` | Create first practice or skip to Sanctuary. |

**Design principle**: Each step is a single clear question or action. One idea per step. Backed by a short science nugget where relevant.

---

## 2. Step-by-Step Design Specs

### Step 1: Welcome & Why

**Goal**: Frame the experience — why this matters, our mission, and the science in 2–3 sentences.

**Copy (science-backed)**:
- **Headline**: "Live your dream self"
- **Subhead**: "waQup exists to empower everyone to shape their identity intentionally — backed by neuroscience."
- **Bullets** (keep to 3 max):
  1. **Your voice bypasses skepticism.** Research shows your brain encodes self-spoken words 30–40% more strongly than strangers' (Rogers, Kuiper & Kirker, 1977).
  2. **Morning and night are your best windows.** Theta waves (4–8 Hz) dominate just after waking and just before sleep — when your critical mind is relaxed and your subconscious is most receptive (Stickgold et al., 2000).
  3. **Identity shift is real.** Neuroplasticity + repetition + your voice = measurable neural change in 21–66 days (Lally et al., 2010).

**Mission line**: "We're not telling you what to believe. We're giving you the tools to encode your own."

**UI**: Full-page or split. Left: headline + bullets. Right: hero image (see Section 5). Progress: 1 of 7. CTA: "Let's begin →".

**Optional merge**: If keeping steps minimal (6 total), merge Welcome with Intention — show Welcome as a brief intro hero, then scroll or tap to Intention grid.

---

### Step 2: Intention

**Goal**: "What matters most to you right now?" — 6 intentions.

**Existing copy** (keep): Confidence, Abundance, Peace, Love, Purpose, Health — with emoji + label + sub.

**Science nugget** (small, below grid): "Clarity of intention activates the prefrontal cortex — the part of your brain responsible for planning and change."

**UI**: Grid of 6 cards. Progress: 2 of 7. CTA: "Start creating →". Skip: "Go straight to the orb →".

---

### Step 3: Voice (Clone your voice)

**Goal**: User clones their voice via ElevenLabs IVC. Aligned with ElevenLabs API.

**Copy**:
- **Headline**: "Your voice for your affirmations"
- **Subhead**: "Your brain trusts your own voice more than any other. Upload a recording so your practices sound like you."
- **Science nugget**: "Self-referential processing encodes 30–40% more strongly — your subconscious responds differently to you."

**UI**:
- Voice name (pre-filled "My Voice")
- Upload 1+ audio files (30+ seconds recommended)
- Remove background noise checkbox
- Condensed tips (3–4 bullets from sanctuary/voice)
- CTA: "Create voice and continue"
- Skip: "I'll do this later" → profile

**Progress**: 3 of 7. No VoiceGate in onboarding — available to all new users.

---

### Step 4: Profile

**Goal**: Name + intention stored in profiles.

**Copy** (existing): "What should we call you?" / "Preferred name".

**Science nugget** (optional): "Personalization increases retention — practices that feel yours stick."

**UI**: Input, skip option. Progress: 4 of 7.

---

### Step 5: When you'll listen (NEW)

**Goal**: Explain why morning and night matter. Set expectations for optimal practice.

**Copy**:
- **Headline**: "When to practice"
- **Subhead**: "Your brain is most receptive at two moments — and waQup is built for both."
- **Two cards**:
  1. **Morning (after waking)**: "Hypnopompic state — theta lingers. Your critical mind hasn't fully engaged. Affirmations heard then bypass resistance and encode directly."
  2. **Night (before sleep)**: "Hypnagogic state — theta (4–8 Hz) dominates as you drift off. Sleep-dependent consolidation strengthens what you practice."
- **Summary**: "5 minutes morning + 5 minutes night. That's all it takes. No lifestyle overhaul — just two bookends that compound over weeks."

**UI**: Two visual cards (Sun + Moon icons or images). Progress: 5 of 7. CTA: "I'll practice morning & night" or "Continue".

**Images**: See Section 5 — `onboarding-morning.png`, `onboarding-night.png`.

---

### Step 6: Preferences

**Goal**: Notifications, reminders, etc. (existing).

**Copy**: Keep simple. No science needed here.

**Progress**: 6 of 7.

---

### Step 7: Guide

**Goal**: Create first practice or skip to Sanctuary.

**Copy** (existing): "Create your first practice now" — affirmation, meditation, ritual options.

**Science nugget**: "Create by talking — no forms. Practice is free. Qs are only used when you create."

**Progress**: 7 of 7.

---

## 3. Super Admin: Restart Onboarding

**Visibility**: Only super admin sees "Restart onboarding".

**Behavior**: Sets `onboarding_completed_at = null`, navigates to `/onboarding`. Enables testing the full flow.

**Placement**: Super Admin section in profile dropdown; Admin Dashboard under Tools.

---

## 4. Design Principles (Super Clear, Good Design)

| Principle | Application |
|-----------|-------------|
| **One idea per step** | Each step answers one question or completes one action. |
| **Short science nuggets** | 1–2 sentences max. Source when possible (e.g. "Lally et al., 2010"). |
| **Progress always visible** | Dots or "Step X of 7" at top. |
| **Skip options where appropriate** | Voice, profile — user can set later. Never block. |
| **Consistent layout** | GlassCard, OnboardingStepLayout, spacing from theme. |
| **Typography** | Use `Typography` component. Headlines 22–30px clamp. Body 14–16px. |
| **Accessibility** | aria-labels, sufficient contrast, touch targets 44×44pt min. |

---

## 5. Images — Exact Specs

All images: dark aesthetic, purple ambient, no text. Match `docs/04-reference/image-generation-prompts.md` style.

| # | Filename | Size | Purpose | Prompt (summary) |
|---|----------|------|---------|------------------|
| 1 | `onboarding-welcome-hero.png` | 1792×1024 | Step 1 Welcome | Person in silhouette with headphones, soft purple/blue dawn light through window. Serene, contemplative. Represents "live your dream self." |
| 2 | `onboarding-morning.png` | 1024×1024 | Step 5 When | Person at window, morning light, purple accents. Wake-up, fresh start. Hypnopompic moment. |
| 3 | `onboarding-night.png` | 1024×1024 | Step 5 When | Person in dim room, candle or soft lamp, purple glow. Pre-sleep, wind-down. Hypnagogic moment. |
| 4 | `onboarding-voice.png` | 1024×1024 | Step 3 Voice | Microphone in soft purple light. Minimal, premium. Your voice, your practice. |

**Sizes reference** (DALL·E 3): 1792×1024 (landscape), 1024×1024 (square).

**Full prompts** (add to `docs/04-reference/image-generation-prompts.md`):

```
### Onboarding Welcome Hero
Size: 1792×1024
Filename: onboarding-welcome-hero.png
Prompt: Person in silhouette from behind, wearing over-ear headphones, sitting in a cozy dim room at dawn. Soft purple and blue light rays through sheer curtains. Laptop (silhouetted) on left, candle glow on right. Serene, contemplative, transformation. Dark purples, blues. Photorealistic. No text.

### Onboarding Morning
Size: 1024×1024
Filename: onboarding-morning.png
Prompt: Person at window, early morning light, purple ambient tones. Wake-up moment, fresh start. Hypnopompic state — calm, receptive. Dark background, purple accents. No text.

### Onboarding Night
Size: 1024×1024
Filename: onboarding-night.png
Prompt: Person in dim bedroom, soft candle or lamp glow, purple ambient. Pre-sleep, wind-down. Hypnagogic moment — theta, relaxation. Dark, cozy. No text.

### Onboarding Voice
Size: 1024×1024
Filename: onboarding-voice.png
Prompt: Microphone in soft purple ambient light. Dark background. Minimal, premium wellness app. Your voice for your practice. No text.
```

---

## 6. Science Copy Quick Reference

**Sleep/wake (from marketing.json)**:
- Hypnopompic: "Theta lingers after waking. Critical mind hasn't fully engaged. Affirmations bypass resistance."
- Hypnagogic: "Theta (4–8 Hz) dominates as you drift off. Sleep consolidates what you practice."
- Stickgold et al. (2000): sleep consolidation, memory reprocessing.
- Theta: 4–8 Hz, transitional states.

**Own voice**:
- Rogers, Kuiper & Kirker (1977): self-referential 30–40% stronger encoding.
- "Your subconscious filters out strangers. It responds to you."

**Identity / neuroplasticity**:
- Hebb (1949): neurons that fire together wire together.
- Lally et al. (2010): 18–254 days habit formation, avg 66.
- "Identity can be shaped intentionally."

**Mission** (Our Story):
- "Empower everyone to live their dream self."
- "Tools should help people express themselves, not tell them what to think."
- "Transformation happens when you speak your own intentions."

---

## 7. Implementation Checklist

- [ ] Add Welcome content to step 1 (or merge with Intention)
- [ ] Create `/onboarding/voice` page (IVC flow, no VoiceGate)
- [ ] Create `/onboarding/when` page (morning/night science)
- [ ] Update step numbers (1–7) across all pages
- [ ] Add `/onboarding/voice`, `/onboarding/when` to ONBOARDING_ROUTES
- [ ] Wire intention → voice → profile → when → preferences → guide
- [ ] Create `POST /api/admin/onboarding/reset` (super admin only)
- [ ] Add "Restart onboarding" to SUPERADMIN_MENU_ITEMS
- [ ] Add i18n keys for all new copy (`onboarding.welcome`, `onboarding.when`, etc.)
- [ ] Generate images (onboarding-welcome-hero, onboarding-morning, onboarding-night, onboarding-voice)
- [ ] Add image prompts to `docs/04-reference/image-generation-prompts.md`
- [ ] Extend E2E onboarding spec for new steps

---

## 8. Mobile Parity

Same steps, condensed UI. Voice: reuse `/api/voice/create`. When: same two-card layout, responsive. Super admin: add "Restart onboarding" to mobile settings if superadmin UI exists.
