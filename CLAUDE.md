# GRAIL — Chapter 1 HTML5 Prototype

호러 어드벤처 GRAIL의 **Chapter 1 (GR-1, Ashvale Forest)** 을 2D top-down Canvas로 구현한 프로토타입입니다.
레벨 설계의 정본은 `f:\AI\develop\casy\used\Grail_Chapter_Level_Design_v2_latest.docx` (LDD v2.0 Revised, 2026-08-05) 이며,
이 리포지토리는 그중 **GR-1(3장)** 을 웹 브라우저에서 플레이 가능한 형태로 옮긴 것입니다.

원본 게임은 1인칭 3D를 전제로 설계되었지만, 이 프로토타입은 **2D top-down 단순화 구현**입니다.
코드를 수정하거나 새 기능을 추가하기 전에 아래 "설계 문서 vs 구현" 섹션에서 의도적 차이점을 먼저 확인하세요.

## 실행 / 빌드

```bash
npm install
npm run check   # tsc --noEmit
npm run build   # tsc -p tsconfig.json → dist/
npm run dev     # server.mjs (Node 기본 http 모듈, 외부 의존성 없음) → http://localhost:4173
node tests/smoke.mjs   # build 이후 실행, world 무결성 + CH1 진행 플래그 순서 검증
```

TypeScript strict, ESM(`type: module`). 빌드 산출물(`dist/`)이 저장소에 커밋되어 있으므로,
`src/*.ts`를 고치면 반드시 `npm run build`까지 실행해 `dist/`를 동기화해야 브라우저/스모크 테스트에 반영됩니다.

## 아키텍처 (레이어드, Ports & Adapters)

```
Presentation  (GameController, ModalView)
     │
     ▼
Infrastructure ──▶ Application ──▶ Domain
     ▲                 │
     └──── Ports(interface) ────┘
```

- `domain/` — 순수 게임 규칙/모델 (Chapter1 진행 플래그, Player, Hollow, Geometry, World 정의). Canvas·DOM·LocalStorage를 모른다.
- `application/` — 유스케이스: `Chapter1FlowService`(상호작용 분기), `MovementService`(이동/충돌), `ShadowPuzzleService`(그림자 봉인 퍼즐 판정), `SaveGameService`. 구체 구현이 아닌 `ports/Ports.ts`의 인터페이스(Renderer/Input/Save/Asset/Audio/Modal)만 사용.
- `infrastructure/` — 브라우저 구현체: `CanvasRenderer`, `BrowserInput`, `ManifestAssetProvider`, `LocalStorageSaveRepository`, `WebAudioPort`.
- `config/Chapter1World.ts` — CH1 맵 전체(Area/Wall/Portal/Interaction/Decoration)를 데이터로 정의. 새 구역/오브젝트를 추가할 때는 여기부터 본다.

향후 렌더러를 Phaser 등으로 교체하려면 `RendererPort` 구현체만 새로 만들면 되고,
맵을 Tiled로 옮기려면 `TiledWorldLoader`(Infrastructure) → `WorldDefinition`(Domain) 어댑터를 추가하는 방식을 권장(README 참고). Domain/Application은 건드리지 않는다.

## 에셋 교체 원칙

게임 로직은 파일 경로가 아니라 `public/assets/manifest.json`의 논리 ID(`bg.forest`, `enemy.hollow` 등)만 참조한다.
현재 모든 이미지는 SVG **placeholder**이며 실제 컨셉아트로 교체될 예정. 그림 파일을 바꿔도 `src/` 코드는 수정하지 않는 것이 원칙 — 경로 변경은 manifest.json에서만.

## 설계 문서 vs 구현 — GR-1 매핑

`Grail_Chapter_Level_Design_v2_latest.docx`의 "CHAPTER 1 · GR-1 (3장)"이 이 코드베이스의 정본 사양이다.
새 기능/버그 수정 시 이 문서의 비트 시트(3.1), Area 설정(3.2), 퍼즐 사양(3.3)을 우선 참고할 것.

### 1:1로 구현된 것

