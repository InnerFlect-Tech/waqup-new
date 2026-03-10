# waQup — Image Generation Prompts for ChatGPT

Use these prompts with **ChatGPT** (DALL·E 3) to generate images for the public marketing pages. Copy each block entirely into ChatGPT.

---

## Status (as of Mar 2026)

| # | Image | Status | Notes |
|---|-------|--------|-------|
| 1 | landing-hero-bg | ✅ | Hero background |
| 2 | landing-your-voice | ✅ | Card image (reference quality) |
| 3 | landing-ai-creates | ⚡ | Regenerate with v2 prompt for sharper quality |
| 4 | landing-replay-forever | ⚡ | Regenerate with v2 prompt for sharper silhouette |
| 5 | our-story-hero | ✅ | Hero background |
| 6 | our-story-insight | ✅ | Insight section background |
| 7 | our-story-founder | ✅ | Founder portrait in GlassCard |
| 8 | pricing-hero | ✅ | Contemplating sunset — person, headphones, window, purple glow |
| 9 | pricing-comparison | ✅ | Split visual — generic left / personal right, applied in comparison section |
| 10 | waitlist-bg | ✅ | Subtle background |
| 11 | for-teachers-analytics | ✅ | Dashboard/analytics visual above comparison table |
| 12 | for-creators-hero | ✅ | Recording setup — laptop, mic, headphones, purple glow |
| 13 | for-coaches-hero | ✅ | Coach and client in calm session |
| 14 | for-coaches-notes | ✅ | Writing lamp at night — session notes visual |
| 15 | for-creators-growth | ✅ | Glowing upward graph — success, scaling |
| 16 | for-studios-qr | ✅ | QR code moment — phone scanning in studio, yoga mat, candle |
| 17 | get-qs-hero | ✅ | Serene rhythm in purple light — woman, headphones, cosmic glow |
| 18 | icon-affirmations | ✅ | Sunrise — used in how-it-works content types |
| 19 | icon-meditations | ✅ | Glowing moon — used in how-it-works content types |
| 20 | icon-rituals | ✅ | Candle — used in how-it-works content types |
| 21 | icon-voice | ✅ | Microphone — used in how-it-works content types strip |
| 22 | icon-listen | ✅ | Headphones — used in how-it-works content types strip |
| 23 | icon-q-coin | ✅ | Q coin — used in how-it-works content types strip |

---

**DALL·E 3 supported sizes:** 1792×1024 (16:9), 1024×1792 (9:16), 1024×1024 (1:1).  
**Output format:** PNG. After generation, download and save with the suggested filename.

---

## Reference style (primeira imagem — hero)

Use this as the visual benchmark. The first hero image has:

- **Subject:** Person in silhouette, seen from behind, wearing over-ear headphones, sitting relaxed, gazing at the window
- **Room:** Dimly lit, cozy — bedroom/study, sheer curtains at window
- **Light:** Purple and blue ethereal rays streaming through the window, warm candle glow on the right
- **Details:** Open laptop (silhouetted) on left, leafy plant, textured bedding
- **Palette:** Deep purples, blues, greys, black; warm amber/orange from candle
- **Mood:** Calm, introspective, immersive, serene, atmospheric

When generating similar images, use: *silhouette from behind*, *over-ear headphones*, *purple and blue light rays from window*, *moody*, *cozy*, *dimly lit*.

---

## How to Use

1. Open ChatGPT (with image generation).
2. Copy the **full prompt block** for an image (including the filename line).
3. Paste and send. ChatGPT will generate the image.
4. Download the image. ChatGPT will suggest the filename — use it exactly (e.g. `landing-hero-bg.png`).
5. Place in `packages/web/public/images/`.

**Optional:** If ChatGPT has a size selector, choose: **Landscape** (1792×1024), **Portrait** (1024×1792), or **Square** (1024×1024) to match the table. Or add to the prompt: *Generate as landscape / portrait / square*.

Each prompt includes a line asking ChatGPT to suggest the filename when you download. Use that exact name so files stay organised.

