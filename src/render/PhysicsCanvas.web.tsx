/**
 * Web fallback - View-based rendering instead of Skia.
 * Skia's useDerivedValue + Path doesn't work in worklet context on web.
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import { getAllBodies, updateEngine } from '../physics';
import { cleanupDebris } from '../physics/collisionHandler';
import { createGround } from '../physics/ground';
import { restoreTower, getBlockWidth, HEIGHT } from '../physics/block';
import { initPendingBlock, updatePendingBlock } from '../physics/pendingBlock';
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

const SPAWN_Y = 50;

export function PhysicsCanvas({ onReady, restoreScore = 0 }: PhysicsCanvasProps) {
  const [bodies, setBodies] = useState<BodyData[]>([]);
  const [pendingBlock, setPendingBlock] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const pendingInitializedRef = useRef(false);

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
      const store = useGameStore.getState();
      const dims = store.physicsDimensions;
      const status = store.status;
      const currentPuzzle = store.currentPuzzle;
      const isPieceFalling = store.isPieceFalling;
      const score = store.score;

      // Update pending block bounce when in pre-drop phase
      if (dims && status === 'PLAYING' && currentPuzzle && !isPieceFalling) {
        if (!pendingInitializedRef.current) {
          initPendingBlock(dims.width / 2);
          pendingInitializedRef.current = true;
        }
        const blockWidth = getBlockWidth(score + 1);
        const newX = updatePendingBlock(1000 / 60, dims.width, blockWidth, score);
        store.setPendingBlockX(newX);
        setPendingBlock({
          x: newX - blockWidth / 2,
          y: SPAWN_Y - HEIGHT / 2,
          w: blockWidth,
          h: HEIGHT,
        });
      } else {
        if (isPieceFalling) {
          pendingInitializedRef.current = false;
        }
        setPendingBlock(null);
      }

      updateEngine(1000 / 60);
      cleanupDebris();
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
      {pendingBlock && (
        <View
          key="pending"
          style={[
            styles.block,
            { backgroundColor: colors.primary },
            {
              left: pendingBlock.x,
              top: pendingBlock.y,
              width: pendingBlock.w,
              height: pendingBlock.h,
            },
          ]}
        />
      )}
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
