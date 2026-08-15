import type { AreaId, Chapter1Snapshot } from '../domain/Chapter1.js';
import { Chapter1Progress } from '../domain/Chapter1.js';
import type { Player } from '../domain/Player.js';
import type { SaveRepository } from './ports/Ports.js';

export class SaveGameService {
  constructor(private readonly repo: SaveRepository) {}

  save(areaId: AreaId, player: Player, progress: Chapter1Progress): void {
    this.repo.save({
      areaId, playerX: player.position.x, playerY: player.position.y,
      flags: [...progress.flags], items: [...progress.items], lanternOn: player.lanternOn
    });
  }

  load(): Chapter1Snapshot | null { return this.repo.load(); }
  clear(): void { this.repo.clear(); }
}