---

## 1. Landing Page (`/`)

### 1.1 Hero background

| Size | 1792×1024 (16:9) |
|------|------------------|
| Filename | `landing-hero-bg.png` |

```
A person in silhouette, seen from behind, wearing modern over-ear headphones, sitting deeply focused in a cozy, dimly lit room. Soft, vibrant purple and blue light rays stream from a large window with sheer curtains, creating an ethereal haze. An open minimalist laptop is on a small desk to their left, and a lit, warm-toned candle glows softly to their right. Dark, rich color palette with strong contrast between light and shadow. Serene, contemplative, immersive atmosphere. Photorealistic, cinematic lighting. No text.
When you provide this image for download, suggest the filename: landing-hero-bg.png
```

### 1.2 "Your voice" section

| Size | 1024×1024 (1:1) |
|------|-----------------|
| Filename | `landing-your-voice.png` |

```
Atmospheric photo of a microphone in soft purple ambient light. Dark background with subtle purple glow. Minimal, premium wellness app aesthetic. Professional product photography style. No text.
When you provide this image for download, suggest the filename: landing-your-voice.png
```

### 1.3 "AI creates" section

| Size | 1024×1024 (1:1) |
|------|-----------------|
| Filename | `landing-ai-creates.png` |

```
Ultra-sharp abstract visualization of neural pathways or interconnected light filaments in dark space. Purple, violet and indigo gradients. Crisp glowing connections, high resolution, no softness or blur. Center-weighted composition — main visual interest in center third. Scientific, brain-related, transformation vibe. Professional product-quality rendering. Premium wellness app aesthetic. No text.
When you provide this image for download, suggest the filename: landing-ai-creates.png
```

### 1.4 "Replay forever" section

| Size | 1024×1024 (1:1) |
|------|-----------------|
| Filename | `landing-replay-forever.png` |

```
Person in sharp silhouette wearing over-ear headphones at dawn or dusk. Cosmic purple and violet sky gradient. Silhouette and headphone outline must be crisp, high-resolution — no soft edges. Center-weighted composition — figure in center. Peaceful, mindful moment. Dark aesthetic, premium feel. Professional, product-photography quality. No text.
When you provide this image for download, suggest the filename: landing-replay-forever.png
```

---

## 2. Our Story (`/our-story`)

### 2.1 Hero / personal origin

| Size | 1792×1024 (16:9) |
|------|------------------|
| Filename | `our-story-hero.png` |

```
Atmospheric photo: a single person at a desk or in a quiet room, laptop open, early morning light. Dark moody tones with soft purple accents. Authentic, founder story, personal journey. Contemplative, human. No text.
When you provide this image for download, suggest the filename: our-story-hero.png
```

### 2.2 "The insight" section

| Size | 1792×1024 (16:9) |
|------|------------------|
| Filename | `our-story-insight.png` |

```
Abstract visual: light breaking through darkness. Purple and violet rays. Metaphor for realization, clarity, transformation. Minimal, poetic. No text.
When you provide this image for download, suggest the filename: our-story-insight.png
```

### 2.3 Founder quote / signature

| Size | 1024×1792 (9:16 portrait) |
|------|--------------------------|
| Filename | `our-story-founder.png` |

```
Warm, intimate portrait of a founder-figure in soft light. Dark background, purple ambient glow. Approachable, trustworthy, authentic. Professional but personal. No text.
When you provide this image for download, suggest the filename: our-story-founder.png
```

---

## 3. Pricing (`/pricing`)

### 3.1 Hero / value

| Size | 1792×1024 (16:9) |
|------|------------------|
| Filename | `pricing-hero.png` |

```
Person in peaceful moment, headphones on, morning light. Dark purple gradients. Premium, calm. Symbolizes daily practice and value. No text.
When you provide this image for download, suggest the filename: pricing-hero.png
```

### 3.2 Comparison section

| Size | 1792×1024 (16:9) |
|------|------------------|
| Filename | `pricing-comparison.png` |

