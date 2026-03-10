# Button Design Tokens

**Purpose**: Single source of truth for button padding, spacing, border radius, and icon sizing across waQup Web and Mobile.

---

## Canonical Tokens

From `packages/shared/src/theme/tokens.ts`:

| Token | Value | Use case |
|-------|-------|----------|
| `buttonTokens.borderRadius` | 16px | Pill-like rounded corners for all buttons |
| `buttonTokens.iconGap` | 8px | Gap between icon and text (matches `spacing.sm`) |
| `buttonTokens.iconSize.sm` | 14px | Icon size for `size="sm"` buttons |
| `buttonTokens.iconSize.md` | 16px | Icon size for `size="md"` buttons |
| `buttonTokens.iconSize.lg` | 20px | Icon size for `size="lg"` buttons |
| `buttonTokens.paddingX.sm` | 16px | Horizontal padding for small buttons |
| `buttonTokens.paddingX.md` | 24px | Horizontal padding for medium buttons |
| `buttonTokens.paddingX.lg` | 32px | Horizontal padding for large buttons |
| `buttonTokens.paddingY.sm` | 8px | Vertical padding for small buttons |
| `buttonTokens.paddingY.md` | 12px | Vertical padding for medium buttons |
| `buttonTokens.paddingY.lg` | 16px | Vertical padding for large buttons |
| `buttonTokens.minHeight.sm` | 32px | Minimum height for small buttons |
| `buttonTokens.minHeight.md` | 44px | Minimum height for medium buttons (touch target) |
| `buttonTokens.minHeight.lg` | 52px | Minimum height for large buttons |
| `buttonTokens.iconOnlySize` | 40px | Size for icon-only buttons (square) |

---

## Web Usage

```ts
import { BUTTON_TOKENS } from '@/theme';

// In Button component or custom CTA
<Button style={{
  borderRadius: BUTTON_TOKENS.borderRadius,
  paddingLeft: BUTTON_TOKENS.paddingX.lg,
  paddingRight: BUTTON_TOKENS.paddingX.lg,
  gap: BUTTON_TOKENS.iconGap,
}}>
  <Plus size={20} />  {/* Use BUTTON_TOKENS.iconSize.lg for size="lg" */}
  Get more credits
</Button>
```

The shared `Button` component already uses `BUTTON_TOKENS` internally. For custom buttons or CTAs, import and use these tokens.

---

## Icon Sizing in Buttons

When placing an icon inside a Button, use the size that matches the button:

| Button size | Icon size |
|-------------|-----------|
| `sm` | 14px (`BUTTON_TOKENS.iconSize.sm`) |
| `md` | 16px (`BUTTON_TOKENS.iconSize.md`) |
| `lg` | 20px (`BUTTON_TOKENS.iconSize.lg`) |

**Do not** add `marginRight` or `marginLeft` to icons inside buttons — the Button uses `gap: BUTTON_TOKENS.iconGap` for spacing.

---

## Related Docs

- Spacing guide: `docs/04-reference/17-spacing-usage-guide.md`
- Design system: `docs/04-reference/07-design-system-cross-platform.md`

---

**Last Updated**: 2026-03-08
