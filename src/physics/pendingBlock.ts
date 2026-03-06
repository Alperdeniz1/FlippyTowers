/**
 * Pending block - horizontal bounce animation before drop.
 * The piece moves left-to-right and reverses at screen edges.
 * Not a Matter.js body until dropped.
 */

const BASE_SPEED = 100; // px/s
const SPEED_PER_SCORE = 5; // Increase difficulty with score
const EDGE_PADDING = 20;

let pendingX = 0;
let pendingVelocity = BASE_SPEED;

/**
 * Initialize pending block position (e.g. at screen center).
 */
export function initPendingBlock(centerX: number): void {
  pendingX = centerX;
  pendingVelocity = BASE_SPEED;
}

/**
 * Update pending block position for bounce. Call each frame.
 * Returns the new X position (center of block).
 */
export function updatePendingBlock(
  deltaMs: number,
  screenWidth: number,
  blockWidth: number,
  score: number
): number {
  const speed = BASE_SPEED + score * SPEED_PER_SCORE;
  const minX = EDGE_PADDING + blockWidth / 2;
  const maxX = screenWidth - EDGE_PADDING - blockWidth / 2;

  const velocity = pendingVelocity > 0 ? speed : -speed;
  pendingX += velocity * (deltaMs / 1000);

  if (pendingX >= maxX) {
    pendingX = maxX;
    pendingVelocity = -1;
  } else if (pendingX <= minX) {
    pendingX = minX;
    pendingVelocity = 1;
  }

  return pendingX;
}

/**
 * Get current pending X (e.g. when user drops).
 */
export function getPendingBlockX(): number {
  return pendingX;
}
