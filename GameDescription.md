Game Overview: "One More Floor"
"One More Floor" is a 2D hybrid trivia-puzzle and physics-simulation game for iOS and Android. The core objective is to build the highest possible tower by correctly answering rapid-fire, binary trivia questions.

Core Gameplay Loop
The Trivia Phase: The player is presented with a fast-paced question (e.g., "Which is heavier?", "What's stronger?") and two emoji-based options (e.g., Rock 🪨 vs. Feather 🪶).

Success Mechanic (Stacking): If the player answers correctly, the score increases by 1, and a new physical block is dropped from the top of the screen onto the tower. To increase difficulty, each successive block becomes slightly narrower.

Penalty Mechanic (The Wobble): If the player answers incorrectly, they receive a strike, tracked by a 3-dot "wobble bar" indicator. The first mistake triggers a warning (yellow), the second is danger (red).

Failure State (Collapse): Upon reaching 3 mistakes, the tower suffers a structural failure and collapses. The game ends, recording the final score against the all-time best score.

Technical Architecture & Execution
Unlike the web prototype which uses static CSS animations for faking the drop and wobble effects, the mobile version relies on a real-time deterministic physics engine to create dynamic, unscripted gameplay.

Tech Stack: React Native, Expo, TypeScript.

Physics (Matter.js): Manages the rigid-body simulation. Every floor added is a physical rectangle with mass, friction, and gravity. A wrong answer will apply a lateral force vector to the tower's center of mass, challenging the player's actual physical stack.

Rendering (React Native Skia + Reanimated): Operates on a 60fps loop independent of React's render cycle. It reads coordinates from Matter.js and draws the blocks on a high-performance canvas.

UI/Logic (Zustand): Manages the standard React Native UI components that sit strictly as an overlay on top of the Skia canvas. This layer handles the trivia questions, score HUD, and home/game-over screens.

Monetization & Retention
Rewarded Recovery: Upon tower collapse, players are presented with a "Watch Ad to Continue" button. Watching the ad revives the player by removing one wobble strike, allowing them to continue their current tower.

Ad Placements: The UI accommodates a persistent advertisement banner at the bottom of the screen.