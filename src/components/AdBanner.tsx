/**
 * Persistent ad banner placeholder at bottom of screen.
 * Mock - ready for real ad SDK integration.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const BANNER_HEIGHT = 50;

export function AdBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.label}>Ad</Text>
    </View>
  );
}

export const AD_BANNER_HEIGHT = BANNER_HEIGHT;

const styles = StyleSheet.create({
  banner: {
    height: BANNER_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
});
