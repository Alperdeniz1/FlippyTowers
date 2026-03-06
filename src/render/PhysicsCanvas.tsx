/**
 * Render Layer - Skia Canvas that reads body data from Matter.js via shared values.
 * Runs at 60fps independent of React's render cycle.
 */

import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { useSharedValue, useFrameCallback, useDerivedValue, runOnJS } from 'react-native-reanimated';
import { getAllBodies, updateEngine } from '../physics';
import { createGround } from '../physics/ground';
import { restoreTower } from '../physics/block';
import { resetWorld } from '../physics/engine';
import { useGameStore } from '../store/gameStore';
import { colors } from '../theme/colors';

export type BodyData = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  angle: number;
};

interface PhysicsCanvasProps {
  onReady?: () => void;
  restoreScore?: number;
}

export function PhysicsCanvas({ onReady, restoreScore = 0 }: PhysicsCanvasProps) {
  const bodyPositions = useSharedValue<BodyData[]>([]);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const setPhysicsDimensions = useGameStore((s) => s.setPhysicsDimensions);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      const dims = { width, height };
      setDimensions(dims);
      setPhysicsDimensions(dims);
    }
  }, [setPhysicsDimensions]);

  useEffect(() => {
    if (!dimensions) return;
    const { width, height } = dimensions;
    resetWorld();
    createGround(width, height);
    if (restoreScore > 0) {
      restoreTower(width / 2, height, restoreScore);
    }
    onReady?.();
    return () => {
      resetWorld();
      setPhysicsDimensions(null);
    };
  }, [dimensions, onReady, restoreScore, setPhysicsDimensions]);

  const syncBodiesToSharedValue = useCallback(() => {
    updateEngine(1000 / 60);
    const bodies = getAllBodies().map((body) => ({
      id: body.id,
      x: body.position.x - (body.bounds.max.x - body.bounds.min.x) / 2,
      y: body.position.y - (body.bounds.max.y - body.bounds.min.y) / 2,
      w: body.bounds.max.x - body.bounds.min.x,
      h: body.bounds.max.y - body.bounds.min.y,
      angle: body.angle,
    }));
    bodyPositions.value = bodies;
  }, []);

  useFrameCallback(() => {
    runOnJS(syncBodiesToSharedValue)();
  });

  const blocksPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const bodies = bodyPositions.value;
    for (let i = 0; i < bodies.length; i++) {
      const b = bodies[i];
      const rectPath = Skia.Path.Make();
      rectPath.addRect(Skia.XYWHRect(b.x, b.y, b.w, b.h));
      const matrix = Skia.Matrix();
      const centerX = b.x + b.w / 2;
      const centerY = b.y + b.h / 2;
      matrix.translate(centerX, centerY);
      matrix.rotate(b.angle);
      matrix.translate(-centerX, -centerY);
      rectPath.transform(matrix);
      path.addPath(rectPath);
    }
    return path;
  });

  return (
    <View style={styles.canvas} onLayout={onLayout}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Path path={blocksPath} color={colors.primary} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    position: 'relative' as const,
  },
});
