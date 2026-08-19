import test from 'node:test';
import assert from 'node:assert/strict';
import { chapter1World } from '../dist/config/Chapter1World.js';
import { PIXELS_PER_METER, metersToPixels } from '../dist/domain/Scale.js';
import { Player } from '../dist/domain/Player.js';
import { MovementService } from '../dist/application/MovementService.js';
import { ShadowPuzzleService } from '../dist/application/ShadowPuzzleService.js';
import { rectsOverlap } from '../dist/domain/Geometry.js';
import fs from 'node:fs';

const input=(overrides={})=>({up:false,down:false,left:false,right:false,run:false,crouch:false,interactPressed:false,lanternPressed:false,escapePressed:false,debugPressed:false,...overrides});

test('P0 scale and LDD noise values stay canonical',()=>{
  assert.equal(PIXELS_PER_METER,45.8);
  assert.ok(Math.abs(metersToPixels(14)-641.2)<1e-9);
  const player=new Player({x:500,y:500}); const movement=new MovementService(); const area=chapter1World.areas.ending;
  movement.update(player,area,input({right:true,crouch:true}),.01); assert.equal(player.noiseRadiusMeters,2);
  movement.update(player,area,input({right:true}),.01); assert.equal(player.noiseRadiusMeters,5);
  movement.update(player,area,input({right:true,run:true}),.01); assert.equal(player.noiseRadiusMeters,14);
});

test('forest gate requires the first cabin visit',()=>{
  const portal=chapter1World.areas.forest.portals.find(p=>p.id==='forest.toGate');
  assert.equal(portal?.requireFlag,'cabinVisited');
  assert.ok(portal?.denyMessage);
});

test('shadow puzzle align() is a pure live read that never mutates failure state',()=>{
  const puzzle=new ShadowPuzzleService();
  const wrongOrder=puzzle.align({slots:['✠','○','△'],mirrorAngle:45,candleAngle:30});
  assert.equal(wrongOrder.overlapPercent,0,'wrong order must never report overlap, even at the exact angle');
  assert.equal(wrongOrder.orderCorrect,false);
  assert.equal(wrongOrder.mirrorAligned,true,'per-dial alignment stays live/independent of order so the angle mini-puzzle always gives feedback');
  assert.equal(wrongOrder.candleAligned,true);
  // calling align() repeatedly must not increment failures — it drives real-time UI feedback, not a guess.
  puzzle.align({slots:['△','△','△'],mirrorAngle:0,candleAngle:0});
  puzzle.align({slots:['△','△','△'],mirrorAngle:15,candleAngle:15});
  const feedback=puzzle.attempt({slots:['△','△','△'],mirrorAngle:0,candleAngle:0});
  assert.equal(feedback.failures,1,'only attempt() — the committed seal action — should count as a failure');
  assert.equal(puzzle.attempt({slots:['△','○','✠'],mirrorAngle:40,candleAngle:35}).solved,true);
});

test('third committed failure exposes a threat event for presentation audio, not chase logic',()=>{
  const puzzle=new ShadowPuzzleService(); let result;
  for(let i=0;i<3;i++) result=puzzle.attempt({slots:['△','△','△'],mirrorAngle:0,candleAngle:0});
  assert.equal(result.event,'threat-approaches');
  assert.equal(result.candlesExtinguished,3);
  assert.equal(result.failures,3);
});

test('cabin areas use matching generated interior art and readable exits',()=>{
  const manifest=JSON.parse(fs.readFileSync(new URL('../public/assets/manifest.json',import.meta.url),'utf8'));
  for(const id of ['bg.cabinA','bg.cabinA.visited','bg.cabinB1Hall','bg.cabinB1Office','bg.cabinB1','bg.cabinB1Rear','bg.cabinB1Cellar','bg.cabinB2','bg.attic']){
    assert.match(manifest.images[id],/environment\/generated\/.*\.png$/);
  }
  const cabinA=chapter1World.areas.cabinA;
  const exit=cabinA.portals.find(portal=>portal.id==='cabinA.exit');
  assert.ok(exit && exit.rect.x<=640 && exit.rect.x+exit.rect.w>=640,'south doorway must be centered');
  assert.ok(!cabinA.walls.some(w=>w.x<640&&w.x+w.w>640&&w.y<600&&w.y+w.h>600),'visible south doorway must not be blocked by collision');
});

