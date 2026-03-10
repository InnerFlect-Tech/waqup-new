# iOS EAS Build + RevenueCat — Setup Guide

**Location**: `packages/mobile/` — Expo EAS Build for iOS (and Android).

---

## eas.json

Located at `packages/mobile/eas.json`. Before submission, founders must replace placeholders in `submit.production.ios`:

| Key | Placeholder | Where to get it |
|-----|-------------|-----------------|
| `appleId` | `REPLACE_WITH_YOUR_APPLE_ID@email.com` | Apple Developer account email |
| `ascAppId` | `REPLACE_WITH_APP_STORE_CONNECT_APP_ID` | App Store Connect → Your App → App Information → Apple ID (numeric) |
| `appleTeamId` | `REPLACE_WITH_10_CHAR_TEAM_ID` | developer.apple.com → Account → Membership → Team ID |

Build profiles (`development`, `preview`, `production`) are pre-configured. Use `production` for App Store submission.

---

## RevenueCat

IAP is handled via RevenueCat. The app uses `react-native-purchases`.

### Env Vars (packages/mobile/.env)

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | RevenueCat iOS API key — from Dashboard → Project → API Keys |
| `REVENUECAT_WEBHOOK_SECRET` | Backend only — webhook authorization for purchase callbacks |

Copy from `packages/mobile/.env.example` and fill in real values.

### Setup Steps

1. Create RevenueCat account at rev.cat
2. Create iOS app with bundle ID `com.waqup.app`
3. Connect to App Store Connect app
4. Create products in App Store Connect (consumables for Q packs)
5. Create Offering in RevenueCat with matching package IDs
6. Copy iOS API key → `EXPO_PUBLIC_REVENUECAT_IOS_KEY`
7. Configure webhook → backend endpoint to grant Qs after purchase; set `REVENUECAT_WEBHOOK_SECRET`

---

## Full Submission Flow

See `packages/mobile/SUBMISSION.md` for the complete pre-submission checklist and commands.
