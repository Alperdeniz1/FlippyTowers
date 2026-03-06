/**
 * Collision handler - overlap resolution when blocks land.
 * Block vs ground: keep block (first block).
 * Block vs block: compute overlap, replace with overlap block, create debris for cut-off parts.
 */

import Matter from 'matter-js';
import { getEngine, getWorld, removeBody, applyLateralForceToTower } from './engine';
import {
  createBlockFromOverlap,
  createDebris,
  HEIGHT,
  MIN_WIDTH,
} from './block';
import { useGameStore } from '../store/gameStore';
import { getNextPuzzle } from '../data/puzzleLoader';

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

      // Only care about collisions involving our dropped block
      if (bodyA.id !== lastDroppedId && bodyB.id !== lastDroppedId) continue;

      const fallingBlock = bodyA.id === lastDroppedId ? bodyA : bodyB;
      const other = bodyA.id === lastDroppedId ? bodyB : bodyA;

      // Block vs ground - first block, keep as-is
      if (other.label === 'ground') {
        useGameStore.getState().setLastDroppedBlockId(null);
        useGameStore.getState().setIsPieceFalling(false);
        useGameStore.getState().setCurrentPuzzle(getNextPuzzle());
        return;
      }

      // Block vs block - compute overlap
      if (other.label === 'block') {
        const fallingLeft = fallingBlock.bounds.min.x;
        const fallingRight = fallingBlock.bounds.max.x;
        const towerLeft = other.bounds.min.x;
        const towerRight = other.bounds.max.x;

        const overlapLeft = Math.max(fallingLeft, towerLeft);
        const overlapRight = Math.min(fallingRight, towerRight);
        const overlapWidth = overlapRight - overlapLeft;

        useGameStore.getState().setLastDroppedBlockId(null);

        if (overlapWidth < MIN_WIDTH) {
          // Complete miss - wobble, remove block
          removeBody(fallingBlock);
          useGameStore.getState().decrementScore();
          useGameStore.getState().incrementWobbleCount();
          const wobbleCount = useGameStore.getState().wobbleCount;
          if (wobbleCount >= 3) {
            applyLateralForceToTower();
            useGameStore.getState().incrementCollapseCount();
            useGameStore.getState().setStatus('COLLAPSED');
          } else {
            useGameStore.getState().setIsPieceFalling(false);
            useGameStore.getState().setCurrentPuzzle(getNextPuzzle());
          }
          return;
        }

        // Partial or full overlap - replace block, create debris
        const overlapCenterX = (overlapLeft + overlapRight) / 2;
        const towerTopY = other.bounds.min.y;
        const newBlockY = towerTopY - HEIGHT / 2;

        removeBody(fallingBlock);

        createBlockFromOverlap(overlapCenterX, newBlockY, overlapWidth);

        // Create debris for left cut-off
        if (fallingLeft < overlapLeft) {
          const debrisWidth = overlapLeft - fallingLeft;
          const debrisCenterX = (fallingLeft + overlapLeft) / 2;
          createDebris(
            debrisCenterX,
            fallingBlock.position.y,
            debrisWidth,
            HEIGHT
          );
        }

        // Create debris for right cut-off
        if (fallingRight > overlapRight) {
          const debrisWidth = fallingRight - overlapRight;
          const debrisCenterX = (overlapRight + fallingRight) / 2;
          createDebris(
            debrisCenterX,
            fallingBlock.position.y,
            debrisWidth,
            HEIGHT
          );
        }

        useGameStore.getState().setIsPieceFalling(false);
        useGameStore.getState().setCurrentPuzzle(getNextPuzzle());
        return;
      }
    }
  });
}

/**
 * Remove debris bodies that have fallen off-screen. Call each frame.
 */
export function cleanupDebris(): void {
  const dims = useGameStore.getState().physicsDimensions;
  if (!dims) return;

  const world = getWorld();
  const bodies = Matter.Composite.allBodies(world);
  const offScreenY = dims.height + 100;

  for (const body of bodies) {
    if (body.label === 'debris' && body.position.y > offScreenY) {
      Matter.World.remove(world, body);
    }
  }
}
