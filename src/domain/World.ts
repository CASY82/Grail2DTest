import type { AreaId, ProgressFlag } from './Chapter1.js';
import type { Rect, Vec2 } from './Geometry.js';

export interface PortalDefinition {
  id: string;
  rect: Rect;
  target: AreaId;
  spawn: Vec2;
  label: string;
  requireFlag?: ProgressFlag;
  denyMessage?: string;
}

export interface InteractionDefinition {
  id: string;
  rect: Rect;
  label: string;
  action: string;
  visibleWhen?: ProgressFlag;
  hiddenWhen?: ProgressFlag;
  assetId?: string;
}

export interface DecorationDefinition {
  rect: Rect;
  assetId?: string;
  fallback: string;
  alpha?: number;
}

export interface AreaDefinition {
  id: AreaId;
  title: string;
  subtitle: string;
  backgroundAssetId: string;
  spawn: Vec2;
  walls: Rect[];
  portals: PortalDefinition[];
  interactions: InteractionDefinition[];
  decorations: DecorationDefinition[];
  ambience: 'rain' | 'cabin' | 'logging' | 'attic' | 'chase' | 'silence';
}

export interface WorldDefinition { areas: Record<AreaId, AreaDefinition>; }
