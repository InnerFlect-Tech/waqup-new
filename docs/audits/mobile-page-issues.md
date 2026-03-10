# Mobile Page-by-Page Issue Checklist

**Last Updated**: 2026-03-10

## Web Pages

| Page | Issue | Status |
|------|-------|--------|
| Landing | Hero minHeight; 640px breakpoint | OK – verified |
| How It Works | Phone mockup 270×540 | ✅ Fixed – responsive |
| Launch | Phone mockup 270×540 | ✅ Fixed – responsive |
| Pricing | Cards at 768px; 375px padding | ✅ Fixed – 375px breakpoint |
| Auth (Login/Signup) | maxWidth 480 | OK |
| AppLayout | Mobile menu, footer | OK |
| Speak | SPEAK_BOTTOM_UI_HEIGHT 220px | ✅ Fixed – min(220px, 35vh) |
| Create/Conversation | height: 100vh | ✅ Fixed – minHeight 100dvh |
| Library | overflow: hidden on cards | OK – WebkitLineClamp |
| Admin/Users | Table minWidth 700 | Expected |
| Content creation steps | maxWidth 48rem | Low |

## Native Mobile Screens

| Screen | Issue | Status |
|--------|-------|--------|
| Screen | SafeAreaProvider | ✅ Fixed – added at root |
| SpeakScreen | Orb 80px, padding | OK |
| ContentCreateScreen | KeyboardAvoidingView | OK |
| SignupScreen | maxWidth 400 | OK |
| BottomSheet | insets | OK |
| SetupScreen | Not in nav | Optional add |
