# Mobile Polish Pass — Final Status Report

**Date**: 2026-03-13  
**Status**: Production-ready baseline established

---

## Done

| Item | Notes |
|------|------|
| **PlaybackEngineProvider + MiniPlayer** | Mounted in MainNavigator; wraps Stack and renders MiniPlayer above tab bar |
| **Dead code cleanup** | Header and BottomSheet removed from layout index; Screen-only export |
| **Deprecations** | CreateModeScreen, MarketplaceScreen, SpeakScreen, HomeScreen marked `@deprecated` with JSDoc |
| **voiceUrl ?? audioUrl fallback** | `playbackStore.buildLayersFromItem` uses `voiceUrl ?? audioUrl ?? null` |
| **Quick create flow** | CreateEntryScreen → ContentCreateScreen → CreateVoiceStepScreen → ContentDetailScreen (own voice + AI voice paths wired) |
| **Main tabs** | Ritual, Library, Create, Profile (Marketplace/Speak removed from main flow) |
| **Profile, Credits, Settings, Reminders** | Accessible via Profile and stack routes |

---

## In Progress / Verify Manually

| Item | Action |
|------|--------|
| **Layout safety (320–430px)** | Verify on physical/simulator at 320, 360, 375, 390, 430 widths |
| **MiniPlayer + tab bar coexistence** | MiniPlayer uses `bottom: TAB_BAR_HEIGHT + insets.bottom`; confirm no overlap on small devices |
| **Keyboard behavior** | CreateVoiceStepScreen, ContentCreateScreen: verify keyboard avoids inputs, no layout jump |
| **Long text truncation** | Ensure `numberOfLines` on titles/descriptions where content can overflow |
| **Touch targets** | Primary buttons 44×44pt min; CreateEntryScreen cards ~88–96pt height |
| **Playback continuity** | Test: open ritual → leave → switch tabs → return; open ritual A → open ritual B |

---

## Missing / Optional Enhancements

| Item | Notes |
|------|------|
| **MiniPlayer when ended** | Currently hides when `playbackState === 'ended'`. If product wants "Tap to replay" bar after finish, add `ended` to visibility condition |
| **Explicit 320px min-width test** | Smallest target not yet validated on device |
| **Loading-state audit** | Confirm all async flows (create, render, upload) show spinners/feedback |
| **Empty-state audit** | Library, Ritual home: verify helpful empty states |

---

## Backend / Product Gaps (Decisions Needed)

None identified for this polish pass. Creation, playback, and navigation are self-contained.

---

## Architecture Summary

```
MainNavigator
├── PlaybackEngineProvider
│   └── View (flex: 1)
│       ├── Stack.Navigator (Tabs, ContentDetail, ContentCreate, CreateVoiceStep, Credits, …)
│       └── MiniPlayer (absolute, above tab bar)
└── MainTabs (Ritual | Library | Create | Profile)
```

- **playbackStore**: Global state; `voiceUrl ?? audioUrl` in `buildLayersFromItem`.
- **ContentDetailScreen**: Full ritual player; uses playbackStore and PlaybackEngineProvider.
- **MiniPlayer**: Visible when `playing` or `paused`; tap opens ContentDetail.
- **Dead/deprecated**: Header, BottomSheet (removed from exports); CreateMode, Marketplace, Speak, Home (kept, marked deprecated).
