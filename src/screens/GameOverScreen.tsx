/**
 * Game over screen - final score, best score, recovery and play again options.
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { ChunkyButton } from '../components/ChunkyButton';
import { RewardedRecoveryModal } from '../components/RewardedRecoveryModal';
import { useGameStore } from '../store/gameStore';

interface GameOverScreenProps {
  onWatchAd?: () => void;
  onPlayAgain: () => void;
}

export function GameOverScreen({ onWatchAd, onPlayAgain }: GameOverScreenProps) {
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const bestScore = useGameStore((s) => s.bestScore);
  const finalScore = useGameStore((s) => s.score);

  const canWatchAd = !!onWatchAd;

  const handleWatchAdClick = () => {
    if (canWatchAd) setShowRecoveryModal(true);
  };

  const handleModalWatchAd = () => {
    onWatchAd?.();
    setShowRecoveryModal(false);
  };

  return (
    <GradientBackground>
      <View style={styles.content}>
        <Text style={styles.title}>Tower Collapsed!</Text>
        <Text style={styles.score}>Score: {finalScore}</Text>
        <Text style={styles.best}>Best: {bestScore}</Text>

        <View style={styles.buttons}>
          {canWatchAd && (
            <ChunkyButton
              title="Watch Ad to Continue"
              onPress={handleWatchAdClick}
              variant="primary"
              style={styles.button}
            />
          )}
          <ChunkyButton
            title="Play Again"
            onPress={onPlayAgain}
            variant="success"
            style={styles.button}
          />
        </View>
      </View>

      <RewardedRecoveryModal
        visible={showRecoveryModal}
        onWatchAd={handleModalWatchAd}
        onDismiss={() => setShowRecoveryModal(false)}
      />
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
    fontSize: 32,
    color: '#fffdf5',
    marginBottom: 24,
    textAlign: 'center',
  },
  score: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 24,
    color: '#fffdf5',
    marginBottom: 8,
  },
  best: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: '#fffdf5',
    opacity: 0.9,
    marginBottom: 48,
  },
  buttons: {
    gap: 16,
    minWidth: 200,
  },
  button: {
    width: '100%',
  },
});
