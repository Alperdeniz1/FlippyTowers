/**
 * Score and best score display overlay.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../store/gameStore';

export function ScoreHUD() {
  const score = useGameStore((s) => s.score);
  const bestScore = useGameStore((s) => s.bestScore);

  return (
    <View style={styles.container}>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.best}>Best: {bestScore}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  score: {
    fontFamily: 'FredokaOne_400Regular',
    fontSize: 32,
    color: '#fffdf5',
  },
  best: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#fffdf5',
    opacity: 0.9,
  },
});
