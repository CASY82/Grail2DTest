import test from 'node:test'; import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chapter2World} from '../dist/config/Chapter2World.js'; import {chapter3World} from '../dist/config/Chapter3World.js';
import {Chapter2Progress} from '../dist/domain/Chapter2.js'; import {Chapter3Progress} from '../dist/domain/Chapter3.js';
import {Chapter2FlowService} from '../dist/application/Chapter2FlowService.js'; import {Chapter3FlowService} from '../dist/application/Chapter3FlowService.js';
import {SequencePuzzleService} from '../dist/application/SequencePuzzleService.js'; import {RitualSequenceService} from '../dist/application/RitualSequenceService.js'; import {Player} from '../dist/domain/Player.js';
import {PursuitService} from '../dist/application/PursuitService.js'; import {Pursuer} from '../dist/domain/Pursuer.js';
import {rectsOverlap} from '../dist/domain/Geometry.js';

const validateWorld=(world,expected)=>{assert.deepEqual(Object.keys(world.areas).sort(),expected.sort());for(const area of Object.values(world.areas)){for(const p of area.portals){assert.ok(world.areas[p.target],`${area.id} -> ${p.target}`);assert.ok(p.spawn.x>=18&&p.spawn.x<=1262&&p.spawn.y>=18&&p.spawn.y<=702);}}};
test('GR-2 and GR-3 area graphs are complete and internally linked',()=>{
 validateWorld(chapter2World,['villageSquare','marketStreet','marketAlley','houseExterior','houseInterior','innGroundFloor','innCellar','innCellarEscape','townHallExterior','townHallInterior','townHallRecords','townGate','villageChaseFinal','ending2']);
 validateWorld(chapter3World,['castleGateChain','greatHall','diningRoom','parlor','office2F','corridorDescent','greatHallSealed','serviceCorridorB1','laboratoryB2','ritualChamber','ending3']);
});
test('sequence puzzle resets harmlessly and solves canonical wine order',()=>{const s=new SequencePuzzleService(['V','II','IV','I','III','VI']);assert.equal(s.click('I').reset,true);let f;for(const x of ['V','II','IV','I','III','VI'])f=s.click(x);assert.equal(f.solved,true);});
test('GR-2 critical path produces all truth pieces and opens the gate',()=>{const p=new Chapter2Progress(),f=new Chapter2FlowService(p);f.interact('house.hide');f.interact('house.diary');for(const x of ['V','II','IV','I','III','VI'])f.interact(`wine.shelf${x}`);f.interact('wine.serpentBox');f.interact('civic.record');for(const x of ['eleanor','isaac','martha','thomas'])f.interact(`civic.name.${x}`);const gate=f.interact('gate2.slot');assert.equal(p.has('nameSlotSolved'),true);assert.equal(gate.autosave,true);});
test('GR-3 ritual fades movement and discards dial agency before completion',()=>{const p=new Chapter3Progress(),f=new Chapter3FlowService(p),r=new RitualSequenceService(),player=new Player({x:0,y:0});f.interact('ritual.approach');f.interact('ritual.reginald');f.interact('ritual.kneel');f.interact('ritual.pedestal');r.update(player,5,true);assert.equal(r.agencyLocked,true);assert.ok(player.controlMultiplier<1);assert.match(f.interact('ritual.dial',r.agencyLocked).body,/몸이 움직이지 않았다/);assert.equal(f.interact('ritual.witness').complete,true);});
test('chapter selection buttons remain clickable inside the non-interactive overlay',()=>{const css=readFileSync(new URL('../style.css',import.meta.url),'utf8');const modal=readFileSync(new URL('../src/presentation/ModalView.ts',import.meta.url),'utf8');assert.match(css,/\.chapter-select button\s*\{[^}]*pointer-events:\s*auto/s);assert.match(modal,/button\.onclick=.*choose/);assert.match(modal,/Digit1.*Digit2.*Digit3/);});
// 2026-08-20: 마스터 시나리오 732행 "북쪽 표지판에는 블랙우드 성, 동쪽에는 상점가, 서쪽에는 여관 거리, 남쪽에는 시청과 주거지".
// 이전 좌표는 여관/시청이 상하 반전이었다. 픽셀값 대신 방위 의미를 단언해 같은 반전이 재발하지 않게 한다.
test('GR-2 village hub places all four routes on their scenario compass points',()=>{const square=chapter2World.areas.villageSquare;const c=id=>{const p=square.portals.find(portal=>portal.id===id);assert.ok(p,`${id} missing`);return{x:p.rect.x+p.rect.w/2,y:p.rect.y+p.rect.h/2,p};};const north=c('sq.gate'),east=c('sq.market'),west=c('sq.inn'),south=c('sq.hall');assert.equal(north.p.target,'townGate');assert.equal(east.p.target,'marketStreet');assert.equal(west.p.target,'innGroundFloor');assert.equal(south.p.target,'townHallExterior');assert.ok(north.y<south.y-300,'성문(북)은 시청(남)보다 위쪽이어야 한다');assert.ok(west.x<east.x-600,'여관(서)은 상점가(동)보다 왼쪽이어야 한다');assert.ok(north.y<Math.min(west.y,east.y)&&south.y>Math.max(west.y,east.y),'북/남이 동/서보다 각각 위·아래여야 한다');for(const [areaId,portalId] of [['innGroundFloor','inn.back'],['marketStreet','market.back'],['townHallExterior','civic.back'],['townGate','gate2.back']]){const back=chapter2World.areas[areaId].portals.find(portal=>portal.id===portalId);assert.ok(back&&back.target==='villageSquare',`${portalId} must return to the square`);}const candle=square.interactions.find(interaction=>interaction.id==='square.candle');const candleCenter={x:candle.rect.x+candle.rect.w/2,y:candle.rect.y+candle.rect.h/2};assert.ok(Math.hypot(candleCenter.x-west.x,candleCenter.y-west.y)>180,'봉헌 촛대는 여관 입구와 떨어져 있어야 한다');});

