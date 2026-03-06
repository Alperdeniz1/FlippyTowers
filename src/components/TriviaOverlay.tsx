/**
 * Trivia overlay - question bar at top, answer buttons flanking the tower (left/right).
 * Keeps the tower always visible for better playability.
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
  const setStatus = useGameStore((s) => s.setStatus);
  const incrementScore = useGameStore((s) => s.incrementScore);
  const incrementWobbleCount = useGameStore((s) => s.incrementWobbleCount);
  const incrementCollapseCount = useGameStore((s) => s.incrementCollapseCount);
  const pendingBlockX = useGameStore((s) => s.pendingBlockX);
  const setIsPieceFalling = useGameStore((s) => s.setIsPieceFalling);
  const setLastDroppedBlockId = useGameStore((s) => s.setLastDroppedBlockId);
  const setCurrentPuzzle = useGameStore((s) => s.setCurrentPuzzle);

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentPuzzle) return;
    if (isCorrect) {
      const newScore = score + 1;
      incrementScore();
      const centerX = physicsDimensions ? pendingBlockX : 200;
      const block = createBlock(centerX, 50, newScore);
      setIsPieceFalling(true);
      setLastDroppedBlockId(block.id);
      // Next puzzle is set by collision handler when block lands
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

  const [leftOpt, rightOpt] = currentPuzzle.options;

  return (
    <>
      {/* Question bar - dedicated block at top, tower always visible below */}
      <View style={styles.questionBar}>
        <Text style={styles.question} numberOfLines={2}>
          {currentPuzzle.question}
        </Text>
      </View>

      {/* Answer buttons - left and right of tower for easy tapping */}
      <View style={styles.leftButton}>
        <TriviaOptionButton
          key={leftOpt.label}
          emoji={leftOpt.emoji}
          label={leftOpt.label}
          isCorrect={leftOpt.isCorrect}
          onPress={handleAnswer}
          style={styles.optionButton}
          compact
        />
      </View>
      <View style={styles.rightButton}>
        <TriviaOptionButton
          key={rightOpt.label}
          emoji={rightOpt.emoji}
          label={rightOpt.label}
          isCorrect={rightOpt.isCorrect}
          onPress={handleAnswer}
          style={styles.optionButton}
          compact
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  questionBar: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    backgroundColor: '#fffdf5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  question: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#1a0533',
    textAlign: 'center',
  },
  leftButton: {
    position: 'absolute',
    left: 16,
    bottom: 100 + AD_BANNER_HEIGHT,
    width: 120,
  },
  rightButton: {
    position: 'absolute',
    right: 16,
    bottom: 100 + AD_BANNER_HEIGHT,
    width: 120,
  },
  optionButton: {
    width: '100%',
  },
});
