# Project Specification: "One More Floor"

## 1. Tech Stack & Constraints
- **Framework:** React Native (managed via Expo)
- **Language:** TypeScript (Strict Mode enabled)
- **Graphics/Rendering:** `@shopify/react-native-skia`
- **Animation:** `react-native-reanimated`
- **Physics Engine:** `matter-js`
- **State Management:** `zustand`
- **Rule:** NEVER use standard React `<View>` components for game objects (floors, ground). All physics objects MUST be drawn on a single Skia `<Canvas>`. Standard React components are ONLY for the UI overlay (menus, buttons, text).

## 2. Core Architecture
The application is strictly divided into three layers:
1.  **Physics Layer (Matter.js):** The absolute source of truth for object positions, mass, collisions, and gravity. Runs independently of React renders.
2.  **Render Layer (Skia):** A passive consumer. It reads the X, Y, and Angle properties from Matter.js bodies via Reanimated `useFrameCallback` and draws them on the screen at 60fps.
3.  **UI/Logic Layer (Zustand + React Native):** Handles the trivia questions, score tracking, user inputs, and triggers events in the Physics Layer (e.g., adding a new block).

## 3. Gameplay Mechanics & Rules
- **Core Loop:** The player answers binary trivia questions (e.g., "Which is heavier?", "What's stronger?") using emoji-based options.
- **Success:** A correct answer increments the score by 1 and drops a new physical block onto the tower. Each successive block becomes slightly narrower to increase difficulty.
- **Penalty (Wobble Bar):** An incorrect answer adds a strike to a 3-dot indicator (1=Yellow warning, 2=Red danger, 3=Collapse).
- **Failure:** At 3 strikes, a lateral force is applied to the tower in the physics engine, causing a physical collapse.
- **Recovery:** Upon collapse, the player can watch an ad to remove one strike and continue the current tower.

## 4. Game Loop & State Machine
The game operates on a strict state machine managed by Zustand.

```typescript
interface GameState {
  status: 'HOME' | 'PLAYING' | 'COLLAPSED';
  score: number;
  bestScore: number;
  wobbleCount: number; // Max 3
  currentPuzzle: Puzzle | null;
  coins: number;
  collapseCountForAds: number; // Triggers ad every 3 collapses
}

interface Puzzle {
  question: string;
  options: { emoji: string; label: string; isCorrect: boolean }[];
}

5. UI/UX & Styling Guidelines (Design System)
Do NOT use generic system UI. The game has a vibrant, chunky, arcade-style aesthetic.

Typography: Fredoka One for Headers/Scores (load via expo-font). Nunito (600, 800) for Body/Labels.

Color Palette: - Sky: #87CEEB, Space/Night: #1a0533, Ground: #5C4033

Primary (Yellow): #FFD166, Success (Green): #06D6A0, Danger (Red): #EF476F, Card: #fffdf5

Global Background: Use expo-linear-gradient for a vertical gradient from #1a0533 (top) to #87CEEB (bottom).

Component Styling ("Chunky Buttons"): Build custom <Pressable> components. Idle state must have a heavy bottom border (e.g., borderBottomWidth: 6). Pressed state reduces this border and translates the button down on the Y-axis to simulate a physical push.

Animations: Correct answers trigger a scale pulse (withSequence). Wrong answers trigger a horizontal shake (withRepeat).

6. Execution Phases (For AI Tracking)
When prompted, execute tasks strictly in this order. Do not proceed to the next phase until the current one is fully functional and tested.

Phase 1: Setup & Physics Bridge. Initialize Expo, install Skia/Matter.js/Reanimated, and render a static ground and one falling block.

Phase 2: Zustand & The UI Shell. Implement the state store, global gradient background, and the custom "Chunky Button" components.

Phase 3: The Trivia Loop. Connect the trivia UI overlay to the state machine. Connect "correct answers" to spawning new Matter.js blocks.

Phase 4: The Wobble Mechanics. Implement the wrong-answer logic, the 3-dot UI indicator, and the physical collapse force when limits are reached.

Phase 5: Persistence & Polish. Add AsyncStorage to save bestScore. Add Reanimated micro-interactions (button presses, correct/wrong shakes).

Phase 6: Monetization Mockups. Build the UI hooks for the persistent Ad Banner and the "Watch Ad to Continue" interstitial logic.