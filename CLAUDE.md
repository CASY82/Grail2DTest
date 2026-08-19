# GRAIL — Chapter 1–3 HTML5 Prototype

호러 어드벤처 GRAIL의 **GR-1(Ashvale Forest) · GR-2(Ashvale Village) · GR-3(Blackwood Castle)** 3개 챕터를 2D top-down Canvas로 구현한 프로토타입입니다.
시작 화면(및 챕터 완료 후)에서 챕터 1~3 중 하나를 선택해 플레이합니다.

원본 게임은 1인칭 3D를 전제로 설계되었지만, 이 프로토타입은 **2D top-down 단순화 구현**입니다.
코드를 수정하거나 새 기능을 추가하기 전에 아래 "설계 문서 vs 구현" 섹션에서 의도적 차이점을 먼저 확인하세요.

## 정본 우선순위 (2026-08-16 확정 · 2026-08-20 갱신 — 새 작업 시작 전 반드시 확인)

이 프로젝트가 참조하는 문서는 다수이며, 서로 다른 시점에 서로 다른 목적으로 작성되어 **부분적으로 충돌한다.** 충돌 시 아래 순서를 따른다.

1. **`f:\AI\develop\casy\used\Grail 게임 시나리오.md`(마스터 시나리오)** — **최우선 정본.** 인물(루카스 베넷, 조앤, 레지널드 블랙우드, 엘리노어 블랙우드)·사건 순서·대사·오브젝트의 최종 근거. 다른 모든 문서·기존 구현과 충돌하면 이것이 이긴다.
2. **`f:\AI\develop\casy\used\Grail_Chapter_Level_Design_v2_latest.docx`(LDD v2.0 Revised, 2026-08-05)** — 마스터 시나리오가 다루지 않는 게임 메커닉 수치(소음 반경, 체력/정신력, 체크포인트 규칙 등)의 근거.
3. **`logs/12-chapter2-3-level-design-2026-08-16.md`(GR-2/GR-3 실행 설계)** — 위 두 문서를 이 코드베이스 문법(`AreaDefinition`/`InteractionDefinition` 등)으로 옮긴 실행 계획. 위 두 정본과 충돌하는 지점이 발견되면 이 문서·이 문서가 낳은 구현 쪽을 고친다.

**`logs/13-master-scenario-canon-audit-2026-08-16.md`**는 2026-08-16 감사 문서다. **이 문서의 판정을 그대로 신뢰하지 말 것** — 2026-08-19 챕터별 전수 재감사에서 `logs/13`이 "✅ 일치"로 통과시킨 항목 중 **8건이 오판정**으로 확인됐다. 공통 원인은 *인터랙션 ID의 존재만 확인하고 실제 문자열을 원문과 대조하지 않은 것*이다(예: `dining.table`/`parlor.piano`/`lab.tubes`는 `case` 자체가 없어 필러로 폴백하고 있었고, GR-2 광장 4방향은 좌표상 여관↔시청이 상하 반전이었으며, GR-1 경고 쪽지 원문은 게임에 표시되지 않았다). 시나리오 관련 작업 시에는 `logs/13` 대신 **마스터 시나리오 원문과 코드를 직접 대조**하고, `logs/13`은 이력 참고용으로만 볼 것.

`logs/13`이 지목했던 핵심 불일치는 **2026-08-20 세션에서 전부 코드에 반영됐다**(상세는 `logs/08-work-log.md`의 2026-08-20 항목):
- GR-3 `ritual.witness`의 "문이 열렸군요"는 **엘리노어(를 통해 말하는 무언가)**의 대사로 정정됨. 레지널드의 「엘리노어.」/「당신이 돌아온 거야.」도 별도 비트로 복원.
- GR-3 `study.reginald`는 원문의 「네가 왔구나.」/「상자를 가지고 왔느냐.」/「두려워하지 마라. 나는 너에게 감사하고 있다.」 3단으로 교체됐고, 「도망칠 필요는 없다. 너는 이미 여기에 왔다.」는 `corridorDescent`의 `descent.voice`로 분리됨.
- GR-2 `house.diary`의 "VIRAX는 병이 아니라 문이었다"는 삭제. **VIRAX는 시장이 되살아난 자들에게 붙인 호칭일 뿐**이라는 원문(844~848행)으로 복원됐고, 앨리의 열쇠 은닉 단서(853~854행)도 함께 들어가 여관행 단서가 이중화됐다.
- GR-1 다락 서랍 보상의 `truthTriangle`은 **유지**(GR-2/GR-3 게이팅 전체가 이 위에 서 있다). 대신 원문에만 있던 경고 쪽지 4행이 '접힌 종이' 모달로 추가되고 `warningNote` 아이템이 생겼다.
- **"1358년" 전제는 폐기됐다.** 마스터 시나리오 621~622행이 "벽난로 위에서 멈춰 버린 **회중시계**"를 명시하므로 `logs/10-11`의 회중시계→모래시계 치환을 원복했다. `tests/p0-systems.test.mjs`의 해당 테스트도 방향을 뒤집어(모래시계 재도입 시 실패) 다시 갱신했다. **되돌리지 말 것.**

