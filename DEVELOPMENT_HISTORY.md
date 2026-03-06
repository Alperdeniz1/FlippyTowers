# Development History - One More Floor

A chronological log of development phases and fixes for the "One More Floor" mobile game.

---

## Phase 1: Setup & Physics Bridge

**Goal:** Ground + one falling block, rendered at 60fps.

**Implemented:**
- Initialized Expo project with TypeScript (strict mode)
- Installed dependencies: `@shopify/react-native-skia`, `react-native-reanimated`, `matter-js`, `zustand`, `expo-linear-gradient`, `expo-font`, `@react-native-async-storage/async-storage`
- Created physics layer:
  - `src/physics/engine.ts` - Singleton Matter.js engine with `addBody`, `applyForce`, `resetWorld`, `getAllBodies`
  - `src/physics/ground.ts` - Static ground body at bottom of screen
  - `src/physics/block.ts` - Block factory with narrowing formula `Math.max(40, 120 - score * 3)`
- Created render layer:
  - `src/render/PhysicsCanvas.tsx` - Skia Canvas with `useFrameCallback` + `useDerivedValue` for 60fps rendering
- Added `src/theme/colors.ts` for design system palette

---

## Phase 2: Zustand & UI Shell

**Goal:** State store, gradient background, chunky buttons.

