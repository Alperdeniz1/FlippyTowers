/**
 * Loads and shuffles puzzles. Easy to extend with categories.
 */

import type { Puzzle } from '../store/gameStore';

// Import puzzles - in a real app you might fetch from API
import puzzlesData from './puzzles.json';

const puzzles: Puzzle[] = puzzlesData as Puzzle[];

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getShuffledPuzzles(category?: string): Puzzle[] {
  const filtered = category
    ? puzzles.filter((p) => p.category === category)
    : puzzles;
  return shuffle(filtered);
}

export function getNextPuzzle(): Puzzle {
  const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  return {
    ...puzzle,
    options: shuffle(puzzle.options),
  };
}
