/**
 * Home screen - gradient background, Play button.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { ChunkyButton } from '../components/ChunkyButton';
import { useGameStore } from '../store/gameStore';
import { getNextPuzzle } from '../data/puzzleLoader';

export function HomeScreen() {
  const startGame = useGameStore((s) => s.startGame);

  const handlePlay = () => {
    startGame(getNextPuzzle());
  };

  return (
    <GradientBackground>
      <View style={styles.content}>
        <Text style={styles.title}>One More Floor</Text>
        <Text style={styles.subtitle}>Build the highest tower!</Text>
        <ChunkyButton
          title="Play"
          onPress={handlePlay}
          variant="primary"
          style={styles.playButton}
        />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontFamily: 'FredokaOne_400Regular',
    fontSize: 36,
    color: '#fffdf5',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: '#fffdf5',
    marginBottom: 48,
    opacity: 0.9,
  },
  playButton: {
    minWidth: 200,
  },
});
