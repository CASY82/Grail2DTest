export class LocalStorageSaveRepository {
    key = 'grail.ch1.save.v1';
    save(snapshot) { localStorage.setItem(this.key, JSON.stringify(snapshot)); }
    load() {
        try {
            const raw = localStorage.getItem(this.key);
            return raw ? JSON.parse(raw) : null;
        }
        catch {
            return null;
        }
    }
    clear() { localStorage.removeItem(this.key); }
}
