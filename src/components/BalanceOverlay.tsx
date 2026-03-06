/**
 * Balance mode overlay - single Drop button to release the bouncing block.
 * No trivia questions; pure tower balancing.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { createBlock } from '../physics/block';
import { AD_BANNER_HEIGHT } from './AdBanner';
import { colors } from '../theme/colors';

export function BalanceOverlay() {
  const physicsDimensions = useGameStore((s) => s.physicsDimensions);
  const score = useGameStore((s) => s.score);
  const pendingBlockX = useGameStore((s) => s.pendingBlockX);
  const setIsPieceFalling = useGameStore((s) => s.setIsPieceFalling);
  const setLastDroppedBlockId = useGameStore((s) => s.setLastDroppedBlockId);
  const incrementScore = useGameStore((s) => s.incrementScore);

  const handleDrop = () => {
    const newScore = score + 1;
    incrementScore();
    const centerX = physicsDimensions ? pendingBlockX : 200;
    const block = createBlock(centerX, 50, newScore);
    setIsPieceFalling(true);
    setLastDroppedBlockId(block.id);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleDrop}
        style={({ pressed }) => [
          styles.dropButton,
          {
            transform: [{ translateY: pressed ? 4 : 0 }],
            borderBottomWidth: pressed ? 2 : 6,
          },
        ]}
      >
        <Text style={styles.dropText}>Drop</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100 + AD_BANNER_HEIGHT,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dropButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    borderBottomWidth: 6,
    borderBottomColor: '#000',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: colors.space,
  },
});
