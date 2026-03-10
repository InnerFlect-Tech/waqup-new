# Conversation Closure — Page-Specific Document Titles

**Conversation**: Browser tab showing "waQup" on every page; user wanted each page to show its own name.  
**Date**: 2026-03-10

---

## 1. What This Conversation Attempted

Make each page show its own title in the browser tab (e.g., "Library — waQup", "Settings — waQup") instead of every page showing "waQup".

---

## 2. Status of Each Item

| Item | Status | Notes |
|------|--------|------|
| Page-specific titles for main routes (library, speak, create, marketplace, profile) | **Done** | Implemented via layout `generateMetadata` + i18n |
| Page-specific titles for sanctuary routes | **Done** | Same pattern; `t('pages.sanctuary')`, `t('pages.credits')`, etc. |
| Page-specific titles for auth routes | **Done** | `t('pages.login')`, `t('pages.signup')`, etc. |
| Page-specific titles for onboarding, join, waitlist, explanation, coming-soon | **Done** | Same pattern |
| Root layout template `%s — waQup` | **Done** | In `[locale]/layout.tsx` |
| QCoin `size={18}` build error (sanctuary page) | **Resolved** | Now uses `size="sm"`; fixed in later work |
| Original layout paths (`app/(main)/`, etc.) | **Superseded** | Project restructured to `[locale]`; layouts migrated with i18n |
| Marketplace item detail (`/marketplace/[id]`) dynamic title | **Deferred** | Tab shows "Marketplace"; adding generateMetadata for item name would require server wrapper. Low priority. |

---

## 3. Current Implementation

- **Location**: All routes under `app/[locale]/`
- **Pattern**: Each segment has a `layout.tsx` with `generateMetadata` using `getTranslations({ locale, namespace: 'metadata' })` and `t('pages.xxx')`
- **Source of truth**: `packages/web/messages/en/metadata.json` (and other locales) defines `pages.library`, `pages.sanctuary`, etc.
- **Template**: `[locale]/layout.tsx` has `title: { default: 'waQup', template: '%s — waQup' }`

---

## 4. Database

No database changes. N/A.

---

## 5. Open Items Page

- **Resolved**: Added "Page-specific document titles" to resolved section.
- **Deferred**: Added "Marketplace item detail — tab shows Marketplace; could add generateMetadata for item name (low priority)".

---

## 6. Action Still Required?

**No.** All primary routes show correct page titles. Marketplace [id] dynamic title is optional polish.
