import { Chapter1Progress, type AreaId, type Chapter1Snapshot, type ItemId } from '../domain/Chapter1.js';
import { centerOf, distance, rectsOverlap } from '../domain/Geometry.js';
import { Hollow } from '../domain/Hollow.js';
import { Player } from '../domain/Player.js';
import type { InteractionDefinition, PortalDefinition, WorldDefinition } from '../domain/World.js';
import { Chapter1FlowService } from '../application/Chapter1FlowService.js';
import { ChaseService } from '../application/ChaseService.js';
import { MovementService } from '../application/MovementService.js';
import { SaveGameService } from '../application/SaveGameService.js';
import type { AssetProvider, AudioPort, InputPort, ModalPort, RendererPort } from '../application/ports/Ports.js';

export class GameController {
  private readonly progress=new Chapter1Progress();
  private readonly player=new Player({x:180,y:520});
  private readonly hollow=new Hollow();
  private readonly flow=new Chapter1FlowService(this.progress);
  private readonly movement=new MovementService();
  private readonly chase=new ChaseService();
  private readonly saves:SaveGameService;
  private areaId:AreaId='bridge';
  private previousTime=performance.now();
  private busy=false;
  private portalCooldown=0;
  private debug=false;

  constructor(
    private readonly world:WorldDefinition, private readonly input:InputPort, private readonly renderer:RendererPort,
    private readonly assets:AssetProvider, private readonly audio:AudioPort, private readonly modal:ModalPort,
    saveService:SaveGameService
  ){ this.saves=saveService; }

  async start():Promise<void>{
    await this.assets.load();
    const snapshot=this.saves.load(); if(snapshot) this.restore(snapshot);
    this.enterArea(this.areaId,{x:this.player.position.x,y:this.player.position.y},false);
    await this.modal.showMessage('GRAIL · CHAPTER 1', '2D HTML5 프로토타입. 공격 수단은 없다. 조사하고, 소리를 관리하고, 필요하면 도망쳐라.', 'Enter/E · 시작'); this.input.clearPressed();
    requestAnimationFrame(t=>this.loop(t));
  }

  private loop(now:number):void{
    const dt=Math.min(.033,(now-this.previousTime)/1000); this.previousTime=now;
    if(!this.modal.isOpen() && !this.busy) this.update(dt);
    this.render(); requestAnimationFrame(t=>this.loop(t));
  }

  private update(dt:number):void{
    this.portalCooldown=Math.max(0,this.portalCooldown-dt);
    const state=this.input.poll();
    if(state.escapePressed) void this.pauseInfo();
    if(state.debugPressed) this.debug=!this.debug;
    if(state.lanternPressed) this.player.lanternOn=!this.player.lanternOn;
    this.movement.update(this.player,this.currentArea(),state,dt);
    this.handlePortal();
    if(state.interactPressed) void this.handleInteraction();
    if(this.areaId==='chaseRoad'){
      this.hollow.active=true;
      if(this.chase.update(this.hollow,this.player,dt)) void this.onCaught();
    }
  }

  private render():void{
    const interaction=this.nearestInteraction(); const portal=this.nearestPortal();
    const prompt=interaction?.label ?? portal?.label;
    this.renderer.render({
      area:this.currentArea(), player:this.player, hollow:this.hollow, objective:this.progress.objective(),
      ...(prompt ? {prompt} : {}), noiseRadiusMeters:this.player.noiseRadiusMeters, inventoryText:this.inventoryText(), debug:this.debug
    });
  }

  private currentArea(){ return this.world.areas[this.areaId]; }

  private handlePortal():void{
    if(this.portalCooldown>0) return;
    const portal=this.currentArea().portals.find(p=>rectsOverlap(this.player.bounds(),p.rect)); if(!portal) return;
    if(portal.requireFlag && !this.progress.has(portal.requireFlag)){
      this.portalCooldown=1.1; this.busy=true;
      void this.modal.showMessage(portal.label,portal.denyMessage ?? '아직 갈 수 없다.').finally(()=>{this.busy=false;}); return;
    }
    this.enterArea(portal.target,portal.spawn,true); this.portalCooldown=.8;
  }

  private nearestPortal():PortalDefinition|undefined{
    return this.currentArea().portals.filter(p=>distance(this.player.position,centerOf(p.rect))<95).sort((a,b)=>distance(this.player.position,centerOf(a.rect))-distance(this.player.position,centerOf(b.rect)))[0];
  }

