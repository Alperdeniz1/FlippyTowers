/**
 * Collision handler - block lands as whole piece, tower balance affects stability.
 * No cut-off: block stays intact. Off-center placement shifts tower balance;
 * physics handles natural toppling when tower becomes too unbalanced.
 */

import Matter from 'matter-js';
import { getEngine, getAllBodies } from './engine';
import { useGameStore } from '../store/gameStore';
import { getNextPuzzle } from '../data/puzzleLoader';

const TIP_ANGLE_THRESHOLD = 0.9; // ~52 degrees - tower has fallen

let isInitialized = false;

export function initCollisionHandler(): void {
  if (isInitialized) return;
  isInitialized = true;

  const engine = getEngine();

  Matter.Events.on(engine, 'collisionStart', (event) => {
    const pairs = event.pairs;
    const lastDroppedId = useGameStore.getState().lastDroppedBlockId;
    if (lastDroppedId === null) return;

    for (const pair of pairs) {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      if (bodyA.id !== lastDroppedId && bodyB.id !== lastDroppedId) continue;

      const other = bodyA.id === lastDroppedId ? bodyB : bodyA;

      // Block landed on ground or another block - keep as whole piece, advance game
      if (other.label === 'ground' || other.label === 'block') {
        useGameStore.getState().setLastDroppedBlockId(null);
        useGameStore.getState().setIsPieceFalling(false);
        if (useGameStore.getState().gameMode === 'trivia') {
          useGameStore.getState().setCurrentPuzzle(getNextPuzzle());
        }
        return;
      }
    }
  });
}

/**
 * Check if tower has tipped over (any block rotated too much). Call each frame.
 * Triggers COLLAPSED when tower becomes unbalanced and falls.
 */
export function checkTowerStability(): void {
  const status = useGameStore.getState().status;
  if (status !== 'PLAYING') return;

  const bodies = getAllBodies().filter((b) => b.label === 'block');
  for (const body of bodies) {
    const absAngle = Math.abs(body.angle);
    if (absAngle > TIP_ANGLE_THRESHOLD) {
      useGameStore.getState().incrementCollapseCount();
      useGameStore.getState().setStatus('COLLAPSED');
      return;
    }
  }
}
