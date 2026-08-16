import { chapter1World } from '../dist/config/Chapter1World.js';
import { Chapter1Progress } from '../dist/domain/Chapter1.js';
import { Chapter1FlowService } from '../dist/application/Chapter1FlowService.js';
import { rectsOverlap } from '../dist/domain/Geometry.js';

const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const playerRect = (p) => ({ x:p.x-14, y:p.y-18, w:28, h:36 });

for (const area of Object.values(chapter1World.areas)) {
  if (area.id === 'ending') continue;
  assert(!area.walls.some(w => rectsOverlap(playerRect(area.spawn), w)), `Area default spawn collides with wall: ${area.id}`);
  for (const portal of area.portals) {
    const target = chapter1World.areas[portal.target];
    assert(!target.walls.some(w => rectsOverlap(playerRect(portal.spawn), w)), `Portal spawn collides with wall: ${portal.id} -> ${portal.target}`);
    assert(!target.portals.some(p => rectsOverlap(playerRect(portal.spawn), p.rect)), `Portal spawn immediately re-triggers another portal: ${portal.id} -> ${portal.target}`);
  }
}

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
console.log('Smoke tests passed: world spawns + CH1 progression.');