test('north gate art, collision, and lock interaction share one visual boundary',()=>{
  const manifest=JSON.parse(fs.readFileSync(new URL('../public/assets/manifest.json',import.meta.url),'utf8'));
  assert.match(manifest.images['bg.gate'],/environment\/generated\/north-gate-v1\.png$/);
  const gate=chapter1World.areas.gate;
  const lock=gate.interactions.find(i=>i.id==='gate.lock');
  const gateMass=gate.walls.find(w=>w.x===760);
  assert.ok(lock && gateMass);
  assert.ok(lock.rect.x+lock.rect.w>=gateMass.x,'lock must touch the blocking gate mass');
  assert.ok(lock.rect.x<gateMass.x,'lock must be reachable from the walkable clearing');
});

test('every runtime map and character uses a generated raster asset',()=>{
  const manifest=JSON.parse(fs.readFileSync(new URL('../public/assets/manifest.json',import.meta.url),'utf8'));
  for(const [id,assetPath] of Object.entries(manifest.images)){
    assert.match(assetPath,/\.(png|webp)$/i,`${id} must not fall back to an SVG placeholder`);
    const diskPath=new URL(`../${assetPath.replace(/^\.\//,'')}`,import.meta.url);
    assert.ok(fs.existsSync(diskPath),`${id} asset must exist on disk`);
  }
  assert.match(manifest.images['bg.logging'],/logging-road-manager-building-v1\.png$/);
  assert.match(manifest.images['bg.bridge'],/collapsed-bridge-v1\.png$/);
});

test('loggingRoad landmarks pay off the cabin.record clue without gating the route',()=>{
  const logging=chapter1World.areas.loggingRoad;
  const wanted={ 'logging.fence':'fenceExamined', 'logging.oak':'oakExamined', 'logging.creek':'creekExamined', 'logging.cart':'cartExamined' };
  for(const [id,flag] of Object.entries(wanted)){
    const found=logging.interactions.find(i=>i.id===id);
    assert.ok(found,`${id} must exist on loggingRoad`);
    assert.equal(found.hiddenWhen,flag,`${id} must self-hide once examined, not gate anything else`);
    assert.equal(found.visibleWhen,undefined,`${id} must be a soft/no-gate discoverable, always visible until examined`);
    for(const portal of logging.portals) assert.ok(!rectsOverlap(found.rect,portal.rect),`${id} must not overlap portal ${portal.id}`);
  }
  for(const portal of logging.portals) assert.equal(portal.requireFlag,undefined,'landmarks stay optional — no portal on loggingRoad may require them');
});

test('expanded management building keeps its optional story beats soft and clear of portals',()=>{
  const expected={
    cabinB1Hall:{'hall.ledger':'hallLedgerSeen','hall.coats':'hallCoatsSeen'},
    cabinB1Office:{'office.roster':'officeRosterSeen','office.map':'officeMapSeen'},
    cabinB1Rear:{'rear.bunk':'rearBunkSeen','rear.workbench':'rearWorkbenchSeen'},
    cabinB1Cellar:{'cellar.crates':'cellarCratesSeen','cellar.marks':'cellarMarksSeen'}
  };
  for(const [areaId,interactions] of Object.entries(expected)){
    const area=chapter1World.areas[areaId]; assert.ok(area,`${areaId} must exist`);
    for(const [id,flag] of Object.entries(interactions)){
      const found=area.interactions.find(i=>i.id===id); assert.ok(found,`${id} must exist in ${areaId}`);
      assert.equal(found.hiddenWhen,flag); assert.equal(found.visibleWhen,undefined);
      for(const portal of area.portals) assert.ok(!rectsOverlap(found.rect,portal.rect),`${id} must not overlap ${portal.id}`);
    }
    for(const portal of area.portals) assert.equal(portal.requireFlag,undefined,`${areaId} story beats must not gate travel`);
  }
});