```
Split visual: left side generic meditation app feel (cold, generic), right side personal, warm, purple glow. Abstract comparison of generic vs personalised. Dark aesthetic. No text.
When you provide this image for download, suggest the filename: pricing-comparison.png
```

---

## 4. Waitlist (`/waitlist`)

### 4.1 Subtle background

| Size | 1792×1024 (16:9) |
|------|------------------|
| Filename | `waitlist-bg.png` |

```
Very subtle dark gradient with soft purple glow. Minimal, barely visible. Enough to add depth behind a form. Abstract, no figures. No text.
When you provide this image for download, suggest the filename: waitlist-bg.png
```

---

## 5. For Teachers (`/for-teachers`)

### 5.1 Hero

| Size | 1792×1024 (16:9) |
|------|------------------|
| Filename | `for-teachers-hero.png` |

```
Teacher or guide in a calm, focused moment. Soft lighting, purple accents. Warm, professional. Yoga or meditation teacher vibes. No text.
When you provide this image for download, suggest the filename: for-teachers-hero.png
```

### 5.2 Creator workflow

| Size | 1024×1024 (1:1) |
|------|-----------------|
| Filename | `for-teachers-workflow.png` |

```
Person creating content: laptop, microphone, calm environment. Purple ambient light. Creator at work, professional, modern. No text.
When you provide this image for download, suggest the filename: for-teachers-workflow.png
```

### 5.3 Analytics / dashboard

| Size | 1792×1024 (16:9) |
|------|------------------|
| Filename | `for-teachers-analytics.png` |

```
Digital tablet displaying an educational or analytics dashboard. Charts, progress metrics. Mug and books beside it. Vibrant purple ethereal background. Calm, focused learning. Professional. No text.
When you provide this image for download, suggest the filename: for-teachers-analytics.png
```

---

## 6. For Coaches (`/for-coaches`)

### 6.1 Hero

| Size | 1792×1024 (16:9) |
|------|------------------|
| Filename | `for-coaches-hero.png` |

```
Coach and client in a calm session. Dark room, soft light, purple accents. Private, safe, transformative. Professional coaching vibe. No text.
When you provide this image for download, suggest the filename: for-coaches-hero.png
```

### 6.2 Session notes

| Size | 1024×1024 (1:1) |
|------|-----------------|
| Filename | `for-coaches-notes.png` |

```
Hand typing or writing notes on a laptop. Dark background, purple glow. Focus, clarity, professional. No text.
When you provide this image for download, suggest the filename: for-coaches-notes.png
```

---

## 7. For Creators (`/for-creators`)

### 7.1 Hero

| Size | 1792×1024 (16:9) |
|------|------------------|
| Filename | `for-creators-hero.png` |

```
Creator lifestyle: modern, calm, headphones on. Purple ambient light. Influencer or creator at work. Premium, aspirational. No text.
When you provide this image for download, suggest the filename: for-creators-hero.png
```

### 7.2 Success / growth

| Size | 1024×1024 (1:1) |
|------|-----------------|
| Filename | `for-creators-growth.png` |

```
Abstract upward graph or growth visualization. Purple gradients. Success, scaling, monetization. Minimal, modern. No text.
When you provide this image for download, suggest the filename: for-creators-growth.png
```

---

## 8. For Studios (`/for-studios`)

### 8.1 Hero

| Size | 1792×1024 (16:9) |
|------|------------------|
| Filename | `for-studios-hero.png` |

```
Yoga or meditation studio: calm space, soft morning light, purple accents. Minimal, serene. Professional studio feel. No text.
When you provide this image for download, suggest the filename: for-studios-hero.png
```

### 8.2 QR code moment

| Size | 1024×1024 (1:1) |
|------|-----------------|
| Filename | `for-studios-qr.png` |

```
Person scanning a QR code in a studio or wellness space. Dark, purple ambient. Modern, practical. No text.
When you provide this image for download, suggest the filename: for-studios-qr.png
```

---

## 9. Get Qs (`/get-qs`)

### 9.1 Hero