test('GR-2/GR-3 pursuit zones spawn the chaser clear of walls and the room entry point',()=>{
 const pursuitAreas=[[chapter2World,'marketAlley',false],[chapter2World,'innCellarEscape',true],[chapter2World,'villageChaseFinal',true],[chapter3World,'corridorDescent',true],[chapter3World,'greatHallSealed',true]];
 for(const [world,id,onEnter] of pursuitAreas){
  const area=world.areas[id]; assert.ok(area.pursuit,`${id} should define a pursuit zone`);
  assert.equal(area.pursuit.onEnter??false,onEnter,`${id} onEnter flag`);
  assert.ok(area.pursuit.speed>0 && area.pursuit.catchTitle && area.pursuit.catchBody);
  const spawnRect={x:area.pursuit.spawn.x-15,y:area.pursuit.spawn.y-27,w:30,h:54};
  assert.ok(!area.walls.some(w=>rectsOverlap(spawnRect,w)),`${id} pursuit spawn collides with a wall`);
  assert.ok(Math.hypot(area.pursuit.spawn.x-area.spawn.x,area.pursuit.spawn.y-area.spawn.y)>150,`${id} pursuit spawn too close to the room's default entry point`);
 }
 assert.equal(chapter2World.areas.innCellar.pursuit,undefined,'wine rack puzzle stays a no-fail click puzzle, no live chaser');
 assert.equal(chapter3World.areas.office2F.pursuit,undefined,'the Reginald reveal itself stays a static sighting, chase starts at corridorDescent');
});

test('GR-2 mirror sighting starts a real pursuit instead of a blink-and-gone sighting',()=>{
 const p=new Chapter2Progress(),f=new Chapter2FlowService(p);
 const result=f.interact('alley.mirror');
 assert.equal(result.startPursuit,true); assert.equal(result.sighting,undefined); assert.equal(p.has('hollowSighted'),true);
});

test('PursuitService steers the chaser toward the player, stops at walls, and reports a catch on overlap',()=>{
 const service=new PursuitService(); const area={walls:[{x:100,y:0,w:20,h:720}]};
 const chaser=new Pursuer(); chaser.active=true; chaser.position={x:0,y:0}; chaser.speed=200;
 const player=new Player({x:300,y:0});
 for(let i=0;i<200;i++) service.update(chaser,player,area,0.016); // matches the engine's per-frame dt clamp, avoids tunneling through the thin wall
 assert.ok(chaser.position.x>0 && chaser.position.x<=100,'chaser advances toward the player but is blocked by the wall');
 const closePlayer=new Player({x:chaser.position.x,y:chaser.position.y});
 assert.equal(service.update(chaser,closePlayer,area,0.016),true,'overlapping bounds should report a catch');
 const inactive=new Pursuer();
 assert.equal(service.update(inactive,player,area,1),false,'an inactive pursuer never catches the player');
});
