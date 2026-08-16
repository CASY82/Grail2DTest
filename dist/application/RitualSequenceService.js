export class RitualSequenceService {
    elapsed = 0;
    update(player, dt, active) {
        if (!active) {
            player.controlMultiplier = 1;
            return;
        }
        this.elapsed += dt;
        player.controlMultiplier = Math.max(0.12, 1 - this.elapsed / 12);
    }
    get agencyLocked() { return this.elapsed >= 4; }
}
