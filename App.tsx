import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Platform, StyleSheet, ViewStyle } from 'react-native';
import {
  useFonts,
  FredokaOne_400Regular,
} from '@expo-google-fonts/fredoka-one';
import {
  useFonts as useNunitoFonts,
  Nunito_600SemiBold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { useGameStore } from './src/store/gameStore';
import { resetWorld } from './src/physics/engine';
import { getNextPuzzle } from './src/data/puzzleLoader';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { AdBanner } from './src/components/AdBanner';
import { WebLayoutFix } from './src/components/WebLayoutFix';
import { colors } from './src/theme/colors';
import { hydrateStore } from './src/store/persistence';

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    hydrateStore((score) => useGameStore.getState().setBestScore(score));
  }, []);
  const status = useGameStore((s) => s.status);
  const resetGame = useGameStore((s) => s.resetGame);
  const setStatus = useGameStore((s) => s.setStatus);
  const setWobbleCount = useGameStore((s) => s.setWobbleCount);

  const handlePlayAgain = () => {
    resetWorld();
    resetGame();
    const store = useGameStore.getState();
    setStatus('PLAYING');
    if (store.gameMode === 'trivia') {
      store.setCurrentPuzzle(getNextPuzzle());
    }
  };

  const handleWatchAd = () => {
    const store = useGameStore.getState();
    store.setRestoreScore(store.score);
    store.setWobbleCount(2);
    store.setStatus('PLAYING');
    if (store.gameMode === 'trivia') {
      store.setCurrentPuzzle(getNextPuzzle());
    }
  };

  const [fredokaLoaded] = useFonts({
    FredokaOne_400Regular,
  });

  const [nunitoLoaded] = useNunitoFonts({
    Nunito_600SemiBold,
    Nunito_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fredokaLoaded && nunitoLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fredokaLoaded, nunitoLoaded]);

  if (!fredokaLoaded || !nunitoLoaded) {
    return null;
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.space }]} onLayout={onLayoutRootView}>
      <WebLayoutFix />
      <View style={styles.content}>
        {status === 'HOME' && <HomeScreen />}
        {status === 'PLAYING' && <GameScreen />}
        {status === 'COLLAPSED' && (
          <GameOverScreen
            onWatchAd={handleWatchAd}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </View>
      <AdBanner />
      <StatusBar style="light" />
    </View>
  );
}

const webRootStyles = Platform.OS === 'web'
  ? ({ height: '100vh', minHeight: '100vh', overflow: 'hidden' } as unknown as ViewStyle)
  : {};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    ...webRootStyles,
  },
  content: {
    flex: 1,
    minHeight: 0,
  },
});
