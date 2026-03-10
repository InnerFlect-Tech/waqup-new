# Error, Loading, and Empty States — Standards

**Reference**: Phase 6 quality targets. All pages that fetch data or perform async operations should handle three states consistently.

---

## Loading State

- Use `<Loading />` from `@/components` for full-page or section loaders.
- For inline/button loading, use `Button` with `loading` prop.
- Never show a blank screen during loading — at minimum show a spinner or skeleton.

---

## Error State

- Wrap async calls in `try/catch` and surface user-friendly messages (no stack traces).
- Use `<ErrorBanner message="…" onRetry={…} />` from `@/components` for recoverable errors.
- Network/unexpected errors: "Something went wrong. Please try again." + retry button.
- Validation errors: inline under the field or in a compact banner.

---

## Empty State

- Use `<EmptyState icon={…} title="…" body="…" action={…} />` when there is no data but the user can act (e.g. "Create your first affirmation").
- Provide a clear message and a primary CTA (button or link).
- Examples: library (no content), marketplace (no items), progress (no sessions yet).

---

## Components

| Component      | Import                         | Use When                          |
|----------------|--------------------------------|------------------------------------|
| `EmptyState`   | `@/components`                 | List/grid has no items, user can create |
| `ErrorBanner`  | `@/components`                 | API failure, validation summary    |
| `Loading`      | `@/components`                 | Page or section is fetching data   |

---

## Audit Checklist (per page)

- [ ] Loading: spinner or skeleton during fetch
- [ ] Error: try/catch with user-friendly message; retry where appropriate
- [ ] Empty: EmptyState with CTA when data set is empty
