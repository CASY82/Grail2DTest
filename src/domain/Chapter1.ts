export type AreaId =
  | 'bridge' | 'forest' | 'cabinA' | 'gate' | 'loggingRoad'
  | 'cabinB1Hall' | 'cabinB1Office' | 'cabinB1' | 'cabinB1Rear' | 'cabinB1Cellar'
  | 'cabinB2' | 'attic' | 'chaseRoad' | 'ending'
  | 'villageSquare'|'marketStreet'|'marketAlley'|'houseExterior'|'houseInterior'|'innGroundFloor'|'innCellar'|'innCellarEscape'|'townHallExterior'|'townHallInterior'|'townHallRecords'|'townGate'|'villageChaseFinal'|'ending2'
  | 'castleGateChain'|'greatHall'|'diningRoom'|'parlor'|'office2F'|'corridorDescent'|'greatHallSealed'|'serviceCorridorB1'|'laboratoryB2'|'ritualChamber'|'ending3';

export type ProgressFlag =
  | 'bridgeObserved' | 'cabinVisited' | 'gateChecked' | 'routeKnown'
  | 'fenceExamined' | 'oakExamined' | 'creekExamined' | 'cartExamined'
  | 'atticOpened' | 'atticClueSeen' | 'mechanismExamined' | 'puzzleSolved' | 'chaseStarted' | 'chapterComplete'
  | 'markedTreeSeen' | 'puddleTracksSeen' | 'forestEyesSeen'
  | 'hallLedgerSeen' | 'hallCoatsSeen' | 'officeRosterSeen' | 'officeMapSeen'
  | 'rearBunkSeen' | 'rearWorkbenchSeen' | 'cellarCratesSeen' | 'cellarMarksSeen'
  | 'triangleHintFound' | 'circleHintFound' | 'crossHintFound'
  | 'wingClockDecoySeen' | 'wingBagDecoySeen' | 'wingStatueDecoySeen'
  | 'b2ClockDecoySeen' | 'officeIconDecoySeen' | 'rearSatchelDecoySeen'
  | 'villageArrived'|'gateTried'|'blackLambClueKnown'|'hollowSighted'|'hidSuccessfully'|'diaryRead'|'wineHintRead'|'wineOrderSolved'|'ironGateKeyTaken'|'innFireStarted'|'fourNamesKnown'|'truthSlotLit'|'nameSlotSolved'|'chapter2Complete'
  | 'gateSealed'|'portraitSeen'|'footprintsSeen'|'emberSeen'|'mannequinSeen'|'journalRead'|'reginaldEncountered'|'doorsChorusSeen'|'frontBlockedSeen'|'serviceDoorFound'|'silenceNoted'|'pedestalSeen'|'eleanorConfirmed'|'ritualEntered'|'boxOpened'|'chapter3Complete';

export type ItemId = 'woodcutTriangle' | 'woodcutCircle' | 'woodcutCross' | 'rustedGateKey' | 'truthTriangle'|'truthCircle'|'truthCross'|'ironGateKey';

export interface Chapter1Snapshot {
  chapterId?: 1|2|3;
  areaId: AreaId;
  playerX: number;
  playerY: number;
  flags: ProgressFlag[];
  items: ItemId[];
  lanternOn: boolean;
}

export class Chapter1Progress {
  readonly flags = new Set<ProgressFlag>();
  readonly items = new Set<ItemId>();

  has(flag: ProgressFlag): boolean { return this.flags.has(flag); }
  set(flag: ProgressFlag): void { this.flags.add(flag); }
  owns(item: ItemId): boolean { return this.items.has(item); }
  addItem(item: ItemId): void { this.items.add(item); }

  hasAllWoodcuts(): boolean {
    return this.owns('woodcutTriangle') && this.owns('woodcutCircle') && this.owns('woodcutCross');
  }

  objective(): string {
    if (this.has('chapterComplete')) return 'CHAPTER 1 COMPLETE';
    if (this.has('chaseStarted')) return '다시 북쪽 관문으로 향하라.';
    if (this.has('puzzleSolved')) return '창밖의 인기척을 확인하라.';
    if (this.hasAllWoodcuts()) return '다락으로 돌아가 △ ○ ✠ 그림자 봉인을 완성하라.';
    if (this.has('atticClueSeen')) return '건물 곳곳에서 △ ○ ✠ 목판화를 찾아라.';
    if (this.has('routeKnown')) return '옛 벌목로의 랜드마크를 따라 둘째 오두막으로 이동하라.';
    if (this.has('gateChecked')) return '첫 오두막으로 돌아가 북쪽 관문 관리 기록을 찾아라.';
    if (this.has('cabinVisited')) return '북쪽 관문을 찾아 상태를 확인하라.';
    return '숲을 따라 첫 오두막을 찾아라.';
  }
}