| 설계 문서 | 구현 위치 |
|---|---|
| 붕괴된 다리 → Ashvale 숲 → 첫 오두막 → 북쪽 관문 → 벌목로 → 둘째 오두막(1F/2F/다락) → 강제 추격 → 관문 개방 | `config/Chapter1World.ts` (Area: bridge, forest, cabinA, gate, loggingRoad, cabinB1, cabinB2, attic, chaseRoad, ending) |
| 진행 플래그 순서 (cabinVisited→gateChecked→routeKnown→atticOpened→atticClueSeen→puzzleSolved→chaseStarted→chapterComplete) | `domain/Chapter1.ts` `ProgressFlag`, 순서는 `tests/smoke.mjs`가 검증 |
| 다락 선행 확인 → 1F 서재/창고/기도실에서 △○✠ 목판화 수집 → 다락 복귀 후 그림자 봉인 | `Chapter1FlowService.interact()`의 `attic.clue` / `attic.mechanism` / `woodcut.*` / `cabinB1.diary` / `attic.puzzle` 분기 |
| 그림자 봉인 보상 = 녹슨 관문 열쇠 + △ 진실 조각(경고 쪽지 포함, 문서 0.1의 정합성 보정 반영) | `Chapter1FlowService.solvePuzzle()` → `rustedGateKey`, `truthTriangle` |
| 첫 오두막 재방문 시 관리 기록 노출(벌목로 랜드마크: 울타리→벼락 참나무→개울→수레길) | `cabinA.record` interaction, `visibleWhen:'gateChecked'` |
| 걷기/앉기/달리기 소음 반경 2m/5m/14m | `MovementService.noiseRadiusMeters` (문서 1.3의 "앉아 이동 2m·걷기 5m·달리기 14m"과 일치. 단, 문서의 "빠른 걷기 8m" 중간 단계는 구현에 없음 — 걷기/달리기 이진 선택) |
| 봉헌 촛대 수동 저장 | `SaveGameService` + `cabin.candle`/`cabin.parchment` interaction의 `autosave` |

### 의도적으로 단순화/변경된 것 (설계 문서와 다름 — 되돌리지 말 것)

