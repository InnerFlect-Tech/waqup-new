# Full Codebase Analysis – waQup Rebuild

**Purpose**: Single source of truth for code reduction opportunities, duplicates, functions to improve, and best-practice alignments. Uses Context7 references and `.cursorrules` standards.

**References**:
- `.cursorrules` – DRY principle, shared code placement, architecture
- `docs/02-mobile/03-implementation.md` – Implementation patterns
- `docs/03-platforms/01-multi-platform-strategy.md` – Multi-platform standards
- `docs/04-reference/07-design-system-cross-platform.md` – Theme/token architecture
- `docs/04-reference/04-pages-comparison.md` – Pages SSOT, sitemap

**Last Updated**: 2026-02-16

---

## Executive Summary

| Area | Findings | Est. Impact |
|------|----------|--------------|
| **Duplicates** | 5 major categories | ~300–400 lines reducible |
| **Shared logic** | Content type icons/colors, menu items, layouts | Move to `@waqup/shared` or shared web utils |
| **Route data** | Pages vs Sitemap use different structures | One canonical source |
| **Scripts** | 9 scripts duplicate Supabase client setup | Shared script util |
| **Legacy/Stale** | `waqup-new/waqup-new/` nested folder | Potential cleanup |

---

## 1. Duplicates & Redundancies

### 1.1 Content Type Helpers (High impact)

**Location**: `ContentListPage.tsx`, `LibraryPage`, `MarketplacePage`

**Issue**: `getTypeIcon` and `getTypeColor` duplicated 3 times with nearly identical logic.

```ts
// ContentListPage + Library + Marketplace each have:
const getTypeIcon = (type) => { switch (type) { case 'ritual': return Music; ... } };
const getTypeColor = (type) => { switch (type) { case 'ritual': return 'default'; ... } };
```

**Recommendation**: Add to `@waqup/shared/utils` or `packages/web/src/lib/content-helpers.ts`:

```ts
// packages/shared/src/utils/content-helpers.ts (or web lib)
export function getContentTypeIcon(type: ContentItemType): LucideIcon { ... }
export function getContentTypeBadgeVariant(type: ContentItemType): 'default' | 'success' | 'info' { ... }
```

**Ref**: `.cursorrules` – "Utility functions" in shared; "No duplicate utility functions"

**Est. reduction**: ~40 lines

---

### 1.2 Sanctuary Create Layouts (High impact)

**Location**: 
- `app/sanctuary/affirmations/create/layout.tsx`
- `app/sanctuary/meditations/create/layout.tsx`
- `app/sanctuary/rituals/create/layout.tsx`

**Issue**: Three nearly identical layout files; only `contentType` prop differs.

**Recommendation**: Single shared layout component with dynamic route param, or one reusable layout:

```ts
// app/sanctuary/[type]/create/layout.tsx - OR -
// components/shared/ContentCreateLayout.tsx
export function ContentCreateLayout({ contentType, children }: { contentType: ContentItemType; children: ReactNode }) {
  return (
    <ContentCreationProvider contentType={contentType}>
      <PageShell intensity="medium">
        <div style={{ ... }}>{children}</div>
      </PageShell>
    </ContentCreationProvider>
  );
}
```

Then each create folder uses a minimal layout that passes `contentType`.

**Ref**: `docs/04-reference/07-design-system-cross-platform.md`; `.cursorrules` – "No duplicate components"

**Est. reduction**: ~45 lines (3 × 15 lines → 1 × 15 + 3 × 2)

---

### 1.3 MenuItem / QuickAction Interfaces & Data (Medium impact)

**Location**: `(main)/home/page.tsx`, `sanctuary/page.tsx`, `(main)/profile/page.tsx`

**Issue**: Same `MenuItem` and `QuickAction` interfaces and similar `MENU_ITEMS` / `QUICK_ACTIONS` data repeated. Minor icon differences (e.g., `Sparkles` vs `Plus` for Create, `GraduationCap` vs `BookOpen` for Learn).

