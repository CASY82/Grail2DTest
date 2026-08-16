export class Pursuer {
    active = false; // true while actively chasing the player toward catch distance
    position = { x: 0, y: 0 };
    speed = 150;
    assetId = 'enemy.hollow';
    size = { w: 30, h: 54 };
}
