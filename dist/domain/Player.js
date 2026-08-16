export class Player {
    position;
    size = { w: 28, h: 36 };
    facing = { x: 0, y: 1 };
    lanternOn = true;
    moving = false;
    running = false;
    crouching = false;
    noiseRadiusMeters = 0;
    controlMultiplier = 1;
    constructor(position) { this.position = { ...position }; }
    bounds(at = this.position) {
        return { x: at.x - this.size.w / 2, y: at.y - this.size.h / 2, w: this.size.w, h: this.size.h };
    }
}
