# 🍝 SLOPIFY - Implementation Guide

> **A satirical app that takes mundane photos and "ruins" them with AI-generated surreal images and captions.**

---

## 📋 Pre-Flight Checklist

Before starting, ensure you have:
- [ ] Google AI Studio API Key ([Get one here](https://aistudio.google.com/app/apikey))
- [ ] Expo Go app installed on your physical device (Camera won't work on emulator)
- [ ] Node.js 18+ installed

---

## 🎯 Grading Requirements Mapping

| Requirement | Points | Implementation |
|-------------|--------|----------------|
| **Navigation** | 3p | 6 screens with `expo-router`, data passing via URL params |
| **Persistence** | 4p | `expo-sqlite` for storing slop history |
| **Web Service** | 4p | Google AI Studio (Gemini Flash + Imagen 3) |
| **Native Features** | 4p | `expo-camera` + `expo-haptics` |
| **Permissions & Security** | 4p | Camera permissions + `expo-secure-store` for API key |
| **UI/UX** | 4p | NativeWind + shadcn-style components from `react-native-reusables` |

---

## 🎨 UI Guidelines

### Icons (Important!)

**Always use Lucide icons instead of emojis.** The project includes `lucide-react-native` and a pre-configured `Icon` component.

```typescript
// ✅ DO: Use Lucide icons
import { Icon } from '@/components/ui/icon';
import { Trash2Icon, PlusIcon, HelpCircleIcon } from 'lucide-react-native';

<Icon as={Trash2Icon} className="size-5 text-destructive" />
<Icon as={PlusIcon} className="size-7 text-primary-foreground" />

// ❌ DON'T: Use emojis for UI elements
<Text>🗑️</Text>
<Text>+</Text>
```

Browse available icons at: https://lucide.dev/icons

---

## 🗂️ Final Project Structure

```
topslop/
├── app/
│   ├── _layout.tsx        # Root layout with theme provider
│   ├── index.tsx          # Dashboard - Grid of past slops
│   ├── lab.tsx            # Camera viewfinder
│   ├── refinery.tsx       # Slop level selector (sliders/options)
│   ├── process.tsx        # "The Void" - API processing screen
│   ├── result.tsx         # Reveal screen - Original vs Slop
│   ├── help.tsx           # Bad advice screen
│   └── +not-found.tsx     # 404 screen (already exists)
├── components/
│   └── ui/
│       ├── button.tsx     # ✅ Already exists
│       ├── text.tsx       # ✅ Already exists
│       ├── icon.tsx       # ✅ Already exists
│       ├── card.tsx       # 📦 Install from reusables
│       ├── skeleton.tsx   # 📦 Install from reusables
│       ├── slider.tsx     # 📦 Install from reusables
│       └── switch.tsx     # 📦 Install from reusables
├── lib/
│   ├── utils.ts           # ✅ Already exists (cn helper)
│   ├── theme.ts           # ✅ Already exists
│   ├── db.ts              # 🆕 SQLite database setup & queries
│   ├── api.ts             # 🆕 Google AI Studio API functions
│   └── constants.ts       # 🆕 App constants and slop presets
├── hooks/
│   ├── useSlops.ts        # 🆕 Hook for fetching slop history
│   └── useColorScheme.tsx # 🆕 Enhanced theme hook with toggle
├── docs/
│   ├── PHASE-1.md         # Foundations & Navigation
│   ├── PHASE-2.md         # The Vault (Database)
│   ├── PHASE-3.md         # The Engine (API Services)
│   └── PHASE-4.md         # The Polish
└── .env                   # 🆕 Environment variables (API key)
```

---

## 📖 Implementation Phases

| Phase | Name | Description | Link |
|-------|------|-------------|------|
| 1 | **Foundations & Navigation** | Set up 6 screens, install deps, create constants | [PHASE-1.md](docs/PHASE-1.md) |
| 2 | **The Vault** | SQLite database setup and CRUD operations | [PHASE-2.md](docs/PHASE-2.md) |
| 3 | **The Engine** | Google AI Studio API integration (Gemini + Imagen) | [PHASE-3.md](docs/PHASE-3.md) |
| 4 | **The Polish** | Haptics, SecureStore, theme toggle, styling | [PHASE-4.md](docs/PHASE-4.md) |

---

## ✅ Master Checklist

### Phase 1: Foundations
- [ ] Install all Expo dependencies
- [ ] Install UI components from reusables
- [ ] Create `.env` file with API key
- [ ] Create `lib/constants.ts`
- [ ] Create all 6 screen files
- [ ] Set up basic navigation between screens

### Phase 2: The Vault
- [ ] Create `lib/db.ts` with schema
- [ ] Initialize database in `_layout.tsx`
- [ ] Create `hooks/useSlops.ts`
- [ ] Test: Insert and retrieve a dummy record

### Phase 3: The Engine
- [ ] Create `lib/api.ts` with all 3 API functions
- [ ] Implement `runSlopPipeline` master function
- [ ] Wire up `process.tsx` to use the pipeline
- [ ] Test: Full flow from camera to saved slop

### Phase 4: The Polish
- [ ] Add haptics to result and camera screens
- [ ] Create `lib/secure.ts` (optional)
- [ ] Implement theme toggle
- [ ] Handle camera permissions with nice UI
- [ ] Apply consistent styling to all screens
- [ ] Test: Complete user journey

---

## 🚨 Common Pitfalls

1. **Imagen API Access:** Imagen 3 requires billing enabled on Google Cloud. If you hit quota errors, ensure your project has billing set up.

2. **Camera on Emulator:** The camera won't work on iOS Simulator or Android Emulator. Use Expo Go on a physical device.

3. **File URIs:** When passing URIs between screens, use `encodeURIComponent()` and `decodeURIComponent()`.

4. **SQLite Sync:** `expo-sqlite` in Expo 54+ uses the synchronous API by default. The `openDatabaseSync` function is correct.

5. **Base64 Size:** Large images as base64 can hit API limits. Consider resizing images before sending to Gemini.

---

## 📚 Useful Resources

- [Expo Camera Docs](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo SQLite Docs](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Imagen API Docs](https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview)
- [React Native Reusables](https://reactnativereusables.com/)
- [NativeWind Docs](https://www.nativewind.dev/)

---

**Start with [Phase 1](docs/PHASE-1.md) → Good luck! 🍝✨**