## 실행 / 빌드

```bash
npm install
npm run check   # tsc --noEmit
npm run build   # tsc -p tsconfig.json → dist/
npm run dev     # server.mjs (Node 기본 http 모듈, 외부 의존성 없음) → http://localhost:4173
node tests/smoke.mjs   # build 이후 실행, CH1-3 world 무결성 + 인터랙션 커버리지 + 엔딩 복원 + CH1 진행 순서
node --test tests/p0-systems.test.mjs tests/chapter2-3.test.mjs   # 26 케이스
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

- `domain/` — 순수 게임 규칙/모델 (Chapter1/2/3 진행 플래그, Player, Hollow, Pursuer, Geometry, World 정의). Canvas·DOM·LocalStorage를 모른다.
- `application/` — 유스케이스: `Chapter1FlowService`/`Chapter2FlowService`/`Chapter3FlowService`(상호작용 분기), `MovementService`(플레이어 이동/충돌), `PursuitService`(GR-2/GR-3 추격자 이동/포획 판정), `ShadowPuzzleService`/`SequencePuzzleService`(퍼즐 판정), `RitualSequenceService`(GR-3 의식실 조작권 감쇠), `SaveGameService`. 구체 구현이 아닌 `ports/Ports.ts`의 인터페이스(Renderer/Input/Save/Asset/Audio/Modal)만 사용.
- `infrastructure/` — 브라우저 구현체: `CanvasRenderer`, `BrowserInput`, `ManifestAssetProvider`, `LocalStorageSaveRepository`, `WebAudioPort`.
- `config/Chapter1World.ts`/`Chapter2World.ts`/`Chapter3World.ts` — 챕터별 맵 전체(Area/Wall/Portal/Interaction/Decoration/Pursuit)를 데이터로 정의. `WorldFactory.ts`의 `room()`/`portal()`/`interaction()` 헬퍼를 공유한다. 새 구역/오브젝트를 추가할 때는 여기부터 본다.

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
| 붕괴된 다리 → Ashvale 숲 → 첫 오두막 → 북쪽 관문 → 벌목로 → 둘째 오두막(1F/2F/다락) → 관문 개방 | `config/Chapter1World.ts` (Area: bridge, forest, cabinA, gate, loggingRoad, cabinB1Hall, cabinB1Office, cabinB1, cabinB1Rear, cabinB1Cellar, cabinB2, attic, ending). `chaseRoad`는 진입 포탈이 0개인 데드 데이터라 2026-08-20에 제거했다 — `manifest.json`의 `bg.chase`는 미사용으로 남아 있다. |
| 진행 플래그 순서 (cabinVisited→mapFound→gateChecked→routeKnown→atticOpened→atticClueSeen→puzzleSolved→chaseStarted→chapterComplete) | `domain/Chapter1.ts` `ProgressFlag`. `chaseStarted`(다락 창밖 목격)는 2026-08-20부터 `gate.inspect` 완료의 **필수 조건**이다 — 이전에는 건너뛸 수 있었다 |
| 다락 선행 확인 → 1F 서재/창고/기도실에서 △○✠ 목판화 수집 → 다락 복귀 후 그림자 봉인 | `Chapter1FlowService.interact()`의 `attic.clue` / `attic.mechanism` / `woodcut.*` / `cabinB1.diary` / `attic.puzzle` 분기. **세 목판화와 각 힌트는 전부 `cabinB1`에 있다** — 원문 607·611행이 "아래층"을 두 번 못박고 `office.roster`도 "서재, 창고, 기도실"이라 안내하므로, 2026-08-20에 `cabinB2`/`cabinB1Rear`에 흩어져 있던 것을 회수했다. 다시 흩지 말 것 |
| 그림자 봉인 보상 = 녹슨 관문 열쇠 + △ 진실 조각(경고 쪽지 포함, 문서 0.1의 정합성 보정 반영) | `Chapter1FlowService.solvePuzzle()` → `rustedGateKey`, `truthTriangle` |
| 첫 오두막 재방문 시 관리 기록 노출(벌목로 랜드마크: 울타리→벼락 참나무→개울→수레길) | `cabinA.record` interaction, `visibleWhen:'gateChecked'` |
| 걷기/앉기/달리기 소음 반경 2m/5m/14m | `MovementService.noiseRadiusMeters` (문서 1.3의 "앉아 이동 2m·걷기 5m·달리기 14m"과 일치. 단, 문서의 "빠른 걷기 8m" 중간 단계는 구현에 없음 — 걷기/달리기 이진 선택) |
| 봉헌 촛대 수동 저장 | `SaveGameService` + `cabin.candle`/`cabin.parchment` interaction의 `autosave` |

### 의도적으로 단순화/변경된 것 (설계 문서와 다름 — 되돌리지 말 것)

- **시점**: 문서는 1인칭(카메라 1.58m, 캡슐 반경 0.32m)을 전제하지만, 이 프로토타입은 **2D top-down**. 좌표/속도 단위(px, `MovementService`의 88/146/238)는 문서의 m/s 값과 직접 대응하지 않는다.
- **조작**: 문서 1.2의 Space(장애물 넘기)/Tab(단서 확인)는 미구현. 대신 `` ` `` (충돌/소음 디버그 표시)가 추가되어 있음(README 참고).
- **체력/정신력/횃불**: 문서 1.2의 체력 3타, 정신력 100(감소 로직), 횃불 20분 시스템은 아직 구현되지 않음. 등잔(F키) ON/OFF와 시야 변화만 존재. **단 등잔은 2026-08-20부터 기본 OFF다** — 시나리오 216~218·354행이 "빛은 안전이 아니라 표적이 될 수도 있었다"를 두 번 강조하는데, 기본 ON + 무페널티는 이 트레이드오프를 순이익으로 역전시켰다. 소음/발각 계수에 `lanternOn`을 반영하는 것은 향후 과제.
- **적**: 문서는 GR-1에 "늑대(연출)"와 "The Hollow 1체"를 배치하지만, 구현에는 늑대 연출이 없고 Hollow만 존재.
- **GR-1의 Hollow는 플레이어를 추격하지 않는다 (GR-1 한정 — 이 결정을 GR-2/GR-3까지 확장하지 말 것)**: 문서에 반복적으로 등장하는 "강제 추격/붙잡힘" 문구와 달리, GR-1 한정으로는 Hollow가 게임플레이 장애물이 아니라 분위기 연출이라는 확인을 받아 되돌렸다. 다락 창문(`attic.window`) 상호작용은 `Chapter1FlowService`가 `sighting:true`를 반환하고, `GameController.triggerSighting()`이 Hollow를 창밖 인근(x:960,y:230)에 `SIGHTING_SECONDS(2.4초)` 동안만 표시한 뒤 사라지게 한다. 이동/추적 AI, 포탈 봉쇄, 붙잡힘 실패 상태는 없다 — `audio.pulse('hollow')`로 저음 사운드만 재생되고 플레이어는 그 즉시 자유롭게 관문까지 돌아갈 수 있다. 이전에 있던 `ChaseService`/`ChaseRules`(추격 이동·강제 경로·유예시간)는 삭제되었다. **2026-08-16 재확인**: 이 무추격 결정은 GR-1의 단일 Hollow 인스턴스에만 적용된다 — GR-2/GR-3는 아래 GR-2/GR-3 매핑 섹션의 `PursuitService` 실추격 시스템을 쓴다. `study.reginald`(GR-3 2층 집무실)처럼 여전히 "대면"만 하고 지나가는 지점은 `Hollow`/`triggerSighting()`을 그대로 재사용하지만, 이는 무추격 결정의 재확인이 아니라 그 지점 자체가 정지된 스침 연출이기 때문이다.
- **그림자 봉인 퍼즐은 더 이상 blind-guess가 아니다**: 원 설계 문서는 1인칭 3D에서 거울/촛대가 실제로 회전하며 벽에 그림자가 투사되는 것을 전제하지만, 이 프로토타입에는 그런 3D 셰도우캐스팅이 없다. 이를 2D-native하게 재구현했다 — `ModalView.showShadowPuzzle()`은 손잡이(±15°)를 조작할 때마다 `ShadowPuzzleService.align()`(순수 함수, 실패 카운트에 영향 없음)을 즉시 재호출해 SVG 다이얼과 겹침 % / "차갑다~완전히 겹쳤다" 온도어 라벨을 실시간으로 갱신한다. "봉인 확인" 버튼은 `attempt()`를 호출하는 커밋 동작으로, 이미 실시간으로 정답 여부를 아는 상태에서 누르므로 더 이상 맹목적 추측이 아니다. 정답(거울 45°/촛대 30°)으로 가는 디제틱 단서는 다락의 새 상호작용 `attic.mechanism`("받침대 테두리 살피기")이 제공한다 — 받침대 눈금(15° 간격 13칸) 중 두 칸만 유난히 닳아 반들거린다는 환경 스토리텔링이며, `mechanismExamined` 플래그(`ProgressFlag`)가 true일 때만 다이얼 SVG에도 해당 눈금이 금색으로 강조 표시된다(`ShadowPuzzleModalOptions.hintAvailable`). 이 플래그를 조사하지 않아도 실시간 겹침 % 피드백만으로 풀이는 가능하지만, 조사하면 정확한 정답 각도를 바로 알 수 있다. 실패 시 이벤트(`candles-flicker` / 3의 배수 실패마다 `threat-approaches`)는 여전히 오디오 전용 분위기 연출이며(Hollow 이동/추격 없음), 5회 실패 시 힌트를 주던 기존 로직은 제거했다(힌트가 이제 상시 월드에 있으므로). 되돌리지 말 것 — 실시간 피드백 없는 순수 커밋-후-피드백 방식으로 되돌리면 Problem 1(맹목적 추측)이 재발한다.
- 이 항목들은 README의 "다음 확장 우선순위"에 명시된 대로 향후 순차 도입 대상이며, 현재 누락은 버그가 아니다.

