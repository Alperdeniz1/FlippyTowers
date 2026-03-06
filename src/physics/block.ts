/**
 * Factory for block bodies. Each successive block becomes slightly narrower.
 * Formula: Math.max(MIN_WIDTH, BASE_WIDTH - score * NARROWING_FACTOR)
 */

import Matter from 'matter-js';
import { addBody } from './engine';

const BASE_WIDTH = 120;
export const MIN_WIDTH = 40;
export const HEIGHT = 30;
const NARROWING_FACTOR = 3;

export function getBlockWidth(score: number): number {
  return Math.max(MIN_WIDTH, BASE_WIDTH - score * NARROWING_FACTOR);
}

export function createBlock(
  centerX: number,
  spawnY: number,
  score: number
): Matter.Body {
  const width = getBlockWidth(score);
  const block = Matter.Bodies.rectangle(centerX, spawnY, width, HEIGHT, {
    mass: 1,
    friction: 0.8,
    restitution: 0.1,
    label: 'block',
  });
  addBody(block);
  return block;
}

/**
 * Create a block from overlap region (after cut-off resolution).
 * Used when a falling block lands with partial alignment.
 */
export function createBlockFromOverlap(
  centerX: number,
  y: number,
  width: number
): Matter.Body {
  const block = Matter.Bodies.rectangle(centerX, y, width, HEIGHT, {
    mass: 1,
    friction: 0.8,
    restitution: 0.1,
    label: 'block',
  });
  addBody(block);
  return block;
}

/**
 * Create debris body for cut-off portion. Falls with gravity, removed when off-screen.
 */
export function createDebris(
  centerX: number,
  centerY: number,
  width: number,
  height: number
): Matter.Body {
  const debris = Matter.Bodies.rectangle(centerX, centerY, width, height, {
    mass: 0.5,
    friction: 0.5,
    restitution: 0.2,
    label: 'debris',
  });
  addBody(debris);
  return debris;
}

/**
 * Restore a tower by creating stacked blocks. Used when reviving from ad.
 * screenHeight is used to position blocks above the ground.
 */
export function restoreTower(
  centerX: number,
  screenHeight: number,
  score: number
): void {
  const groundTop = screenHeight - 100;
  const blockSpacing = HEIGHT + 2;
  for (let i = 1; i <= score; i++) {
    const y = groundTop - 15 - (i - 1) * blockSpacing;
    createBlock(centerX, y, i);
  }
}
