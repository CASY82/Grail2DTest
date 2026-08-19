const borderWalls = () => [
    { x: 0, y: 0, w: 1280, h: 18 }, { x: 0, y: 702, w: 1280, h: 18 },
    { x: 0, y: 0, w: 18, h: 720 }, { x: 1262, y: 0, w: 18, h: 720 }
];
const area = (value) => value;
export const chapter1World = {
    areas: {
        bridge: area({
            id: 'bridge', title: '붕괴된 다리', subtitle: 'Blackmere Wood · 귀환로 상실', backgroundAssetId: 'bg.bridge', spawn: { x: 180, y: 520 }, ambience: 'rain',
            walls: [...borderWalls(), { x: 580, y: 0, w: 700, h: 420 }, { x: 850, y: 420, w: 430, h: 282 }],
            portals: [{ id: 'bridge.toForest', rect: { x: 25, y: 210, w: 90, h: 170 }, target: 'forest', spawn: { x: 120, y: 590 }, label: '숲길로 이동' }],
            interactions: [{ id: 'bridge.look', rect: { x: 510, y: 440, w: 180, h: 120 }, label: '붕괴된 다리 확인', action: 'bridge.lookBack', hiddenWhen: 'bridgeObserved' }],
            decorations: [
                { rect: { x: 80, y: 580, w: 520, h: 38 }, fallback: '#28302f' }, { rect: { x: 560, y: 330, w: 300, h: 22 }, fallback: '#39413f' },
                { rect: { x: 870, y: 130, w: 260, h: 28 }, fallback: '#26332e' }
            ]
        }),
        forest: area({
            id: 'forest', title: 'Ashvale Forest', subtitle: '첫 오두막 · 북쪽 관문 · 옛 벌목로', backgroundAssetId: 'bg.forest', spawn: { x: 120, y: 590 }, ambience: 'rain',
            walls: [...borderWalls(), { x: 300, y: 160, w: 80, h: 300 }, { x: 900, y: 80, w: 70, h: 300 }],
            portals: [
                { id: 'forest.toBridge', rect: { x: 25, y: 560, w: 70, h: 120 }, target: 'bridge', spawn: { x: 140, y: 420 }, label: '붕괴된 다리' },
                { id: 'forest.toCabinA', rect: { x: 380, y: 40, w: 180, h: 80 }, target: 'cabinA', spawn: { x: 640, y: 520 }, label: '첫 오두막' },
                { id: 'forest.toGate', rect: { x: 1110, y: 40, w: 120, h: 90 }, target: 'gate', spawn: { x: 180, y: 560 }, label: '북쪽 관문', requireFlag: 'cabinVisited', denyMessage: '숲의 갈림길이 빗속에 묻혀 있다. 먼저 불빛이 보이는 오두막에서 방향을 확인해야 한다.' },
                { id: 'forest.toLogging', rect: { x: 1110, y: 570, w: 120, h: 100 }, target: 'loggingRoad', spawn: { x: 140, y: 360 }, label: '옛 벌목로', requireFlag: 'routeKnown', denyMessage: '길이 여러 갈래로 얽혀 있다. 관리 기록이 없다면 방향을 잃을 것 같다.' }
            ],
            interactions: [
                { id: 'forest.markedTree', rect: { x: 95, y: 90, w: 120, h: 130 }, label: '나무의 낯선 표식', action: 'forest.markedTree', hiddenWhen: 'markedTreeSeen' },
                { id: 'forest.puddleTracks', rect: { x: 430, y: 510, w: 120, h: 120 }, label: '웅덩이 옆 발자국', action: 'forest.puddleTracks', hiddenWhen: 'puddleTracksSeen' },
                { id: 'forest.eyes', rect: { x: 790, y: 110, w: 220, h: 90 }, label: '나무 사이의 눈빛', action: 'forest.eyes', hiddenWhen: 'forestEyesSeen' },
                { id: 'forest.howl', rect: { x: 640, y: 380, w: 170, h: 110 }, label: '숲을 울리는 울음소리', action: 'forest.howl', hiddenWhen: 'howlHeard' }
            ],
            decorations: [
                { rect: { x: 95, y: 90, w: 120, h: 130 }, fallback: '#1d2823' }, { rect: { x: 430, y: 510, w: 120, h: 120 }, fallback: '#18231f' }, { rect: { x: 1000, y: 410, w: 110, h: 140 }, fallback: '#1c2924' }
            ]
        }),
        cabinA: area({
            id: 'cabinA', title: '첫 오두막', subtitle: '첫 방문은 안전하다. 돌아오면 무언가 달라진다.', backgroundAssetId: 'bg.cabinA', spawn: { x: 640, y: 520 }, ambience: 'cabin',
            // The collision shell follows the generated cabin walls. The only exit is the visible south doorway.
            walls: [...borderWalls(), { x: 160, y: 28, w: 960, h: 30 }, { x: 160, y: 28, w: 30, h: 572 }, { x: 1090, y: 28, w: 30, h: 572 }, { x: 160, y: 570, w: 390, h: 30 }, { x: 730, y: 570, w: 390, h: 30 }],
            portals: [{ id: 'cabinA.exit', rect: { x: 570, y: 560, w: 140, h: 100 }, target: 'forest', spawn: { x: 470, y: 145 }, label: '밖으로 나가기' }],
            interactions: [
                { id: 'cabin.lamp', rect: { x: 760, y: 120, w: 120, h: 110 }, label: '집 앞의 램프', action: 'cabin.lamp', hiddenWhen: 'cabinLampSeen' },
                { id: 'cabin.ransacked', rect: { x: 250, y: 80, w: 200, h: 110 }, label: '뒤집힌 실내', action: 'cabin.ransacked', hiddenWhen: 'cabinRansackedSeen' },
                { id: 'cabin.parchment', rect: { x: 270, y: 220, w: 100, h: 80 }, label: '양피지 조사', action: 'cabin.parchment', hiddenWhen: 'cabinVisited' },
                { id: 'cabin.map', rect: { x: 380, y: 300, w: 130, h: 100 }, label: '양피지 더미 속 지도', action: 'cabin.map', visibleWhen: 'cabinVisited', hiddenWhen: 'mapFound' },
                { id: 'cabin.candle', rect: { x: 970, y: 400, w: 110, h: 150 }, label: '봉헌 촛대', action: 'cabin.candle' },
                { id: 'cabin.record', rect: { x: 830, y: 420, w: 130, h: 100 }, label: '관리 기록 읽기', action: 'cabin.record', visibleWhen: 'gateChecked' },
                { id: 'cabin.bootprint', rect: { x: 480, y: 455, w: 140, h: 95 }, label: '진흙 발자국', action: 'cabin.bootprint', visibleWhen: 'routeKnown' }
            ],
            decorations: [{ rect: { x: 250, y: 380, w: 180, h: 100 }, fallback: '#4a392c' }, { rect: { x: 830, y: 380, w: 170, h: 110 }, fallback: '#3a3027' }]
        }),
        gate: area({
            id: 'gate', title: '북쪽 관문', subtitle: '성인 남자 키 두 배 높이의 돌벽 · 철제로 보강된 참나무 문', backgroundAssetId: 'bg.gate', spawn: { x: 180, y: 560 }, ambience: 'rain',
            // Generated art places the stone posts and iron leaves along this northeast mass.
            walls: [...borderWalls(), { x: 760, y: 70, w: 440, h: 500 }],
            portals: [{ id: 'gate.back', rect: { x: 25, y: 540, w: 80, h: 130 }, target: 'forest', spawn: { x: 1060, y: 120 }, label: '숲으로 돌아가기' }],
            interactions: [{ id: 'gate.lock', rect: { x: 610, y: 245, w: 155, h: 145 }, label: '거대한 녹슨 자물쇠', action: 'gate.inspect' }],
            decorations: []
        }),
        loggingRoad: area({
            id: 'loggingRoad', title: '옛 벌목로', subtitle: '울타리 → 벼락 참나무 → 얕은 개울 → 수레길', backgroundAssetId: 'bg.logging', spawn: { x: 100, y: 360 }, ambience: 'logging',
            // Walls follow the generated art: the dead tree trunk (left-center), the creek banks
            // either side of the plank crossing (~y400-490), and the log pile beside the manager building.
            walls: [...borderWalls(), { x: 250, y: 0, w: 70, h: 250 }, { x: 410, y: 0, w: 180, h: 270 }, { x: 610, y: 0, w: 150, h: 400 }, { x: 600, y: 490, w: 170, h: 230 }, { x: 760, y: 0, w: 70, h: 290 }, { x: 980, y: 390, w: 80, h: 330 }],
            portals: [
                { id: 'logging.back', rect: { x: 20, y: 300, w: 70, h: 120 }, target: 'forest', spawn: { x: 1080, y: 610 }, label: '첫 오두막 방향' },
                { id: 'logging.toB1', rect: { x: 1170, y: 290, w: 80, h: 140 }, target: 'cabinB1Hall', spawn: { x: 640, y: 520 }, label: '북부 벌목장 관리동' }
            ],
            // Landmarks pay off the cabin.record clue ("울타리 → 벼락 참나무 → 얕은 개울 → 수레길") —
            // optional, single-fire, no gate. Positions checked against the generated background art.
            interactions: [
                { id: 'logging.fence', rect: { x: 290, y: 300, w: 140, h: 100 }, label: '허물어진 뒤편 울타리', action: 'logging.fence', hiddenWhen: 'fenceExamined' },
                { id: 'logging.oak', rect: { x: 420, y: 280, w: 150, h: 70 }, label: '벼락 맞은 참나무', action: 'logging.oak', hiddenWhen: 'oakExamined' },
                { id: 'logging.creek', rect: { x: 630, y: 405, w: 110, h: 75 }, label: '개울의 판자다리', action: 'logging.creek', hiddenWhen: 'creekExamined' },
                { id: 'logging.cart', rect: { x: 870, y: 100, w: 130, h: 75 }, label: '버려진 수레와 통나무 더미', action: 'logging.cart', hiddenWhen: 'cartExamined' },
                { id: 'logging.handprints', rect: { x: 820, y: 420, w: 140, h: 110 }, label: '검붉은 손자국이 이어지는 길', action: 'logging.handprints', visibleWhen: 'creekExamined', hiddenWhen: 'followerFelt' },
                { id: 'logging.cabinB', rect: { x: 1060, y: 120, w: 140, h: 130 }, label: '공터의 둘째 오두막', action: 'logging.cabinB', hiddenWhen: 'cabinBObserved' },
                { id: 'logging.plaque', rect: { x: 1075, y: 300, w: 90, h: 110 }, label: '녹이 슨 명패', action: 'logging.plaque', visibleWhen: 'cabinBObserved', hiddenWhen: 'plaqueSeen' }
            ],
            decorations: [
                { rect: { x: 350, y: 80, w: 120, h: 160 }, fallback: '#2b2118' }, { rect: { x: 610, y: 480, w: 180, h: 25 }, fallback: '#39514e' }, { rect: { x: 880, y: 120, w: 190, h: 50 }, fallback: '#403c32' }
            ]
        }),
        cabinB1Hall: area({
            id: 'cabinB1Hall', title: '둘째 오두막 · 북부 벌목장 관리동', subtitle: '1F 현관홀 · 멈춰 버린 출입 기록', backgroundAssetId: 'bg.cabinB1Hall', spawn: { x: 640, y: 520 }, ambience: 'cabin',
            walls: [...borderWalls(), { x: 155, y: 45, w: 970, h: 28 }, { x: 155, y: 45, w: 28, h: 555 }, { x: 1097, y: 45, w: 28, h: 555 }, { x: 155, y: 575, w: 390, h: 25 }, { x: 735, y: 575, w: 390, h: 25 }],
            portals: [
                { id: 'hall.exit', rect: { x: 565, y: 560, w: 140, h: 100 }, target: 'loggingRoad', spawn: { x: 1120, y: 360 }, label: '벌목로' },
                { id: 'hall.toWing', rect: { x: 570, y: 55, w: 140, h: 90 }, target: 'cabinB1', spawn: { x: 640, y: 520 }, label: '서재 · 창고 · 기도실' },
                { id: 'hall.toOffice', rect: { x: 210, y: 90, w: 130, h: 100 }, target: 'cabinB1Office', spawn: { x: 640, y: 520 }, label: '관리사무소' }
            ],
            interactions: [
                { id: 'hall.ledger', rect: { x: 280, y: 300, w: 180, h: 150 }, label: '출입 기록부', action: 'hall.ledger', hiddenWhen: 'hallLedgerSeen' },
                { id: 'hall.coats', rect: { x: 820, y: 120, w: 220, h: 160 }, label: '걸린 우비 네 벌', action: 'hall.coats', hiddenWhen: 'hallCoatsSeen' }
            ],
            decorations: [{ rect: { x: 280, y: 300, w: 180, h: 150 }, fallback: '#49382a' }, { rect: { x: 820, y: 120, w: 220, h: 160 }, fallback: '#282a27' }]
        }),
        cabinB1Office: area({
            id: 'cabinB1Office', title: '북부 벌목장 관리동 · 관리사무소', subtitle: '인부 명부 · 벌목 구역 지도', backgroundAssetId: 'bg.cabinB1Office', spawn: { x: 640, y: 520 }, ambience: 'cabin',
            walls: [...borderWalls(), { x: 160, y: 60, w: 960, h: 28 }, { x: 160, y: 60, w: 28, h: 540 }, { x: 1092, y: 60, w: 28, h: 540 }, { x: 160, y: 575, w: 390, h: 25 }, { x: 730, y: 575, w: 390, h: 25 }],
            portals: [{ id: 'office.back', rect: { x: 570, y: 560, w: 140, h: 100 }, target: 'cabinB1Hall', spawn: { x: 390, y: 190 }, label: '현관홀' }],
            interactions: [
                { id: 'office.roster', rect: { x: 285, y: 260, w: 240, h: 180 }, label: '인부 명부', action: 'office.roster', hiddenWhen: 'officeRosterSeen' },
                { id: 'office.map', rect: { x: 780, y: 90, w: 220, h: 150 }, label: '벌목 구역 지도', action: 'office.map', hiddenWhen: 'officeMapSeen' },
                { id: 'office.kneelingIcon', rect: { x: 560, y: 350, w: 150, h: 150 }, label: '기도하는 목상', action: 'office.kneelingIcon', visibleWhen: 'atticClueSeen', hiddenWhen: 'officeIconDecoySeen' }
            ],
            decorations: [{ rect: { x: 285, y: 260, w: 240, h: 180 }, fallback: '#4a3425' }, { rect: { x: 780, y: 90, w: 220, h: 150 }, fallback: '#594c38' }]
        }),
        cabinB1: area({
            id: 'cabinB1', title: '둘째 오두막 · 북부 벌목장 관리동', subtitle: '1F 서재 · 창고 · 기도실', backgroundAssetId: 'bg.cabinB1', spawn: { x: 640, y: 520 }, ambience: 'cabin',
            walls: [...borderWalls(), { x: 150, y: 90, w: 980, h: 30 }, { x: 150, y: 90, w: 30, h: 510 }, { x: 1100, y: 90, w: 30, h: 510 }, { x: 150, y: 570, w: 400, h: 30 }, { x: 730, y: 570, w: 400, h: 30 }, { x: 420, y: 90, w: 28, h: 360 }, { x: 820, y: 240, w: 28, h: 360 }],
            portals: [
                { id: 'b1.back', rect: { x: 580, y: 565, w: 120, h: 100 }, target: 'cabinB1Hall', spawn: { x: 640, y: 200 }, label: '현관홀' },
                { id: 'b1.toRear', rect: { x: 960, y: 120, w: 100, h: 80 }, target: 'cabinB1Rear', spawn: { x: 640, y: 520 }, label: '숙소 · 작업장' }
            ],
            interactions: [
                { id: 'b1.watchHint', rect: { x: 200, y: 140, w: 140, h: 100 }, label: '벽난로 위의 회중시계', action: 'b2.watchHint', visibleWhen: 'atticClueSeen', hiddenWhen: 'triangleHintFound' },
                { id: 'wood.tri', rect: { x: 200, y: 250, w: 140, h: 90 }, label: '벽과 선반 사이의 나무판', action: 'woodcut.triangle', visibleWhen: 'triangleHintFound' },
                { id: 'store.mannequin', rect: { x: 460, y: 150, w: 110, h: 130 }, label: '꺾인 낡은 마네킹', action: 'store.mannequin', hiddenWhen: 'storeMannequinSeen' },
                { id: 'store.barrels', rect: { x: 640, y: 300, w: 150, h: 120 }, label: '곰팡이 핀 오크통', action: 'store.barrels', hiddenWhen: 'storeBarrelsSeen' },
                { id: 'store.tools', rect: { x: 660, y: 430, w: 150, h: 90 }, label: '벽에 걸린 톱과 도끼', action: 'store.tools', hiddenWhen: 'storeToolsSeen' },
                { id: 'rear.mildewHint', rect: { x: 470, y: 300, w: 120, h: 110 }, label: '곰팡내가 유독 진한 구석', action: 'rear.mildewHint', visibleWhen: 'atticClueSeen', hiddenWhen: 'circleHintFound' },
                { id: 'wood.circle', rect: { x: 470, y: 430, w: 140, h: 100 }, label: '마지막 오크통 아래 핏자국', action: 'woodcut.circle', visibleWhen: 'circleHintFound' },
                { id: 'wood.cross', rect: { x: 900, y: 410, w: 120, h: 100 }, label: '목 잃은 여신상', action: 'woodcut.cross', visibleWhen: 'crossHintFound' },
                { id: 'b1.diary', rect: { x: 180, y: 370, w: 100, h: 80 }, label: '책상 위 낡은 일기', action: 'cabinB1.diary', visibleWhen: 'atticClueSeen' },
                { id: 'wing.waxHint', rect: { x: 880, y: 520, w: 180, h: 45 }, label: '두껍게 굳은 촛농', action: 'wing.waxHint', visibleWhen: 'atticClueSeen', hiddenWhen: 'crossHintFound' },
                { id: 'wing.clockDecoy', rect: { x: 250, y: 460, w: 130, h: 90 }, label: '아직 가는 회중시계', action: 'wing.clockDecoy', visibleWhen: 'atticClueSeen', hiddenWhen: 'wingClockDecoySeen' },
                { id: 'wing.bagDecoy', rect: { x: 600, y: 150, w: 160, h: 120 }, label: '말끔한 짐 꾸러미', action: 'wing.bagDecoy', visibleWhen: 'atticClueSeen', hiddenWhen: 'wingBagDecoySeen' },
                { id: 'wing.statueDecoy', rect: { x: 850, y: 230, w: 140, h: 140 }, label: '팔 없는 성인상', action: 'wing.statueDecoy', visibleWhen: 'atticClueSeen', hiddenWhen: 'wingStatueDecoySeen' }
            ],
            decorations: [{ rect: { x: 210, y: 155, w: 165, h: 200 }, fallback: '#46382e' }, { rect: { x: 500, y: 300, w: 220, h: 190 }, fallback: '#332b25' }, { rect: { x: 880, y: 330, w: 170, h: 200 }, fallback: '#3c3936' }]
        }),
        cabinB1Rear: area({
            id: 'cabinB1Rear', title: '북부 벌목장 관리동 · 후관', subtitle: '1F 벌목꾼 숙소 · 작업장', backgroundAssetId: 'bg.cabinB1Rear', spawn: { x: 640, y: 520 }, ambience: 'cabin',
            walls: [...borderWalls(), { x: 140, y: 45, w: 1000, h: 28 }, { x: 140, y: 45, w: 28, h: 555 }, { x: 1112, y: 45, w: 28, h: 555 }, { x: 140, y: 575, w: 400, h: 25 }, { x: 740, y: 575, w: 400, h: 25 }, { x: 500, y: 65, w: 28, h: 260 }, { x: 690, y: 65, w: 28, h: 260 }],
            portals: [
                { id: 'rear.back', rect: { x: 575, y: 560, w: 130, h: 100 }, target: 'cabinB1', spawn: { x: 930, y: 220 }, label: '서재 · 창고 · 기도실' },
                { id: 'rear.toB2', rect: { x: 1000, y: 90, w: 105, h: 100 }, target: 'cabinB2', spawn: { x: 260, y: 520 }, label: '2층 계단' },
                { id: 'rear.toCellar', rect: { x: 1100, y: 330, w: 100, h: 130 }, target: 'cabinB1Cellar', spawn: { x: 640, y: 190 }, label: '지하 저장고' }
            ],
            interactions: [
                { id: 'rear.bunk', rect: { x: 175, y: 190, w: 190, h: 230 }, label: '정리된 침상', action: 'rear.bunk', hiddenWhen: 'rearBunkSeen' },
                { id: 'rear.workbench', rect: { x: 760, y: 250, w: 230, h: 180 }, label: '틀톱 정리대', action: 'rear.workbench', hiddenWhen: 'rearWorkbenchSeen' },
                { id: 'rear.satchel', rect: { x: 175, y: 75, w: 180, h: 100 }, label: '여행 가방', action: 'rear.satchel', visibleWhen: 'atticClueSeen', hiddenWhen: 'rearSatchelDecoySeen' }
            ],
            decorations: [{ rect: { x: 175, y: 190, w: 190, h: 230 }, fallback: '#40332c' }, { rect: { x: 760, y: 250, w: 230, h: 180 }, fallback: '#463627' }]
        }),
        cabinB1Cellar: area({
            id: 'cabinB1Cellar', title: '북부 벌목장 관리동 · 지하 저장고', subtitle: '소금 상자 · 젖은 돌벽', backgroundAssetId: 'bg.cabinB1Cellar', spawn: { x: 640, y: 190 }, ambience: 'attic',
            walls: [...borderWalls(), { x: 105, y: 25, w: 1070, h: 28 }, { x: 105, y: 25, w: 28, h: 620 }, { x: 1147, y: 25, w: 28, h: 620 }, { x: 105, y: 620, w: 1070, h: 25 }],
            portals: [{ id: 'cellar.back', rect: { x: 570, y: 45, w: 140, h: 105 }, target: 'cabinB1Rear', spawn: { x: 1050, y: 390 }, label: '후관으로 올라가기' }],
            interactions: [
                { id: 'cellar.crates', rect: { x: 145, y: 170, w: 250, h: 360 }, label: '소금에 절인 식량', action: 'cellar.crates', hiddenWhen: 'cellarCratesSeen' },
                { id: 'cellar.marks', rect: { x: 1000, y: 150, w: 120, h: 300 }, label: '벽의 손톱자국', action: 'cellar.marks', hiddenWhen: 'cellarMarksSeen' }
            ],
            decorations: [{ rect: { x: 145, y: 170, w: 250, h: 360 }, fallback: '#302b24' }, { rect: { x: 1000, y: 150, w: 120, h: 300 }, fallback: '#514338' }]
        }),
        cabinB2: area({
            id: 'cabinB2', title: '둘째 오두막 · 2F', subtitle: '천장의 흔적과 접이식 사다리', backgroundAssetId: 'bg.cabinB2', spawn: { x: 260, y: 520 }, ambience: 'cabin',
            walls: [...borderWalls(), { x: 140, y: 100, w: 1000, h: 30 }, { x: 140, y: 100, w: 30, h: 520 }, { x: 1110, y: 100, w: 30, h: 520 }, { x: 140, y: 590, w: 1000, h: 30 }, { x: 500, y: 250, w: 300, h: 38 }],
            portals: [
                { id: 'b2.down', rect: { x: 150, y: 530, w: 90, h: 70 }, target: 'cabinB1Rear', spawn: { x: 980, y: 240 }, label: '1층 후관' },
                { id: 'b2.attic', rect: { x: 900, y: 130, w: 130, h: 80 }, target: 'attic', spawn: { x: 640, y: 500 }, label: '다락', requireFlag: 'atticOpened', denyMessage: '천장문은 너무 높다. 내려올 장치가 있어야 한다.' }
            ],
            interactions: [
                { id: 'b2.strap', rect: { x: 820, y: 170, w: 100, h: 110 }, label: '핏자국 끝 가죽 고리', action: 'cabinB.strap' },
                { id: 'b2.clockDecoy', rect: { x: 390, y: 150, w: 100, h: 95 }, label: '깨진 회중시계', action: 'b2.clockDecoy', visibleWhen: 'atticClueSeen', hiddenWhen: 'b2ClockDecoySeen' }
            ],
            decorations: [{ rect: { x: 360, y: 350, w: 200, h: 100 }, fallback: '#45372f' }, { rect: { x: 760, y: 340, w: 180, h: 120 }, fallback: '#342b27' }]
        }),
        attic: area({
            id: 'attic', title: '둘째 오두막 · 다락', subtitle: '△ ○ ✠ · 촛대 · 거울 · 빈 받침대', backgroundAssetId: 'bg.attic', spawn: { x: 640, y: 500 }, ambience: 'attic',
            walls: [...borderWalls(), { x: 160, y: 110, w: 960, h: 30 }, { x: 160, y: 110, w: 30, h: 490 }, { x: 1090, y: 110, w: 30, h: 490 }, { x: 160, y: 570, w: 400, h: 30 }, { x: 720, y: 570, w: 400, h: 30 }],
            portals: [{ id: 'attic.down', rect: { x: 585, y: 555, w: 110, h: 85 }, target: 'cabinB2', spawn: { x: 950, y: 250 }, label: '2층으로 내려가기' }],
            interactions: [
                { id: 'attic.clue', rect: { x: 300, y: 200, w: 150, h: 100 }, label: '벽의 문양과 새겨진 문장', action: 'attic.clue' },
                { id: 'attic.puzzle', rect: { x: 555, y: 240, w: 170, h: 120 }, label: '그림자 봉인 장치', action: 'attic.puzzle' },
                { id: 'attic.mechanism', rect: { x: 555, y: 400, w: 170, h: 90 }, label: '받침대 테두리 살피기', action: 'attic.mechanism' },
                { id: 'attic.window', rect: { x: 900, y: 180, w: 120, h: 130 }, label: '창밖 확인', action: 'attic.window', visibleWhen: 'puzzleSolved' }
            ], decorations: [{ rect: { x: 540, y: 225, w: 200, h: 150 }, fallback: '#605143' }, { rect: { x: 895, y: 170, w: 135, h: 150 }, fallback: '#243333' }]
        }),
        ending: area({
            id: 'ending', title: 'CHAPTER 1 COMPLETE', subtitle: 'Ashvale Village', backgroundAssetId: 'bg.ending', spawn: { x: 640, y: 360 }, ambience: 'silence', walls: [], portals: [], interactions: [], decorations: []
        })
    }
};