- **시점**: 문서는 1인칭(카메라 1.58m, 캡슐 반경 0.32m)을 전제하지만, 이 프로토타입은 **2D top-down**. 좌표/속도 단위(px, `MovementService`의 88/146/238)는 문서의 m/s 값과 직접 대응하지 않는다.
- **조작**: 문서 1.2의 Space(장애물 넘기)/Tab(단서 확인)는 미구현. 대신 `` ` `` (충돌/소음 디버그 표시)가 추가되어 있음(README 참고).
- **체력/정신력/횃불**: 문서 1.2의 체력 3타, 정신력 100(감소 로직), 횃불 20분 시스템은 아직 구현되지 않음. 등잔(F키) ON/OFF와 시야 변화만 존재.
- **적**: 문서는 GR-1에 "늑대(연출)"와 "The Hollow 1체"를 배치하지만, 구현에는 늑대 연출이 없고 Hollow만 존재.
- **Hollow는 플레이어를 추격하지 않는다**: 문서에 반복적으로 등장하는 "강제 추격/붙잡힘" 문구와 달리, 실제 시나리오 의도는 Hollow가 게임플레이 장애물이 아니라 분위기 연출이라는 확인을 받아 되돌렸다. 다락 창문(`attic.window`) 상호작용은 `Chapter1FlowService`가 `sighting:true`를 반환하고, `GameController.triggerSighting()`이 Hollow를 창밖 인근(x:960,y:230)에 `SIGHTING_SECONDS(2.4초)` 동안만 표시한 뒤 사라지게 한다. 이동/추적 AI, 포탈 봉쇄, 붙잡힘 실패 상태는 없다 — `audio.pulse('hollow')`로 저음 사운드만 재생되고 플레이어는 그 즉시 자유롭게 관문까지 돌아갈 수 있다. 이전에 있던 `ChaseService`/`ChaseRules`(추격 이동·강제 경로·유예시간)는 삭제되었다.
- **그림자 봉인 퍼즐은 더 이상 blind-guess가 아니다**: 원 설계 문서는 1인칭 3D에서 거울/촛대가 실제로 회전하며 벽에 그림자가 투사되는 것을 전제하지만, 이 프로토타입에는 그런 3D 셰도우캐스팅이 없다. 이를 2D-native하게 재구현했다 — `ModalView.showShadowPuzzle()`은 손잡이(±15°)를 조작할 때마다 `ShadowPuzzleService.align()`(순수 함수, 실패 카운트에 영향 없음)을 즉시 재호출해 SVG 다이얼과 겹침 % / "차갑다~완전히 겹쳤다" 온도어 라벨을 실시간으로 갱신한다. "봉인 확인" 버튼은 `attempt()`를 호출하는 커밋 동작으로, 이미 실시간으로 정답 여부를 아는 상태에서 누르므로 더 이상 맹목적 추측이 아니다. 정답(거울 45°/촛대 30°)으로 가는 디제틱 단서는 다락의 새 상호작용 `attic.mechanism`("받침대 테두리 살피기")이 제공한다 — 받침대 눈금(15° 간격 13칸) 중 두 칸만 유난히 닳아 반들거린다는 환경 스토리텔링이며, `mechanismExamined` 플래그(`ProgressFlag`)가 true일 때만 다이얼 SVG에도 해당 눈금이 금색으로 강조 표시된다(`ShadowPuzzleModalOptions.hintAvailable`). 이 플래그를 조사하지 않아도 실시간 겹침 % 피드백만으로 풀이는 가능하지만, 조사하면 정확한 정답 각도를 바로 알 수 있다. 실패 시 이벤트(`candles-flicker` / 3의 배수 실패마다 `threat-approaches`)는 여전히 오디오 전용 분위기 연출이며(Hollow 이동/추격 없음), 5회 실패 시 힌트를 주던 기존 로직은 제거했다(힌트가 이제 상시 월드에 있으므로). 되돌리지 말 것 — 실시간 피드백 없는 순수 커밋-후-피드백 방식으로 되돌리면 Problem 1(맹목적 추측)이 재발한다.
- 이 항목들은 README의 "다음 확장 우선순위"에 명시된 대로 향후 순차 도입 대상이며, 현재 누락은 버그가 아니다.

### 아직 반영되지 않은 문서 항목 (확장 시 참고)

- 장애물 기반 시야(Line-of-Sight)
- 정신력 시스템, 애니메이션 State Machine
- 사운드 에셋 Manifest / spatial audio (`WebAudioPort`는 존재하나 문서 5.5 수준의 레이어링은 없음)
- GR-2(Ashvale Village)·GR-3(Blackwood Castle) 확장 — 문서 전체 범위 중 이 리포지토리는 GR-1까지만 구현. GR-2/GR-3 착수 시 `config/`에 새 World, `domain/`에 새 Progress 모델을 추가하는 동일 패턴을 따를 것.

## 코딩 규칙

- 이 리포지토리에 새 코드를 추가할 때 레이어 의존 방향(Presentation→Infrastructure→Application→Domain, Domain은 최하위)을 위반하지 말 것. Domain이 Canvas/DOM/LocalStorage를 import하면 안 된다.
- Area/Portal/Interaction을 추가할 때는 `tests/smoke.mjs`가 spawn-wall 충돌과 portal 재발동을 자동 검증하므로, 새 Area 추가 후 반드시 `npm run build && node tests/smoke.mjs` 실행.
- 진행 플래그를 추가/변경하면 `Chapter1Progress.objective()`의 우선순위 체인(위에서부터 역순 판정)도 함께 갱신해야 목표 텍스트가 어긋나지 않는다.
- **작업을 마치면 항상 `logs/08-work-log.md`에 작업 일지를 남긴다.** 날짜별 `## YYYY-MM-DD` 섹션(같은 날 여러 세션이면 그 아래 소제목)에 시간순으로 추가 — 무엇을/왜 바꿨는지, 주요 변경 파일, 검증 결과(빌드/테스트/스크린샷 여부)를 간단히 적는다. 계획 검토 없이 코드를 먼저 구현해버리는 등 사용자 의도와 어긋났던 사고도 "주의" 섹션으로 남겨 재발을 막는다. `logs/00-06`은 2026-08-15 1회성 감사 문서, `07`은 에셋 제작 지시서로 별도 성격이니 건드리지 말 것 — 작업 일지는 `08` 하나로 계속 이어간다.
