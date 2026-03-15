# Affirmations Page Redesign — Premium Track Library

**Date**: 2026-03-16  
**Status**: Implemented

## 1. Audit

**Should the page remain "Affirmations"?**

- **Recommendation**: Keep route `/sanctuary/affirmations` for navigation consistency, but use a more user-facing label: **"Affirmation tracks"**.
- Rationale: "Affirmations" is taxonomy-driven; "Affirmation tracks" signals media/library and aligns with Spotify/Calm/Apple Music mental model.

## 2. Naming Direction

| Before | After |
|--------|-------|
| Affirmations | Affirmation tracks |
| Your affirmations for cognitive re-patterning | Short, repeatable tracks for identity change |
| Create Affirmation | Create track |
| Search affirmations... | Search your tracks... |

## 3. Improved Copy

**Page framing:**
- **Title**: Affirmation tracks
- **Subtitle**: Short, repeatable tracks for identity change.
- **Alternatives considered**: "Fast, repeatable tracks for inner rewiring", "Short audio tracks for belief change"

**Card hierarchy:**
- Clean display title (never raw prompts)
- One-line emotional/functional subtitle (from description)
- Metadata: voice type, duration, recency
- Draft labels: "Untitled draft", "Draft in progress", "Needs review"

## 4. Implementation Summary

### Display title layer (`getContentDisplayInfo`)

- **Location**: `packages/shared/src/utils/content-helpers.ts`
- Strips prompt prefixes ("I want to...", "Help me to...")
- Title-cases cleaned strings
- Detects nonsense titles (>80 chars, multiline, punctuation-only) → "Untitled draft"
- Draft labels by status + content state

### ContentListPage enhancements

- `useDisplayTitle`: Uses `getContentDisplayInfo` for card titles/subtitles
- `createInHeaderOnly`: Create action only in header; no create card in grid
- `continueListeningItem`: "Continue listening" row for most recently played
- `searchPlaceholder`, `createCardSubtitle`: Customizable copy

### Affirmations page

- New copy (title, description, labels)
- `createInHeaderOnly: true`
- `useDisplayTitle: true`
- `continueListeningItem`: Most recently played affirmation
- `searchPlaceholder`: "Search your tracks..."

## 5. Design Principles

- **Premium media feel**: Spotify/Calm/Apple Music for personal subconscious audio
- **No CMS/admin vibe**: Clean titles, draft labels, media-card hierarchy
- **waQup dark luminous design system**: Preserved (glass, gradients, blur)
- **Create action**: Top CTA; does not compete with content cards in grid
