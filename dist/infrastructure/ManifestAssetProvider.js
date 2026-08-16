export class ManifestAssetProvider {
    manifestUrl;
    images = new Map();
    refreshToken = Date.now().toString(36);
    constructor(manifestUrl = './public/assets/manifest.json') {
        this.manifestUrl = manifestUrl;
    }
    async load() {
        try {
            const manifest = await (await fetch(this.withRefreshToken(this.manifestUrl), { cache: 'no-store' })).json();
            await Promise.all(Object.entries(manifest.images).map(([id, path]) => this.loadImage(id, path)));
        }
        catch (error) {
            console.warn('[AssetProvider] Manifest load failed; fallback rendering remains available.', error);
        }
    }
    getImage(id) { return this.images.get(id); }
    async loadImage(id, path) {
        await new Promise((resolve) => {
            const image = new Image();
            image.onload = () => { this.images.set(id, image); resolve(); };
            image.onerror = () => { console.warn(`[AssetProvider] Missing asset: ${id} -> ${path}`); resolve(); };
            image.src = this.withRefreshToken(path);
        });
    }
    withRefreshToken(path) {
        return `${path}${path.includes('?') ? '&' : '?'}refresh=${this.refreshToken}`;
    }
}
