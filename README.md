# Slopify

> **A satirical mobile app that transforms your mundane photos into AI-generated "slop" — low-quality, surreal images paired with cringe-worthy social media captions.**

Slopify parodies the flood of AI-generated engagement bait content across social platforms. Take a photo, choose your platform and intensity level, and watch as AI transforms your image into something gloriously terrible.

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🎭 Platform-Specific Slop Modes

Transform your photos into platform-specific AI content:

| Mode | Description |
|------|-------------|
| 👴 **Facebook Bait** | Classic engagement bait with guilt trips and "Type Amen" energy |
| 👔 **LinkedIn Lunatic** | Corporate hustle culture cringe and humble brags |
| 📸 **Instagram Influencer** | Aesthetic obsession with subtle flexing |
| 🐦 **Twitter/X Ragebait** | Hot takes and ratio farming |
| 🔺 **Reddit Karma Farm** | TIFU and sob stories for upvotes |
| 🎵 **TikTok Brain Rot** | Chaotic zoomer energy |
| 🤖 **AI Art Parody** | Over-prompted digital art nightmares |
| 📧 **Boomer Email Forward** | Chain mail energy with comic sans vibes |

### 🎚️ Slop Intensity Levels

- **Mild Slop** — Slightly off proportions, unusual materials
- **Medium Slop** — Morphing limbs, weird textures, impossible quantities
- **MAXIMUM SLOP** — Pure unhinged chaos with 8-fingered children and floating vegetables

### 📱 Core Functionality

- 📷 **Camera Integration** — Capture photos directly or pick from gallery
- 🤖 **AI Image Generation** — Powered by Google's Gemini 2.5 Flash and Imagen 4
- 💬 **Auto-Generated Captions** — Platform-appropriate cringe text
- 💾 **Local Storage** — SQLite database for your slop collection
- ❤️ **Favorites** — Save your best worst creations
- 🎊 **Celebrations** — Confetti animations for new masterpieces
- 📤 **Sharing** — Share images and copy captions
- 🔔 **Notifications** — Get notified when your slop is ready
- 🌙 **Dark Mode** — Full light/dark/system theme support

---

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Expo](https://expo.dev/) (v54) | React Native framework & development platform |
| [Expo Router](https://expo.github.io/router/) (v6) | File-based routing with typed routes |
| [NativeWind](https://www.nativewind.dev/) (v4) | Tailwind CSS for React Native |
| [React Native Reusables](https://reactnativereusables.com/) | Shadcn-style UI components |
| [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) | Local SQLite database |
| [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/) | Camera capture functionality |
| [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) | Encrypted API key storage |
| [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) | Tactile feedback |
| [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) | Local push notifications |
| [Google AI Studio](https://aistudio.google.com/) | Gemini 2.5 Flash + Imagen 4 APIs |

---

## 📁 Project Structure

```
topslop/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout with providers
│   ├── index.tsx                 # Dashboard — grid of past slops
│   ├── lab.tsx                   # Camera viewfinder
│   ├── refinery.tsx              # Slop mode & intensity selector
│   ├── process.tsx               # "The Void" — AI processing screen
│   ├── result.tsx                # Reveal screen with before/after
│   ├── settings.tsx              # API key, theme, permissions
│   ├── help.tsx                  # Satirical "bad advice" tips
│   └── +not-found.tsx            # 404 screen
├── components/
│   └── ui/                       # Reusable UI components
│       ├── accordion.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── icon.tsx
│       ├── skeleton.tsx
│       ├── switch.tsx
│       └── text.tsx
├── hooks/
│   ├── useSlops.ts               # Fetch slop history with stats
│   └── useAppColorScheme.ts      # Theme preference management
├── lib/
│   ├── api.ts                    # Google AI API integration
│   ├── constants.ts              # Slop modes, levels, prompts
│   ├── db.ts                     # SQLite database operations
│   ├── notifications.ts          # Local notification handling
│   ├── secure.ts                 # SecureStore API key management
│   ├── theme.ts                  # Navigation theme config
│   └── utils.ts                  # Utility functions (cn helper)
└── assets/
    └── images/                   # App icons and splash screen
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Expo Go** app on your physical device (camera won't work on emulator)
- **Google AI Studio API Key** — [Get one here](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/topslop.git
   cd topslop
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure API key** (choose one method)

   **Option A: Environment variable**

   ```bash
   # Create .env file
   echo "EXPO_PUBLIC_GOOGLE_AI_API_KEY=your_api_key_here" > .env
   ```

   **Option B: In-app settings**

   - Launch the app and go to **Settings**
   - Enter your API key in the secure storage field

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Run on your device**
   - Scan the QR code with [Expo Go](https://expo.dev/go)
   - Or press `a` for Android / `i` for iOS simulator

---

## 📖 Usage Guide

### Creating Your First Slop

1. **Open the app** and tap the **+** button or "Enter The Lab"
2. **Take a photo** or select one from your gallery
3. **Choose your platform** (Facebook, LinkedIn, Instagram, etc.)
4. **Select slop intensity** (Mild, Medium, or MAXIMUM)
5. **Optionally add context** to guide the AI
6. **Tap "Slopify This!"** and wait for the magic
7. **View your creation** with before/after comparison
8. **Share** or **save to favorites**

### Tips

- Use "Surprise Me" for random mode/intensity combinations
- Tap the ❤️ filter on the dashboard to view only favorites
- Regenerate captions if the first one isn't cringe enough
- Edit captions manually for perfect platform parody

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Expo dev server with cache clear |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run in web browser |
| `npm run clean` | Remove `.expo` and `node_modules` |

---

## 🗄️ Database Schema

The app uses SQLite for local storage:

```sql
CREATE TABLE slops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_uri TEXT NOT NULL,      -- Original photo path
  slop_uri TEXT NOT NULL,          -- Generated image path
  caption TEXT NOT NULL,           -- AI-generated caption
  slop_level TEXT NOT NULL,        -- mild | medium | extreme
  slop_mode TEXT DEFAULT 'facebook', -- Platform mode
  is_favorite INTEGER DEFAULT 0,   -- Favorite flag
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Security

- **API keys** are stored using `expo-secure-store` (encrypted on-device storage)
- **Camera permissions** are requested at runtime with user-friendly prompts
- **Notification permissions** are optional and requested only when needed
- No data is sent to external servers except Google AI APIs

---

## 🎨 Theming

The app supports three theme modes:

- ☀️ **Light** — Clean, bright interface
- 🌙 **Dark** — Easy on the eyes
- 🖥️ **System** — Follows device preference

Toggle in **Settings** → **Appearance**

---

## 📚 API Integration

### Gemini 2.5 Flash (Vision)

Analyzes input photos and generates surreal transformation prompts based on the selected platform mode and intensity level.

### Imagen 4

Generates the final "slopped" image from the Gemini-crafted prompt. Outputs 1:1 aspect ratio images.

### Rate Limits

Be aware of Google AI API quotas. If you encounter rate limit errors:

- Wait a few minutes and retry
- Consider enabling billing on Google Cloud for higher quotas

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs
- 💡 Suggest new slop modes
- 🎨 Improve UI/UX
- 📝 Enhance documentation

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [React Native Reusables](https://reactnativereusables.com/) for the beautiful UI components
- [Expo](https://expo.dev/) for the amazing development experience
- [Google AI Studio](https://aistudio.google.com/) for the AI APIs
- The entire AI slop phenomenon for endless inspiration

---

<div align="center">

**Made with 💀 and questionable taste**

*Remember: The best slop is the slop you make yourself*

</div>
