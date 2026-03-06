/**
 * 3-dot wobble indicator: 1=Yellow warning, 2=Red danger, 3=Collapse.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { colors } from '../theme/colors';

export function WobbleBar() {
  const wobbleCount = useGameStore((s) => s.wobbleCount);

  const getDotColor = (index: number) => {
    if (index >= wobbleCount) return colors.card;
    if (wobbleCount === 1) return colors.warning;
    if (wobbleCount === 2) return colors.danger;
    return colors.danger;
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: getDotColor(i) },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
});
