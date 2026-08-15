import { distance } from '../domain/Geometry.js';
import type { Hollow } from '../domain/Hollow.js';
import type { Player } from '../domain/Player.js';

export class ChaseService {
  update(hollow: Hollow, player: Player, dt: number): boolean {
    if (!hollow.active) return false;
    const dx = player.position.x - hollow.position.x;
    const dy = player.position.y - hollow.position.y;
    const d = Math.max(1, Math.hypot(dx, dy));
    const pressure = player.noiseRadiusMeters >= 14 ? 1.08 : 1;
    hollow.position.x += (dx / d) * hollow.speed * pressure * dt;
    hollow.position.y += (dy / d) * hollow.speed * pressure * dt;
    return distance(hollow.position, player.position) < hollow.catchDistance;
  }
}
