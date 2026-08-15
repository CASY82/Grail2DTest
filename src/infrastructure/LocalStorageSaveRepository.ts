import type { Chapter1Snapshot } from '../domain/Chapter1.js';
import type { SaveRepository } from '../application/ports/Ports.js';

export class LocalStorageSaveRepository implements SaveRepository {
  private readonly key = 'grail.ch1.save.v1';
  save(snapshot: Chapter1Snapshot): void { localStorage.setItem(this.key, JSON.stringify(snapshot)); }
  load(): Chapter1Snapshot | null {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) as Chapter1Snapshot : null;
    } catch { return null; }
  }
  clear(): void { localStorage.removeItem(this.key); }
}
