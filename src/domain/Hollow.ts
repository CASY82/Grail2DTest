import type { Vec2 } from './Geometry.js';

export class Hollow {
  active = false;
  position: Vec2 = { x: 80, y: 360 };
  speed = 174; // visualized approximation of LDD 3.8m/s
  catchDistance = 26;
}
