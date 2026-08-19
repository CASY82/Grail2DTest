import type { AssetProvider, RenderFrame, RendererPort } from '../application/ports/Ports.js';
import { centerOf } from '../domain/Geometry.js';
import { metersToPixels } from '../domain/Scale.js';

export class CanvasRenderer implements RendererPort {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly logicalW = 1280;
  private readonly logicalH = 720;

  constructor(private readonly canvas: HTMLCanvasElement, private readonly assets: AssetProvider) {
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas 2D unsupported'); this.ctx = ctx;
    window.addEventListener('resize', () => this.resize()); this.resize();
  }

  resize(): void { this.canvas.width = this.logicalW; this.canvas.height = this.logicalH; }

  render(frame: RenderFrame): void {
    const c = this.ctx; c.clearRect(0,0,this.logicalW,this.logicalH);
    this.drawBackground(frame);
    this.drawRain(frame);
    this.drawWorld(frame);
    this.drawHollow(frame);
    this.drawPursuer(frame);
    this.drawPlayer(frame);
    this.drawDarkness(frame);
    this.drawHud(frame);
  }

  private drawBackground(frame: RenderFrame): void {
    const c = this.ctx; const image = this.assets.getImage(frame.area.backgroundAssetId);
    if (image) c.drawImage(image,0,0,this.logicalW,this.logicalH);
    else {
      const g=c.createLinearGradient(0,0,0,this.logicalH); g.addColorStop(0,'#111918'); g.addColorStop(1,'#090d0c'); c.fillStyle=g; c.fillRect(0,0,this.logicalW,this.logicalH);
    }
  }

