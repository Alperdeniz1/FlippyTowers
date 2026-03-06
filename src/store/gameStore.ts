/**
 * Game state machine - Zustand store.
 * Handles trivia, score, wobble, and triggers physics layer events.
 */

import { create } from 'zustand';
import { saveBestScore } from './persistence';

export interface PuzzleOption {
  emoji: string;
  label: string;
  isCorrect: boolean;
}

export interface Puzzle {
  question: string;
  options: PuzzleOption[];
  category?: string;
}

export type GameStatus = 'HOME' | 'PLAYING' | 'COLLAPSED';

export interface GameState {
  status: GameStatus;
  score: number;
  bestScore: number;
  wobbleCount: number;
  currentPuzzle: Puzzle | null;
  coins: number;
  collapseCountForAds: number;
  restoreScore: number; // When > 0, physics should restore tower (after ad revive)
  physicsDimensions: { width: number; height: number } | null; // Canvas size for physics/spawn
}

interface GameActions {
  setStatus: (status: GameStatus) => void;
  setPhysicsDimensions: (dims: { width: number; height: number } | null) => void;
  startGame: (firstPuzzle?: Puzzle) => void;
  setScore: (score: number) => void;
  setBestScore: (bestScore: number) => void;
  setWobbleCount: (count: number) => void;
  setCurrentPuzzle: (puzzle: Puzzle | null) => void;
  incrementScore: () => void;
  incrementWobbleCount: () => void;
  incrementCollapseCount: () => void;
  resetGame: () => void;
  setRestoreScore: (score: number) => void;
}

const initialState: GameState = {
  status: 'HOME',
  score: 0,
  bestScore: 0,
  wobbleCount: 0,
  currentPuzzle: null,
  coins: 0,
  collapseCountForAds: 0,
  restoreScore: 0,
  physicsDimensions: null,
};

export const useGameStore = create<GameState & GameActions>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),
  setPhysicsDimensions: (physicsDimensions) => set({ physicsDimensions }),
  setScore: (score) => set({ score }),
  setBestScore: (bestScore) => set({ bestScore }),
  setWobbleCount: (wobbleCount) => set({ wobbleCount }),
  setCurrentPuzzle: (currentPuzzle) => set({ currentPuzzle }),

  incrementScore: () =>
    set((state) => {
      const newScore = state.score + 1;
      const newBest = Math.max(state.bestScore, newScore);
      if (newBest > state.bestScore) {
        saveBestScore(newBest);
      }
      return {
        score: newScore,
        bestScore: newBest,
      };
    }),

  incrementWobbleCount: () =>
    set((state) => ({ wobbleCount: Math.min(3, state.wobbleCount + 1) })),

  incrementCollapseCount: () =>
    set((state) => ({ collapseCountForAds: state.collapseCountForAds + 1 })),

  resetGame: () =>
    set((state) => {
      const newState = {
        ...initialState,
        bestScore: state.bestScore,
        collapseCountForAds: state.collapseCountForAds,
        restoreScore: 0,
      };
      return newState;
    }),

  setRestoreScore: (restoreScore) => set({ restoreScore }),

  startGame: (firstPuzzle?: Puzzle) =>
    set((state) => ({
      ...state,
      status: 'PLAYING',
      score: 0,
      wobbleCount: 0,
      currentPuzzle: firstPuzzle ?? null,
    })),
}));
