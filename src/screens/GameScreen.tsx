/**
 * Game screen - Physics canvas with Trivia overlay and Score HUD.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PhysicsCanvas } from '../render/PhysicsCanvas';
import { TriviaOverlay } from '../components/TriviaOverlay';
import { ScoreHUD } from '../components/ScoreHUD';
import { WobbleBar } from '../components/WobbleBar';
import { GradientBackground } from '../components/GradientBackground';
import { useGameStore } from '../store/gameStore';

export function GameScreen() {
  const restoreScore = useGameStore((s) => s.restoreScore);

  return (
    <GradientBackground>
    <View style={styles.container}>
      <PhysicsCanvas restoreScore={restoreScore} />
      <View style={styles.uiOverlay} pointerEvents="box-none">
        <View style={styles.hudRow}>
          <ScoreHUD />
          <WobbleBar />
        </View>
        <TriviaOverlay />
      </View>
    </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden' as const,
  },
  uiOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  hudRow: {
    position: 'absolute',
    top: 48,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
