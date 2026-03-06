/**
 * Persistence layer - AsyncStorage for best score.
 * Does NOT import gameStore to avoid require cycle.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const BEST_SCORE_KEY = '@one_more_floor/best_score';

export async function loadBestScore(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(BEST_SCORE_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch {
    return 0;
  }
}

export async function saveBestScore(score: number): Promise<void> {
  try {
    await AsyncStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // Ignore save errors
  }
}

/**
 * Load best score and pass to setter. Caller provides setBestScore to avoid cycle.
 */
export async function hydrateStore(setBestScore: (score: number) => void): Promise<void> {
  const bestScore = await loadBestScore();
  setBestScore(bestScore);
}
