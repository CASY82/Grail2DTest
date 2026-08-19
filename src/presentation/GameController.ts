import { Chapter1Progress, type AreaId, type Chapter1Snapshot, type ItemId } from '../domain/Chapter1.js';
import { centerOf, distance, rectsOverlap } from '../domain/Geometry.js';
import { Hollow } from '../domain/Hollow.js';
import { Pursuer } from '../domain/Pursuer.js';
import { Player } from '../domain/Player.js';
import type { AreaDefinition, InteractionDefinition, PortalDefinition, WorldDefinition } from '../domain/World.js';
import { Chapter1FlowService } from '../application/Chapter1FlowService.js';
import { Chapter2FlowService } from '../application/Chapter2FlowService.js';
import { Chapter3FlowService } from '../application/Chapter3FlowService.js';
import { Chapter2Progress } from '../domain/Chapter2.js';
import { Chapter3Progress } from '../domain/Chapter3.js';
import { RitualSequenceService } from '../application/RitualSequenceService.js';
import { MovementService } from '../application/MovementService.js';
import { PursuitService } from '../application/PursuitService.js';
import { ShadowPuzzleService } from '../application/ShadowPuzzleService.js';
import { SaveGameService } from '../application/SaveGameService.js';
import type { AssetProvider, AudioPort, InputPort, ModalPort, RendererPort } from '../application/ports/Ports.js';

export class GameController {
  private static readonly SIGHTING_SECONDS=2.4;
  static readonly ENDING_AREAS:readonly AreaId[]=['ending','ending2','ending3'];
  private readonly progress=new Chapter1Progress();
  private readonly progress2=new Chapter2Progress();
  private readonly progress3=new Chapter3Progress();
  private readonly player=new Player({x:180,y:520});
  private readonly hollow=new Hollow();
  private readonly pursuer=new Pursuer();
  private readonly flow=new Chapter1FlowService(this.progress);
  private readonly flow2=new Chapter2FlowService(this.progress2);
  private readonly flow3=new Chapter3FlowService(this.progress3);
  private readonly ritual=new RitualSequenceService();
  private readonly movement=new MovementService();
  private readonly pursuit=new PursuitService();
  private readonly shadowPuzzle=new ShadowPuzzleService();
  private readonly saves:SaveGameService;
  private areaId:AreaId='bridge';
  private chapterId:1|2|3=1;
  private previousTime=performance.now();
  private busy=false;
  private portalCooldown=0;
  private sightingTimer=0;
  private pursuitGrace=0;
  private pursuitArea:AreaId|null=null;
  private cabinRevisitSeen=false;
  private debug=false;

  constructor(
    private readonly worlds:Record<1|2|3,WorldDefinition>, private readonly input:InputPort, private readonly renderer:RendererPort,
    private readonly assets:AssetProvider, private readonly audio:AudioPort, private readonly modal:ModalPort,
    saveService:SaveGameService
  ){ this.saves=saveService; }

  async start():Promise<void>{
    await this.assets.load();
    const snapshot=this.saves.load(); this.beginChapter(await this.modal.showChapterSelect());
    if(snapshot && (snapshot.chapterId??1)===this.chapterId) this.restore(snapshot);
    this.enterArea(this.areaId,{x:this.player.position.x,y:this.player.position.y},false);
    if(this.chapterId===1) await this.showPrologue();
    await this.modal.showMessage(`GRAIL · CHAPTER ${this.chapterId}`, '공격 수단은 없다. 조사하고, 소리를 관리하고, 필요하면 도망쳐라.\nF로 등잔을 켤 수 있지만 등잔은 꺼진 채로 시작한다 — 빛은 안전이 아니라 표적이 될 수도 있었다.', 'Enter/E · 시작'); this.input.clearPressed();
    requestAnimationFrame(t=>this.loop(t));
  }

  private beginChapter(chapter:1|2|3):void{
    this.chapterId=chapter; this.areaId=this.chapterStartArea(chapter);
    this.player.position=this.chapterStartPosition(chapter); this.player.controlMultiplier=1;
    this.activeProgress.addItem('jadeBox');
  }

