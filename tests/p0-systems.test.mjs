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
  for(const id of ['bg.cabinA','bg.cabinA.visited','bg.cabinB1','bg.cabinB2','bg.attic']){
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