### 2026-08-20 마스터 시나리오 반영분 (되돌리지 말 것)

2026-08-19 QA 감사(결함 64건 — Blocker 1 · Critical 8 · Major 26 · Minor 29)를 코드에 반영한 세션의 결과다. 아래는 **마스터 시나리오 원문이 근거**이므로 "기존 구현이 이랬다"는 이유로 되돌리지 말 것.

- **서막 도입**: 챕터 1 시작 시에만 프롤로그 모달 3장(H.의 편지 / 조앤·20 노블 / 아내의 배웅→습격)이 조작 안내 앞에 나온다. 그 전까지 주인공 이름조차 게임 텍스트에 없었다.
- **옥색 돌 상자**: `ItemId`의 `jadeBox`. 세 챕터 모두 시작 시 기본 소지이며 소지품에 상시 표시되고, GR-3 `boxOpened` 이후 사라진다. 게임 전체의 MacGuffin인데 이전에는 GR-3의 한 문장에만 등장했다.
- **둘째 오두막 1층 5구역 확장은 의도적 유지**: 원문 549~551행은 "일층에는 모두 세 개의 방"이지만, `cabinB1Hall`/`cabinB1Office`/`cabinB1`/`cabinB1Rear`/`cabinB1Cellar` 확장은 되돌리는 비용이 커서 **유지하기로 결정**했다. 대신 목판화 3개만 원문의 3실(`cabinB1`)로 회수했다. 이 확장은 버그가 아니라 문서화된 차이다.
- **GR-2 여관 아크는 더 이상 선택 사항이 아니다**: `gate2.slot`이 세 진실·네 이름에 더해 **`ironGateKey` 소지를 검사**한다. 이전에는 장부→와인 퍼즐→철 열쇠→방화→탈출을 통째로 건너뛰고 챕터 2를 끝낼 수 있었고, `ironGateKey`는 어디서도 참조되지 않는 사문화된 아이템이었다.
- **GR-2 방화 순서**: `escape.lamp`는 `innCellar`(철 열쇠 획득 직후)에 있고 탈출 포탈 `wine.escape`는 `innFireStarted`를 요구한다. 원문 918~921행이 **방화 → 통풍창** 순서이며, 939~940행 "여관의 불길을 보고, 마을의 것들이 깨어난 것이다"라는 인과가 여기 걸려 있다. `sq.hall`도 `innFireStarted` 이후에만 열린다.
- **GR-2 광장 방위**: 원문 732행대로 북=성문·동=상점가·서=여관·남=시청. 이전에는 여관↔시청이 상하 반전이었다. `tests/chapter2-3.test.mjs`가 픽셀이 아니라 **방위 의미**로 단언한다.
- **GR-2 네 명패**: 라벨이 비문 기반(`명패 — 그녀가 처음 쓰러졌다` 등)이고 배치 순서가 정답과 다르게 섞여 있다. 이전에는 `1번째 명패`~`4번째 명패`라 단서 없이 좌→우로 눌러도 풀렸다. 섞인 순서를 정렬하지 말 것.
- **GR-3 클라이맥스 6비트**: `ritual.approach → reginald → kneel → pedestal → dial → witness`. 레지널드 재등장·Grail 유리병·받침대 안치·엘리노어 각성이 전부 여기 들어간다. 게이팅은 새 `ProgressFlag`가 아니라 `Chapter3Progress.ritualBeat`(런타임 상태)로 하며, 세이브 복원 시 `boxOpened`/`ritualEntered`로 하한을 되살려 중간 로드에서도 막히지 않는다.
- **엔딩은 파국이다**: `ritual.dial`이 원문 1226~1252(변이·"그깟 20 노블이…"), `ritual.witness`가 1254~1279(엘리노어 각성 → "문이 열렸군요" → "당신이 돌아온 거야"), `ModalView.showFinalEnding()`이 1281~1319(의식 소실 → 유리통 각성 → 첨탑의 두 그림자)를 잇는다. **순서가 원문과 1:1이므로 임의로 바꾸지 말 것.** "GRAIL의 첫 여정이 끝난다"는 원문에 없는 창작이라 폐기했다.
- **GR-3 추격자는 VIRAX다**: `corridorDescent`/`greatHallSealed` 모두 `enemy.hollow`. 레지널드는 원문상 집무실 이후 지하 실험실까지 등장하지 않으며, 이 공백이 지하 재등장("이번에는 분명한 발소리였다")의 대비를 만든다.
- **엔딩 Area 소프트락 수정**: `GameController.restore()`가 스냅샷 `areaId`를 `ending`/`ending2`/`ending3`로 판정하면 챕터 시작 지점으로 폴백한다. 이전에는 챕터 완료 후 새로고침하면 포탈·상호작용이 0개인 엔딩 Area에 영구히 갇혔다.

