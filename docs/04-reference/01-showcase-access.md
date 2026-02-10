# Component Showcase Access

**Purpose**: Single source of truth for accessing the component showcase on Web and Mobile.

---

## Web (Next.js)

- **URL (local)**: `http://localhost:3000/showcase`
- **URL (production)**: `https://your-domain.com/showcase`
- The route is not linked in main navigation; use the URL directly.

---

## Mobile (React Native + Expo)

### Deep links

- **Custom scheme (dev)**: `waqup://showcase`
- **Universal link (prod)**: `https://waqup.app/showcase`

### Testing deep links

**iOS Simulator**:
```bash
xcrun simctl openurl booted "waqup://showcase"
```

**Android Emulator**:
```bash
adb shell am start -W -a android.intent.action.VIEW -d "waqup://showcase" com.waqup.app
```

**Expo Go**:
```bash
npx uri-scheme open waqup://showcase --ios
npx uri-scheme open waqup://showcase --android
```

### Programmatic navigation (dev)

```typescript
import { useNavigation } from '@react-navigation/native';
const navigation = useNavigation();
navigation.navigate('Showcase');
```

---

## Notes

- Showcase is hidden from normal navigation (tabs/menus).
- Access is via direct URL or deep link for development and testing.
- In production you may add auth or remove the route.

---

## Route reference

| Platform | Route / link | Notes |
|----------|--------------|--------|
| Web | `/showcase` | URL only |
| Mobile | `waqup://showcase` | Deep link |
| Mobile | `waqup://login`, `waqup://signup`, `waqup://home`, `waqup://library`, `waqup://create`, `waqup://profile` | Auth required for home/library/create/profile |
