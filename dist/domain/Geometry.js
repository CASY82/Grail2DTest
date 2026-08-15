export const rectsOverlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
export const centerOf = (r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
