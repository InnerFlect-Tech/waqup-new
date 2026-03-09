# waQup - Multi-Platform Application

**Production-ready mobile and web application for iOS, Android, and desktop browsers**

[![Repository](https://img.shields.io/badge/repository-GitHub-blue)](https://github.com/InnerFlect-Tech/waqup-new)
[![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-24.0.0%2B-brightgreen)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-%3E%3D10.0.0-red)](https://www.npmjs.com/)

---

## 📍 Repository

**GitHub**: [https://github.com/InnerFlect-Tech/waqup-new](https://github.com/InnerFlect-Tech/waqup-new)

```bash
git clone https://github.com/InnerFlect-Tech/waqup-new.git
cd waqup-new
```

---

## 🚀 Installation

### Quick Start (Recommended)

**macOS/Linux**:
```bash
# Clone the repository
git clone https://github.com/InnerFlect-Tech/waqup-new.git
cd waqup-new

# Run master installation script (does everything)
chmod +x scripts/install.sh
./scripts/install.sh
```

**Windows**:
```powershell
# Clone the repository
git clone https://github.com/InnerFlect-Tech/waqup-new.git
cd waqup-new

# Run master installation script (does everything)
.\scripts\install.ps1
```

The master installation script will:
1. ✅ **Verify Prerequisites**: Check Node.js (>= 24.0.0), npm (>=10.0.0), Git
2. ✅ **Install Dependencies**: Install all root, mobile, and web dependencies
3. ✅ **Setup Environment**: Create `.env` file from `.env.example`
4. ✅ **Verify Installation**: Run TypeScript compilation checks

**After installation**:
1. Edit `.env` file with your API keys and credentials (see [Environment Variables](#environment-variables))
2. Run `npm run dev:all` (or `npm run dev:all:win` on Windows) to start development servers
3. Start coding! 🎉

### Manual Installation

If you prefer to install manually or run scripts individually:

**macOS/Linux**:
```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Run scripts in order
./scripts/01-verify-prerequisites.sh
./scripts/02-install-dependencies.sh
./scripts/03-setup-environment.sh
./scripts/04-verify-installation.sh
```

**Windows**:
```powershell
# Run scripts in order
.\scripts\01-verify-prerequisites.ps1
.\scripts\02-install-dependencies.ps1
.\scripts\03-setup-environment.ps1
.\scripts\04-verify-installation.ps1
```

See [scripts/README.md](./scripts/README.md) for detailed information about each script.

### Prerequisites

**Required for All Platforms**:
- **Node.js**: 24.0.0+
- **npm**: 10.0.0+ (comes with Node.js)
- **Git**: Latest version

**Optional (for Mobile Development)**:
- **Expo CLI**: `npm install -g expo-cli` (optional - can use npx instead)
- **Expo Go App** (Recommended - No SDK needed):
  - Install Expo Go on your iOS/Android device
  - Scan QR code to run app - no Android SDK or Xcode needed!
- **iOS Development** (macOS only - Optional, for custom builds):
  - Xcode 15.0+ (via App Store)
  - Xcode Command Line Tools: `xcode-select --install`
  - CocoaPods: `sudo gem install cocoapods`
- **Android Development** (Optional - Only needed for custom builds):
  - Android Studio (latest)
  - Android SDK (API 33+)
  - Java Development Kit (JDK) 17+
  
**Note**: Android SDK is **NOT required** for development with Expo Go. See [docs/02-mobile/04-android-sdk-requirements.md](./docs/02-mobile/04-android-sdk-requirements.md) for details.

**External Services** (Required - add to `.env` file):
- Supabase account and project (URL and keys)
- OpenAI API key
- Stripe account (for payments - publishable and secret keys)

### Environment Variables

After installation, edit the `.env` file with your credentials:

```bash
# App URL (Web) – required for production OAuth (Google Sign-In, password reset)
# Set to your deployment URL (e.g. https://waqup-new.vercel.app) in Vercel/hosting env
NEXT_PUBLIC_APP_URL=https://your-app-url.com

# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SECRET_KEY=your_supabase_secret_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

**Production (e.g. Vercel)**: Set `NEXT_PUBLIC_APP_URL` to your live URL so OAuth redirects (Google Sign-In, password reset emails) point to the deployed app instead of localhost. Add the same URL’s `/auth/callback` path to your Supabase project’s **Redirect URLs** in Authentication → URL Configuration. If the provider redirects to `/login` with tokens in the URL hash (implicit flow), the login page will still establish the session and redirect into the app.

### Troubleshooting

**Scripts won't run (macOS/Linux)**:
```bash
# Make scripts executable
chmod +x scripts/install.sh
chmod +x scripts/*.sh
```

**PowerShell execution policy (Windows)**:
```powershell
# Allow script execution (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**npm install hangs**:
The installation scripts use `--no-audit --no-fund` flags to prevent hanging. If installation still hangs:
1. Clear npm cache: `npm cache clean --force`
2. Remove node_modules: `rm -rf node_modules packages/*/node_modules` (Unix) or `Remove-Item -Recurse -Force node_modules,packages\*\node_modules` (Windows)
3. Remove package-lock.json files
4. Run installation again

**Node.js version issues**:
- Ensure Node.js version is 24.0.0+
- Use `nvm` (Node Version Manager): run `nvm use` in project root (uses `.nvmrc`)
- macOS: `brew install node@24` or download from nodejs.org
- Windows: Download installer from nodejs.org

---

### Next Steps

1. **Read**: [START_HERE.md](./START_HERE.md) for detailed setup instructions
2. **Follow**: [rebuild-roadmap/01-planning/01-roadmap.md](./rebuild-roadmap/01-planning/01-roadmap.md) for development roadmap
3. **Track**: [rebuild-roadmap/03-tracking/01-changelog.md](./rebuild-roadmap/03-tracking/01-changelog.md) for progress

---

## 📦 Platforms

- **Mobile**: React Native + Expo (iOS + Android)
- **Web**: Next.js (Desktop browsers - Chrome-first, PWA support)

---

## 🛠️ Technology Stack

- **Mobile**: Expo SDK 54, React Native, TypeScript 5.9.3
- **Web**: Next.js 16.1.6, React 19.2.3, TypeScript 5.9.3
- **Shared**: Supabase, Zustand, React Query, Zod
- **Runtime**: Node.js 24.0.0+, npm 10+

---

## 💻 Cross-Platform Support

✅ **Windows**: Fully supported  
✅ **macOS**: Fully supported  
✅ **Linux**: Fully supported  

All commands work identically across platforms.

---

## 📁 Project Structure

```
waqup-new/
├── packages/
│   ├── mobile/          # React Native + Expo (iOS + Android)
│   ├── web/             # Next.js (Desktop browsers)
│   └── shared/          # Shared business logic
├── docs/                # Documentation
├── rebuild-roadmap/     # Development roadmap
└── package.json         # Root workspace config
```

### Web design system (packages/web)

- **Shared layout**: `AppHeader` (public / authenticated / simplified), `PageShell` (background + gradient + content container), `GlassCard` (auth/content variants), `ThemeSelector` (collapsible: single “Theme” button, dropdown on click to avoid overlapping page content)
- **Design tokens**: `packages/web/src/theme/design-tokens.ts` (CONTENT_MAX_WIDTH, PAGE_PADDING, SAFE_AREA_RIGHT, spacing, glass card styles)
- **Safe-area**: Main, marketing, and landing pages use `SAFE_AREA_RIGHT` so the fixed Theme button never overlaps content; `PlaceholderPage` includes it for sanctuary and other placeholder screens
- **Layouts**: Auth (no header), Main/Sanctuary (authenticated header), Marketing (landing header reflects auth state), Onboarding (simplified header)
- **Header nav**: Active state via `usePathname()`; "Home" active on `/sanctuary/*`; logo links to `/sanctuary` when authenticated, `/` when public.
- **Unified cards**: Home, Create, and Profile use consistent glass card styling (glass.opaque, tertiary icon background, accent icons)
- **Reference**: [docs/04-reference/04-pages-comparison.md](./docs/04-reference/04-pages-comparison.md) for page inventory

---

## 🏃 Development

```bash
# Install dependencies
npm install

# Run mobile (Expo)
npm run dev:mobile

# Run web (Next.js)
npm run dev:web

# Run both simultaneously
npm run dev:all
```

---

## 📚 Documentation

- **[START_HERE.md](./START_HERE.md)** - Getting started guide
- **[docs/](./docs/)** - Complete documentation
- **[rebuild-roadmap/](./rebuild-roadmap/)** - Development roadmap

---

## 🔗 Related Repositories

- **This Repository**: [waqup-new](https://github.com/InnerFlect-Tech/waqup-new) - Multi-platform rebuild (Mobile + Web)
- **Main Project**: `waqup-app/` (parent directory) - Original project

---

## ✅ Status

- ✅ Project structure initialized
- ✅ Mobile + Web platforms configured
- ✅ Shared package set up
- ✅ Documentation complete
- ✅ Cross-platform compatible
- ✅ Web design consistency: AppHeader, PageShell, GlassCard, design tokens; all pages aligned
- ⏳ Ready for Phase 1 development

---

---

## 📝 License

This project is proprietary and confidential. All rights reserved.

---

**Last Updated**: February 18, 2026  
**Repository**: [https://github.com/InnerFlect-Tech/waqup-new](https://github.com/InnerFlect-Tech/waqup-new)