  private async showPrologue():Promise<void>{
    await this.modal.showMessage('문앞의 옥색 돌 상자','\u2018취급 주의!\nAshvale 성의 주인께 이 상자를 무사히 전달해주십시오.\n보수는 귀하가 상상도 못할 정도로 후할 것입니다.\n다른 이에게 보이지 않도록, 그 무엇과도 바꾸지 않도록 하십시오.\n— H.\u2019\n\n운송업을 하고 있는 루카스 베넷은 이 옥색 상자를 오늘 오전 문앞에서 발견했다.','Enter · 계속'); this.input.clearPressed();
    await this.modal.showMessage('20 노블','“조앤, 이 시간에 무슨일이야”\n“지금이면 집에 있을 줄 알고 왔지~ 좋은 소식을 들고 왔으니까”\n\n조앤이 내민 쪽지에는 이렇게 적혀 있었다.\n\u2018만약 성공적으로 전달한다면 20 노블을 드리도록 하겠습니다.\u2019\n\n“뭐..뭣? 20 노블?”\n장사꾼으로 지내온 25년간 이런 큰 돈을 만져본적이 있었던가 깊이 고민했다.','Enter · 계속'); this.input.clearPressed();
    await this.modal.showMessage('다음날 새벽','“뭔가 굉장한 일을 떠맡게 된것 같은데, 당신을 믿어”\n\n루카스는 옥색 돌 상자를 옷 품속에 집어 넣으며, 바깥으로 나왔다.\n하지만 Blackmere Wood를 가로지르던 짐마차는 도적들에게 습격당했고, 그의 손은 끝까지 옥색 돌 상자를 움켜쥐고 있었다.\n굵은 기둥이 부러지는 소리와 함께, 다리는 그대로 무너져 내렸다.','Enter · 계속'); this.input.clearPressed();
  }

  private loop(now:number):void{
    const dt=Math.min(.033,(now-this.previousTime)/1000); this.previousTime=now;
    if(!this.modal.isOpen() && !this.busy) this.update(dt);
    this.render(); requestAnimationFrame(t=>this.loop(t));
  }

  private update(dt:number):void{
    this.portalCooldown=Math.max(0,this.portalCooldown-dt);
    this.ritual.update(this.player,dt,this.chapterId===3&&this.progress3.has('boxOpened'));
    if(this.hollow.active){
      this.sightingTimer=Math.max(0,this.sightingTimer-dt);
      if(this.sightingTimer<=0) this.hollow.active=false;
    }
    const state=this.input.poll();
    if(state.escapePressed) void this.pauseInfo();
    if(state.debugPressed) this.debug=!this.debug;
    if(state.lanternPressed) this.player.lanternOn=!this.player.lanternOn;
    this.movement.update(this.player,this.currentArea(),state,dt);
    if(this.pursuitGrace>0){
      this.pursuitGrace=Math.max(0,this.pursuitGrace-dt);
      const cfg=this.currentArea().pursuit; if(this.pursuitGrace<=0 && cfg && (cfg.onEnter || this.pursuitArea===this.areaId)) this.activatePursuit(cfg);
    }
    if(this.pursuer.active && this.pursuit.update(this.pursuer,this.player,this.currentArea(),dt)){
      this.busy=true; void this.handleCatch(); return;
    }
    this.handlePortal();
    if(state.interactPressed) void this.handleInteraction();
  }

  private render():void{
    const area=this.currentArea();
    const interaction=this.nearestInteraction(); const portal=this.nearestPortal();
    const blockedPortalIds=area.portals.filter(p=>p.requireFlag && !this.activeProgress.has(p.requireFlag)).map(p=>p.id);
    const prompt=interaction?.label ?? (portal ? `${blockedPortalIds.includes(portal.id)?'잠김 · ':''}${portal.label}` : undefined);
    const visibleInteractionIds=area.interactions.filter(i=>this.interactionVisible(i)).map(i=>i.id);
    this.renderer.render({
      area, player:this.player, hollow:this.hollow, pursuer:this.pursuer, objective:this.activeProgress.objective(),
      ...(prompt ? {prompt} : {}), noiseRadiusMeters:this.player.noiseRadiusMeters, inventoryText:this.inventoryText(), blockedPortalIds, visibleInteractionIds, debug:this.debug
    });
  }

  private currentArea(){
    const base=this.worlds[this.chapterId].areas[this.areaId];
    if(!base) throw new Error(`Area ${this.areaId} is missing from chapter ${this.chapterId}`);
    if(this.areaId!=='cabinA' || !this.activeProgress.has('gateChecked')) return base;
    return { ...base, backgroundAssetId:'bg.cabinA.visited', subtitle:'재방문 · 누군가 치우고 간 방', decorations:[...base.decorations,{rect:{x:575,y:475,w:130,h:18},fallback:'#151918',alpha:.72},{rect:{x:760,y:330,w:42,h:18},fallback:'#4b3a30',alpha:.8}] };
  }

