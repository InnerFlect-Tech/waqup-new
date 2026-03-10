# Mobile messages (i18n)

Messages mirror `packages/web/messages/` structure for consistency. Keep in sync when updating copy.

- **auth** – Login, signup, forgot password, validation
- **common** – Shared UI strings (buttons, labels, errors)
- **nav** – Tab and navigation labels

To add a new locale: create `packages/mobile/messages/<locale>/` with the same JSON files and register in `packages/mobile/src/i18n/index.ts`.