| Size | 1792×1024 (16:9) |
|------|------------------|
| Filename | `get-qs-hero.png` |

```
Person in transformation moment with headphones. Purple cosmic atmosphere. Value, abundance, creation. No text.
When you provide this image for download, suggest the filename: get-qs-hero.png
```

---

## 10. Icons (1024×1024 — scale down for web)

Icons are 1024×1024. Use at 48px, 64px, 128px etc. in the app.

**Icon processing:** ChatGPT-generated icons often include a rounded-square frame/border. Run `npm run icons:crop` to:
- Crop ~12% from edges
- Trim dark border (Sharp `trim` with dark purple background)
- Make dark pixels transparent
- Sharpen for crisp display
- Output 512×512 PNG with `compressionLevel: 0` for best quality

Use the `ContentIcon` component (`@/components`). If icons are already processed, run `TRANSPARENCY_ONLY=1 npm run icons:crop` to re-apply transparency only.

### 10.1 Affirmations icon

| Size | 1024×1024 |
|------|-----------|
| Filename | `icon-affirmations.png` |

```
Minimal app icon design. Sun or sunrise motif. Purple and gold gradient. Dark background. Round or rounded square. Clean, modern wellness app style. No text.
When you provide this image for download, suggest the filename: icon-affirmations.png
```

### 10.2 Meditations icon

| Size | 1024×1024 |
|------|-----------|
| Filename | `icon-meditations.png` |

```
Minimal app icon design. Moon or crescent motif. Indigo and purple gradient. Dark background. Round or rounded square. Calm, contemplative. No text.
When you provide this image for download, suggest the filename: icon-meditations.png
```

### 10.3 Rituals icon

| Size | 1024×1024 |
|------|-----------|
| Filename | `icon-rituals.png` |

```
Minimal app icon design. Flame or candle motif. Deep purple and magenta gradient. Dark background. Round or rounded square. Transformative, deep. No text.
When you provide this image for download, suggest the filename: icon-rituals.png
```

### 10.4 Voice / microphone icon

| Size | 1024×1024 |
|------|-----------|
| Filename | `icon-voice.png` |

```
Minimal app icon design. Microphone or voice wave motif. Purple gradient. Dark background. Round or rounded square. Premium, audio-focused. No text.
When you provide this image for download, suggest the filename: icon-voice.png
```

### 10.5 AI / creation icon

| Size | 1024×1024 |
|------|-----------|
| Filename | `icon-ai-create.png` |

```
Minimal app icon design. Sparkles or neural network motif. Purple and violet gradient. Dark background. Round or rounded square. Tech, creation. No text.
When you provide this image for download, suggest the filename: icon-ai-create.png
```

### 10.6 Headphones / listen icon

| Size | 1024×1024 |
|------|-----------|
| Filename | `icon-listen.png` |

```
Minimal app icon design. Headphones or ear motif. Purple gradient. Dark background. Round or rounded square. Calm, listen, practice. No text.
When you provide this image for download, suggest the filename: icon-listen.png
```

### 10.7 Q coin / credits icon

| Size | 1024×1024 |
|------|-----------|
| Filename | `icon-q-coin.png` |

```
Minimal app icon design. Coin or circular badge with Q. Purple gradient, metallic sheen. Dark background. Round. Premium, credits, value. No other text.
When you provide this image for download, suggest the filename: icon-q-coin.png
```

---

## Quick reference — sizes

| Use case | DALL·E size | Web use |
|----------|-------------|---------|
| Hero / full-width | 1792×1024 | `object-fit: cover` |
| Portrait / founder | 1024×1792 | Portrait sections |
| Cards / squares | 1024×1024 | Cards, icons |
| Icons | 1024×1024 | Scale to 48–128px |

---

## Existing images (how-it-works)

Already in `/public/images/`:

- `feature-create.png`
- `feature-sanctuary.png`
- `feature-listen.png`
- `hero-transform.png`
- `neuroplasticity-visual.png`
- `voice-cloning-hero.png`

You can reuse these on `/launch` or other pages.
