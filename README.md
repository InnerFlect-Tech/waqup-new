# waQup - Multi-Platform Application

**Production-ready mobile and web application for iOS, Android, and desktop browsers**

---

## 🚀 Quick Start

### Automated Installation (Recommended)

**Windows**:
```powershell
# Clone the repository
git clone <repository-url>
cd waqup-app/waqup-new

# Run automated setup script
.\scripts\setup-windows.ps1
```

**macOS/Linux**:
```bash
# Clone the repository
git clone <repository-url>
cd waqup-app/waqup-new

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
- **Node.js**: 20.9.0+ (LTS) or Node.js 22+ (LTS)
- **npm**: 10.0.0+ (comes with Node.js)
- **Git**: Latest version

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

**External Services** (Required):
- Supabase account and project
- OpenAI API key
- Stripe account (for payments)

#### Windows Installation

```powershell
# 1. Install Node.js (if not installed)
# Download from: https://nodejs.org/ (LTS version)
node --version  # Verify: Should be 20.9.0+ or 22+
npm --version   # Verify: Should be 10.0.0+

# 2. Install Git (if not installed)
# Download from: https://git-scm.com/download/win
git --version   # Verify installation

# 3. Install Expo CLI globally
npm install -g expo-cli

# 4. Clone repository
git clone <repository-url>
cd waqup-app/waqup-new

# 5. Install dependencies
npm install

# 6. Setup environment
copy .env.example .env
# Edit .env file with your credentials

# 7. Start development servers
npm run dev:all:win
```

**Android Setup (Windows)**:
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
node --version  # Verify: Should be 20.9.0+ or 22+
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

**Android Setup (macOS)**:
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
node --version  # Should be 20.9.0+ or 22+
npm --version   # Should be 10.0.0+

# 2. Install Git (if not installed)
sudo apt-get install git

# 3. Install Expo CLI globally
sudo npm install -g expo-cli

# 4. Clone repository
git clone <repository-url>
cd waqup-app/waqup-new

# 5. Install dependencies
npm install

# 6. Setup environment
cp .env.example .env
# Edit .env file with your credentials

# 7. Start development servers
npm run dev:all
```

**Android Setup (Linux)**:
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

## 🔗 Repositories

- **Main Repo**: `waqup-app/` (parent directory)
- **New Project**: `waqup-app/waqup-new/` (this directory)

Both repositories are tracked separately and visible in Cursor.

---

## ✅ Status

- ✅ Project structure initialized
- ✅ Mobile + Web platforms configured
- ✅ Shared package set up
- ✅ Documentation complete
- ✅ Cross-platform compatible
- ⏳ Ready for Phase 1 development

---

**Last Updated**: 2026-02-07