  private handlePortal():void{
    if(this.portalCooldown>0) return;
    const portal=this.currentArea().portals.find(p=>rectsOverlap(this.player.bounds(),p.rect)); if(!portal) return;
    if(portal.requireFlag && !this.activeProgress.has(portal.requireFlag)){
      this.portalCooldown=1.1; this.busy=true;
      void this.modal.showMessage(portal.label,portal.denyMessage ?? '아직 갈 수 없다.').finally(()=>{this.busy=false;}); return;
    }
    this.enterArea(portal.target,portal.spawn,true); this.portalCooldown=.8;
    if(this.chapterId===1 && this.areaId==='cabinA' && !this.cabinRevisitSeen && this.activeProgress.has('gateChecked')){
      this.cabinRevisitSeen=true; this.busy=true;
      void this.modal.showMessage('낯선 오두막','분명 익숙해야할 오두막이 다시 돌아왔을때는 굉장히 낯설게 느껴졌다.\n\n분명 오두막을 나선 오전까지만 해도 바닥을 뒤덮고 있던 양피지들이 전부 사라져 있었다.\n넘어져 있던 의자와 반쯤 비어 있던 책장도 처음부터 흐트러진 적이 없었던 것처럼 반듯하게 정리되어 있었다.').finally(()=>{this.input.clearPressed();this.busy=false;});
    }
  }

  private nearestPortal():PortalDefinition|undefined{
    return this.currentArea().portals.filter(p=>distance(this.player.position,centerOf(p.rect))<95).sort((a,b)=>distance(this.player.position,centerOf(a.rect))-distance(this.player.position,centerOf(b.rect)))[0];
  }

  private nearestInteraction():InteractionDefinition|undefined{
    return this.currentArea().interactions.filter(i=>this.interactionVisible(i) && distance(this.player.position,centerOf(i.rect))<105).sort((a,b)=>distance(this.player.position,centerOf(a.rect))-distance(this.player.position,centerOf(b.rect)))[0];
  }

  private interactionVisible(i:InteractionDefinition):boolean{
    if(i.visibleWhen && !this.activeProgress.has(i.visibleWhen)) return false;
    if(i.hiddenWhen && this.activeProgress.has(i.hiddenWhen)) return false;
    const itemByAction:Partial<Record<string,ItemId>>={ 'woodcut.triangle':'woodcutTriangle','woodcut.circle':'woodcutCircle','woodcut.cross':'woodcutCross' };
    const item=itemByAction[i.action]; if(item && this.activeProgress.owns(item)) return false;
    return true;
  }

  private async handleInteraction():Promise<void>{
    if(this.busy) return;
    const interaction=this.nearestInteraction(); if(!interaction) return; this.busy=true;
    try{
      const result=this.chapterId===1?this.flow.interact(interaction.action):this.chapterId===2?this.flow2.interact(interaction.action):this.flow3.interact(interaction.action,this.ritual.agencyLocked); await this.modal.showMessage(result.title,result.body); this.input.clearPressed();
      if(result.openPuzzle){
        const solved=await this.modal.showShadowPuzzle({
          align:input=>this.shadowPuzzle.align(input),
          attempt:input=>this.shadowPuzzle.attempt(input),
          hintAvailable:this.progress.has('mechanismExamined'),
          mirrorTarget:ShadowPuzzleService.ANSWER.mirrorAngle,
          candleTarget:ShadowPuzzleService.ANSWER.candleAngle,
          onFeedback:feedback=>{
            if(feedback.event==='threat-approaches'){ this.audio.pulse('error'); this.audio.pulse('step'); }
            else if(!feedback.solved) this.audio.pulse('error');
          }
        });
        if(solved){
          this.flow.solvePuzzle(); this.audio.pulse('success');
          await this.modal.showMessage('봉인이 맞물리다','세 그림자가 겹치는 순간, 다락 전체가 숨을 멈춘 듯 조용해진다. 받침대 안쪽에서 나무가 갈리는 소리가 낮게 울린다.');
          this.input.clearPressed();
          await this.modal.showMessage('열린 서랍','서랍이 열린다. 녹슨 관문 열쇠, 접힌 종이, △ 진실 조각을 획득했다.');
          this.input.clearPressed();
          this.progress.addItem('warningNote');
          await this.modal.showMessage('접힌 종이','\u2018Ashvale의 북쪽 관문에서만 들을 수 있는 울음이 있다.\n그것이 당신보다 먼저 당신을 알아챌 것이다.\n들어가지 말라. 그러나 이미 늦었다면—\n살아남기를.\u2019');
          this.input.clearPressed(); this.save();
        }
      }
      if(result.sighting){ this.triggerSighting(); this.save(); }
      if(result.startPursuit){ const cfg=this.currentArea().pursuit; if(cfg) this.activatePursuit(cfg); this.save(); }
      if(result.complete){
        if(this.chapterId===1)this.progress.set('chapterComplete'); this.hollow.active=false; this.pursuer.active=false; const end=this.chapterId===1?'ending':this.chapterId===2?'ending2':'ending3';this.enterArea(end,{x:640,y:360},false); await this.modal.showEnding(this.chapterId); this.input.clearPressed();
        this.beginChapter(await this.modal.showChapterSelect()); this.enterArea(this.areaId,this.player.position,false); this.save();
      } else if(result.autosave) this.save();
    }finally{this.busy=false;}
  }

