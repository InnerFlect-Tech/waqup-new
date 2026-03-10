# App Store Submission — Required Steps

## Pre-Submission Checklist

- [ ] `eas.json` submit.production.ios: Replace `REPLACE_WITH_*` with real Apple ID, ASC App ID, Team ID
- [ ] `packages/mobile/.env`: Set `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (from RevenueCat Dashboard)
- [ ] App Store Connect: App metadata, screenshots, privacy policy URL
- [ ] TestFlight: Upload build, add internal testers, run smoke tests
- [ ] RevenueCat: Products/offerings configured; webhook pointed at backend for Q grants

---

Before running `eas submit --platform ios --profile production`, update `eas.json` with real credentials:

## iOS Credentials (eas.json)

| Field | Where to find it |
|---|---|
| `appleId` | Your Apple Developer account email |
| `ascAppId` | App Store Connect → Your App → App Information → Apple ID (numeric) |
| `appleTeamId` | developer.apple.com → Account → Membership → Team ID (10 chars) |

## Environment Variables (packages/mobile/.env)

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
EXPO_PUBLIC_API_URL=https://waqup.app
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## RevenueCat Setup

1. Create a RevenueCat account at rev.cat
2. Create a new iOS app with bundle ID `com.waqup.app`
3. Connect it to your App Store Connect app
4. Create Products in App Store Connect:
   - `com.waqup.credits.50` — Consumable, $4.99
   - `com.waqup.credits.200` — Consumable, $14.99
   - `com.waqup.credits.500` — Consumable, $29.99
5. In RevenueCat, create an Offering called "default" with packages matching the product IDs
6. Copy the RevenueCat iOS API key to `EXPO_PUBLIC_REVENUECAT_IOS_KEY`
7. Set up the RevenueCat webhook → your backend to grant Qs after purchase

## Android Credentials

1. Create a Google Play service account at play.google.com/console
2. Download the JSON key file
3. Place it at `packages/mobile/google-services-key.json` (gitignored)

## Final Build Command

```bash
cd packages/mobile
eas build --platform ios --profile production
eas submit --platform ios --profile production
```