### 아직 반영되지 않은 문서 항목 (확장 시 참고)

- 장애물 기반 시야(Line-of-Sight)
- 정신력 시스템, 애니메이션 State Machine
- 사운드 에셋 Manifest / spatial audio (`WebAudioPort`는 존재하나 문서 5.5 수준의 레이어링은 없음)

## 설계 문서 vs 구현 — GR-2/GR-3 매핑

`logs/12-chapter2-3-level-design-2026-08-16.md`가 GR-2·GR-3의 정본 설계 문서다(LDD의 GR-2/GR-3 명세를 이 코드베이스 문법으로 옮긴 것). GR-2는 `config/Chapter2World.ts`+`domain/Chapter2.ts`+`application/Chapter2FlowService.ts`, GR-3는 `Chapter3World.ts`+`Chapter3.ts`+`Chapter3FlowService.ts`로 GR-1과 동일한 3파일 패턴을 따른다. Area 그래프(1.1/2.1), 시퀀스 비트(1.2/2.2), 와인 선반·네 이름·세 진실 퍼즐(1.3/1.4), 체크포인트(1.6/2.5)는 문서와 1:1로 구현되어 있다.

### GR-2/GR-3 실추격 시스템 (2026-08-16 도입 — GR-1과의 차이점)

설계 문서 1.5/2.3은 GR-1의 무추격 결정을 그대로 계승해 GR-2/GR-3도 전부 `sighting`(스침 후 소멸) 패턴으로 설계했지만, 이후 확인 결과 **GR-2부터는 적이 실제로 플레이어를 추격해야 한다**는 요청을 받아 GR-2/GR-3에 한해 이 결정을 뒤집었다. GR-1의 Hollow(위 GR-1 매핑 섹션 참고)는 영향받지 않는다.

