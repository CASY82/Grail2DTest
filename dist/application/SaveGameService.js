export class SaveGameService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    save(areaId, player, progress) {
        this.repo.save({
            areaId, playerX: player.position.x, playerY: player.position.y,
            flags: [...progress.flags], items: [...progress.items], lanternOn: player.lanternOn
        });
    }
    load() { return this.repo.load(); }
    clear() { this.repo.clear(); }
}
