# waQup - Multi-Platform Application

**Production-ready mobile and web application for iOS, Android, and desktop browsers**

[![Repository](https://img.shields.io/badge/repository-GitHub-blue)](https://github.com/InnerFlect-Tech/waqup-new)
[![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-%3E%3D10.0.0-red)](https://www.npmjs.com/)

---

## 📍 Repository

**GitHub**: [https://github.com/InnerFlect-Tech/waqup-new](https://github.com/InnerFlect-Tech/waqup-new)

```bash
git clone https://github.com/InnerFlect-Tech/waqup-new.git
cd waqup-new
```

---

## 🚀 Quick Start

### Automated Installation (Recommended)

**Windows**:
```powershell
# Clone the repository
git clone https://github.com/InnerFlect-Tech/waqup-new.git
cd waqup-new

# Run automated setup script
.\scripts\setup-windows.ps1
```

**macOS/Linux**:
```bash
# Clone the repository
git clone https://github.com/InnerFlect-Tech/waqup-new.git
cd waqup-new

# Run automated setup script
./scripts/setup-linux.sh
```

The setup scripts will:
- ✅ Check and verify Node.js, npm, and Git installation
- ✅ Install Expo CLI globally
- ✅ Install all project dependencies
- ✅ Create `.env` file from `.env.example`
- ✅ Verify Android SDK setup (if applicable)
- ✅ Check macOS development tools (Xcode, CocoaPods) on macOS

**After running the script**:
1. Edit `.env` file with your API keys and credentials
2. Run `npm run dev:all` to start development servers
3. Start coding! 🎉

---

### Manual Installation

#### Prerequisites

**Required for All Platforms**:
- **Node.js**: >= 24.0.0 (LTS)
- **npm**: 10.0.0+ (comes with Node.js)
- **Git**: Latest version

**For Mobile Development**:
- **Expo CLI**: `npm install -g expo-cli`
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

**External Services** (Required):
- Supabase account and project
- OpenAI API key
- Stripe account (for payments)

#### Windows Installation

```powershell
# 1. Install Node.js (if not installed)
# Download from: https://nodejs.org/ (LTS version)
node --version  # Verify: Should be >= 24.0.0
npm --version   # Verify: Should be 10.0.0+

# 2. Install Git (if not installed)
# Download from: https://git-scm.com/download/win
git --version   # Verify installation

# 3. Install Expo CLI globally
npm install -g expo-cli

# 4. Clone repository
git clone https://github.com/InnerFlect-Tech/waqup-new.git
cd waqup-new

# 5. Install dependencies
npm install

# 6. Setup environment
copy .env.example .env
# Edit .env file with your credentials

# 7. Start development servers
npm run dev:all:win
```

**Android Setup (Windows - Optional)**:
> **💡 Tip**: Skip this if using Expo Go! Android SDK is only needed for custom native modules or local builds.

1. Install Android Studio from https://developer.android.com/studio
2. Set up Android SDK (API 33+)
3. Configure environment variables:
   - Open System Properties > Environment Variables
   - Add: `ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk`
   - Add to Path: `%ANDROID_HOME%\platform-tools`

#### macOS Installation

```bash
# 1. Install Node.js (if not installed)
# Option A: Via Homebrew
brew install node@22

# Option B: Download from https://nodejs.org/ (LTS version)
node --version  # Verify: Should be >= 24.0.0
npm --version   # Verify: Should be 10.0.0+

# 2. Install Git (if not installed)
# Comes with Xcode Command Line Tools:
xcode-select --install

# 3. Install Expo CLI globally
npm install -g expo-cli

# 4. Install Xcode (for iOS development)
# Download from App Store: https://apps.apple.com/app/xcode/id497799835
# Install Command Line Tools:
xcode-select --install

# 5. Install CocoaPods (for iOS development)
sudo gem install cocoapods

# 6. Clone repository
git clone <repository-url>
cd waqup-app/waqup-new

# 7. Install dependencies
npm install

# 8. Setup environment
cp .env.example .env
# Edit .env file with your credentials

# 9. Start development servers
npm run dev:all
```

**Android Setup (macOS - Optional)**:
> **💡 Tip**: Skip this if using Expo Go! Android SDK is only needed for custom native modules or local builds.

1. Install Android Studio from https://developer.android.com/studio
2. Set up Android SDK (API 33+)
3. Add to `~/.zshrc` or `~/.bash_profile`:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
4. Reload shell: `source ~/.zshrc` or `source ~/.bash_profile`

#### Linux Installation

```bash
# 1. Install Node.js via NodeSource (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be >= 24.0.0
npm --version   # Should be 10.0.0+

# 2. Install Git (if not installed)
sudo apt-get install git

# 3. Install Expo CLI globally
sudo npm install -g expo-cli

# 4. Clone repository
git clone https://github.com/InnerFlect-Tech/waqup-new.git
cd waqup-new

# 5. Install dependencies
npm install

# 6. Setup environment
cp .env.example .env
# Edit .env file with your credentials

# 7. Start development servers
npm run dev:all
```

**Android Setup (Linux - Optional)**:
> **💡 Tip**: Skip this if using Expo Go! Android SDK is only needed for custom native modules or local builds.

1. Install Android Studio from https://developer.android.com/studio
2. Set up Android SDK (API 33+)
3. Add to `~/.bashrc` or `~/.zshrc`:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
4. Reload shell: `source ~/.bashrc` or `source ~/.zshrc`

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
- **Runtime**: Node.js 24+ (Active LTS), npm 10+

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
- ⏳ Ready for Phase 1 development

---

---

## 📝 License

This project is proprietary and confidential. All rights reserved.

---

**Last Updated**: February 7, 2026  
**Repository**: [https://github.com/InnerFlect-Tech/waqup-new](https://github.com/InnerFlect-Tech/waqup-new)
