import { rectsOverlap } from '../domain/Geometry.js';
/** GR-2/GR-3 only — steers a single Pursuer straight toward the player each frame, blocked by
 *  the same wall rects the player collides with. Returns true the instant it catches the player. */
export class PursuitService {
    update(pursuer, player, area, dt) {
        if (!pursuer.active)
            return false;
        const dx = player.position.x - pursuer.position.x, dy = player.position.y - pursuer.position.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.001) {
            const step = Math.min(dist, pursuer.speed * dt);
            this.moveAxis(pursuer, area, { x: pursuer.position.x + (dx / dist) * step, y: pursuer.position.y }, 'x');
            this.moveAxis(pursuer, area, { x: pursuer.position.x, y: pursuer.position.y + (dy / dist) * step }, 'y');
        }
        return rectsOverlap(player.bounds(), this.bounds(pursuer));
    }
    moveAxis(pursuer, area, next, axis) {
        if (area.walls.some(w => rectsOverlap(this.bounds(pursuer, next), w)))
            return;
        pursuer.position[axis] = next[axis];
    }
    bounds(pursuer, at = pursuer.position) {
        return { x: at.x - pursuer.size.w / 2, y: at.y - pursuer.size.h / 2, w: pursuer.size.w, h: pursuer.size.h };
    }
}
