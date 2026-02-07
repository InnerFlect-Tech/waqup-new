# Android SDK Requirements - Expo Development

**Status**: ✅ Current | **Last Updated**: 2026-02-07

## Quick Answer

**Do you need Android SDK?**

- ✅ **NO** - For development with Expo Go (recommended for most developers)
- ⚠️ **YES** - For building custom development builds or production APKs

---

## Development Options

### Option 1: Expo Go (No Android SDK Required) ✅ Recommended

**Best for**: Most developers, especially when starting out

**What you need**:
- Node.js >= 24.0.0
- npm 10.0.0+
- Expo CLI
- Expo Go app on your phone (iOS/Android)

**How it works**:
1. Run `npm run dev:mobile` or `expo start`
2. Scan QR code with Expo Go app
3. App runs on your phone instantly
4. Hot reload works automatically

**Advantages**:
- ✅ No Android SDK installation needed
- ✅ No Android Studio needed
- ✅ Works on any device with Expo Go
- ✅ Fastest development setup
- ✅ No build times

**Limitations**:
- ⚠️ Can't use custom native modules not included in Expo Go
- ⚠️ Some advanced native features may not be available

---

### Option 2: Development Builds (Android SDK Required)

**Best for**: When you need custom native modules or advanced features

**What you need**:
- Everything from Option 1, PLUS:
- Android Studio (latest)
- Android SDK (API 33+)
- Java Development Kit (JDK) 17+
- Android Emulator or physical device

**How it works**:
1. Build custom development build: `eas build --profile development --platform android`
2. Install on device/emulator
3. Run `expo start --dev-client`
4. App runs with your custom native code

**Advantages**:
- ✅ Full access to all native modules
- ✅ Can use any Expo module or custom native code
- ✅ Production-like environment

**Disadvantages**:
- ❌ Requires Android SDK setup
- ❌ Longer initial setup time
- ❌ Build times for each update

---

### Option 3: Production Builds (Android SDK Required)

**Best for**: Building APKs/IPAs for app stores

**What you need**:
- Everything from Option 2
- EAS Build account (or local build setup)

**How it works**:
1. Configure `eas.json` for production builds
2. Run `eas build --platform android --profile production`
3. Download APK/AAB for Google Play Store

---

## When Do You Actually Need Android SDK?

### ✅ You DON'T need Android SDK if:
- You're developing with Expo Go
- You're using standard Expo modules (expo-av, expo-notifications, etc.)
- You're testing on physical devices via Expo Go
- You're in early development phase

### ⚠️ You DO need Android SDK if:
- You need custom native modules
- You're building production APKs
- You're using EAS Build for development builds
- You need to test on Android Emulator locally

---

## Installation Guide (If Needed)

### Windows

1. **Install Android Studio**:
   - Download from: https://developer.android.com/studio
   - Install with default settings

2. **Configure Environment Variables**:
   ```powershell
   # Open System Properties > Environment Variables
   # Add:
   ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
   
   # Add to Path:
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   ```

3. **Install Android SDK**:
   - Open Android Studio
   - Go to Tools > SDK Manager
   - Install Android SDK Platform 33+
   - Install Android SDK Build-Tools

4. **Verify Installation**:
   ```powershell
   adb version  # Should show version number
   ```

### macOS

1. **Install Android Studio**:
   ```bash
   # Download from: https://developer.android.com/studio
   # Or via Homebrew:
   brew install --cask android-studio
   ```

2. **Configure Environment Variables**:
   ```bash
   # Add to ~/.zshrc or ~/.bash_profile:
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   
   # Reload shell:
   source ~/.zshrc  # or source ~/.bash_profile
   ```

3. **Install Android SDK**:
   - Open Android Studio
   - Go to Tools > SDK Manager
   - Install Android SDK Platform 33+
   - Install Android SDK Build-Tools

4. **Verify Installation**:
   ```bash
   adb version  # Should show version number
   ```

---

## Recommended Setup for waQup

### For Most Developers (Recommended)

**Use Expo Go - No Android SDK needed**

```bash
# 1. Install dependencies
npm install

# 2. Start Expo
npm run dev:mobile

# 3. Scan QR code with Expo Go app
# Done! No Android SDK required.
```

### For Production Builds

**Use EAS Build (Cloud) - No local Android SDK needed**

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Configure build
eas build:configure

# 4. Build in cloud
eas build --platform android --profile production

# EAS Build handles Android SDK in the cloud
# No local Android SDK installation needed!
```

---

## Deprecation Warnings Explained

### Common Deprecation Warnings

1. **Node.js Version Warning**:
   ```
   npm warn EBADENGINE Unsupported engine
   ```
   - **Fixed**: Updated `package.json` to require Node >=24.0.0
   - **Action**: No action needed if using Node >= 24.0.0

2. **Package Deprecations**:
   - Some packages may show deprecation warnings
   - These are usually warnings, not errors
   - Most can be safely ignored if functionality works

3. **React Navigation v7**:
   - ✅ Compatible with Expo SDK 54
   - ✅ Requires React Native >= 0.72.0 (we have 0.81.5)
   - ✅ Uses static configuration API (newer, better TypeScript support)

---

## Summary

**For waQup Development**:

1. **Start with Expo Go** - No Android SDK needed
2. **Use EAS Build for production** - No local Android SDK needed
3. **Only install Android SDK if**:
   - You need custom native modules
   - You want to build locally (not recommended)
   - You need Android Emulator for testing

**Bottom Line**: You can develop the entire waQup mobile app without installing Android SDK by using Expo Go for development and EAS Build for production builds.

---

## References

- **Expo Go**: https://docs.expo.dev/get-started/expo-go/
- **Development Builds**: https://docs.expo.dev/development/introduction/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **Android Setup**: https://docs.expo.dev/workflow/android-studio-emulator/
