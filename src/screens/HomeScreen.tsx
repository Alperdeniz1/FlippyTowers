/**
 * Home screen - gradient background, mode selection, Play button.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { ChunkyButton } from '../components/ChunkyButton';
import { useGameStore } from '../store/gameStore';
import { getNextPuzzle } from '../data/puzzleLoader';
export function HomeScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const gameMode = useGameStore((s) => s.gameMode);
  const setGameMode = useGameStore((s) => s.setGameMode);

  const handlePlay = () => {
    startGame(gameMode === 'trivia' ? getNextPuzzle() : undefined);
  };

  return (
    <GradientBackground>
      <View style={styles.content}>
        <Text style={styles.title}>One More Floor</Text>
        <Text style={styles.subtitle}>Build the highest tower!</Text>

        <View style={styles.modeSelector}>
          <Text style={styles.modeLabel}>Mode</Text>
          <View style={styles.modeButtons}>
            <ChunkyButton
              title="Trivia"
              onPress={() => setGameMode('trivia')}
              variant="primary"
              style={StyleSheet.flatten([styles.modeButton, { opacity: gameMode === 'trivia' ? 1 : 0.7 }])}
            />
            <ChunkyButton
              title="Balance"
              onPress={() => setGameMode('balance')}
              variant={gameMode === 'balance' ? 'success' : 'primary'}
              style={StyleSheet.flatten([styles.modeButton, { opacity: gameMode === 'balance' ? 1 : 0.7 }])}
            />
          </View>
          <Text style={styles.modeHint}>
            {gameMode === 'trivia'
              ? 'Answer questions & drop blocks at the right time'
              : 'Just balance the tower - drop when aligned'}
          </Text>
        </View>

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
    marginBottom: 32,
    opacity: 0.9,
  },
  modeSelector: {
    marginBottom: 32,
    alignItems: 'center',
  },
  modeLabel: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#fffdf5',
    marginBottom: 12,
    opacity: 0.9,
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    minWidth: 120,
  },
  modeHint: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#fffdf5',
    marginTop: 12,
    opacity: 0.8,
    textAlign: 'center',
    maxWidth: 280,
  },
  playButton: {
    minWidth: 200,
  },
});
