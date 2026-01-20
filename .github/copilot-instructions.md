You are an expert in TypeScript, React Native, Expo Router, Nativewind, and React Native Reusables.

## Project overview
- This is an Expo project using the app router in `app/` with a root layout in `app/_layout.tsx` and the home screen in `app/index.tsx`.
- Navigation theming is centralized in `lib/theme.ts` and wired via `NAV_THEME` inside `RootLayout`.
- Shared UI primitives live in `components/ui/` (e.g. `button`, `text`, `icon`) and should be preferred over raw React Native components.
- Styling uses Tailwind via Nativewind with config in `tailwind.config.js` and CSS variables defined in `global.css`.

## Code style and structure
- Use functional components with hooks and `.tsx` files throughout the app.
- Prefer the `@` path alias (e.g. `@/components/ui/button`, `@/lib/utils`) instead of relative imports.
- When adding screens, place them under `app/` following Expo Router conventions and use `Stack.Screen` options from within the screen component (see `app/index.tsx`).
- Reuse the primitives in `components/ui/` rather than re-implementing styles (for example use `Button`, `Text`, `Icon`).

## Theming and color scheme
- Theme tokens are defined in `THEME` and mapped to React Navigation themes via `NAV_THEME` in `lib/theme.ts`.
- The root layout in `app/_layout.tsx` reads `colorScheme` from `nativewind` and passes `NAV_THEME[colorScheme ?? 'light']` to `ThemeProvider`.
- For screen-level theming or toggles, use `useColorScheme` from `nativewind` as in the `ThemeToggle` component in `app/index.tsx`.
- Do not hardcode colors; instead, rely on Tailwind tokens (e.g. `bg-primary`, `text-muted-foreground`) which are backed by CSS variables configured in `tailwind.config.js`.

## Styling patterns
- Compose styles using the `className` prop and the `cn` utility from `lib/utils.ts` to merge conditional classes.
- For components with variants (size, style, etc.), use `class-variance-authority` (`cva`) as in `components/ui/button.tsx` and `components/ui/text.tsx`.
- When you need text styling inside buttons or similar, wrap children with `Text` and use the `TextClassContext` pattern from `components/ui/text.tsx` instead of duplicating text classes.
- For icons, always use the `Icon` wrapper in `components/ui/icon.tsx` so that Nativewind `className` and `size` interop works correctly.

## Navigation and layout
- Use Expo Router primitives (`Stack`, `Link`) from `expo-router` for navigation; do not introduce React Navigation stack/navigator components directly.
- Configure per-screen headers via `Stack.Screen` inside the screen component (see `SCREEN_OPTIONS` in `app/index.tsx`).
- Use `PortalHost` from `@rn-primitives/portal` (already mounted in `app/_layout.tsx`) for overlays such as modals or toasts instead of ad-hoc absolute-positioned views.

## Commands and workflows
- `npm run dev` — start the Expo dev server (clears cache); press `i`/`a`/`w` to open iOS, Android, or Web.
- `npm run ios` / `npm run android` / `npm run web` — start directly on a specific platform.
- `npm run clean` — remove `.expo` and `node_modules` for a fresh install.
- Add new UI components via React Native Reusables CLI: `npx @react-native-reusables/cli@latest add <component>`.
- Aliases are configured in `components.json` (`@/components`, `@/lib`, `@/hooks`, etc.) for consistent imports.

## TypeScript and correctness
- Maintain strong typing for props and component APIs; avoid `any` and prefer explicit interfaces or typed React component props.
- Keep platform-specific behavior behind `Platform.select` when needed, following the examples in `components/ui/button.tsx` and `components/ui/text.tsx`.

## Formatting
- Prettier is configured with the `prettier-plugin-tailwindcss` plugin to auto-sort Tailwind classes; run your editor's format-on-save or `npx prettier --write .` to apply.
