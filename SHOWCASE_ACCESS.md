# Component Showcase Access Guide

This document explains how to access the component showcase on both platforms.

## Web Platform (Next.js)

### Access via URL
Simply navigate to:
```
http://localhost:3000/showcase
```
or in production:
```
https://your-domain.com/showcase
```

The showcase page is **not linked** in the main navigation, but is accessible via direct URL.

## Mobile Platform (React Native + Expo)

### Access via Deep Link

The showcase screen can be accessed via deep links:

#### Option 1: Custom Scheme (Development)
```
waqup://showcase
```

#### Option 2: Universal Link (Production)
```
https://waqup.app/showcase
```

### Testing Deep Links

#### iOS Simulator
```bash
xcrun simctl openurl booted "waqup://showcase"
```

#### Android Emulator
```bash
adb shell am start -W -a android.intent.action.VIEW -d "waqup://showcase" com.waqup.app
```

#### Expo Go (Development)
1. Open Expo Go app
2. Scan QR code to open your app
3. In the Expo Go app, you can test deep links using the URL bar or by running:
```bash
npx uri-scheme open waqup://showcase --ios
npx uri-scheme open waqup://showcase --android
```

### Programmatic Navigation (Development)

You can also navigate programmatically in development:

```typescript
import { useNavigation } from '@react-navigation/native';

// In any component
const navigation = useNavigation();
navigation.navigate('Showcase');
```

## Notes

- The showcase route is **hidden from normal navigation** - users won't see it in tabs or menus
- It's accessible **only via direct URL/deep link** for testing and development purposes
- In production, you may want to add authentication checks or remove the route entirely

## Available Routes

### Web Routes
- `/showcase` - Component showcase (hidden, URL access only)

### Mobile Deep Links
- `waqup://showcase` - Component showcase (hidden, deep link access only)
- `waqup://login` - Login screen
- `waqup://signup` - Signup screen
- `waqup://home` - Home screen (requires auth)
- `waqup://library` - Library screen (requires auth)
- `waqup://create` - Create screen (requires auth)
- `waqup://profile` - Profile screen (requires auth)