  private triggerSighting():void{
    // Scripted glimpse (GR-1 attic window, or GR-3's brief Reginald reveal) — never tracks the player.
    this.hollow.assetId=this.chapterId===3?'character.reginald':'enemy.hollow';
    this.hollow.position={x:960,y:230}; this.hollow.active=true; this.sightingTimer=GameController.SIGHTING_SECONDS;
    this.audio.pulse('hollow');
  }

  private activatePursuit(cfg:NonNullable<AreaDefinition['pursuit']>):void{
    this.pursuer.active=true; this.pursuer.position={...cfg.spawn}; this.pursuer.speed=cfg.speed; this.pursuer.assetId=cfg.enemyAssetId; this.pursuitArea=this.areaId;
    this.audio.pulse('hollow');
  }

  private async handleCatch():Promise<void>{
    const cfg=this.currentArea().pursuit; this.pursuer.active=false;
    try{
      await this.modal.showMessage(cfg?.catchTitle??'붙잡히다',cfg?.catchBody??'차가운 손이 스치고 지나간다.');
      this.input.clearPressed();
      this.player.position={...this.currentArea().spawn};
      this.pursuitGrace=1.5;
    } finally { this.busy=false; }
  }

  private enterArea(target:AreaId,spawn:{x:number;y:number},autosave:boolean):void{
    this.areaId=target; this.player.position={...spawn}; this.audio.setAmbience(this.currentArea().ambience);
    this.hollow.active=false; this.pursuer.active=false; this.pursuitGrace=0; this.pursuitArea=null;
    const pursuit=this.currentArea().pursuit; if(pursuit?.onEnter) this.activatePursuit(pursuit);
    if(autosave && ['cabinB1','cabinB2','attic'].includes(target)) this.save();
  }

  private restore(snapshot:Chapter1Snapshot):void{
    const stranded=GameController.ENDING_AREAS.includes(snapshot.areaId);
    this.areaId=stranded?this.chapterStartArea(this.chapterId):snapshot.areaId;
    this.player.position=stranded?this.chapterStartPosition(this.chapterId):{x:snapshot.playerX,y:snapshot.playerY};
    this.player.lanternOn=snapshot.lanternOn;
    snapshot.flags.forEach(f=>this.activeProgress.set(f)); snapshot.items.forEach(i=>this.activeProgress.addItem(i));
  }

  private inventoryText():string{
    const icons:string[]=[];
    if(this.activeProgress.owns('jadeBox') && !this.activeProgress.has('boxOpened'))icons.push('옥색 돌 상자');
    if(this.activeProgress.owns('woodcutTriangle'))icons.push('△'); if(this.activeProgress.owns('woodcutCircle'))icons.push('○'); if(this.activeProgress.owns('woodcutCross'))icons.push('✠');
    if(this.activeProgress.owns('rustedGateKey'))icons.push('녹슨 열쇠'); for(const [id,label] of [['warningNote','경고 쪽지'],['ashvaleMap','Ashvale 지도'],['truthTriangle','△ 진실 조각'],['truthCircle','○ 진실 조각'],['truthCross','✠ 진실 조각'],['ironGateKey','철 열쇠']] as const)if(this.activeProgress.owns(id))icons.push(label);
    return `소지품: ${icons.length?icons.join(' · '):'없음'}`;
  }

  private async pauseInfo():Promise<void>{
    if(this.busy)return; this.busy=true;
    await this.modal.showMessage('PAUSE',`현재 목표: ${this.activeProgress.objective()}\n저장은 봉헌 촛대 및 핵심 진행 시 자동으로 수행된다.`,'Enter/Escape · 계속'); this.input.clearPressed(); this.busy=false;
  }
  private get activeProgress(){return this.chapterId===1?this.progress:this.chapterId===2?this.progress2:this.progress3;}
  private chapterStartArea(chapter:1|2|3):AreaId{return chapter===1?'bridge':chapter===2?'villageSquare':'castleGateChain';}
  private chapterStartPosition(chapter:1|2|3):{x:number;y:number}{return chapter===2?{x:635,y:500}:{x:180,y:520};}
  private save():void{this.saves.save(this.areaId,this.player,this.activeProgress,this.chapterId);}
}
