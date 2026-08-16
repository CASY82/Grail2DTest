import type { AreaId, Chapter1Snapshot } from '../domain/Chapter1.js';
import type { ItemId, ProgressFlag } from '../domain/Chapter1.js';
import type { Player } from '../domain/Player.js';
import type { SaveRepository } from './ports/Ports.js';

export class SaveGameService {
  constructor(private readonly repo: SaveRepository) {}

  save(areaId: AreaId, player: Player, progress:{flags:Set<ProgressFlag>;items:Set<ItemId>}, chapterId:1|2|3=1): void {
    this.repo.save({
      chapterId, areaId, playerX: player.position.x, playerY: player.position.y,
      flags: [...progress.flags], items: [...progress.items], lanternOn: player.lanternOn
    });
  }

  load(): Chapter1Snapshot | null { return this.repo.load(); }
  clear(): void { this.repo.clear(); }
}
