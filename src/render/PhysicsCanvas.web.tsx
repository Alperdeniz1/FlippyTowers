/**
 * Web fallback - View-based rendering instead of Skia.
 * Skia's useDerivedValue + Path doesn't work in worklet context on web.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
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
  label?: string;
};

interface PhysicsCanvasProps {
  onReady?: () => void;
  restoreScore?: number;
}

export function PhysicsCanvas({ onReady, restoreScore = 0 }: PhysicsCanvasProps) {
  const [bodies, setBodies] = useState<BodyData[]>([]);
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

  useEffect(() => {
    if (!dimensions) return;
    let rafId: number;
    const loop = () => {
      updateEngine(1000 / 60);
      const nextBodies = getAllBodies().map((body) => ({
        id: body.id,
        x: body.position.x - (body.bounds.max.x - body.bounds.min.x) / 2,
        y: body.position.y - (body.bounds.max.y - body.bounds.min.y) / 2,
        w: body.bounds.max.x - body.bounds.min.x,
        h: body.bounds.max.y - body.bounds.min.y,
        angle: body.angle,
        label: body.label,
      }));
      setBodies(nextBodies);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [dimensions]);

  return (
    <View style={styles.canvas} onLayout={onLayout}>
      {bodies.map((b) => (
        <View
          key={b.id}
          style={[
            styles.block,
            { backgroundColor: b.label === 'ground' ? colors.ground : colors.primary },
            {
              left: b.x,
              top: b.y,
              width: b.w,
              height: b.h,
              transform: [
                { translateX: b.w / 2 },
                { translateY: b.h / 2 },
                { rotate: `${b.angle}rad` },
                { translateX: -b.w / 2 },
                { translateY: -b.h / 2 },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    position: 'relative' as const,
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'hidden' as const,
  },
  block: {
    position: 'absolute',
    borderRadius: 2,
  },
});
