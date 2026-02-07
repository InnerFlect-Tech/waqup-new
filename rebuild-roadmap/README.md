# waQup Mobile App Rebuild - Roadmap & Planning

**Purpose**: Complete roadmap and planning for mobile app rebuild

---

## 📋 Table of Contents

1. [Structure](#structure)
2. [Quick Navigation](#quick-navigation)
3. [Development Setup](#development-setup)
   - [Quick Start (Automated Setup)](#-quick-start-automated-setup)
   - [Prerequisites](#prerequisites)
   - [Local Development (Manual Setup)](#local-development-manual-setup)
     - [Windows](#local-development-windows)
     - [Linux/macOS](#local-development-linuxmacos)
4. [Development Pipeline](#development-pipeline)
5. [Production Pipeline](#production-pipeline)
6. [How to Use](#how-to-use)
7. [Key Principles](#key-principles)

---

## Structure

```
rebuild-roadmap/
├── README.md                    # This file
│
├── 01-planning/                 # Planning documents
│   ├── 01-roadmap.md           # Main roadmap (13 phases)
│   └── 02-schema-verification.md # Database schema analysis
│
├── 02-phases/                   # Phase analyses
│   ├── 01-phase-01-project-foundation.md
│   └── [More phases...]
│
└── 03-tracking/                 # Tracking & templates
    ├── 01-changelog.md         # Step completion tracking
    ├── 02-analysis-template.md # Phase analysis template
    └── 03-step-tracking.md     # Step tracking template
```

---

## Quick Navigation

### 📋 Planning (`01-planning/`)
- **[01 Roadmap](./01-planning/01-roadmap.md)** - Complete rebuild roadmap (13 phases, 50+ steps)
- **[02 Schema Verification](./01-planning/02-schema-verification.md)** - Database schema analysis

### 🔍 Phase Analyses (`02-phases/`)
- **[00 Phase 0: Research & Planning](./02-phases/00-phase-00-research-planning.md)** - ✅ Complete
- **[01 Phase 1: Project Foundation](./02-phases/01-phase-01-project-foundation.md)** - Detailed analysis
- **[02 Phase 2: Design System & UI Foundation](./02-phases/02-phase-02-design-system-ui-foundation.md)** - Stub ready
- **[03 Phase 3: Authentication System](./02-phases/03-phase-03-authentication-system.md)** - Stub ready
- **[04 Phase 4: Core Pages Structure](./02-phases/04-phase-04-core-pages-structure.md)** - Stub ready
- **[05 Phase 5: Content Definitions & Types](./02-phases/05-phase-05-content-definitions-types.md)** - Stub ready
- **[06 Phase 6: Error Handling & Validation](./02-phases/06-phase-06-error-handling-validation.md)** - Stub ready
- **[07 Phase 7: API Integration](./02-phases/07-phase-07-api-integration.md)** - Stub ready
- **[08 Phase 8: Audio System](./02-phases/08-phase-08-audio-system.md)** - Stub ready
- **[09 Phase 9: AI Integration](./02-phases/09-phase-09-ai-integration.md)** - Stub ready
- **[10 Phase 10: Payment & Credits](./02-phases/10-phase-10-payment-credits.md)** - Stub ready
- **[11 Phase 11: Performance Optimization](./02-phases/11-phase-11-performance-optimization.md)** - Stub ready
- **[12 Phase 12: Testing & Quality Assurance](./02-phases/12-phase-12-testing-quality-assurance.md)** - Stub ready
- **[13 Phase 13: App Store Preparation](./02-phases/13-phase-13-app-store-preparation.md)** - Stub ready

### 📊 Tracking (`03-tracking/`)
- **[01 Changelog](./03-tracking/01-changelog.md)** - Step completion tracking
- **[02 Analysis Template](./03-tracking/02-analysis-template.md)** - Template for phases
- **[03 Step Tracking](./03-tracking/03-step-tracking.md)** - Template for steps

---

## Development Setup

### 🚀 Quick Start (Automated Setup)

**Easiest way to set up your development environment!**

We provide automated setup scripts that handle all the installation steps for you:

**Windows**:
```powershell
# Run from project root directory
.\scripts\setup-windows.ps1
```

**Linux/macOS**:
```bash
# Run from project root directory
./scripts/setup-linux.sh
```

**What the scripts do**:
- ✅ Check and verify Node.js, npm, and Git installation
- ✅ Install Expo CLI globally
- ✅ Install all project dependencies
- ✅ Create `.env` file from `.env.example`
- ✅ Verify Android SDK setup (if applicable)
- ✅ Check macOS development tools (Xcode, CocoaPods) on macOS

**After running the script**:
1. Edit `.env` file with your API keys and credentials
2. Run `npm run dev:all` (or `npm run dev:all:win` on Windows) to start development servers
3. Start coding! 🎉

---

### Prerequisites

**Required for All Platforms**:
- **Node.js**: 20.9.0+ (LTS) or Node.js 22+ (LTS)
- **npm**: 10.0.0+ (comes with Node.js)
- **Git**: Latest version
- **Code Editor**: VS Code or Cursor (recommended)

**Platform-Specific Requirements**:

**For Mobile Development**:
- **Expo CLI**: `npm install -g expo-cli`
- **iOS Development** (macOS only):
  - Xcode 15.0+ (via App Store)
  - Xcode Command Line Tools: `xcode-select --install`
  - CocoaPods: `sudo gem install cocoapods`
- **Android Development**:
  - Android Studio (latest)
  - Android SDK (API 33+)
  - Java Development Kit (JDK) 17+
  - Android Emulator or physical device

**For Web Development**:
- Modern browser (Chrome recommended for development)
- No additional platform-specific requirements

**External Services** (Required):
- Supabase account and project
- OpenAI API key
- Stripe account (for payments)

---

## Local Development (Manual Setup)

> **💡 Tip**: If you prefer automated setup, use the [Quick Start scripts](#-quick-start-automated-setup) above!

### Local Development (Windows)

#### Step 1: Install Prerequisites

```powershell
# 1. Install Node.js (if not installed)
# Download from: https://nodejs.org/ (LTS version)
# Verify installation:
node --version  # Should be 20.9.0+ or 22+
npm --version   # Should be 10.0.0+

# 2. Install Git (if not installed)
# Download from: https://git-scm.com/download/win
# Verify installation:
git --version

# 3. Install Expo CLI globally
npm install -g expo-cli

# 4. Install Android Studio (for Android development)
# Download from: https://developer.android.com/studio
# Follow installation wizard
# Set up Android SDK (API 33+)
# Configure ANDROID_HOME environment variable:
#   - Open System Properties > Environment Variables
#   - Add: ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
#   - Add to Path: %ANDROID_HOME%\platform-tools
```

#### Step 2: Clone and Setup Project

```powershell
# 1. Clone repository
git clone <repository-url>
cd waqup-app/waqup-new

# 2. Install dependencies
npm install

# 3. Copy environment file
copy .env.example .env

# 4. Configure environment variables
# Edit .env file with your credentials:
#   - EXPO_PUBLIC_SUPABASE_URL
#   - EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
#   - NEXT_PUBLIC_SUPABASE_URL
#   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
#   - SUPABASE_SECRET_KEY
#   - OPENAI_API_KEY
#   - STRIPE_PUBLISHABLE_KEY
#   - STRIPE_SECRET_KEY
```

#### Step 3: Start Development Servers

```powershell
# Option 1: Run all platforms simultaneously
npm run dev:all

# Option 2: Run platforms individually
npm run dev:mobile  # Mobile (React Native + Expo)
npm run dev:web     # Web (Next.js)

# Mobile will start Expo Dev Server
# Web will start Next.js dev server on http://localhost:3000
```

#### Step 4: Test on Devices/Emulators

**For Mobile (Android)**:
```powershell
# 1. Start Android Emulator (via Android Studio)
# OR connect physical Android device via USB

# 2. In Expo Dev Server, press 'a' to open on Android
# OR scan QR code with Expo Go app on physical device
```

**For Web**:
```powershell
# Open browser to http://localhost:3000
# Chrome recommended for best experience
```

---

### Local Development (Linux/macOS)

#### Step 1: Install Prerequisites

**Linux (Ubuntu/Debian)**:
```bash
# 1. Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation:
node --version  # Should be 20.9.0+ or 22+
npm --version   # Should be 10.0.0+

# 2. Install Git (if not installed)
sudo apt-get install git

# 3. Install Expo CLI globally
sudo npm install -g expo-cli

# 4. Install Android Studio (for Android development)
# Download from: https://developer.android.com/studio
# Extract and run: ./studio.sh
# Set up Android SDK (API 33+)
# Add to ~/.bashrc or ~/.zshrc:
#   export ANDROID_HOME=$HOME/Android/Sdk
#   export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**macOS**:
```bash
# 1. Install Node.js (if not installed)
# Download from: https://nodejs.org/ (LTS version)
# OR use Homebrew:
brew install node@22

# Verify installation:
node --version  # Should be 20.9.0+ or 22+
npm --version   # Should be 10.0.0+

# 2. Install Git (if not installed)
# Comes with Xcode Command Line Tools:
xcode-select --install

# 3. Install Expo CLI globally
npm install -g expo-cli

# 4. Install Xcode (for iOS development)
# Download from App Store
# Install Command Line Tools:
xcode-select --install

# 5. Install CocoaPods (for iOS)
sudo gem install cocoapods

# 6. Install Android Studio (for Android development)
# Download from: https://developer.android.com/studio
# Set up Android SDK (API 33+)
# Add to ~/.zshrc or ~/.bash_profile:
#   export ANDROID_HOME=$HOME/Library/Android/sdk
#   export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### Step 2: Clone and Setup Project

```bash
# 1. Clone repository
git clone <repository-url>
cd waqup-app/waqup-new

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Configure environment variables
# Edit .env file with your credentials:
#   - EXPO_PUBLIC_SUPABASE_URL
#   - EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
#   - NEXT_PUBLIC_SUPABASE_URL
#   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
#   - SUPABASE_SECRET_KEY
#   - OPENAI_API_KEY
#   - STRIPE_PUBLISHABLE_KEY
#   - STRIPE_SECRET_KEY
```

#### Step 3: Start Development Servers

```bash
# Option 1: Run all platforms simultaneously
npm run dev:all

# Option 2: Run platforms individually
npm run dev:mobile  # Mobile (React Native + Expo)
npm run dev:web     # Web (Next.js)

# Mobile will start Expo Dev Server
# Web will start Next.js dev server on http://localhost:3000
```

#### Step 4: Test on Devices/Emulators

**For Mobile (iOS - macOS only)**:
```bash
# 1. Start iOS Simulator
open -a Simulator

# 2. In Expo Dev Server, press 'i' to open on iOS Simulator
# OR scan QR code with Expo Go app on physical device
```

**For Mobile (Android)**:
```bash
# 1. Start Android Emulator (via Android Studio)
# OR connect physical Android device via USB

# 2. In Expo Dev Server, press 'a' to open on Android
# OR scan QR code with Expo Go app on physical device
```

**For Web**:
```bash
# Open browser to http://localhost:3000
# Chrome recommended for best experience
```

---

## Development Pipeline

### Local Development Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    Local Development Pipeline                │
└─────────────────────────────────────────────────────────────┘

1. SETUP PHASE
   ├── Clone repository
   ├── Install dependencies (npm install)
   ├── Configure environment (.env)
   └── Verify prerequisites

2. DEVELOPMENT PHASE
   ├── Start dev servers (npm run dev:all)
   ├── Make code changes
   ├── Test on platforms (Mobile + Web)
   └── Verify functionality

3. TESTING PHASE
   ├── Unit tests (npm run test)
   ├── Type checking (npm run type-check)
   ├── Linting (npm run lint)
   └── Manual testing on devices/emulators

4. COMMIT PHASE
   ├── Stage changes (git add)
   ├── Commit with message (git commit)
   ├── Update changelog (rebuild-roadmap/03-tracking/01-changelog.md)
   └── Push to branch (git push)
```

### Development Commands

**Root Level**:
```bash
# Development
npm run dev:mobile      # Start mobile dev server
npm run dev:web         # Start web dev server
npm run dev:all         # Start all dev servers (Linux/macOS)
npm run dev:all:win     # Start all dev servers (Windows)

# Building
npm run build:shared    # Build shared package
npm run build:mobile    # Build mobile app
npm run build:web       # Build web app
npm run build:all       # Build all packages

# Testing & Quality
npm run test            # Run all tests
npm run lint            # Lint all packages
npm run type-check      # Type check all packages
```

**Platform-Specific**:
```bash
# Mobile (packages/mobile/)
npm run start           # Start Expo dev server
npm run android         # Run on Android
npm run ios             # Run on iOS (macOS only)
npm run web             # Run web version

# Web (packages/web/)
npm run dev             # Start Next.js dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Lint code
```

### Development Best Practices

1. **Always Test on Both Platforms**: Mobile and Web simultaneously
2. **Update Changelog**: After completing each step
3. **Type Safety**: Run `npm run type-check` before committing
4. **Linting**: Run `npm run lint` before committing
5. **Small Commits**: One logical change per commit
6. **Descriptive Messages**: Clear commit messages with step reference

---

## Production Pipeline

### Production Build Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Pipeline                      │
└─────────────────────────────────────────────────────────────┘

1. PRE-BUILD PHASE
   ├── Update version numbers
   ├── Verify environment variables
   ├── Run tests (npm run test)
   ├── Type check (npm run type-check)
   └── Lint check (npm run lint)

2. BUILD PHASE
   ├── Build shared package (npm run build:shared)
   ├── Build mobile app (npm run build:mobile)
   │   ├── iOS build (EAS Build or Xcode)
   │   └── Android build (EAS Build or Android Studio)
   └── Build web app (npm run build:web)

3. TESTING PHASE
   ├── Test production builds locally
   ├── Test on physical devices
   ├── Performance testing
   └── Security audit

4. DEPLOYMENT PHASE
   ├── Mobile Deployment:
   │   ├── iOS: App Store Connect (via EAS Submit)
   │   └── Android: Google Play Console (via EAS Submit)
   ├── Web Deployment:
   │   └── Vercel/Netlify (automatic via Git)
   └── Post-deployment verification

5. MONITORING PHASE
   ├── Monitor crash reports (Sentry)
   ├── Monitor performance metrics
   ├── Monitor user feedback
   └── Monitor API usage
```

### Production Build Commands

**Mobile (iOS)**:
```bash
# Using EAS Build (Recommended)
cd packages/mobile
eas build --platform ios --profile production

# Using Xcode (macOS only)
cd packages/mobile/ios
pod install
open *.xcworkspace
# Build and archive in Xcode
```

**Mobile (Android)**:
```bash
# Using EAS Build (Recommended)
cd packages/mobile
eas build --platform android --profile production

# Using Android Studio
cd packages/mobile/android
./gradlew assembleRelease
# Or open in Android Studio and build release APK/AAB
```

**Web**:
```bash
# Build for production
cd packages/web
npm run build

# Test production build locally
npm run start

# Deploy to Vercel (automatic via Git)
# Or manually:
vercel --prod
```

### Production Deployment

**Mobile Apps**:
- **iOS**: Deploy via EAS Submit to App Store Connect
- **Android**: Deploy via EAS Submit to Google Play Console
- **OTA Updates**: Push JavaScript updates via EAS Update

**Web App**:
- **Vercel**: Automatic deployment via Git (recommended)
- **Netlify**: Automatic deployment via Git
- **Self-hosted**: Deploy Next.js build to any Node.js server

### Environment Variables for Production

**Mobile (.env.production)**:
```bash
EXPO_PUBLIC_SUPABASE_URL=production_supabase_url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=production_key
# ... other production variables
```

**Web (.env.production)**:
```bash
NEXT_PUBLIC_SUPABASE_URL=production_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=production_key
SUPABASE_SECRET_KEY=production_secret_key
# ... other production variables
```

### Production Checklist

**Before Deployment**:
- [ ] All tests passing
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Environment variables configured
- [ ] Version numbers updated
- [ ] Changelog updated
- [ ] Production builds tested locally
- [ ] Performance benchmarks met
- [ ] Security audit completed

**After Deployment**:
- [ ] Verify app works on production
- [ ] Monitor crash reports
- [ ] Monitor performance metrics
- [ ] Verify OTA updates (mobile)
- [ ] Verify web deployment
- [ ] Test on multiple devices/browsers
- [ ] Monitor API usage and costs

---

## How to Use

1. **Start Here**: Read [01 Roadmap](./01-planning/01-roadmap.md)
2. **Setup Environment**: Follow [Development Setup](#development-setup) for your OS
3. **Check Schema**: Review [02 Schema Verification](./01-planning/02-schema-verification.md)
4. **Follow Phase**: Read phase analysis in `02-phases/`
5. **Track Progress**: Update [01 Changelog](./03-tracking/01-changelog.md)

---

## Key Principles

- **Step-by-Step Verification**: Each step independently testable
- **Now/After Analysis**: Document current vs target state
- **Schema Coherence**: Verify database at each phase
- **Production Quality**: Not prototypes
- **Documentation First**: Base on existing docs
- **Multi-Platform**: Develop Mobile and Web simultaneously
- **Test Simultaneously**: Test all platforms together

---

**Last Updated**: 2026-02-07
