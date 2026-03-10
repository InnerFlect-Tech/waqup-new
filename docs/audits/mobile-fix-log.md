# Mobile UI Audit – Fix Log

**Audit Date**: 2026-03-10

## Fixes Applied

| Date | Phase | Change |
|------|-------|--------|
| 2026-03-10 | A | Created audit docs: mobile-ui-audit-report.md, mobile-page-issues.md, mobile-fix-log.md |
| 2026-03-10 | A | Documented device matrix and SafeAreaProvider status |
| 2026-03-10 | B | Phone mockups (how-it-works, launch): responsive width `min(270px, 85vw)`, aspectRatio 1/2 |
| 2026-03-10 | B | SPEAK_BOTTOM_UI_HEIGHT: `min(220px, 35vh)` for small viewports |
| 2026-03-10 | B | Create/Conversation: height→minHeight 100dvh, safe-area-inset-bottom on paddingBottom |
| 2026-03-10 | B | Library/ContentListPage cards: already use WebkitLineClamp + overflow for ellipsis |
| 2026-03-10 | C | Added @media (max-width: 375px) for hero, pricing, footer padding |
| 2026-03-10 | C | ShareModal, AddVoiceModal: verified responsive (ShareModal uses min(420px, calc(100vw - 32px))) |
| 2026-03-10 | D | Added SafeAreaProvider at root in packages/mobile/src/app/App.tsx |
| 2026-03-10 | D | BottomSheet already uses insets.bottom; screens use scrollable where needed |
| 2026-03-10 | E | iconOnlySize 40 → 44 in shared tokens (touch target compliance) |
| 2026-03-10 | E | Mobile Input error/helperText: variant small (12px) → caption (14px) for readability |
| 2026-03-10 | G | Playwright config + e2e/mobile-viewport.spec.ts for viewport audit; test:e2e script |
