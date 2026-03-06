/**
 * Physics Layer - Matter.js engine singleton.
 * Source of truth for object positions, mass, collisions, and gravity.
 */

import Matter from 'matter-js';
import { initCollisionHandler } from './collisionHandler';

let engine: Matter.Engine | null = null;
let world: Matter.World | null = null;

export function getEngine(): Matter.Engine {
  if (!engine) {
    engine = Matter.Engine.create();
    world = engine.world;
    initCollisionHandler();
  }
  return engine;
}

export function getWorld(): Matter.World {
  if (!world) {
    getEngine();
  }
  return world!;
}

export function addBody(body: Matter.Body): void {
  Matter.World.add(getWorld(), body);
}

export function removeBody(body: Matter.Body): void {
  Matter.World.remove(getWorld(), body);
}

export function applyForce(body: Matter.Body, force: Matter.Vector, point?: Matter.Vector): void {
  Matter.Body.applyForce(body, point ?? body.position, force);
}

export function updateEngine(deltaMs: number): void {
  Matter.Engine.update(getEngine(), deltaMs);
}

export function resetWorld(): void {
  const w = getWorld();
  const e = getEngine();
  Matter.World.clear(w, false);
  Matter.Engine.clear(e);
}

export function getAllBodies(): Matter.Body[] {
  return Matter.Composite.allBodies(getWorld());
}

/**
 * Applies a lateral (horizontal) force to all blocks to trigger tower collapse.
 * Direction is random (left or right).
 */
export function applyLateralForceToTower(): void {
  const bodies = getAllBodies().filter((b) => b.label === 'block');
  const direction = Math.random() > 0.5 ? 1 : -1;
  const forceMagnitude = 0.15;
  const force: Matter.Vector = { x: direction * forceMagnitude, y: 0 };

  bodies.forEach((body) => {
    Matter.Body.applyForce(body, body.position, force);
  });
}
