# Responsive Design — waQup Web & Mobile

Breakpoints, padding rules, and checklist for multi-viewport alignment across web and mobile app.

---

## Breakpoints (Web)

| Breakpoint | Width | Target devices |
|------------|-------|----------------|
| 320px | 320px | iPhone SE, very small phones |
| 375px | 375px | iPhone 8, small phones |
| 390px | 390px | iPhone 14 |
| 640px (sm) | 640px | Large phones, small tablets |
| 768px (md) | 768px | Tablets |
| 1024px (lg) | 1024px | Desktop |
| 1280px (xl) | 1280px | Large desktop (CONTENT_MAX_WIDTH) |

---

## Padding Rules (Web)

### Header

- **Token:** `HEADER_PADDING_X_RESPONSIVE` (`clamp(16px, 5vw, 96px)`)
- Use in `AppLayout` nav — scales down on narrow viewports
- Mobile menu: same responsive padding

### Landing & marketing sections

- **Hero / sections:** `padding: 0 clamp(16px, 4vw, 32px)`
- **Overrides (globals.css):**
  - `@media (max-width: 640px)`: `.landing-hero`, `.landing-section` → 24px
  - `@media (max-width: 375px)`: 16px

### Page content

- **PageShell:** `clamp(PAGE_PADDING, 5vw, HEADER_PADDING_X)` for horizontal padding when centered
- **Footer:** `.footer-inner` — 24px at 768px, 16px at 375px

---

## Key Patterns

### No overflow clipping

- Avoid `overflow: hidden` on hero sections that contain large text/logos
- Use `minWidth: 0` on flex containers to prevent flex items from forcing overflow
- Logo font-size: `clamp(32px, 8vw, 100px)` for hero — ensures "waQup" fits at 320px

### Responsive typography

- Headlines: `clamp(36px, 5vw, 56px)` or similar
- Body: `clamp(14px, 1.8vw, 17px)`
- Use `clamp()` for fluid scaling — avoids media queries for most cases

### Grids

- `grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))` for cards
- `minmax(220px, 1fr)` for denser layouts
- Tables (admin): wrap in `overflow-x: auto` for horizontal scroll on small screens

---

## Mobile App (React Native)

- **Screen component:** Uses `useSafeAreaInsets` with `safeAreaTop` and `safeAreaBottom` (default: true)
- **Padding:** `spacing.md` (16px) when `padding={true}`
- **Touch targets:** Minimum 44pt (Apple HIG / Android)
- **Flex:** Avoid fixed widths in px — use `flex`, `width: '100%'`, or percentage

---

## E2E Tests (Web)

Responsive tests live in:

- `e2e/specs/public/landing.spec.ts` — 320, 375, 390px overflow + hero visibility
- `e2e/specs/responsive/mobile-viewport.spec.ts` — how-it-works, pricing, our-story overflow at 375px
- `e2e/helpers/navigation.helper.ts` — `assertNoHorizontalOverflow(page)`

---

## Checklist for New Pages

- [ ] No horizontal overflow at 320px, 375px, 390px
- [ ] Padding uses `clamp()` or media queries (no fixed 32px on mobile)
- [ ] Hero/headline text scales with viewport
- [ ] Modals/drawers: `min(320px, 90vw)` width
- [ ] Tables: `overflow-x: auto` wrapper
- [ ] Run `assertNoHorizontalOverflow` in E2E for new marketing routes