test('management building spine and optional branches preserve the three-room puzzle wing',()=>{
  const hall=chapter1World.areas.cabinB1Hall;
  assert.equal(hall.portals.find(p=>p.id==='hall.toWing')?.target,'cabinB1');
  assert.equal(hall.portals.find(p=>p.id==='hall.toOffice')?.target,'cabinB1Office');
  assert.equal(chapter1World.areas.cabinB1.portals.find(p=>p.id==='b1.toRear')?.target,'cabinB1Rear');
  assert.equal(chapter1World.areas.cabinB1Rear.portals.find(p=>p.id==='rear.toB2')?.target,'cabinB2');
  assert.equal(chapter1World.areas.cabinB1Rear.portals.find(p=>p.id==='rear.toCellar')?.target,'cabinB1Cellar');
  const woodcuts=[
    ['cabinB1','wood.tri','triangleHintFound'],
    ['cabinB1','wood.circle','circleHintFound'],
    ['cabinB1','wood.cross','crossHintFound']
  ];
  for(const [areaId,id,flag] of woodcuts){
    assert.equal(chapter1World.areas[areaId].interactions.find(i=>i.id===id)?.visibleWhen,flag);
  }
});

test('woodcut search uses one discoverable hint before each hidden trigger',()=>{
  const chains=[
    ['cabinB1','b1.watchHint','triangleHintFound','wood.tri'],
    ['cabinB1','rear.mildewHint','circleHintFound','wood.circle'],
    ['cabinB1','wing.waxHint','crossHintFound','wood.cross']
  ];
  for(const [areaId,hintId,flag,woodcutId] of chains){
    const area=chapter1World.areas[areaId];
    const hint=area.interactions.find(i=>i.id===hintId);
    const woodcut=area.interactions.find(i=>i.id===woodcutId);
    assert.ok(hint && woodcut,`${areaId} must contain ${hintId} and ${woodcutId}`);
    assert.equal(hint.visibleWhen,'atticClueSeen'); assert.equal(hint.hiddenWhen,flag);
    assert.equal(woodcut.visibleWhen,flag);
    assert.ok(!rectsOverlap(hint.rect,woodcut.rect),`${hintId} and ${woodcutId} need separate search targets`);
    for(const portal of area.portals){
      assert.ok(!rectsOverlap(hint.rect,portal.rect),`${hintId} must not overlap ${portal.id}`);
      assert.ok(!rectsOverlap(woodcut.rect,portal.rect),`${woodcutId} must not overlap ${portal.id}`);
    }
  }
});

test('six puzzle decoys are clue-gated, one-shot, and separate from travel portals',()=>{
  const decoys=[
    ['cabinB1','wing.clockDecoy','wingClockDecoySeen'],
    ['cabinB1','wing.bagDecoy','wingBagDecoySeen'],
    ['cabinB1','wing.statueDecoy','wingStatueDecoySeen'],
    ['cabinB2','b2.clockDecoy','b2ClockDecoySeen'],
    ['cabinB1Office','office.kneelingIcon','officeIconDecoySeen'],
    ['cabinB1Rear','rear.satchel','rearSatchelDecoySeen']
  ];
  for(const [areaId,id,flag] of decoys){
    const area=chapter1World.areas[areaId]; const decoy=area.interactions.find(i=>i.id===id);
    assert.ok(decoy,`${id} must exist in ${areaId}`);
    assert.equal(decoy.visibleWhen,'atticClueSeen'); assert.equal(decoy.hiddenWhen,flag);
    for(const portal of area.portals) assert.ok(!rectsOverlap(decoy.rect,portal.rect),`${id} must not overlap ${portal.id}`);
  }
});

