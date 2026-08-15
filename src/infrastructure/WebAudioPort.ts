import type { AudioPort } from '../application/ports/Ports.js';
import type { AreaDefinition } from '../domain/World.js';

export class WebAudioPort implements AudioPort {
  private ctx?: AudioContext;
  private current: AreaDefinition['ambience'] = 'silence';
  private timer?: number;

  constructor() {
    const unlock = () => { this.ensureContext(); window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
  }

  setAmbience(kind: AreaDefinition['ambience']): void {
    if (this.current === kind) return;
    this.current = kind;
    if (this.timer) window.clearInterval(this.timer);
    if (kind === 'silence') return;
    const interval = kind === 'chase' ? 650 : kind === 'attic' ? 2600 : 4100;
    this.timer = window.setInterval(() => this.ambientTick(kind), interval);
  }

  pulse(kind: 'step' | 'error' | 'hollow' | 'success'): void {
    const ctx = this.ensureContext(); if (!ctx) return;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    const now = ctx.currentTime;
    const freq = kind === 'success' ? 520 : kind === 'error' ? 105 : kind === 'hollow' ? 68 : 150;
    osc.type = kind === 'success' ? 'sine' : 'triangle'; osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(kind === 'hollow' ? 0.08 : 0.03, now + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'hollow' ? 0.8 : 0.18));
    osc.connect(gain).connect(ctx.destination); osc.start(now); osc.stop(now + 0.9);
  }

  private ambientTick(kind: AreaDefinition['ambience']): void {
    const ctx = this.ensureContext(); if (!ctx) return;
    const osc = ctx.createOscillator(); const gain = ctx.createGain(); const now = ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.value = kind === 'chase' ? 48 : kind === 'attic' ? 73 : kind === 'cabin' ? 91 : 110;
    gain.gain.setValueAtTime(0.0001, now); gain.gain.linearRampToValueAtTime(kind === 'chase' ? 0.035 : 0.012, now + .1); gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(now + 1.3);
  }

  private ensureContext(): AudioContext | undefined {
    try {
      this.ctx ??= new AudioContext();
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return this.ctx;
    } catch { return undefined; }
  }
}
