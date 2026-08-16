import { clamp, rectsOverlap } from '../domain/Geometry.js';
export class MovementService {
    static SPEED = { crouch: 88, walk: 146, run: 238 };
    static NOISE_METERS = { idle: 0, crouch: 2, walk: 5, run: 14 };
    update(player, area, input, dt) {
        let dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
        let dy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
        const len = Math.hypot(dx, dy);
        if (len > 0) {
            dx /= len;
            dy /= len;
            player.facing = { x: dx, y: dy };
        }
        player.moving = len > 0;
        player.running = player.moving && input.run && !input.crouch;
        player.crouching = player.moving && input.crouch;
        const speed = player.crouching ? MovementService.SPEED.crouch : player.running ? MovementService.SPEED.run : MovementService.SPEED.walk;
        player.noiseRadiusMeters = !player.moving ? MovementService.NOISE_METERS.idle : player.crouching ? MovementService.NOISE_METERS.crouch : player.running ? MovementService.NOISE_METERS.run : MovementService.NOISE_METERS.walk;
        const delta = { x: dx * speed * player.controlMultiplier * dt, y: dy * speed * player.controlMultiplier * dt };
        this.moveAxis(player, area, { x: player.position.x + delta.x, y: player.position.y }, 'x');
        this.moveAxis(player, area, { x: player.position.x, y: player.position.y + delta.y }, 'y');
        player.position.x = clamp(player.position.x, 18, 1262);
        player.position.y = clamp(player.position.y, 18, 702);
    }
    moveAxis(player, area, next, axis) {
        const bounds = player.bounds(next);
        if (area.walls.some(w => rectsOverlap(bounds, w)))
            return;
        player.position[axis] = next[axis];
    }
}
