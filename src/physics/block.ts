/**
 * Factory for block bodies. Each successive block becomes slightly narrower.
 * Formula: Math.max(MIN_WIDTH, BASE_WIDTH - score * NARROWING_FACTOR)
 */

import Matter from 'matter-js';
import { addBody } from './engine';

const BASE_WIDTH = 120;
const MIN_WIDTH = 40;
const HEIGHT = 30;
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
