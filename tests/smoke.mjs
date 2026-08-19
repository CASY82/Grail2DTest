import { chapter1World } from '../dist/config/Chapter1World.js';
import { chapter2World } from '../dist/config/Chapter2World.js';
import { chapter3World } from '../dist/config/Chapter3World.js';
import { Chapter1Progress } from '../dist/domain/Chapter1.js';
import { Chapter2Progress } from '../dist/domain/Chapter2.js';
import { Chapter3Progress } from '../dist/domain/Chapter3.js';
import { Chapter1FlowService } from '../dist/application/Chapter1FlowService.js';
import { Chapter2FlowService } from '../dist/application/Chapter2FlowService.js';
import { Chapter3FlowService } from '../dist/application/Chapter3FlowService.js';
import { GameController } from '../dist/presentation/GameController.js';
import { rectsOverlap } from '../dist/domain/Geometry.js';

const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const playerRect = (p) => ({ x:p.x-14, y:p.y-18, w:28, h:36 });
const endingAreas = ['ending', 'ending2', 'ending3'];
assert(Array.isArray(GameController.ENDING_AREAS) && endingAreas.every(a => GameController.ENDING_AREAS.includes(a)), 'GameController.ENDING_AREAS must cover every chapter ending area');

const chapters = [
  { id:1, world:chapter1World, newProgress:() => new Chapter1Progress(), newFlow:(p) => new Chapter1FlowService(p), fallbackBody:'특별한 것은 없다.' },
  { id:2, world:chapter2World, newProgress:() => new Chapter2Progress(), newFlow:(p) => new Chapter2FlowService(p), fallbackBody:'사라진 마을 사람들의 흔적만 남아 있다.' },
  { id:3, world:chapter3World, newProgress:() => new Chapter3Progress(), newFlow:(p) => new Chapter3FlowService(p), fallbackBody:'Blackwood의 오래된 침묵이 내려앉아 있다.' }
];

// 1. World integrity — spawns, portal targets, portal re-triggers, pursuit spawns.
for (const { id, world } of chapters) {
  for (const area of Object.values(world.areas)) {
    if (endingAreas.includes(area.id)) continue;
    assert(!area.walls.some(w => rectsOverlap(playerRect(area.spawn), w)), `CH${id} area default spawn collides with wall: ${area.id}`);
    if (area.pursuit) assert(!area.walls.some(w => rectsOverlap(playerRect(area.pursuit.spawn), w)), `CH${id} pursuit spawn collides with wall: ${area.id}`);
    for (const portal of area.portals) {
      const target = world.areas[portal.target];
      assert(target, `CH${id} portal points at a missing area: ${portal.id} -> ${portal.target}`);
      assert(!target.walls.some(w => rectsOverlap(playerRect(portal.spawn), w)), `CH${id} portal spawn collides with wall: ${portal.id} -> ${portal.target}`);
      assert(!target.portals.some(p => rectsOverlap(playerRect(portal.spawn), p.rect)), `CH${id} portal spawn immediately re-triggers another portal: ${portal.id} -> ${portal.target}`);
    }
  }
}

// 2. Every interaction action must be handled by its chapter's FlowService (no default filler).
for (const { id, world, newProgress, newFlow, fallbackBody } of chapters) {
  assert(newFlow(newProgress()).interact('__no_such_action__').body === fallbackBody, `CH${id} fallback body drifted — update tests/smoke.mjs`);
  for (const area of Object.values(world.areas)) {
    for (const interaction of area.interactions) {
      const result = newFlow(newProgress()).interact(interaction.action);
      assert(result.body !== fallbackBody, `CH${id} interaction falls back to the default filler: ${area.id} / ${interaction.id} (action "${interaction.action}")`);
    }
  }
}

// 3. Ending Areas are dead ends (that is what makes a snapshot taken in one a trap),
//    and every other portal-less Area must at least own a scripted way out.
for (const { id, world } of chapters) {
  for (const area of Object.values(world.areas)) {
    if (endingAreas.includes(area.id)) { assert(area.portals.length === 0, `CH${id} ending area unexpectedly has portals: ${area.id}`); continue; }
    if (area.portals.length === 0) assert(area.interactions.length > 0, `CH${id} non-ending area has no way out at all: ${area.id}`);
  }
}
// …and a save taken inside one must never restore the player back into it.
globalThis.requestAnimationFrame ??= () => 0;
for (const chapterId of [1, 2, 3]) {
  const areaId = endingAreas[chapterId - 1];
  const snapshot = { chapterId, areaId, playerX:640, playerY:360, flags:[], items:[], lanternOn:false };
  const noop = () => {};
  const controller = new GameController(
    { 1:chapter1World, 2:chapter2World, 3:chapter3World },
    { poll:() => ({}), clearPressed:noop },
    { render:noop },
    { load:async () => {} },
    { setAmbience:noop, pulse:noop },
    { isOpen:() => false, showChapterSelect:async () => chapterId, showMessage:async () => {}, showShadowPuzzle:async () => false, showEnding:async () => {} },
    { load:() => snapshot, save:noop, clear:noop }
  );
  await controller.start();
  const restored = chapter1World.areas[controller.areaId] ?? chapter2World.areas[controller.areaId] ?? chapter3World.areas[controller.areaId];
  assert(!endingAreas.includes(controller.areaId), `CH${chapterId} restored straight back into the ending area ${areaId}`);
  assert(restored && restored.portals.length > 0, `CH${chapterId} restored into an area with no exit: ${controller.areaId}`);
}