**Implemented:**
- `src/store/gameStore.ts` - Zustand store with `GameState` (status, score, bestScore, wobbleCount, currentPuzzle, coins, collapseCountForAds)
- `src/components/ChunkyButton.tsx` - Arcade-style button with heavy bottom border, pressed state
- `src/components/GradientBackground.tsx` - Vertical gradient (#1a0533 → #87CEEB)
- `src/screens/HomeScreen.tsx` - Play button, Fredoka One + Nunito fonts
- `src/data/puzzles.json` - 10 binary trivia questions with emoji options
- `src/data/puzzleLoader.ts` - Load and shuffle puzzles by category
- Font loading via `@expo-google-fonts/fredoka-one` and `@expo-google-fonts/nunito`

---

## Phase 3: Trivia Loop

**Goal:** Trivia UI overlay + correct answer spawns new block.

**Implemented:**
- `src/components/TriviaOverlay.tsx` - Question + two emoji options
- `src/components/ScoreHUD.tsx` - Score and best score display
- `src/screens/GameScreen.tsx` - Composes PhysicsCanvas + TriviaOverlay + ScoreHUD
- Connected correct answer → `incrementScore()`, `createBlock()`, next puzzle
- PhysicsCanvas no longer auto-creates initial block; first block spawns on first correct answer

---

## Phase 4: Wobble Mechanics

**Goal:** Wrong answers → strikes → lateral force → collapse.

**Implemented:**
- `src/components/WobbleBar.tsx` - 3-dot indicator (yellow → red)
- Wrong answer logic: 1–2 strikes → next puzzle; 3 strikes → `applyLateralForceToTower()`, status COLLAPSED
- `src/physics/engine.ts` - `applyLateralForceToTower()` applies horizontal impulse to all blocks
- `src/screens/GameOverScreen.tsx` - Final score, best score, "Watch Ad to Continue", "Play Again"
- `restoreTower()` in block.ts for ad-revive flow

---

## Phase 5: Persistence & Polish

**Goal:** Save best score, micro-interactions.

**Implemented:**
- `src/store/persistence.ts` - AsyncStorage for bestScore; `loadBestScore`, `saveBestScore`, `hydrateStore`
- Broke require cycle: `persistence.ts` no longer imports `gameStore`; `hydrateStore` accepts callback
- `src/components/TriviaOptionButton.tsx` - Correct answer → scale pulse; wrong answer → horizontal shake
- Best score persisted on increment; hydrated on app start

---

## Phase 6: Monetization Mockups

**Goal:** UI hooks for ads; no real ad SDK.

**Implemented:**
- `src/components/AdBanner.tsx` - Persistent placeholder banner at bottom (50px)
- `src/components/RewardedRecoveryModal.tsx` - "Watch Ad to Continue" modal with mock callback
- GameOverScreen shows recovery modal when "Watch Ad" clicked
- Ad revive: `setWobbleCount(2)`, restore tower, continue game

---

## Package Updates (Expo 55 Compatibility)

**Issue:** Package version warnings for Skia, expo-font, expo-linear-gradient, react-native-reanimated.

**Fix:** Ran `npx expo install --fix` to align with Expo 55:
- `@shopify/react-native-skia`: 1.12.4 → 2.4.18
- `expo-font`: 14.x → ~55.0.4
- `expo-linear-gradient`: 14.x → ~55.0.8
- `react-native-reanimated`: 3.17.x → 4.2.1

---

## Web Support - Initial Attempt (Skia)

**Issue:** White screen when clicking Play on web.

**Attempted:**
- Ran `npx setup-skia-web` to copy `canvaskit.wasm` to `public/`
- Created `index.web.tsx` with `LoadSkiaWeb()` deferred loading
- Added `app.json` web.bundler: "metro"

**Result:** Failed - `Skia.Path` undefined in `useDerivedValue` worklet context on web.

---

## Web Support - View-Based Fallback

**Issue:** Skia's `useDerivedValue` + Path doesn't work in worklet context on web.

**Fix:**
- Created `src/render/PhysicsCanvas.web.tsx` - View-based renderer for web
- Uses `requestAnimationFrame` instead of `useFrameCallback` for physics loop
- Renders blocks as absolutely positioned `View`s instead of Skia paths
- Simplified `index.web.tsx` to direct `registerRootComponent(App)` (no Skia load on web)

---

## Web Layout Fixes

**Issue:** Tower on right side, blank scrollable space at bottom.

**Fix:**
- `src/components/WebLayoutFix.tsx` - Injects global CSS: `html, body` height 100%, overflow hidden; `#root` flex, height 100%
- Root View: `height: 100vh`, `minHeight: 100vh`, `overflow: hidden` on web
- Wrapped GameScreen in `GradientBackground`
- PhysicsCanvas: `width: 100%`, `alignSelf: stretch`, `overflow: hidden`

---

## Require Cycle Fix

**Issue:** `gameStore.ts → persistence.ts → gameStore.ts` require cycle.

**Fix:** Removed `gameStore` import from `persistence.ts`. `hydrateStore` now accepts `setBestScore` callback; `App.tsx` passes `(score) => useGameStore.getState().setBestScore(score)`.

---

## Ground Visibility & Option Randomization

**Issue 1:** Ground not visible; had to answer 10 questions to see tower tip.

**Fix:** Physics now uses canvas dimensions from `onLayout` instead of `Dimensions.get('window')`. Ground positioned at bottom of actual canvas.

**Issue 2:** Correct answer always in first option.

**Fix:** `getNextPuzzle()` shuffles options before returning: `options: shuffle(puzzle.options)`.

---

## Block Position & Canvas Dimensions

**Issue:** Tiles on right half of screen; blocks fell to invisible area after hitting ground.

**Fix:**
- Added `physicsDimensions` to game store - canvas size from `onLayout`
- PhysicsCanvas calls `setPhysicsDimensions()` when layout is known
- TriviaOverlay uses `physicsDimensions.width / 2` for block spawn center (instead of `Dimensions.get('window').width / 2`)
- Canvas and GameScreen container: `overflow: hidden`
- Ground rendered with `colors.ground` (#5C4033)
- Removed `createGround` from `handlePlayAgain`; PhysicsCanvas handles it on mount with correct dimensions

---

## File Structure (Final)

```
src/
├── physics/          engine.ts, ground.ts, block.ts
├── render/           PhysicsCanvas.tsx, PhysicsCanvas.web.tsx
├── store/            gameStore.ts, persistence.ts
├── components/       ChunkyButton, TriviaOverlay, TriviaOptionButton,
│                     ScoreHUD, WobbleBar, GradientBackground,
│                     AdBanner, RewardedRecoveryModal, WebLayoutFix
├── screens/          HomeScreen, GameScreen, GameOverScreen
├── data/              puzzles.json, puzzleLoader.ts
└── theme/            colors.ts
```

---

## Running the App

- **Web:** `npm run web`
- **Android:** `npm run android`
- **iOS:** `npm run ios` (macOS only)
- **Expo Go:** `npm start` → scan QR code

---

*Last updated: March 2026*
