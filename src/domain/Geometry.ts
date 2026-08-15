export interface Vec2 { x: number; y: number; }
export interface Rect { x: number; y: number; w: number; h: number; }

export const rectsOverlap = (a: Rect, b: Rect): boolean =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export const centerOf = (r: Rect): Vec2 => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
export const distance = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.y - b.y);
export const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));
