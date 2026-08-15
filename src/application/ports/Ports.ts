import type { AreaDefinition } from '../../domain/World.js';
import type { Chapter1Snapshot } from '../../domain/Chapter1.js';
import type { Hollow } from '../../domain/Hollow.js';
import type { Player } from '../../domain/Player.js';
import type { ShadowPuzzleAlignment, ShadowPuzzleFeedback, ShadowPuzzleInput } from '../ShadowPuzzleService.js';

export interface InputState {
  up: boolean; down: boolean; left: boolean; right: boolean;
  run: boolean; crouch: boolean;
  interactPressed: boolean; lanternPressed: boolean; escapePressed: boolean; debugPressed: boolean;
}

export interface InputPort { poll(): InputState; clearPressed(): void; }
export interface SaveRepository { save(snapshot: Chapter1Snapshot): void; load(): Chapter1Snapshot | null; clear(): void; }
export interface AssetProvider { load(): Promise<void>; getImage(id: string): HTMLImageElement | undefined; }

export interface RenderFrame {
  area: AreaDefinition;
  player: Player;
  hollow: Hollow;
  objective: string;
  prompt?: string;
  message?: string;
  noiseRadiusMeters: number;
  inventoryText: string;
  blockedPortalIds: readonly string[];
  visibleInteractionIds: readonly string[];
  debug: boolean;
}

export interface RendererPort { render(frame: RenderFrame): void; resize(): void; }
export interface AudioPort { setAmbience(kind: AreaDefinition['ambience']): void; pulse(kind: 'step' | 'error' | 'hollow' | 'success'): void; }

export interface ShadowPuzzleModalOptions {
  /** Pure live read, called on every dial/slot change to drive real-time feedback. */
  align: (input: ShadowPuzzleInput) => ShadowPuzzleAlignment;
  /** Commits a sealing attempt when the player pulls the "봉인 확인" lever. */
  attempt: (input: ShadowPuzzleInput) => ShadowPuzzleFeedback;
  /** True once the player has examined the pedestal's worn angle grooves in the world —
   *  reveals the exact-degree diegetic hint inside the dial visualization. */
  hintAvailable: boolean;
  /** The answer's mirror/candle degrees, only rendered as a "worn groove" tick when hintAvailable. */
  mirrorTarget: number;
  candleTarget: number;
  onFeedback?: (feedback: ShadowPuzzleFeedback) => void;
}

export interface ModalPort {
  showMessage(title: string, body: string, hint?: string): Promise<void>;
  showShadowPuzzle(options: ShadowPuzzleModalOptions): Promise<boolean>;
  showEnding(): Promise<void>;
  isOpen(): boolean;
}
