const borderWalls = () => [
    { x: 0, y: 0, w: 1280, h: 18 }, { x: 0, y: 702, w: 1280, h: 18 },
    { x: 0, y: 0, w: 18, h: 720 }, { x: 1262, y: 0, w: 18, h: 720 }
];
const area = (value) => value;
export const chapter1World = {
    areas: {
        bridge: area({
            id: 'bridge', title: '붕괴된 다리', subtitle: 'Blackmere Wood · 귀환로 상실', backgroundAssetId: 'bg.bridge', spawn: { x: 180, y: 520 }, ambience: 'rain',
            walls: [...borderWalls(), { x: 0, y: 620, w: 1280, h: 82 }, { x: 500, y: 0, w: 110, h: 280 }],
            portals: [{ id: 'bridge.toForest', rect: { x: 1160, y: 70, w: 90, h: 170 }, target: 'forest', spawn: { x: 120, y: 590 }, label: '숲길로 이동' }],
            interactions: [{ id: 'bridge.look', rect: { x: 210, y: 470, w: 180, h: 100 }, label: '붕괴된 다리 확인', action: 'bridge.lookBack' }],
            decorations: [
                { rect: { x: 80, y: 580, w: 520, h: 38 }, fallback: '#28302f' }, { rect: { x: 560, y: 330, w: 300, h: 22 }, fallback: '#39413f' },
                { rect: { x: 870, y: 130, w: 260, h: 28 }, fallback: '#26332e' }
            ]
        }),
        forest: area({
            id: 'forest', title: 'Ashvale Forest', subtitle: '첫 오두막 · 북쪽 관문 · 옛 벌목로', backgroundAssetId: 'bg.forest', spawn: { x: 120, y: 590 }, ambience: 'rain',
            walls: [...borderWalls(), { x: 300, y: 160, w: 80, h: 300 }, { x: 610, y: 320, w: 90, h: 300 }, { x: 900, y: 80, w: 70, h: 300 }],
            portals: [
                { id: 'forest.toBridge', rect: { x: 25, y: 560, w: 70, h: 120 }, target: 'bridge', spawn: { x: 1120, y: 160 }, label: '붕괴된 다리' },
                { id: 'forest.toCabinA', rect: { x: 380, y: 40, w: 180, h: 80 }, target: 'cabinA', spawn: { x: 640, y: 520 }, label: '첫 오두막' },
                { id: 'forest.toGate', rect: { x: 1110, y: 40, w: 120, h: 90 }, target: 'gate', spawn: { x: 180, y: 560 }, label: '북쪽 관문' },
                { id: 'forest.toLogging', rect: { x: 1110, y: 570, w: 120, h: 100 }, target: 'loggingRoad', spawn: { x: 140, y: 360 }, label: '옛 벌목로', requireFlag: 'routeKnown', denyMessage: '길이 여러 갈래로 얽혀 있다. 관리 기록이 없다면 방향을 잃을 것 같다.' }
            ],
            interactions: [],
            decorations: [
                { rect: { x: 95, y: 90, w: 120, h: 130 }, fallback: '#1d2823' }, { rect: { x: 430, y: 510, w: 120, h: 120 }, fallback: '#18231f' }, { rect: { x: 1000, y: 410, w: 110, h: 140 }, fallback: '#1c2924' }
            ]
        }),
        cabinA: area({
            id: 'cabinA', title: '첫 오두막', subtitle: '첫 방문은 안전하다. 돌아오면 무언가 달라진다.', backgroundAssetId: 'bg.cabinA', spawn: { x: 640, y: 520 }, ambience: 'cabin',
            walls: [...borderWalls(), { x: 170, y: 130, w: 940, h: 35 }, { x: 170, y: 130, w: 35, h: 470 }, { x: 1075, y: 130, w: 35, h: 470 }, { x: 170, y: 565, w: 370, h: 35 }, { x: 740, y: 565, w: 370, h: 35 }, { x: 530, y: 260, w: 220, h: 38 }],
            portals: [{ id: 'cabinA.exit', rect: { x: 570, y: 560, w: 140, h: 100 }, target: 'forest', spawn: { x: 470, y: 145 }, label: '밖으로 나가기' }],
            interactions: [
                { id: 'cabin.parchment', rect: { x: 270, y: 220, w: 100, h: 80 }, label: '양피지 조사', action: 'cabin.parchment', hiddenWhen: 'cabinVisited' },
                { id: 'cabin.candle', rect: { x: 910, y: 210, w: 80, h: 80 }, label: '봉헌 촛대', action: 'cabin.candle' },
                { id: 'cabin.record', rect: { x: 810, y: 400, w: 160, h: 80 }, label: '관리 기록 읽기', action: 'cabin.record', visibleWhen: 'gateChecked' }
            ],
            decorations: [{ rect: { x: 250, y: 380, w: 180, h: 100 }, fallback: '#4a392c' }, { rect: { x: 830, y: 380, w: 170, h: 110 }, fallback: '#3a3027' }]
        }),
        gate: area({
            id: 'gate', title: '북쪽 관문', subtitle: 'Ashvale로 이어지는 녹슨 철문', backgroundAssetId: 'bg.gate', spawn: { x: 180, y: 560 }, ambience: 'rain',
            walls: [...borderWalls(), { x: 780, y: 90, w: 330, h: 450 }],
            portals: [{ id: 'gate.back', rect: { x: 25, y: 540, w: 80, h: 130 }, target: 'forest', spawn: { x: 1060, y: 120 }, label: '숲으로 돌아가기' }],
            interactions: [{ id: 'gate.lock', rect: { x: 720, y: 270, w: 110, h: 120 }, label: '관문 자물쇠', action: 'gate.inspect' }],
            decorations: [{ rect: { x: 805, y: 105, w: 280, h: 420 }, fallback: '#383f3d' }]
        }),
        loggingRoad: area({
            id: 'loggingRoad', title: '옛 벌목로', subtitle: '울타리 → 벼락 참나무 → 얕은 개울 → 수레길', backgroundAssetId: 'bg.logging', spawn: { x: 100, y: 360 }, ambience: 'logging',
            walls: [...borderWalls(), { x: 250, y: 0, w: 70, h: 250 }, { x: 470, y: 400, w: 80, h: 320 }, { x: 760, y: 0, w: 70, h: 290 }, { x: 980, y: 390, w: 80, h: 330 }],
            portals: [
                { id: 'logging.back', rect: { x: 20, y: 300, w: 70, h: 120 }, target: 'forest', spawn: { x: 1080, y: 610 }, label: '첫 오두막 방향' },
                { id: 'logging.toB1', rect: { x: 1170, y: 290, w: 80, h: 140 }, target: 'cabinB1', spawn: { x: 640, y: 520 }, label: '둘째 오두막' }
            ], interactions: [], decorations: [
                { rect: { x: 350, y: 80, w: 120, h: 160 }, fallback: '#2b2118' }, { rect: { x: 610, y: 480, w: 180, h: 25 }, fallback: '#39514e' }, { rect: { x: 880, y: 120, w: 190, h: 50 }, fallback: '#403c32' }
            ]
        }),
        cabinB1: area({
            id: 'cabinB1', title: '둘째 오두막 · 1F', subtitle: '서재 · 창고 · 기도실', backgroundAssetId: 'bg.cabinB1', spawn: { x: 640, y: 520 }, ambience: 'cabin',
            walls: [...borderWalls(), { x: 150, y: 90, w: 980, h: 30 }, { x: 150, y: 90, w: 30, h: 510 }, { x: 1100, y: 90, w: 30, h: 510 }, { x: 150, y: 570, w: 400, h: 30 }, { x: 730, y: 570, w: 400, h: 30 }, { x: 420, y: 90, w: 28, h: 360 }, { x: 820, y: 240, w: 28, h: 360 }],
            portals: [
                { id: 'b1.exit', rect: { x: 580, y: 565, w: 120, h: 100 }, target: 'loggingRoad', spawn: { x: 1120, y: 360 }, label: '벌목로' },
                { id: 'b1.toB2', rect: { x: 960, y: 120, w: 100, h: 80 }, target: 'cabinB2', spawn: { x: 260, y: 520 }, label: '2층 계단' }
            ],
            interactions: [
                { id: 'wood.tri', rect: { x: 235, y: 190, w: 120, h: 80 }, label: '멈춘 회중시계', action: 'woodcut.triangle', visibleWhen: 'atticClueSeen' },
                { id: 'wood.circle', rect: { x: 520, y: 400, w: 140, h: 85 }, label: '썩은 짐', action: 'woodcut.circle', visibleWhen: 'atticClueSeen' },
                { id: 'wood.cross', rect: { x: 900, y: 410, w: 120, h: 100 }, label: '목 잃은 여신상', action: 'woodcut.cross', visibleWhen: 'atticClueSeen' }
            ],
            decorations: [{ rect: { x: 210, y: 155, w: 165, h: 200 }, fallback: '#46382e' }, { rect: { x: 500, y: 300, w: 220, h: 190 }, fallback: '#332b25' }, { rect: { x: 880, y: 330, w: 170, h: 200 }, fallback: '#3c3936' }]
        }),
        cabinB2: area({
            id: 'cabinB2', title: '둘째 오두막 · 2F', subtitle: '천장의 흔적과 접이식 사다리', backgroundAssetId: 'bg.cabinB2', spawn: { x: 260, y: 520 }, ambience: 'cabin',
            walls: [...borderWalls(), { x: 140, y: 100, w: 1000, h: 30 }, { x: 140, y: 100, w: 30, h: 520 }, { x: 1110, y: 100, w: 30, h: 520 }, { x: 140, y: 590, w: 1000, h: 30 }, { x: 500, y: 250, w: 300, h: 38 }],
            portals: [
                { id: 'b2.down', rect: { x: 150, y: 530, w: 90, h: 70 }, target: 'cabinB1', spawn: { x: 990, y: 260 }, label: '1층' },
                { id: 'b2.attic', rect: { x: 900, y: 130, w: 130, h: 80 }, target: 'attic', spawn: { x: 640, y: 500 }, label: '다락', requireFlag: 'atticOpened', denyMessage: '천장문은 너무 높다. 내려올 장치가 있어야 한다.' }
            ],
            interactions: [{ id: 'b2.strap', rect: { x: 820, y: 170, w: 100, h: 110 }, label: '핏자국 끝 가죽 고리', action: 'cabinB.strap' }],
            decorations: [{ rect: { x: 360, y: 350, w: 200, h: 100 }, fallback: '#45372f' }, { rect: { x: 760, y: 340, w: 180, h: 120 }, fallback: '#342b27' }]
        }),
        attic: area({
            id: 'attic', title: '둘째 오두막 · 다락', subtitle: '△ ○ ✠ · 촛대 · 거울 · 빈 받침대', backgroundAssetId: 'bg.attic', spawn: { x: 640, y: 500 }, ambience: 'attic',
            walls: [...borderWalls(), { x: 160, y: 110, w: 960, h: 30 }, { x: 160, y: 110, w: 30, h: 490 }, { x: 1090, y: 110, w: 30, h: 490 }, { x: 160, y: 570, w: 400, h: 30 }, { x: 720, y: 570, w: 400, h: 30 }],
            portals: [{ id: 'attic.down', rect: { x: 585, y: 555, w: 110, h: 85 }, target: 'cabinB2', spawn: { x: 950, y: 250 }, label: '2층으로 내려가기' }],
            interactions: [
                { id: 'attic.clue', rect: { x: 300, y: 200, w: 150, h: 100 }, label: '벽의 문양과 쪽지', action: 'attic.clue' },
                { id: 'attic.puzzle', rect: { x: 555, y: 240, w: 170, h: 120 }, label: '그림자 봉인 장치', action: 'attic.puzzle' },
                { id: 'attic.window', rect: { x: 900, y: 180, w: 120, h: 130 }, label: '창밖 확인', action: 'attic.window', visibleWhen: 'puzzleSolved' }
            ], decorations: [{ rect: { x: 540, y: 225, w: 200, h: 150 }, fallback: '#605143' }, { rect: { x: 895, y: 170, w: 135, h: 150 }, fallback: '#243333' }]
        }),
        chaseRoad: area({
            id: 'chaseRoad', title: '강제 추격', subtitle: '다락 → 북쪽 관문', backgroundAssetId: 'bg.chase', spawn: { x: 100, y: 360 }, ambience: 'chase',
            walls: [...borderWalls(), { x: 280, y: 0, w: 85, h: 270 }, { x: 280, y: 470, w: 85, h: 250 }, { x: 570, y: 220, w: 85, h: 500 }, { x: 860, y: 0, w: 85, h: 470 }],
            portals: [],
            interactions: [{ id: 'chase.gate', rect: { x: 1160, y: 280, w: 80, h: 160 }, label: '북쪽 관문 열기', action: 'gate.inspect' }],
            decorations: [{ rect: { x: 1170, y: 250, w: 60, h: 220 }, fallback: '#48504e' }]
        }),
        ending: area({
            id: 'ending', title: 'CHAPTER 1 COMPLETE', subtitle: 'Ashvale Village', backgroundAssetId: 'bg.ending', spawn: { x: 640, y: 360 }, ambience: 'silence', walls: [], portals: [], interactions: [], decorations: []
        })
    }
};
