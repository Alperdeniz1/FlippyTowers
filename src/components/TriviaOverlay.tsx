/**
 * Trivia question overlay - binary question with two emoji options.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TriviaOptionButton } from './TriviaOptionButton';
import { useGameStore } from '../store/gameStore';
import { createBlock } from '../physics/block';
import { applyLateralForceToTower } from '../physics/engine';
import { getNextPuzzle } from '../data/puzzleLoader';
import { AD_BANNER_HEIGHT } from './AdBanner';

export function TriviaOverlay() {
  const currentPuzzle = useGameStore((s) => s.currentPuzzle);
  const physicsDimensions = useGameStore((s) => s.physicsDimensions);
  const score = useGameStore((s) => s.score);
  const wobbleCount = useGameStore((s) => s.wobbleCount);
  const setCurrentPuzzle = useGameStore((s) => s.setCurrentPuzzle);
  const setStatus = useGameStore((s) => s.setStatus);
  const incrementScore = useGameStore((s) => s.incrementScore);
  const incrementWobbleCount = useGameStore((s) => s.incrementWobbleCount);
  const incrementCollapseCount = useGameStore((s) => s.incrementCollapseCount);

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentPuzzle) return;
    if (isCorrect) {
      const newScore = score + 1;
      incrementScore();
      const centerX = physicsDimensions ? physicsDimensions.width / 2 : 200;
      createBlock(centerX, 50, newScore);
      setCurrentPuzzle(getNextPuzzle());
    } else {
      incrementWobbleCount();
      if (wobbleCount >= 2) {
        applyLateralForceToTower();
        incrementCollapseCount();
        setStatus('COLLAPSED');
      } else {
        setCurrentPuzzle(getNextPuzzle());
      }
    }
  };

  if (!currentPuzzle) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.question}>{currentPuzzle.question}</Text>
        <View style={styles.options}>
          {currentPuzzle.options.map((opt) => (
            <TriviaOptionButton
              key={opt.label}
              emoji={opt.emoji}
              label={opt.label}
              isCorrect={opt.isCorrect}
              onPress={handleAnswer}
              style={styles.optionButton}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120 + AD_BANNER_HEIGHT,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fffdf5',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  question: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: '#1a0533',
    marginBottom: 20,
    textAlign: 'center',
  },
  options: {
    gap: 12,
  },
  optionButton: {
    minWidth: '100%',
  },
});