  private nearestInteraction():InteractionDefinition|undefined{
    return this.currentArea().interactions.filter(i=>this.interactionVisible(i) && distance(this.player.position,centerOf(i.rect))<105).sort((a,b)=>distance(this.player.position,centerOf(a.rect))-distance(this.player.position,centerOf(b.rect)))[0];
  }

  private interactionVisible(i:InteractionDefinition):boolean{
    if(i.visibleWhen && !this.progress.has(i.visibleWhen)) return false;
    if(i.hiddenWhen && this.progress.has(i.hiddenWhen)) return false;
    const itemByAction:Partial<Record<string,ItemId>>={ 'woodcut.triangle':'woodcutTriangle','woodcut.circle':'woodcutCircle','woodcut.cross':'woodcutCross' };
    const item=itemByAction[i.action]; if(item && this.progress.owns(item)) return false;
    return true;
  }

  private async handleInteraction():Promise<void>{
    const interaction=this.nearestInteraction(); if(!interaction) return; this.busy=true;
    try{
      const result=this.flow.interact(interaction.action); await this.modal.showMessage(result.title,result.body); this.input.clearPressed();
      if(result.openPuzzle){
        const solved=await this.modal.showShadowPuzzle();
        if(solved){ this.flow.solvePuzzle(); this.audio.pulse('success'); await this.modal.showMessage('봉인 완성','세 그림자가 하나로 겹치자 서랍이 열린다. 녹슨 관문 열쇠, 경고 쪽지, △ 진실 조각을 획득했다.'); this.input.clearPressed(); this.saves.save(this.areaId,this.player,this.progress); }
      }
      if(result.startChase){ this.enterArea('chaseRoad',{x:100,y:360},false); this.hollow.position={x:45,y:360}; this.hollow.active=true; this.audio.pulse('hollow'); this.saves.save(this.areaId,this.player,this.progress); }
      if(result.complete){
        this.progress.set('chapterComplete'); this.hollow.active=false; this.enterArea('ending',{x:640,y:360},false); this.saves.save(this.areaId,this.player,this.progress); await this.modal.showEnding(); this.input.clearPressed();
      } else if(result.autosave) this.saves.save(this.areaId,this.player,this.progress);
    }finally{this.busy=false;}
  }

  private async onCaught():Promise<void>{
    if(this.busy) return; this.busy=true; this.hollow.active=false; this.audio.pulse('error');
    await this.modal.showMessage('붙잡혔다','차가운 손이 어깨를 움켜쥔다. 추격 구간 시작점에서 다시 시도한다.'); this.input.clearPressed();
    this.player.position={x:100,y:360}; this.hollow.position={x:45,y:360}; this.hollow.active=true; this.busy=false;
  }

  private enterArea(target:AreaId,spawn:{x:number;y:number},autosave:boolean):void{
    this.areaId=target; this.player.position={...spawn}; this.audio.setAmbience(this.currentArea().ambience);
    if(target!=='chaseRoad') this.hollow.active=false;
    if(autosave && ['cabinB1','cabinB2','attic'].includes(target)) this.saves.save(this.areaId,this.player,this.progress);
  }

  private restore(snapshot:Chapter1Snapshot):void{
    this.areaId=snapshot.areaId; this.player.position={x:snapshot.playerX,y:snapshot.playerY}; this.player.lanternOn=snapshot.lanternOn;
    snapshot.flags.forEach(f=>this.progress.set(f)); snapshot.items.forEach(i=>this.progress.addItem(i));
    if(this.areaId==='chaseRoad'){this.hollow.active=true;this.hollow.position={x:45,y:360};}
  }

  private inventoryText():string{
    const icons:string[]=[];
    if(this.progress.owns('woodcutTriangle'))icons.push('△'); if(this.progress.owns('woodcutCircle'))icons.push('○'); if(this.progress.owns('woodcutCross'))icons.push('✠');
    if(this.progress.owns('rustedGateKey'))icons.push('녹슨 열쇠'); if(this.progress.owns('truthTriangle'))icons.push('△ 진실 조각');
    return `소지품: ${icons.length?icons.join(' · '):'없음'}`;
  }

  private async pauseInfo():Promise<void>{
    if(this.busy)return; this.busy=true;
    await this.modal.showMessage('PAUSE',`현재 목표: ${this.progress.objective()}\n저장은 봉헌 촛대 및 핵심 진행 시 자동으로 수행된다.`,'Enter/Escape · 계속'); this.input.clearPressed(); this.busy=false;
  }
}
