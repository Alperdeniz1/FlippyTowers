/**
 * Creates the static ground body at the bottom of the screen.
 */

import Matter from 'matter-js';
import { addBody } from './engine';

export function createGround(screenWidth: number, screenHeight: number): Matter.Body {
  const ground = Matter.Bodies.rectangle(
    screenWidth / 2,
    screenHeight - 50,
    screenWidth,
    100,
    {
      isStatic: true,
      label: 'ground',
    }
  );
  addBody(ground);
  return ground;
}