**Recommendation**: Shared types and canonical menu config in `packages/web/src/lib/navigation.ts` (or `@waqup/shared` if used by mobile):

```ts
export interface MenuItem { name: string; description: string; icon: LucideIcon; href: string; count?: number; }
export const SANCTUARY_MENU_ITEMS: MenuItem[] = [ ... ];
export const HOME_QUICK_ACTIONS: QuickAction[] = [ ... ]; // icon variant per page if needed
```

**Est. reduction**: ~60 lines

---

### 1.4 ContentItem Interface Duplication (Medium impact)

**Location**: `packages/web/app/(main)/library/page.tsx` defines local `ContentItem`; `@/components/content/ContentItem.ts` has canonical type

**Issue**: Library page uses its own `interface ContentItem` instead of importing from `@/components/content`.

**Recommendation**: 
```ts
// library/page.tsx - change to:
import type { ContentItem } from '@/components/content';
```
Ensure `ContentItem` in `ContentItem.ts` has all fields Library needs (`frequency`, `lastPlayed`, etc.). Or move to `@waqup/shared/types` if shared across platforms.

**Ref**: `.cursorrules` – "Types MUST be shared, never duplicated"

**Est. reduction**: ~10 lines + type coherence

---

### 1.5 Route Data – Pages vs Sitemap (Medium impact)

**Location**: `app/pages/page.tsx` (WITHOUT_AUTH, WITH_AUTH), `app/sitemap-view/page.tsx` (SITEMAP_ROUTES)

**Issue**: Two different representations of routes. Docs (04-pages-and-themes-reference.md) recommend: "Keep one canonical list and reuse it for both Pages Index and Sitemap."

**Recommendation**: Create `packages/web/src/lib/routes.ts`:

```ts
export interface AppRoute { path: string; section: string; description?: string; status?: RouteStatus; }
export const APP_ROUTES: AppRoute[] = [ ... ]; // single source
// pages/page.tsx and sitemap-view/page.tsx both consume this
```

**Ref**: `docs/04-reference/04-pages-comparison.md` – "Keep one canonical list" for routes

**Est. reduction**: ~50 lines + single source of truth

---

## 2. Scripts – Supabase Client Duplication (Medium impact)

**Location**: 9 scripts in `scripts/` each instantiate Supabase client:

- `test-payment-flow.ts`, `test-beta-flow.ts`, `setup-database.ts`, `reset-and-migrate.ts`, `list-tables.ts`, `create-user.ts`, `create-admin.ts`, `check-profiles.ts`, `apply-migration.ts`

**Issue**: Each does:
```ts
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseUrl, supabaseServiceKey);
```

**Recommendation**: Shared script util `scripts/lib/supabase.ts`:

