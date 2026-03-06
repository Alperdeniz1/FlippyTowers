import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { useSharedValue, useFrameCallback, useDerivedValue } from 'react-native-reanimated';
import Matter from 'matter-js';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 1. Define the Physics Engine outside the render cycle to prevent memory leaks
const engine = Matter.Engine.create();
const world = engine.world;

export default function GameEngine() {
  // 2. Skia Shared Values for high-performance rendering (bypassing React State)
  const bodyPositions = useSharedValue<{ id: number; x: number; y: number; w: number; h: number; angle: number }[]>([]);

  // 3. Game State (Standard React State for UI overlays)
  const [gameState, setGameState] = useState<'IDLE' | 'PUZZLE' | 'DROPPING' | 'COLLAPSED'>('IDLE');
  const [collapses, setCollapses] = useState(0);

  useEffect(() => {
    // 4. Initialize Physics Boundaries (The Ground)
    const ground = Matter.Bodies.rectangle(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 50, SCREEN_WIDTH, 100, { 
      isStatic: true,
      label: 'ground'
    });
    Matter.World.add(world, ground);

    return () => {
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  // 5. The Core Loop: Sync Matter.js with Reanimated/Skia at 60fps
  useFrameCallback(() => {
    // Step the physics engine forward
    Matter.Engine.update(engine, 1000 / 60);

    // Map Matter.js bodies to Skia-readable data
    const activeBodies = Matter.Composite.allBodies(world).map(body => ({
      id: body.id,
      x: body.position.x - (body.bounds.max.x - body.bounds.min.x) / 2, // Skia draws from top-left, Matter calculates from center
      y: body.position.y - (body.bounds.max.y - body.bounds.min.y) / 2,
      w: body.bounds.max.x - body.bounds.min.x,
      h: body.bounds.max.y - body.bounds.min.y,
      angle: body.angle,
    }));

    bodyPositions.value = activeBodies;
  });

  // 6. The Render Pipeline: Calculate the exact drawing path on the UI Thread
  const blocksPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    
    for (let i = 0; i < bodyPositions.value.length; i++) {
      const b = bodyPositions.value[i];
      
      // Create the physical rectangle
      const rectPath = Skia.Path.Make();
      rectPath.addRect(Skia.XYWHRect(b.x, b.y, b.w, b.h));
      
      // Calculate the rotation matrix from the center of the specific block
      const matrix = Skia.Matrix();
      const centerX = b.x + b.w / 2;
      const centerY = b.y + b.h / 2;
      
      matrix.translate(centerX, centerY);
      matrix.rotate(b.angle); // Matter.js angles are in radians
      matrix.translate(-centerX, -centerY);
      
      // Apply transformation and append to the master path
      rectPath.transform(matrix);
      path.addPath(rectPath);
    }
    
    return path;
  });

  // Function to trigger after a correct puzzle answer
  const dropNewFloor = () => {
    const newFloor = Matter.Bodies.rectangle(SCREEN_WIDTH / 2, 50, 100, 30, {
      mass: 1,
      friction: 0.8,
      restitution: 0.1 // Low bounciness
    });
    Matter.World.add(world, newFloor);
    setGameState('DROPPING');
  };

  

  return (
    <View style={styles.container}>
      {/* SKIA LAYER: Pure performance drawing. One single component updated natively. */}
      <Canvas style={styles.canvas}>
        <Path path={blocksPath} color="#FFD166" />
      </Canvas>

      {/* REACT NATIVE UI LAYER: Buttons, Menus, Puzzles overlayed on top */}
      <View style={styles.uiOverlay}>
        {/* Placeholder for the 5-second puzzle component */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0533' },
  canvas: { flex: 1 },
  uiOverlay: { ...StyleSheet.absoluteFillObject, pointerEvents: 'box-none' },
});