import type { AssetProvider } from '../application/ports/Ports.js';

interface AssetManifest { images: Record<string, string>; }

export class ManifestAssetProvider implements AssetProvider {
  private readonly images = new Map<string, HTMLImageElement>();
  private readonly refreshToken = Date.now().toString(36);
  constructor(private readonly manifestUrl = './public/assets/manifest.json') {}

  async load(): Promise<void> {
    try {
      const manifest = await (await fetch(this.withRefreshToken(this.manifestUrl), { cache:'no-store' })).json() as AssetManifest;
      await Promise.all(Object.entries(manifest.images).map(([id, path]) => this.loadImage(id, path)));
    } catch (error) {
      console.warn('[AssetProvider] Manifest load failed; fallback rendering remains available.', error);
    }
  }

  getImage(id: string): HTMLImageElement | undefined { return this.images.get(id); }

  private async loadImage(id: string, path: string): Promise<void> {
    await new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => { this.images.set(id, image); resolve(); };
      image.onerror = () => { console.warn(`[AssetProvider] Missing asset: ${id} -> ${path}`); resolve(); };
      image.src = this.withRefreshToken(path);
    });
  }

  private withRefreshToken(path:string):string {
    return `${path}${path.includes('?')?'&':'?'}refresh=${this.refreshToken}`;
  }
}