```ts
import { createClient } from '@supabase/supabase-js';
export const getSupabaseAdmin = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

**Est. reduction**: ~30 lines across scripts

---

## 3. Functions to Improve (Best Practices)

### 3.1 Error Handling Consistency

**Location**: Auth flows (login, signup), API usage

**Issue**: Some catch blocks use `console.error` only; others use `normalizeAuthError`. Inconsistent user-facing messages.

**Recommendation**: Centralize in `@/lib/auth-errors` (exists) and ensure all auth surfaces use `normalizeAuthError`. Document pattern in `docs/02-mobile/03-implementation.md`.

**Ref**: `.cursorrules` – "Proper error handling", "User-friendly messages"

---

### 3.2 Form Patterns (Login / Signup)

**Location**: `(auth)/login/page.tsx`, `(auth)/signup/page.tsx`

**Issue**: Both follow similar patterns (useForm, zodResolver, useEffect for setError(null), similar structure). Could extract shared `useAuthForm` or `AuthFormLayout`.

**Recommendation**: Extract shared `AuthFormWrapper` with common layout (Logo, GlassCard, spacing) and form boilerplate. Keeps pages focused on fields and submit logic.

**Est. reduction**: ~80 lines

---

### 3.3 TypeScript Strictness

**Location**: `library/page.tsx` line 391: `getTypeColor(item.type) as any`

**Issue**: `as any` bypasses type safety.

**Recommendation**: Fix `getTypeColor` return type to match `Badge` variant, or narrow library `ContentItem.type` to `ContentItemType` and remove cast.

---

### 3.4 Loading / Empty States

**Ref**: `.cursorrules` – "Loading states", "Empty states", "Beautiful empty states"

**Recommendation**: Audit pages (Library, Marketplace, Create, Profile) for consistent loading skeletons and empty states. Ensure all list views have empty-state UX.

---

## 4. Legacy / Stale Structure

### 4.1 Nested `waqup-new/waqup-new/` Folder

**Location**: Root contains `waqup-new/` with nested `waqup-new/` (scripts, app, packages with old theme files).

**Issue**: Old theme files (colors, spacing, typography, shadows, borders, themes) still present in nested structure. Design system has been consolidated to `@waqup/shared/theme`. Possible duplicate/legacy copy.

**Recommendation**: Verify if `waqup-new/waqup-new/` is used by any build or scripts. If not, consider removing or archiving to reduce confusion.

---

### 4.2 `app/` at Repo Root (Outside packages/web)

**Location**: `app/` (and `waqup-new/app/`) with `lib/supabase/client`, `lib/contexts/`, etc.

**Issue**: May be an older Next.js structure. Current web app lives in `packages/web/`. Ensure no dangling imports or duplicate Supabase clients.

**Recommendation**: Confirm build only uses `packages/web`. If root `app/` is unused, remove or document as legacy.

---

## 5. Best Practice Alignment Checklist

| Rule (.cursorrules) | Status | Action |
|--------------------|--------|--------|
| Business logic in shared | ✅ Theme, auth, schemas | Continue |
| No duplicate types | ⚠️ ContentItem in Library | Use shared |
| No duplicate utilities | ⚠️ getTypeIcon, getTypeColor | Move to shared |
| No duplicate components | ⚠️ 3× create layouts | Consolidate |
| Proper error handling | ⚠️ Inconsistent | Centralize |
| Loading states | ⚠️ Audit needed | Add where missing |
| Empty states | ⚠️ Audit needed | Add where missing |

---

## 6. Priority Order for Refactors

1. **High (Do first)**: Content type helpers → shared; ContentCreateLayout consolidation; ContentItem in Library → shared
2. **Medium**: Menu/QuickAction config; Route data SSOT; Scripts Supabase util
3. **Lower**: Auth form extraction; Loading/empty state audit; Legacy folder cleanup

---

## 7. Context7 Queries for Follow-up

- "What are the implementation patterns for React Native and forms?" → `docs/02-mobile/03-implementation.md`
- "What is the multi-platform strategy and shared code rules?" → `docs/03-platforms/01-multi-platform-strategy.md`, `.cursorrules`
- "What is the design system structure?" → `docs/04-reference/07-design-system-cross-platform.md`
- "What pages exist and what is redundant?" → `docs/04-reference/04-pages-comparison.md`, `docs/04-reference/09-current-vs-final-solution.md`

---

---

## 8. Implementation Status (2026-02-16)

| Item | Status |
|------|--------|
| Content type helpers (getTypeIcon, getTypeColor) | ✅ Done – shared `@waqup/shared/utils` + web `@/lib/content-helpers` |
| Sanctuary create layouts | ✅ Done – `ContentCreateLayout` component, 3 thin layouts |
| MenuItem / QuickAction | ✅ Done – `@/lib/navigation` with HOME_QUICK_ACTIONS, SANCTUARY_*, PROFILE_* |
| ContentItem in Library | ✅ Done – uses `@waqup/shared/types` |
| Route data SSOT | ✅ Done – `@/lib/routes` with APP_ROUTES, pages + sitemap consume it |
| Scripts Supabase util | ⏭ Skipped – scripts folder structure changed (waqu-app deleted) |
| Auth form extraction | ⏭ Deferred – lower priority |

---

**Next Step**: Use this doc as a checklist when implementing future refactors.
