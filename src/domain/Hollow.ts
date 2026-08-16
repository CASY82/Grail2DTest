import type { Vec2 } from './Geometry.js';

export class Hollow {
  active = false; // true while a brief, non-pursuing sighting is on screen
  position: Vec2 = { x: 80, y: 360 };
  assetId = 'enemy.hollow';
  readonly size = { w: 26, h: 50 };
}
