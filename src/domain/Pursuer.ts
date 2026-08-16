import type { Vec2 } from './Geometry.js';

export class Pursuer {
  active = false; // true while actively chasing the player toward catch distance
  position: Vec2 = { x: 0, y: 0 };
  speed = 150;
  assetId = 'enemy.hollow';
  readonly size = { w: 30, h: 54 };
}