- `domain/Pursuer.ts` — GR-2/GR-3 전용 단일 추격자 엔티티(`active`/`position`/`speed`/`assetId`). GR-1의 `Hollow`와 별개 클래스.
- `application/PursuitService.ts` — 순수 서비스. 매 프레임 추격자를 플레이어 방향으로 `speed*dt`만큼 이동시키되(축 분리 이동, `MovementService.moveAxis`와 동일한 방식) Area의 `walls`에 막히면 멈춘다. 플레이어와 bounds가 겹치면 포획으로 판정.
- `AreaDefinition.pursuit`(`domain/World.ts`) — Area별 추격 설정(`enemyAssetId`/`spawn`/`speed`/`catchTitle`/`catchBody`/`onEnter`). `onEnter:true`면 해당 Area에 진입하는 순간 자동 발동(`corridorDescent`/`greatHallSealed`/`innCellarEscape`/`villageChaseFinal`), 없으면 `ActionResult.startPursuit:true`를 반환하는 인터랙션이 발동시킨다(`marketAlley`의 `alley.mirror`).
- **포획 처리**: `GameController.handleCatch()`가 `catchTitle`/`catchBody` 메시지를 보여준 뒤 플레이어를 현재 Area의 스폰 지점으로 되돌리고, 1.5초 유예(`pursuitGrace`) 후 추격이 자동 재개된다 — `onEnter`뿐 아니라 **상호작용으로 시작된 추격도 같은 Area 안에서는 재개**된다(2026-08-20, `pursuitArea` 필드). 이전에는 `marketAlley`에서 한 번 잡히면 추격이 영구히 풀렸다 — 진행 플래그·아이템은 잃지 않는다(다른 시스템과 동일한 "실패해도 영구 손실 없음" 원칙). Area를 벗어나면(`enterArea()`) 추격은 항상 해제된다.
- **적용 지점**: `marketAlley`(Hollow, 거울 조우 시), `innCellarEscape`(Maw, 진입 시), **`townHallExterior`**(Hollow, 진입 시 — 2026-08-20 추가. 원문 965~985행의 "숨을 곳 없는 광장 횡단"이며 `innFireStarted` 이후에만 진입 가능), `villageChaseFinal`(다중 위협 근사, 진입 시) — GR-2. `corridorDescent`/`greatHallSealed`(진입 시, 추격자는 **`enemy.hollow`** — 위 반영분 참고) — GR-3. `innCellar`(와인 선반 퍼즐, 이산 클릭 퍼즐이라 실추격을 넣지 않음)와 `office2F`(레지널드 "대면"은 여전히 정지된 스침)는 의도적으로 제외했다.
- `enemy.maw`는 전용 아트가 없어 `CanvasRenderer.drawPursuer()`의 fallback 사각형으로만 표시된다(플레이스홀더 정책, README "에셋 교체 원칙" 참고) — manifest에 추가되면 자동으로 그림으로 교체된다.

