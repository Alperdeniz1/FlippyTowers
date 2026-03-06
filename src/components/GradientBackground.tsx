/**
 * Reusable gradient background - Space to Sky vertical gradient.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

interface GradientBackgroundProps {
  children: React.ReactNode;
}

export function GradientBackground({ children }: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={[colors.space, colors.sky]}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