// 4. CH1 progression flag order.
const progress = new Chapter1Progress();
const flow = new Chapter1FlowService(progress);
flow.interact('cabin.parchment'); assert(progress.has('cabinVisited'), 'cabinVisited not set');
flow.interact('gate.inspect'); assert(progress.has('gateChecked'), 'gateChecked not set');
flow.interact('cabin.record'); assert(progress.has('routeKnown'), 'routeKnown not set');
flow.interact('cabin.bootprint');
flow.interact('forest.markedTree'); assert(progress.has('markedTreeSeen'), 'markedTreeSeen not set');
flow.interact('forest.puddleTracks'); assert(progress.has('puddleTracksSeen'), 'puddleTracksSeen not set');
flow.interact('forest.eyes'); assert(progress.has('forestEyesSeen'), 'forestEyesSeen not set');
flow.interact('logging.fence'); assert(progress.has('fenceExamined'), 'fenceExamined not set');
flow.interact('logging.oak'); assert(progress.has('oakExamined'), 'oakExamined not set');
flow.interact('logging.creek'); assert(progress.has('creekExamined'), 'creekExamined not set');
flow.interact('logging.cart'); assert(progress.has('cartExamined'), 'cartExamined not set');
flow.interact('hall.ledger'); assert(progress.has('hallLedgerSeen'), 'hallLedgerSeen not set');
flow.interact('hall.coats'); assert(progress.has('hallCoatsSeen'), 'hallCoatsSeen not set');
flow.interact('office.roster'); assert(progress.has('officeRosterSeen'), 'officeRosterSeen not set');
flow.interact('office.map'); assert(progress.has('officeMapSeen'), 'officeMapSeen not set');
flow.interact('rear.bunk'); assert(progress.has('rearBunkSeen'), 'rearBunkSeen not set');
flow.interact('rear.workbench'); assert(progress.has('rearWorkbenchSeen'), 'rearWorkbenchSeen not set');
flow.interact('cellar.crates'); assert(progress.has('cellarCratesSeen'), 'cellarCratesSeen not set');
flow.interact('cellar.marks'); assert(progress.has('cellarMarksSeen'), 'cellarMarksSeen not set');
flow.interact('cabinB.strap'); assert(progress.has('atticOpened'), 'atticOpened not set');
flow.interact('attic.clue'); assert(progress.has('atticClueSeen'), 'atticClueSeen not set');
flow.interact('attic.mechanism'); assert(progress.has('mechanismExamined'), 'mechanismExamined not set');
flow.interact('wing.clockDecoy'); assert(progress.has('wingClockDecoySeen'), 'wingClockDecoySeen not set');
flow.interact('wing.bagDecoy'); assert(progress.has('wingBagDecoySeen'), 'wingBagDecoySeen not set');
flow.interact('wing.statueDecoy'); assert(progress.has('wingStatueDecoySeen'), 'wingStatueDecoySeen not set');
flow.interact('b2.clockDecoy'); assert(progress.has('b2ClockDecoySeen'), 'b2ClockDecoySeen not set');
flow.interact('office.kneelingIcon'); assert(progress.has('officeIconDecoySeen'), 'officeIconDecoySeen not set');
flow.interact('rear.satchel'); assert(progress.has('rearSatchelDecoySeen'), 'rearSatchelDecoySeen not set');
flow.interact('b2.watchHint'); assert(progress.has('triangleHintFound'), 'triangleHintFound not set');
flow.interact('rear.mildewHint'); assert(progress.has('circleHintFound'), 'circleHintFound not set');
flow.interact('wing.waxHint'); assert(progress.has('crossHintFound'), 'crossHintFound not set');
flow.interact('woodcut.triangle'); flow.interact('woodcut.circle'); flow.interact('woodcut.cross');
assert(progress.hasAllWoodcuts(), 'woodcuts incomplete');
assert(flow.interact('attic.puzzle').openPuzzle === true, 'puzzle did not open');
flow.solvePuzzle(); assert(progress.owns('rustedGateKey') && progress.owns('truthTriangle'), 'puzzle rewards missing');
assert(flow.interact('attic.window').sighting === true, 'sighting did not trigger');
assert(flow.interact('gate.inspect').complete === true, 'gate did not complete with key');
console.log('Smoke tests passed: CH1-3 world integrity + interaction coverage + ending restore + CH1 progression.');
