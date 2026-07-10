# Fl!p Flop

Fl!p Flop is a mobile party-game app built with [Expo](https://expo.dev) / React Native. Pass the phone around and play a collection of mini-games designed for groups of friends.

## Games

- **Purity Test** — swipe through spicy questions and get a purity score
- **Red Flag** — call out red/green flags in relationships
- **Undercover** — social deduction word game
- **Apéro** — drinking-game style prompts
- **Médusa** — party mini-game
- **Caméléon** — party mini-game
- **Paranoia** — whisper-and-guess party game
- **Left/Right** — swipe-based choice game
- **Casting** — party mini-game

## Tech stack

- [Expo](https://expo.dev) (React Native 0.85, React 19)
- TypeScript
- NativeWind (Tailwind for React Native)
- React Navigation (stack)
- i18next / react-i18next for localization (English & French)
- Supabase (`@supabase/supabase-js`) for backend
- RevenueCat (`react-native-purchases`) for in-app purchases / paywall

## Getting started

### Prerequisites

- Node.js and [pnpm](https://pnpm.io)
- Expo CLI (installed automatically via `pnpm`/`npx`)
- Xcode (iOS) and/or Android Studio (Android) for native builds

### Install dependencies

```bash
pnpm install
```

### Run the app

```bash
pnpm start        # Expo dev server
pnpm ios          # Run on iOS simulator
pnpm android      # Run on Android emulator/device
pnpm web          # Run in browser
pnpm tunnel       # Expo dev server with tunnel (for testing on physical devices)
```

## Project structure

```
src/
  components/     Shared/common UI components
  config/         App configuration
  constants/      App-wide constants
  content/        Static content
  contexts/       React contexts
  entitlements/   Premium/subscription entitlement logic
  games/          One folder per mini-game (screens, hooks, components)
  hooks/          Shared hooks
  i18n/           i18next setup and locale files (en/fr)
  lib/            Library/client setup (e.g. Supabase)
  paywall/        Paywall / RevenueCat UI
  screens/        Top-level app screens
  types/          Shared TypeScript types
  utils/          Utility functions
supabase/         Supabase project config/migrations
docs/             Additional documentation (per-game notes, architecture)
```

See `docs/PREMIUM_ARCHITECTURE.md` and `docs/CAMELEON.md` for deeper dives into specific subsystems.

## Localization

Copy lives in `src/i18n/locales/{en,fr}`, one JSON file per game/feature. When adding new content (questions, cards, UI strings), update both locales.

## Code quality

```bash
pnpm lint          # ESLint
pnpm lint:fix      # ESLint with autofix
pnpm format        # Prettier write
pnpm format:check  # Prettier check
```

Husky + lint-staged run linting/formatting on staged files at commit time.

## Releases

The app is built and released via [EAS](https://docs.expo.dev/eas/) (`eas.json`). OTA updates are published through `expo-updates`.