  private drawWorld(frame: RenderFrame): void {
    const c=this.ctx;
    // Concept art carries the scenery. Prototype fallback rectangles are debug-only.
    if(frame.debug) for (const d of frame.area.decorations) {
      c.save(); c.globalAlpha=d.alpha ?? .7; c.strokeStyle=d.fallback; c.setLineDash([4,5]); c.strokeRect(d.rect.x,d.rect.y,d.rect.w,d.rect.h); c.restore();
    }
    for (const p of frame.area.portals) {
      const blocked=frame.blockedPortalIds.includes(p.id); const center=centerOf(p.rect);
      c.save();
      const color=blocked?'rgba(238,137,123,.94)':'rgba(144,235,208,.94)';
      c.strokeStyle=color; c.fillStyle=color; c.lineWidth=2; c.textAlign='center'; c.font='600 15px system-ui';
      // Small floor chevrons communicate direction without covering the artwork.
      c.beginPath(); c.moveTo(center.x-18,center.y-6); c.lineTo(center.x,center.y+7); c.lineTo(center.x+18,center.y-6); c.stroke();
      c.globalAlpha=.48; c.beginPath(); c.moveTo(center.x-13,center.y-16); c.lineTo(center.x,center.y-7); c.lineTo(center.x+13,center.y-16); c.stroke(); c.globalAlpha=1;
      c.fillText(`${blocked?'🔒':'➜'} ${p.label}`,center.x,Math.max(28,p.rect.y-10)); c.textAlign='left';
      if(frame.debug){ c.globalAlpha=.55; c.setLineDash([7,5]); c.strokeRect(p.rect.x,p.rect.y,p.rect.w,p.rect.h); }
      c.restore();
    }
    for (const i of frame.area.interactions) {
      if(!frame.visibleInteractionIds.includes(i.id)) continue;
      c.save(); c.strokeStyle='rgba(229,205,144,.82)'; c.lineWidth=2;
      const {x,y,w,h}=i.rect; const arm=Math.min(14,w/4,h/4);
      for(const [sx,sy,dx,dy] of [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]] as const){
        c.beginPath(); c.moveTo(sx+dx*arm,sy); c.lineTo(sx,sy); c.lineTo(sx,sy+dy*arm); c.stroke();
      }
      if(frame.debug){ c.globalAlpha=.45; c.setLineDash([3,5]); c.strokeRect(x,y,w,h); }
      c.restore();
    }
    if (frame.debug) { c.strokeStyle='rgba(255,80,80,.7)'; for (const w of frame.area.walls) c.strokeRect(w.x,w.y,w.w,w.h); }
  }

  private drawPlayer(frame: RenderFrame): void {
    const c=this.ctx; const p=frame.player; const image=this.assets.getImage('character.lucas');
    if (image) c.drawImage(image,p.position.x-22,p.position.y-30,44,60);
    else { c.fillStyle='#c7c0ad'; c.beginPath(); c.arc(p.position.x,p.position.y-7,12,0,Math.PI*2); c.fill(); c.fillRect(p.position.x-10,p.position.y+4,20,22); }
    if (frame.debug && p.noiseRadiusMeters>0) { const radius=metersToPixels(p.noiseRadiusMeters); c.strokeStyle='rgba(120,200,180,.45)'; c.beginPath(); c.arc(p.position.x,p.position.y,radius,0,Math.PI*2); c.stroke(); }
  }

  private drawHollow(frame: RenderFrame): void {
    if (!frame.hollow.active) return;
    const c=this.ctx; const h=frame.hollow; const image=this.assets.getImage(h.assetId);
    if (image) c.drawImage(image,h.position.x-23,h.position.y-34,46,68);
    else { c.fillStyle='#999b93'; c.fillRect(h.position.x-13,h.position.y-25,26,50); c.fillStyle='#0a0a0a'; c.fillRect(h.position.x-7,h.position.y-18,4,5); c.fillRect(h.position.x+3,h.position.y-18,4,5); }
  }

  private drawPursuer(frame: RenderFrame): void {
    if (!frame.pursuer.active) return;
    const c=this.ctx; const p=frame.pursuer; const image=this.assets.getImage(p.assetId);
    if (image) c.drawImage(image,p.position.x-p.size.w/2-3,p.position.y-p.size.h/2-8,p.size.w+6,p.size.h+14);
    else { c.fillStyle='#5c2020'; c.fillRect(p.position.x-p.size.w/2,p.position.y-p.size.h/2,p.size.w,p.size.h); c.fillStyle='#160404'; c.fillRect(p.position.x-6,p.position.y-p.size.h/2+8,4,5); c.fillRect(p.position.x+2,p.position.y-p.size.h/2+8,4,5); }
  }

  private drawDarkness(frame: RenderFrame): void {
    const c=this.ctx; const p=frame.player;
    c.save();
    const radius=p.lanternOn ? 245 : 105;
    const outerAlpha=frame.area.id==='bridge' ? .48 : .82;
    const g=c.createRadialGradient(p.position.x,p.position.y,24,p.position.x,p.position.y,radius);
    g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(.52,'rgba(0,0,0,.08)'); g.addColorStop(1,`rgba(1,4,5,${outerAlpha})`);
    c.fillStyle=g; c.fillRect(0,0,this.logicalW,this.logicalH);
    c.fillStyle=`rgba(1,4,5,${outerAlpha*.42})`;
    c.fillRect(0,0,this.logicalW,Math.max(0,p.position.y-radius));
    c.fillRect(0,Math.min(this.logicalH,p.position.y+radius),this.logicalW,this.logicalH);
    c.restore();
    if (p.lanternOn) { c.save(); c.globalCompositeOperation='screen'; const glow=c.createRadialGradient(p.position.x,p.position.y,5,p.position.x,p.position.y,170); glow.addColorStop(0,'rgba(190,145,77,.12)'); glow.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=glow; c.fillRect(p.position.x-170,p.position.y-170,340,340); c.restore(); }
  }

  private drawHud(frame: RenderFrame): void {
    const c=this.ctx; c.save();
    c.fillStyle='rgba(5,8,8,.72)'; c.fillRect(22,20,560,108); c.strokeStyle='rgba(130,160,150,.28)'; c.strokeRect(22,20,560,108);
    c.fillStyle='#e4e7e4'; c.font='600 17px system-ui'; c.fillText(frame.area.title,40,48); c.fillStyle='#879691'; c.font='13px system-ui'; c.fillText(frame.area.subtitle,40,70);
    c.fillStyle='#cdd4d0'; c.font='14px system-ui'; this.wrapText(`목표: ${frame.objective}`,40,96,520,19);
    c.fillStyle='rgba(5,8,8,.72)'; c.fillRect(22,640,1236,55); c.fillStyle='#aab4b0'; c.font='13px system-ui';
    c.fillText('WASD 이동 · Shift 달리기(토글) · Ctrl 앉기 · E 조사 · F 등잔 · ` 디버그',40,664);
    c.fillStyle=frame.noiseRadiusMeters>=14?'#e6a18f':'#86b9ad'; c.fillText(`소음 ${frame.noiseRadiusMeters}m`,40,686); c.fillStyle='#9aa6a2'; c.fillText(frame.inventoryText,160,686);
    if (frame.prompt) { const w=Math.min(640,c.measureText(frame.prompt).width+46); c.fillStyle='rgba(0,0,0,.78)'; c.fillRect(640-w/2,565,w,42); c.fillStyle='#e8ece9'; c.textAlign='center'; c.fillText(`[E] ${frame.prompt}`,640,591); c.textAlign='left'; }
    c.restore();
  }

  private drawRain(frame: RenderFrame): void {
    if (!['rain','logging','chase'].includes(frame.area.ambience)) return;
    const c=this.ctx; const t=performance.now()/22; c.save(); c.strokeStyle='rgba(180,200,198,.11)'; c.lineWidth=1;
    for (let i=0;i<65;i++) { const x=(i*197+t*3)%1320-20; const y=(i*89+t*7)%760-20; c.beginPath(); c.moveTo(x,y); c.lineTo(x-7,y+18); c.stroke(); } c.restore();
  }

  private wrapText(text:string,x:number,y:number,maxWidth:number,lineHeight:number):void {
    const words=text.split(' '); let line=''; let yy=y;
    for (const word of words) { const test=line+word+' '; if (this.ctx.measureText(test).width>maxWidth && line) { this.ctx.fillText(line,x,yy); line=word+' '; yy+=lineHeight; } else line=test; }
    this.ctx.fillText(line,x,yy);
  }
}
