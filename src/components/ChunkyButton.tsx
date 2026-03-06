/**
 * Custom "Chunky Button" - arcade-style with heavy bottom border.
 * Pressed state reduces border and translates Y to simulate physical push.
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

interface ChunkyButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'danger';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const variantColors = {
  primary: colors.primary,
  success: colors.success,
  danger: colors.danger,
};

export function ChunkyButton({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}: ChunkyButtonProps) {
  const backgroundColor = variantColors[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderBottomColor: '#000',
          transform: [{ translateY: pressed ? 4 : 0 }],
          borderBottomWidth: pressed ? 2 : 6,
        },
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderBottomWidth: 6,
    borderBottomColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: colors.space,
  },
});