test('historically revised puzzle rooms use versioned art while superseded art stays out of the manifest',()=>{
  const manifest=JSON.parse(fs.readFileSync(new URL('../public/assets/manifest.json',import.meta.url),'utf8'));
  assert.match(manifest.images['bg.cabinB1'],/cabin-b1-v3\.png$/);
  assert.match(manifest.images['bg.cabinB1Rear'],/cabin-b1-rear-v3\.png$/);
  assert.match(manifest.images['bg.cabinB2'],/cabin-b2-v3\.png$/);
});

// 2026-08-20: 마스터 시나리오(1순위 정본) 621~622행이 '벽난로 위의 멈춰 버린 회중시계'를 명시하고,
// 근거였던 '1358년' 설정은 시나리오·LDD 어디에도 없어 모래시계 치환을 원복했다.
// 이 테스트는 그 역방향(모래시계 재도입)을 막는다.
test('triangle woodcut chain keeps the master-scenario pocket watch on the mantel',()=>{
  const relevant=['wing.clockDecoy','b2.watchHint','b2.clockDecoy','woodcut.triangle','rear.workbench'];
  const source=fs.readFileSync(new URL('../dist/application/Chapter1FlowService.js',import.meta.url),'utf8');
  for(const action of relevant) assert.ok(source.includes(`case '${action}'`),`${action} must remain implemented`);
  assert.ok(!source.includes('모래시계'),'모래시계 must not return — master scenario 621행 says 회중시계');
  assert.ok(source.includes('회중시계'),'회중시계 must appear in runtime copy');
  assert.ok(source.includes('벽난로'),'벽난로 위라는 배치(원문 621행)가 본문에 남아 있어야 한다');
  const tri=chapter1World.areas.cabinB1.interactions.find(i=>i.id==='wood.tri');
  const hint=chapter1World.areas.cabinB1.interactions.find(i=>i.id==='b1.watchHint');
  assert.ok(tri && hint,'triangle woodcut and its hint both belong to the 1F three-room wing');
  assert.match(hint.label,/회중시계/);
  assert.equal(chapter1World.areas.cabinB1Rear.interactions.find(i=>i.id==='rear.workbench')?.label,'틀톱 정리대');
});

test('forest one-time atmosphere beats do not block any of its four portals',()=>{
  const forest=chapter1World.areas.forest;
  for(const id of ['forest.markedTree','forest.puddleTracks','forest.eyes']){
    const found=forest.interactions.find(i=>i.id===id);
    assert.ok(found,`${id} must exist on forest`);
    for(const portal of forest.portals) assert.ok(!rectsOverlap(found.rect,portal.rect),`${id} must not overlap portal ${portal.id}`);
  }
});

test('cabinA revisit bootprint appears alongside the record, not before routeKnown',()=>{
  const cabin=chapter1World.areas.cabinA;
  const bootprint=cabin.interactions.find(i=>i.id==='cabin.bootprint');
  const record=cabin.interactions.find(i=>i.id==='cabin.record');
  assert.ok(bootprint && record);
  assert.equal(bootprint.visibleWhen,'routeKnown');
  assert.ok(!rectsOverlap(bootprint.rect,record.rect),'bootprint and record need separate readable targets');
  assert.ok(!cabin.portals.some(p=>rectsOverlap(bootprint.rect,p.rect)),'bootprint must not sit on the exit portal');
});

test('offering candle interaction is on the record table, not the stove',()=>{
  const cabin=chapter1World.areas.cabinA;
  const candle=cabin.interactions.find(i=>i.id==='cabin.candle');
  const record=cabin.interactions.find(i=>i.id==='cabin.record');
  assert.ok(candle && record);
  assert.ok(candle.rect.x>=970 && candle.rect.y>=400,'candle must target the lower-right table');
  assert.ok(record.rect.x+record.rect.w<=candle.rect.x,'record and candle need separate readable targets');
});
