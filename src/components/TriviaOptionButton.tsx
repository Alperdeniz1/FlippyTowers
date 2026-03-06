/**
 * Trivia option button with correct (scale pulse) / wrong (shake) animations.
 */

import React from 'react';
import { StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { colors } from '../theme/colors';

interface TriviaOptionButtonProps {
  emoji: string;
  label: string;
  isCorrect: boolean;
  onPress: (isCorrect: boolean) => void;
  style?: ViewStyle;
  compact?: boolean;
}

export function TriviaOptionButton({
  emoji,
  label,
  isCorrect,
  onPress,
  style,
  compact = false,
}: TriviaOptionButtonProps) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  const handlePress = () => {
    if (isCorrect) {
      scale.value = withSequence(
        withTiming(1.15, { duration: 80 }),
        withTiming(1, { duration: 120 })
      );
    } else {
      translateX.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(-8, { duration: 50 }),
          withTiming(0, { duration: 50 })
        ),
        1,
        false
      );
    }
    // Small delay so animation is visible before state update
    setTimeout(() => onPress(isCorrect), isCorrect ? 150 : 250);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle, style]}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          compact && styles.buttonCompact,
          {
            transform: [{ translateY: pressed ? 4 : 0 }],
            borderBottomWidth: pressed ? 2 : 6,
          },
        ]}
      >
        <Text style={[styles.text, compact && styles.textCompact]} numberOfLines={1}>
          {emoji} {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderBottomWidth: 6,
    borderBottomColor: '#000',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCompact: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  text: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: colors.space,
  },
  textCompact: {
    fontSize: 14,
  },
});