## 코딩 규칙

- 이 리포지토리에 새 코드를 추가할 때 레이어 의존 방향(Presentation→Infrastructure→Application→Domain, Domain은 최하위)을 위반하지 말 것. Domain이 Canvas/DOM/LocalStorage를 import하면 안 된다.
- Area/Portal/Interaction을 추가할 때는 `tests/smoke.mjs`가 **CH1-3 세 월드 전부**에 대해 spawn-wall 충돌·포탈 목적지·portal 재발동·추격자 스폰을 검증하고, **모든 인터랙션의 `action`이 해당 FlowService의 `default` 폴백으로 떨어지지 않는지도 단언**한다(월드에만 배치하고 `case`를 만들지 않는 실수를 잡는다 — 2026-08-19 감사에서 이 유형이 12건 나왔다). 새 Area/인터랙션 추가 후 반드시 `npm run build && node tests/smoke.mjs && node --test tests/p0-systems.test.mjs tests/chapter2-3.test.mjs` 실행.
- 진행 플래그를 추가/변경하면 `Chapter1Progress.objective()`의 우선순위 체인(위에서부터 역순 판정)도 함께 갱신해야 목표 텍스트가 어긋나지 않는다.
- **작업을 마치면 항상 `logs/08-work-log.md`에 작업 일지를 남긴다.** 날짜별 `## YYYY-MM-DD` 섹션(같은 날 여러 세션이면 그 아래 소제목)에 시간순으로 추가 — 무엇을/왜 바꿨는지, 주요 변경 파일, 검증 결과(빌드/테스트/스크린샷 여부)를 간단히 적는다. 계획 검토 없이 코드를 먼저 구현해버리는 등 사용자 의도와 어긋났던 사고도 "주의" 섹션으로 남겨 재발을 막는다. `logs/00-06`은 2026-08-15 1회성 감사 문서, `07`은 에셋 제작 지시서로 별도 성격이니 건드리지 말 것 — 작업 일지는 `08` 하나로 계속 이어간다.
