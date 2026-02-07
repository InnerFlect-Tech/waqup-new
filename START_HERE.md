# 🚀 waQup Mobile App - Start Here

**Welcome to the waQup mobile app rebuild project!**

This document will guide you through getting started with development.

---

## 📋 Quick Start Checklist

### ✅ Prerequisites
- [ ] Node.js 20.9.0+ (LTS) or Node.js 22+ (LTS) installed
- [ ] npm or yarn installed
- [ ] Git configured
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Xcode (for iOS) or Android Studio (for Android) - optional for web preview
- [ ] Supabase account and project
- [ ] OpenAI API key
- [ ] Stripe account (for payments)

### ✅ Initial Setup (Phase 1 - Step 1.1)

**Next Task**: Initialize platform projects (Mobile + Web) simultaneously

**Commands to Run**:
```bash
# 1. Initialize Mobile (React Native + Expo)
npx create-expo-app@latest packages/mobile --template blank-typescript

# 2. Initialize Web (Next.js)
npx create-next-app@latest packages/web --typescript --app --tailwind --eslint

# 3. Set up monorepo workspace
# Configure package.json workspaces
```

**See**: `rebuild-roadmap/02-phases/01-phase-01-project-foundation.md` for detailed steps

---

## 🎯 Current Phase

**Phase 1: Project Foundation** - Step 1.1

**Status**: ⏳ Ready to Start

**Goal**: Set up both platforms (Mobile + Web) simultaneously with shared codebase

---

## 📚 Essential Documentation

### Before Starting
1. **Read**: `rebuild-roadmap/01-planning/01-roadmap.md` - Complete roadmap
2. **Read**: `rebuild-roadmap/02-phases/01-phase-01-project-foundation.md` - Current phase details
3. **Read**: `docs/02-mobile/01-technology-stack.md` - Tech stack decisions
4. **Read**: `docs/03-platforms/01-multi-platform-strategy.md` - Multi-platform strategy

### During Development
- **Architecture**: `docs/02-mobile/02-architecture.md`
- **Implementation**: `docs/02-mobile/03-implementation.md`
- **Browser Strategy**: `docs/03-platforms/02-browser-optimization-strategy.md`

---

## 🔄 Development Workflow

### Step-by-Step Process

1. **Read Phase Analysis**: Check `rebuild-roadmap/02-phases/01-phase-XX-*.md`
2. **Read Step Details**: Follow implementation steps in phase doc
3. **Implement**: Code the feature
4. **Test**: Test on all platforms (Mobile, Desktop, Web)
5. **Update Changelog**: Mark step complete in `rebuild-roadmap/03-tracking/01-changelog.md`
6. **Commit**: Commit with descriptive message
7. **Move to Next Step**: Continue to next step in phase

### Testing Strategy

**All Platforms Simultaneously**:
- Test on Mobile (iOS/Android)
- Test on Desktop (macOS/Windows/Linux)
- Test on Web (Chrome-first)

**Quality Standards**:
- 60fps animations
- < 100ms touch/click response
- WCAG 2.1 AA accessibility
- UI consistency across platforms

---

## 📝 Next Steps

### Immediate Next Task

**Phase 1 - Step 1.1**: Initialize All Platform Projects

**Tasks**:
1. Create monorepo structure
2. Initialize Mobile project (React Native + Expo)
3. Initialize Desktop project (Tauri)
4. Verify Web project (Next.js)
5. Set up shared codebase structure
6. Configure workspace

**See**: `rebuild-roadmap/02-phases/01-phase-01-project-foundation.md` → Step 1.1

---

## 🎨 Design Principles

- **Voice-First**: Audio is primary, text/visual secondary
- **Three Content Types**: Affirmations, Meditations, Rituals (NOT interchangeable)
- **Conversation Over Forms**: All creation through dialogue
- **Practice is Free**: Unlimited replay, credits only for creation
- **User Autonomy**: No manipulation, easy exit

---

## 🔗 Important Links

- **Roadmap**: `rebuild-roadmap/01-planning/01-roadmap.md`
- **Changelog**: `rebuild-roadmap/03-tracking/01-changelog.md`
- **Schema Verification**: `rebuild-roadmap/01-planning/02-schema-verification.md`
- **Product Docs**: `../../docs/internal/` (main project)

---

## 💡 Tips

1. **Use Context7**: Query documentation when needed (see `docs/04-reference/01-context7-usage.md`)
2. **Follow .cursorrules**: All project context is in `.cursorrules`
3. **Update Changelog**: Track progress in `rebuild-roadmap/03-tracking/01-changelog.md`
4. **Test Simultaneously**: Test all platforms together
5. **Document Decisions**: Update docs as you go

---

**Ready to start?** Begin with **Phase 1 - Step 1.1**!

**Last Updated**: 2026-02-07
