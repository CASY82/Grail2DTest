# 12. 챕터 2·3 (GR-2 Ashvale Village / GR-3 Blackwood Castle) 레벨 디자인 및 에셋 프롬프트 (2026-08-16)

정본 `Grail_Chapter_Level_Design_v2_latest.docx` (LDD v2.0, 2026-08-05)의 GR-2/GR-3 명세를 이 저장소(`grail-ch1-html5`, HTML5 GR-1 프로토타입)가 실제로 구현 가능한 형태로 옮기는 설계 문서다. GR-1(챕터 1)이 `src/config/Chapter1World.ts`의 Area 그래프(고정 1280×720 화면, portals로 연결, 단일 플래그 `visibleWhen`/`hiddenWhen` 기반 interaction 게이팅)로 구현된 것과 동일한 문법으로 GR-2·GR-3을 설계하고, 대응하는 배경/소품 에셋 생성 프롬프트를 함께 정리한다.

이 문서는 **설계 문서이며 코드·이미지 생성은 포함하지 않는다.** 실제 구현은 별도 작업으로 진행한다.

> **2026-08-20 마스터 시나리오 기준 정정.** 아래 4건(문서상 6개 항목)이 정본 1순위인 마스터 시나리오(`Grail 게임 시나리오.md`)와 직접 충돌해 정정되었다. 각 항목 본문에 `2026-08-20 마스터 시나리오 기준 정정` 표기와 원문 행 번호가 함께 붙어 있으니, 다음 아트 발주 전에 반드시 정정된 쪽을 사용할 것.
> - §3.2.1 `prop.portrait` — 대현관 초상화는 엘리노어가 아니라 **레지널드 블랙우드 경**(1048~1053행). 엘리노어의 그림은 식당 상석 뒤에 따로 있다(1061~1062행).
> - §3.2.1 `prop.footprints` — 발자국은 "안쪽으로만"이 아니라 **같은 신발의 왕복 흔적**이다(1043~1046행).
> - §3.2 `bg.parlor` / §3.2.1 `prop.mannequin` — 창백한 드레스·`--no face detail`이 아니라 **검은 드레스를 입힌 나무 마네킹**이며 얼굴에 엘리노어의 얼굴이 서툰 솜씨로 **그려져 있어야** 한다(1074~1079행).
> - §3.2 `bg.laboratoryB2` / §3.2.1 `prop.glassTubes` — **인간 크기 유리통 열과 그 안에 떠 있는 사람들**이 누락돼 있었다(1161~1165행). 엔딩(1288행)의 전제 오브젝트다.

## 목차

1. 챕터 2 (GR-2 Ashvale Village) 레벨 디자인 — 10년차 게임 기획자 agent 작성
2. 챕터 3 (GR-3 Blackwood Castle) 레벨 디자인 — 10년차 게임 기획자 agent 작성
3. 챕터 2·3 에셋 생성 프롬프트 — 10년차 게임 디자이너(아트 디렉터) agent 작성

---

## 1. 챕터 2 (GR-2 Ashvale Village) 레벨 디자인

**작성 원칙**: `src/config/Chapter1World.ts`가 실제로 사용하는 문법(`AreaDefinition`/`PortalDefinition`/`InteractionDefinition`, 고정 1280×720 화면, `requireFlag`+`denyMessage` 포탈 게이팅, `visibleWhen`+`hiddenWhen` 단일 플래그 인터랙션 게이팅)만 사용한다. 여기서 제안하는 `Chapter2World.ts`/`Chapter2.ts`/`Chapter2FlowService.ts`는 GR-1의 `Chapter1World.ts`/`Chapter1.ts`/`Chapter1FlowService.ts`와 동일한 3파일 구조를 그대로 복제한다고 가정한다. Area id·인터랙션 id는 GR-1의 `hall.*`/`office.*`/`gate.*`와 이름이 겹치면 문서 가독성이 떨어지므로(실제로는 별도 TS 모듈이라 충돌은 없지만) 이 문서 안에서는 GR-1과 구분되는 접두어(`square.`/`market.`/`house.`/`inn.`/`wine.`/`civic.`)를 쓴다.

### 1.0 GLOBAL DESIGN 수치의 이 프로토타입 반영 원칙

LDD GLOBAL DESIGN(1.1~1.4)의 수치는 GR-1에서 이미 부분적으로만 구현되어 있고 나머지는 CLAUDE.md가 "의도적으로 단순화/변경"으로 명시한 상태다. GR-2/GR-3도 **GR-1이 이미 확정한 전례를 그대로 계승**한다 — 이 챕터에서 새로 수치 시스템을 도입하지 않는다. GR-3 섹션에도 동일하게 적용된다.

| GLOBAL DESIGN 항목 | GR-1 구현 상태 | GR-2/GR-3 반영 방식 |
|---|---|---|
| 이동 소음 반경(정지 0m·앉기 2m·걷기 5m·달리기 14m) | `MovementService.NOISE_METERS`로 구현됨 | 그대로 재사용(엔진 공통 로직, 챕터별 재정의 불필요) |
| 적 감지 수치·속도(늑대/Hollow/Maw/Wailers/Beast/레지널드 표) | 미구현 — 이동형 감지 AI 자체가 없음. Hollow는 `attic.window`류 인터랙션이 트리거하는 2.4초 짧은 시야 노출(`triggerSighting()`)로만 존재 | GR-2/GR-3도 동일 패턴(사운드+짧은 시야 노출) 사용. 표의 정성적 서열(속도·감지 반경 대소)은 "어느 인터랙션이 sighting을 유발하는가", "위협이 배경 실루엣으로만 남는가"를 정하는 설계 기준으로만 참고하고, 실수치는 구현하지 않는다 |
| 체력 3타 / 정신력 100 / 등잔 10분 / 횃불 20분 | 전부 미구현(CLAUDE.md "체력/정신력/횃불" 항목 명시) | GR-2/GR-3도 신규 도입하지 않는다. 정신력 감소가 서술된 지점(Wailer -5/s, 성 지하 -1/s 등)은 전부 텍스트+사운드 연출로 근사(1.5/2.3 참고) |
| 체크포인트 규칙(레벨 시작/핵심 퍼즐 완료/강제 추격 직전 자동, 봉헌 촛대 수동, 은신·추격 중 저장 불가) | `SaveGameService`+`autosave:true` 플래그+`cabin.candle` 패턴으로 구현됨 | GR-2/GR-3도 동일 서비스·동일 패턴 재사용(1.6/2.5) |
| 재시작 직후 30초 적 스폰 금지 | GR-1은 "붙잡힘 실패 상태" 자체가 없어 이 규칙을 "해당 없음"으로 처리(logs/09 §1) | GR-2/GR-3도 동일 논리로 해당 없음 — sighting에는 "붙잡힘"이 없으므로 유예 시간을 계산할 대상이 없다 |

### 1.1 Area 그래프

허브(광장, Safe Zone) + 4개 스포크(동: 상점가→폐가, 서: 여관→지하, 남: 시청, 북: 성문→최종 추격)로 분해한다. GR-1의 `cabinB1Hall→cabinB1(Wing)→cabinB1Rear` 스포크 세분 패턴을 그대로 따라, 각 스포크를 2~4개의 고정 화면 Area 체인으로 나눈다.

```
                         ┌─ townGate ─▶ villageChaseFinal ─▶ ending
                         │   (석판 퍼즐)   (강제 편도, GR-1 chaseRoad 패턴)
                         │
marketStreet ─▶ marketAlley ─▶ houseExterior ─▶ houseInterior
     │                                                  (동쪽 스포크, 상점가/폐가)
     │
     ▼
villageSquare (허브, Safe Zone) ──▶ townHallExterior ─▶ townHallInterior ─▶ townHallRecords
     │                                                                    (남쪽 스포크, 시청)
     ▼
innGroundFloor ─▶ innCellar ─▶ innCellarEscape
     (서쪽 스포크, 여관/지하 와인 퍼즐)              (강제 편도 탈출, villageSquare로 복귀)
```

| id | 타이틀/부제 | 역할 | 포탈 연결 |
|---|---|---|---|
| `villageSquare` | 중앙 광장 · Safe Zone | 허브, 수동 저장, 4스포크 진입점 | → `marketStreet`(동) / `innGroundFloor`(서) / `townHallExterior`(남) / `townGate`(북) |
| `marketStreet` | 상점가 잡화점 | 장부 단서(여관 지하 실마리) | → `marketAlley`, 뒤로 `villageSquare` |
| `marketAlley` | 상점가 뒷골목 | Hollow 첫 정면 조우(반사면) | → `houseExterior`(requireFlag:`hollowSighted`), 뒤로 `marketStreet` |
| `houseExterior` | 모리스 폐가 현관 | 빗장 열기, 진입 연출 | → `houseInterior`(requireFlag:`hollowSighted`), 뒤로 `marketAlley` |
| `houseInterior` | 모리스 폐가 내부 | 은신 연출 + 일기(○ 진실 조각) | 뒤로 `houseExterior`만(왕복) |
| `innGroundFloor` | 여관 1층 (The Black Lamb) | 수동 저장(2번째 촛대), 지하 입구 | → `innCellar`(requireFlag:`blackLambClueKnown`), 뒤로 `villageSquare` |
| `innCellar` | 여관 지하 저장고 | 와인 선반 퍼즐(1.3) | → `innCellarEscape`(requireFlag:`wineOrderSolved`), 뒤로 `innGroundFloor` |
| `innCellarEscape` | 환풍구 통로 | Maw 근접 연출, 강제 탈출 | → `villageSquare`(편도, portals 되돌아가기 없음) |
| `townHallExterior` | 시청 외부 | 외부 충돌음 연출 | → `townHallInterior`, 뒤로 `villageSquare` |
| `townHallInterior` | 시청 내부 홀 | 네 기둥·숯 흔적 탐색 | → `townHallRecords`, 뒤로 `townHallExterior` |
| `townHallRecords` | 시청 기록보관실 | 네 이름 필사(✠ 진실 조각) | 뒤로 `townHallInterior`만(왕복) |
| `townGate` | 마을 성문 | 세 진실+네 이름 석판(1.4) | → `villageChaseFinal`(requireFlag:`nameSlotSolved`, 편도), 뒤로 `villageSquare` |
| `villageChaseFinal` | 마을 기상 · 최종 접근 | 다중 위협 연출, Blackwood 진입 | 편도(`portals:[]`), 인터랙션 결과가 `ending`으로 전환 |
| `ending` | CHAPTER 2 COMPLETE | GR-1 `ending` Area와 동일 패턴 | 없음 |

**Safe Zone 설계 반영**: `villageSquare`는 LDD가 "적 진입 금지"로 명시한 유일한 Area다. 이를 위해 (1) `villageSquare`의 `interactions`에는 sighting을 트리거하는 액션을 절대 두지 않는다(석상·분수·게시판·촛대 4개 전부 순수 flavor/저장), (2) `villageSquare`로 귀환하는 모든 포탈(`marketAlley←`, `innCellarEscape←`, `townGate←`)은 편도 또는 안전 상태로만 도달하도록 설계해, sighting이 진행 중인 상태로 광장에 "따라 들어오는" 경로 자체가 존재하지 않는다 — 이는 GR-1이 `enterArea()`에서 Area 전환 시 `hollow.active`를 리셋하지 않는 것과 무관하게, sighting이 애초에 광장 밖 Area의 `interactions`에서만 발동하도록 액션을 배치하는 콘텐츠 레벨 설계로 보장한다.

### 1.2 시퀀스 비트 시트

LDD T2-1~T2-10을 `구역.대상` 인터랙션/포탈 id와 `ProgressFlag`로 재기술한다. GR-1의 `atticClueSeen`류 "선행 확인 → 하위 콘텐츠 노출" 체인 패턴을 그대로 사용한다.

| # | LDD 트리거 | 이 엔진의 구현 | 신규 `ProgressFlag` | 다음 비트를 여는 게이팅 |
|---|---|---|---|---|
| T2-1 | 관문 통과 → 광장 도착 | `villageSquare` 진입 시 자동 표시(별도 인터랙션 불필요, GR-1의 `bridge`처럼 최초 스폰 자체가 연출) | `villageArrived`(스폰 시 set) | — |
| T2-2 | 성문 시도 → 열쇠 구멍 확인 | `townGate` 포탈은 게이팅 없이 항상 열려 있음. `gate2.slot` 인터랙션이 조건 미충족 시 안내문만 반환(GR-1 `gate.inspect` 패턴) | `gateTried` | 없음(탐색 유도 텍스트만) |
| T2-3 | 잡화점 장부 → 장부 읽기 | `market.ledger`, `autosave:true`(체크포인트) | `blackLambClueKnown` | `innGroundFloor→innCellar` 포탈의 `requireFlag` |
| T2-4 | 반사면 → 뒤편 확인, Hollow 첫 조우 | `alley.mirror` — GR-1 `attic.window`/`triggerSighting()` 패턴 재사용(1.5) | `hollowSighted` | `marketAlley→houseExterior`, `houseExterior→houseInterior`의 `requireFlag`(도주처로서의 폐가) |
| T2-5 | 폐가 진입 → 은신 학습 | `house.hide`(침대 밑 은신 연출 텍스트) | `hidSuccessfully` | `house.diary`의 `visibleWhen` |
| T2-6 | 폐가 일기 → VIRAX 명시 | `house.diary`, `visibleWhen:'hidSuccessfully'`, 아이템 `truthCircle` 획득, `autosave:true` | `diaryRead` | 없음(1.4 세 진실 진행도만 갱신) |
| T2-7 | 여관 지하 → 와인 퍼즐 압박 | `wine.hint`+`wine.shelf*` 6종(1.3) | `wineHintRead`, `wineOrderSolved` | `innCellar→innCellarEscape`의 `requireFlag` |
| T2-8 | 철 열쇠 획득 → 환풍구 탈출, 여관 화재 | `wine.serpentBox`(아이템 `ironGateKey`, `autosave:true`) → `escape.lamp`(sighting 연출) | `ironGateKeyTaken`, `innFireStarted` | 없음(편도 이동) |
| T2-9 | 시청 → 네 이름 필사 | `civic.record`(4개 명패 순서 클릭, 1.4), 아이템 `truthCross`, `autosave:true` | `fourNamesKnown` | `gate2.slot` 2단계 판정 |
| T2-10 | 성문 석판 → 세 진실+네 이름, 마을 기상 | `gate2.slot`(1.4), `autosave:true` → `villageChaseFinal`의 `chase2.gate` | `truthSlotLit`, `nameSlotSolved` | `townGate→villageChaseFinal` 포탈, 챕터 종료(`complete:true`) |

### 1.3 와인 선반 퍼즐 (LDD 4.4)

GR-1의 그림자 퍼즐이 `ShadowPuzzleService`(연속값 정렬, `align()`/`attempt()` 분리)로 구현된 것과 달리, 와인 선반은 **이산적 순서 클릭** 퍼즐이라 같은 서비스 구조를 그대로 재사용할 수는 없다. 같은 설계 원칙(실시간 피드백, 실패해도 즉사 없음, 실패 카운트가 게임오버로 이어지지 않음)을 유지하는 새 서비스 `WineRackPuzzleService`(Application)를 제안한다.

**장치 배치(`innCellar`)**: `wine.hint`(중앙 약도+방향 시구, 상시 노출) + 6개 선반 인터랙션 `wine.shelfI`~`wine.shelfVI`(항상 노출, 게이팅 없음 — 정답 순서를 몰라도 클릭 자체는 가능해야 "추론 검증"이 성립).

**서비스 설계(제안)**:
```
WineRackPuzzleService.ANSWER = ['V','II','IV','I','III','VI']
click(shelfId): WineRackFeedback
  - 현재까지 맞은 접두 순서와 비교
  - 다음 정답과 일치 → progressIndex++, 6/6 도달 시 solved:true
  - 불일치 → progressIndex=0으로 리셋(처음부터 다시), mawTimerSeconds -= 10, event:'bottles-shatter'
```
`ShadowPuzzleService.attempt()`가 3의 배수 실패마다 `threat-approaches` 이벤트를 반환하는 것과 동일하게, `WineRackPuzzleService`도 오답마다 청각 페널티(`audio.pulse('bottles')`, 소음 반경 18m는 수치 미구현이므로 "근처 발소리가 서두른다" 텍스트로 근사)만 반환하고 **플레이어를 죽이거나 강제 이동시키지 않는다** — CLAUDE.md가 그림자 퍼즐 재작업에서 확정한 "실시간 피드백 + 실패해도 게임오버 없음" 원칙을 그대로 계승한다.

| 힌트(방향 시구) | 정답 순서 |
|---|---|
| 북쪽의 별 V / 남쪽의 그림자 II / 서쪽의 불 IV / 동쪽의 물 I / 중앙의 심장 III / 봉인된 뱀 VI | V → II → IV → I → III → VI |

`progressIndex===6` 도달 시 `wineOrderSolved` set, `wine.serpentBox`(뱀 나무 상자 회전) 인터랙션이 `visibleWhen:'wineOrderSolved'`로 노출되어 `ironGateKey` 지급 + `autosave:true`. `mawTimerSeconds`는 UI 상 카운트다운으로만 표시(디제틱 압박) — 0에 도달해도 강제 실패가 아니라 `escape.lamp`(1.5 참고)로 이어지는 위협 연출 강도만 높이는 것을 제안한다(LDD의 "환풍구 탈출 항상 보장" 원칙과 정확히 일치).

### 1.4 세 진실 + 네 이름 퍼즐 (LDD 4.5)

**세 조각 획득처와 GR-1 연결점**

| 조각 | 획득처 | 이 문서에서의 인터랙션 | GR-1과의 연결 |
|---|---|---|---|
| △ | GR-1 다락(이미 구현) | `attic.puzzle`(`Chapter1FlowService.solvePuzzle()`)이 이미 `truthTriangle` 아이템을 지급 | **캐리오버 필요** — 아래 참고 |
| ○ | GR-2 모리스 폐가(신규) | `house.diary` | `houseInterior`, `visibleWhen:'hidSuccessfully'` |
| ✠ | GR-2 시청(신규) | `civic.record` | `townHallRecords` |

**GR-1→GR-2 캐리오버 설계 제안**: 현재 `Chapter1Progress`와 (제안하는) `Chapter2Progress`는 완전히 분리된 클래스이므로 `truthTriangle` 아이템은 저절로 넘어오지 않는다. `SaveGameService`/`LocalStorageSaveRepository`가 이미 `Chapter1Snapshot`(`flags`/`items` 포함)을 영속화하고 있으므로, GR-1 종료(`chapterComplete` set + `complete:true` 반환) 시점에 Infrastructure 레이어에 **캠페인 진행 레코드**(예: `campaignCarryover: { items: ItemId[] }`)를 별도 키로 저장하고, GR-2 부트스트랩(진입점, 예: `main2.ts`)이 그 레코드를 읽어 `Chapter2Progress`의 `items` 초기값에 `truthTriangle`을 시드하는 방식을 제안한다. Domain(`Chapter2Progress`)은 순수하게 "생성 시 초기 아이템 목록을 받는" 파라미터만 추가하면 되고, 캐리오버 판정 로직 자체는 Infrastructure/부트스트랩에 둔다 — GR-1 Domain이 GR-2를 몰라야 하는 레이어 의존 방향(Presentation→Infrastructure→Application→Domain)을 지킨다.

**1단계 — 세 진실 (석판, `townGate`의 `gate2.slot`)**

```
gate2.slot:
  if !(owns truthTriangle && owns truthCircle && owns truthCross):
    → "석판의 세 홈이 비어 있다. 아직 채우지 못한 진실이 있다." (부족한 개수 안내)
  else if !fourNamesKnown:
    → truthSlotLit set. "청록빛이 세 홈에서 돈다. 그러나 문은 미동도 하지 않는다. 이름이 없다."
  else:
    → nameSlotSolved set, autosave:true. "청동 문이 열린다." → villageChaseFinal 포탈 개방
```
왼쪽 △ / 중앙 ○ / 오른쪽 ✠ 배치는 GR-1 다락 좌/중/우 배치(3.1)와 동일한 시각 문법을 재사용한다.

**2단계 — 네 이름 (`townHallRecords`의 `civic.record`)**: 엔진에 자유 텍스트 입력 UI가 없으므로(GR-1도 클릭 기반 상호작용만 지원), LDD의 "필사(입력)"를 **와인 선반과 동일한 순서-클릭 패턴**으로 대체한다 — 4개의 작은 명패(엘리노어·아이작·마사·토머스)를 시청 기록보관실 안에서 클릭 가능한 `InteractionDefinition` 4개로 배치하고, 앞서 읽은 문서 단서(예: 인부 명부의 "이름 셋 + 붉은 줄" — GR-1 관리동 `office.roster` 패턴 재사용)가 암시하는 순서로 클릭하면 `fourNamesKnown` set + `truthCross` 지급. 오답 시 데드락 없이 순서만 리셋(와인 퍼즐과 동일한 무페널티 원칙), 사운드만 Wailer 울음으로 변경해 위협 색을 구분한다.

### 1.5 적 조우 설계

| 적 | LDD 배치 | 이 엔진에서의 표현 | 판단 근거 |
|---|---|---|---|
| Hollow | 상점가(반사면 조우, 골목 추격) | `alley.mirror` 클릭 → GR-1 `triggerSighting()` 패턴 그대로 재사용(위치 근처에 2.4초 노출 후 소멸). 실제 이동/추격 AI 없음 | CLAUDE.md가 확정한 "Hollow는 추격하지 않는다"는 GR-1 결정을 그대로 계승. "골목 추격" 문구는 사운드(`audio.pulse('hollow')`)+텍스트 연출로 대체 |
| The Maw | 여관 지하(퍼즐 후반 압박) | 실시간 추격 없음. `wine.serpentBox` 이후 `escape.lamp` 인터랙션 결과 텍스트에서 짧은 근접 조우(동일 sighting 패턴)만 발생, 곧바로 편도 포탈로 탈출 보장 | LDD 자체가 "통풍창 탈출 항상 보장"을 명시 — 탈출이 실패할 수 없는 구조이므로 실추격 AI가 필요 없다 |
| Wailers | 마을 후반(정신력 -5/s, 타 적 호출) | 정신력 시스템 미구현이므로 수치 적용 불가. `civic.thud`(시청 외부 충돌음), `villageChaseFinal`의 배경 사운드/실루엣 데코레이션으로만 존재 — 클릭 가능한 개체 아님 | 1.0의 GLOBAL DESIGN 반영 원칙과 동일: 없는 시스템(정신력)에 의존하는 서술은 텍스트/사운드로 근사 |
| The Beast | 성문 원경(실루엣만) | `townGate`/`villageChaseFinal` 배경 아트에 실루엣을 베이크(순수 `decorations`, 인터랙션 없음) | LDD 원문이 이미 "실루엣만 노출"이라 명시 — 추가 로직 불필요, 아트만 필요 |

Domain의 `Hollow` 클래스는 현재 단일 인스턴스다. "다중 Hollow"(성문 최종 구간의 "Hollow+Wailers 3~4") 같은 서술은 이 프로토타입 범위에서 배경 아트의 다수 실루엣으로만 근사하고, 실제 다중 개체 AI 확장은 이 설계 문서의 범위 밖(향후 엔진 확장 과제)으로 남긴다.

### 1.6 체크포인트

| # | 지점 | 방식 | 구현 |
|---|---|---|---|
| 1 | 광장 봉헌 촛대 | 수동 | `square.candle` |
| 2 | 잡화점 장부 | 자동 | `market.ledger`(`autosave:true`) |
| 3 | 폐가 일기 | 자동 | `house.diary`(`autosave:true`) |
| 4 | 여관(2번째 촛대) | 수동 | `inn.candle` — LDD 1.4가 "GR-2 광장·여관"을 수동 저장 지점으로 명시 |
| 5 | 와인 퍼즐 완료 | 자동 | `wine.serpentBox`(`autosave:true`) |
| 6 | 시청 | 자동 | `civic.record`(`autosave:true`) |
| 7 | 성문 | 자동 | `gate2.slot` 최종 판정(`autosave:true`), 강제 추격 직전 |

은신/추격 성격 구간(`marketAlley`, `innCellarEscape`, `villageChaseFinal`)에는 저장 지점을 두지 않는다 — GLOBAL DESIGN "은신 중/추격 중 저장 불가" 규칙 반영.

### 1.7 플레이타임 추정

프로젝트 확립 방법론(도보 146px/s, 읽기 = 글자수/7.5 + 모달당 1.4초, 2~2.5배 보정)을 적용한다.

| 구성 요소 | 근거 | raw |
|---|---|---|
| 읽기 | 인터랙션 28개(광장4·상점가2·골목1·폐가외1·폐가내2·여관1층2·지하8·탈출1·시청외1·시청내2·기록실2·성문1·최종1), 평균 80자 → 개당 80/7.5+1.4≈12.1초 | 338.8초 (5.65분) |
| 이동 | 스포크 왕복 + 허브 복귀 총 24회 포탈 통과 × 평균 600px | 98.6초 (1.64분) |
| 퍼즐 상호작용 | 와인 선반(6클릭+평균 2~3회 오답 재시도) + 네 이름(4클릭) | 약 75초 (1.25분) |
| **raw 합계(내 계산)** | | **약 8.5분** |
| LDD 자체 비트 지속시간 합(T2-1~T2-10 열) | 35+40+45+90+55+40+70+85+60+90 | 610초(10.2분) |
| **대표 raw 구간** | 두 산정치의 범위 | **8.5~10.2분** |
| **보정(×2~2.5)** | | **17~25.5분** |

**LDD 목표(약 60분) 대비**: 약 **58~72% 부족**. GR-1도 최초 설계 시점(logs/09 §2)에는 raw 7.9~10.4분·보정 15.8~26분으로 목표 30분 대비 최대 47% 부족했고, 이후 관리동 확장(§4)과 목판화 심화(§6)를 거쳐 격차를 줄였다. GR-2는 애초에 목표가 GR-1의 2배(60분)인데 위 1차 초안(허브 1개 + 스포크 4개, Area 14개)은 GR-1 완성본(Area 14개, 이미 확장 완료된 상태)과 비슷한 밀도라서 격차가 GR-1의 초기 상태보다 크게 나타난다. **이 초안은 GR-1과 동일한 "1차 스켈레톤" 단계로 간주해야 한다** — 실제 구현 착수 시 GR-1이 거친 것과 같은 반복 확장(스포크별 서브룸 1~2개 추가, 인터랙션 밀도 증가, 특히 자유 탐색이 허용되는 시청·상점가에 로어 인터랙션 보강)이 필요하다.

### 1.8 신규 art asset 필요 목록

**배경 (Area당 1개)**: `bg.villageSquare`, `bg.marketStreet`, `bg.marketAlley`, `bg.houseExterior`, `bg.houseInterior`, `bg.innGroundFloor`, `bg.innCellar`, `bg.innCellarEscape`, `bg.townHallExterior`, `bg.townHallInterior`, `bg.townHallRecords`, `bg.townGate`, `bg.villageChaseFinal`, `bg.gr2Ending`

**핵심 소품**: 목 꺾인 석상·마른 분수·게시판(광장), 장부·진열대(상점가), 금 간 거울(골목), 빗장·침대·일기(폐가), 여관 게시판·촛대(여관 1층), 번호 와인 선반 6단+중앙 약도+뱀 나무 상자(지하), 환풍구(탈출로), 네 기둥·숯 흔적(시청), 명패 4개(기록실), △○✠ 홈 석판(성문)

---

## 2. 챕터 3 (GR-3 Blackwood Castle) 레벨 디자인

### 2.0 GLOBAL DESIGN 반영

1.0에서 정리한 반영 원칙(이동 소음 재사용, 적 감지 수치 미구현 대신 sighting 근사, 체력/정신력/횃불 미도입, 체크포인트 자동+수동 병행, 30초 유예 해당 없음)을 그대로 적용한다.

### 2.1 Area 그래프

LDD의 "탐험(비선형) → 레지널드 등장 → 일방향 하강"을 상층 허브(자유 탐험) + 하층 강제 편도 체인으로 분해한다. GR-1의 `chaseRoad`(포탈 없는 강제 이동 Area)를 하강 구간 전체에 반복 적용한다.

```
castleGateChain ─▶ greatHall(허브) ─┬─▶ diningRoom (자유 탐험, 왕복)
                                     ├─▶ parlor      (자유 탐험, 왕복)
                                     └─▶ office2F ─▶(journalRead 후 reginaldEncountered)
                                                        │
                                                        ▼ (강제 편도, 상층 복귀 불가)
                                              corridorDescent ─▶ greatHallSealed
                                                                      │
                                                                      ▼ (강제 편도)
                                                              serviceCorridorB1 ─▶ laboratoryB2 ─▶ ritualChamber ─▶ ending
```

| id | 타이틀/부제 | 역할 | 포탈 연결 |
|---|---|---|---|
| `castleGateChain` | 청동 성문 안쪽 | 진입, 체인으로 봉쇄(복귀 불가 선언) | → `greatHall`(편도) |
| `greatHall` | 대현관 (허브) | 상층 자유 탐험 허브, 수동 저장 | → `diningRoom` / `parlor` / `office2F`(왕복 가능, Reginald 등장 전까지) |
| `diningRoom` | 식당 | 정적 공포(따뜻한 재) | 뒤로 `greatHall`만 |
| `parlor` | 응접실 | 정적 공포(마네킹) | 뒤로 `greatHall`만 |
| `office2F` | 2F 집무실 | 일지 → 레지널드 등장(P1) | → `corridorDescent`(requireFlag:`reginaldEncountered`, 편도) |
| `corridorDescent` | 나선 계단 하강 | P2 "문의 합창" | → `greatHallSealed`(편도, `portals` 그 외 없음) |
| `greatHallSealed` | 1F 대현관 (봉쇄됨) | P3 정문 봉쇄 → 서비스 문 | → `serviceCorridorB1`(편도) |
| `serviceCorridorB1` | B1 서비스 복도 | P4 침묵 압박 | → `laboratoryB2`(편도) |
| `laboratoryB2` | B2 실험실 | 유리관·엘리노어 흔적 | → `ritualChamber`(편도) |
| `ritualChamber` | 의식실 | 최종 시퀀스(2.4) | 없음(결과가 `ending`으로 전환) |
| `ending` | CHAPTER 3 / 엔딩 | GR-1·GR-2와 동일 패턴 | 없음 |

**상층 비선형 vs 하층 강제 일방향**: `greatHall`은 GR-1의 `cabinB1Hall`처럼 여러 방으로 왕복 가능한 허브지만, `office2F`의 `study.reginald` 발동(`reginaldEncountered` set) 이후로는 `corridorDescent` 이하 모든 Area가 `portals`에 되돌아가는 항목을 아예 정의하지 않는다 — GR-1 `chaseRoad`가 `portals:[]`인 것과 동일한 방식으로, 별도의 `requireFlag` 잠금 없이 그래프 구조 자체로 상층 복귀를 차단한다.

**정합성 보정 필요 지점(설계 제안)**: LDD 1.4는 GR-3 수동 저장 지점을 "대현관·예배실"로 명시하지만, GR-3의 실제 구간 서술(5.1/5.2)에는 "예배실"이라는 방이 별도로 등장하지 않는다(0.1이 이미 인정한 것과 같은 종류의 정합성 누락으로 판단). 이 문서는 새로운 방을 발명하지 않고 **대현관(`greatHall`) 촛대 1곳만 수동 저장 지점으로 채택**한다 — 나머지는 전부 자동 체크포인트로 커버되므로(2.5) 저장 접근성에 공백은 없다.

### 2.2 시퀀스 비트 시트

| # | LDD 트리거 | 이 엔진의 구현 | 신규 `ProgressFlag` |
|---|---|---|---|
| T3-1 | 성문 진입 → 체인 당겨 닫기 | `gate3.chain`, `autosave:true` | `gateSealed` |
| T3-2 | 대현관 초상화·발자국 조사 | `hall.portrait`, `hall.footprints` | `portraitSeen` |
| T3-3 | 식당/응접실 탐색 | `dining.embers`/`dining.table`, `parlor.mannequin`/`parlor.piano` | `emberSeen`/`mannequinSeen` |
| T3-4 | 2F 집무실 일지 읽기 | `study.journal`, `autosave:true` | `journalRead` |
| T3-5 | 일지 완료 → 도주, 레지널드 등장 | `study.reginald`(`visibleWhen:'journalRead'`), `autosave:true` | `reginaldEncountered` |
| T3-6 | 복도 나선 계단 하강 | `corridorDescent` 진입 자체가 연출(포탈 편도), `descent.doors` 텍스트 | `doorsChorusSeen` |
| T3-7 | 대현관 서비스 문 회피 | `sealed.frontDoor`(차단 이유) → `sealed.serviceDoor`(우회로) | `frontBlockedSeen`, `serviceDoorFound` |
| T3-8 | 지하 하강 → 푸른 복도 | `service.silence`, `autosave:true` | `silenceNoted` |
| T3-9 | 실험실 유리관·엘리노어 확인 | `lab.tubes`, `lab.pedestal`, `lab.eleanor`(`autosave:true`) | `pedestalSeen`, `eleanorConfirmed` |
| T3-10 | 의식실 상자 낙하·자동 개방 | `ritual.approach`(`autosave:true`) → `ritual.kneel` | `ritualEntered`, `boxOpened` |
| T3-11 | 엔딩 | `ritual.witness` → `complete:true` | `chapter3Complete` |

### 2.3 레지널드 추격 페이즈 (LDD 5.3)

단일 플래그 게이팅과 `requireFlag` 기반 포탈 잠금만으로 4페이즈를 구현한다. "양쪽 문에서 Hollow 3~5"처럼 다중 개체가 필요한 연출은 Domain의 `Hollow`가 단일 인스턴스라는 현재 제약상 배경 아트의 다수 실루엣으로 근사한다(1.5와 동일 판단 근거).

| 페이즈 | 발동 조건 | 이 엔진에서의 구현 | 근사 판단 |
|---|---|---|---|
| P1 대면 | `journalRead` | `study.reginald` — GR-1 sighting 패턴과 동일(이동 AI 없이 텍스트+사운드 조우), 실패 시 복구 지점은 `office2F` 자체(재진입 시 동일 텍스트 재생 가능, 별도 재시도 로직 불필요) | 추격 없음 원칙 계승 |
| P2 문의 합창 | `corridorDescent` 진입 | 단방향 강제 포탈 1개(`portals` 되돌아가기 없음) + 배경 아트에 Hollow 3~5 실루엣 베이크. 실제 개별 AI 인스턴스화 안 함 | Domain의 `Hollow` 단일 인스턴스 제약, 다중화는 범위 밖 |
| P3 봉쇄 | `greatHallSealed` 진입 | `sealed.frontDoor`(차단 이유 텍스트) → `sealed.serviceDoor`(우회로), VIRAX도 배경 안개 데코레이션으로 근사 | 상동 |
| P4 침묵 | `serviceCorridorB1` 진입 | `service.silence` 텍스트+오디오 pulse만. "정신력 -1/s"는 정신력 시스템 미구현이라 수치 대신 서술로 대체 | 1.0/2.0의 GLOBAL DESIGN 반영 원칙 |

"체력 1타 후 재추격"(P2 실패 복구)도 체력 시스템이 없으므로, 실패 상태 자체를 만들지 않는다 — `corridorDescent`는 통과하면 그대로 다음 Area로 넘어가는 순수 선형 이동이며, "맞았다"는 느낌은 화면 흔들림/사운드 강조 같은 순수 연출로만 표현할 것을 제안한다(구현은 Presentation의 `CanvasRenderer`/`WebAudioPort` 몫, Domain 상태 변화 없음).

### 2.4 의식실 최종 시퀀스 (LDD 5.4)

**핵심 과제**: "버튼은 눌리지만 결과가 무효화되는 점진적 조작권 박탈"을 레이어드 아키텍처(Presentation→Infrastructure→Application→Domain) 안에서 구현.

| 단계 | LDD 서술 | 구현 지점(레이어) | 설계 제안 |
|---|---|---|---|
| S1 진입 | 빈 받침대가 정지 장치처럼 보임 | Presentation | `ritual.approach` 인터랙션, 일반 텍스트 |
| S2 반응 | 무릎 꿇고 상자 낙하, 상자가 스스로 열림 | Application | `ritual.kneel` — `Chapter3FlowService`가 `boxOpened` set. 이 시점까지는 플레이어 입력이 정상적으로 상태를 바꾼다 |
| S3 점화 | **조작 입력 무효화 시작** | Domain + Application | Domain(`Player` 또는 별도 `RitualState`)에 `controlMultiplier: number`(1.0→0.0)와 `ritualAgencyLocked: boolean` 필드 추가. `ritual.dial` 인터랙션은 여전히 클릭을 받고 모달/다이얼 UI도 정상 표시되지만, `ritualAgencyLocked===true`가 되는 순간부터 그 클릭이 만들어내는 값은 `progress` 상태에 반영되지 않는다 — **입력은 accept, 결과만 discard** |
| S4 전이 | 이동/회전 속도 점진 저하 | Application + Infrastructure | 신규 `RitualSequenceService`(Application, `ShadowPuzzleService`와 같은 급의 순수 서비스)가 `ritualEntered` 이후 경과 시간에 따라 `controlMultiplier`를 정해진 곡선으로 감소시킨다. `MovementService.step()`이 최종 속도 계산에 `player.controlMultiplier`를 곱한다 — Presentation의 `BrowserInput`은 키 입력을 평소처럼 계속 전달한다(입력 파이프라인 자체를 막지 않는다) |
| S5 문 | 시야 암전 직전, "문이 열렸군요" | Presentation | `ritual.witness` — `complete:true` 반환, `ending`으로 전환 |

**레이어 배치 원칙**: 입력을 실제로 차단하는 것(Presentation에서 키 리스너 disable)은 피한다 — 그러면 "조작권이 서서히 사라진다"는 서사적 체감이 아니라 "버튼이 고장 났다"는 UI 버그처럼 읽힌다. 대신 (1) Domain은 무력함의 정도를 나타내는 순수 상태(`controlMultiplier`)만 갖고, (2) Application(`RitualSequenceService`)이 그 상태를 시간 기반으로 갱신하며 "이 상태에서는 상호작용 결과를 반영하지 않는다"는 규칙을 결정하고, (3) Infrastructure/Presentation은 입력을 평소처럼 전달하되 그 결과가 이미 Application 단계에서 무력화된 상태를 반영할 뿐이다. 이는 `Chapter1FlowService`가 이미 "게이팅 판정은 Application, 렌더링/입력 수신은 Presentation"으로 분리해 둔 것과 같은 레이어 원칙의 연장이다.

### 2.5 체크포인트

| # | 지점 | 방식 | 구현 |
|---|---|---|---|
| 1 | 성문 체인 | 자동 | `gate3.chain`(`autosave:true`) |
| 2 | 대현관 촛대 | 수동 | `hall.candle`(2.1의 정합성 보정 — "예배실" 생략) |
| 3 | 집무실 일지 | 자동 | `study.journal`(`autosave:true`) |
| 4 | 추격 시작 | 자동 | `study.reginald`(`autosave:true`, 강제 하강 직전) |
| 5 | B1 | 자동 | `serviceCorridorB1` 진입 시 `service.silence`(`autosave:true`) |
| 6 | B2 | 자동 | `lab.eleanor`(`autosave:true`) |
| 7 | 의식실 | 자동 | `ritual.approach`(`autosave:true`) |

`corridorDescent`/`greatHallSealed`(추격 중 구간)에는 저장 지점을 두지 않는다.

### 2.6 플레이타임 추정

| 구성 요소 | 근거 | raw |
|---|---|---|
| 읽기 | 인터랙션 22개(대현관3·식당2·응접실2·집무실2·복도1·봉쇄홀2·B1복도1·실험실3·의식실5+1), 평균 90자 → 개당 90/7.5+1.4≈13.4초 | 294.8초 (4.9분) |
| 이동 | 상층 왕복(식당/응접실/집무실×3) + 하강 편도 9구간 | 64.7초 (1.1분) |
| 의식실 연출(속도 저하 체감 대기) | S3~S4 강제 연출 시간 | 약 40초 (0.7분) |
| **raw 합계(내 계산)** | | **약 6.7분** |
| LDD 자체 비트 지속시간 합(T3-1~T3-11 열) | 40+45+65+50+95+90+88+70+75+95+50 | 763초(12.7분) |
| **대표 raw 구간** | | **6.7~12.7분** |
| **보정(×2~2.5)** | | **13.4~31.75분(대표 구간 중앙값 약 9.7분 기준 19.4~24.25분)** |

**LDD 목표(약 60분) 대비**: 약 **60~68% 부족**. GR-2와 같은 결론이다 — 이 초안은 1차 스켈레톤이며, 특히 상층 자유 탐험 구간이 현재 `diningRoom`/`parlor` 2개 스포크뿐이라 LDD가 요구하는 "정적 탐험으로 존재감을 축적"하기엔 짧다. 가장 저비용으로 격차를 줄일 수 있는 지점은 **상층에 3번째 자유 탐험 스포크(예: 서재/음악실)를 추가**하는 것 — GR-1이 `cabinB1Hall`에 `cabinB1Office`(막다른 선택 구역)를 붙인 것과 동일한 패턴이며, 강제 하강 이후의 선형 구간은 손대지 않아도 된다.

### 2.7 신규 art asset 필요 목록

**배경 (Area당 1개)**: `bg.castleGateChain`, `bg.greatHall`, `bg.diningRoom`, `bg.parlor`, `bg.office2F`, `bg.corridorDescent`, `bg.greatHallSealed`, `bg.serviceCorridorB1`, `bg.laboratoryB2`, `bg.ritualChamber`, `bg.gr3Ending`

**핵심 소품/캐릭터**: `character.reginald`(신규, 정적 조우용), 초상화·발자국·촛대(대현관), 따뜻한 재·식기(식당), 고개 돌리는 마네킹·피아노(응접실), 일지·커튼(집무실), Hollow 다수 실루엣 베이크(복도), VIRAX 안개·서비스 문(봉쇄된 대현관), 유리관·빈 받침대(실험실), 삼중 링·생명나무·뱀십자 장치·옥색 상자(프롤로그 자산 재사용 가능, 의식실)

---

## 3. 챕터 2·3 에셋 생성 프롬프트

이 절은 1·2절이 확정한 Area 그래프와 "신규 art asset 필요 목록"(1.8/2.7)을 그대로 근거로 삼아, `07-asset-art-scripts.md`가 GR-1에서 실제로 채택한 형식(에셋 id → 컨셉아트 근거 → 비주얼 설명 → AI 이미지 생성 프롬프트 → 구현 메모, 팔레트 토큰 표, 청록=용기 안 전역 규칙)을 GR-2/GR-3에 그대로 적용한다. 컨셉아트는 `ch23-conceptart/` 6장(gr2-village-board·gr2-inn-wine-cityhall-board·gr2-hub-area-view·gr3-castle-upper-board·gr3-castle-lower-lab-board·gr3-vertical-area-view)을 직접 열람한 결과를 1차 근거로 하며, 대응 패널이 없는 항목은 07번 문서와 동일하게 "컨셉아트 없음 — 인접 에셋 재질 상속/텍스트 근거 추정"으로 명시한다. 07번 문서의 3대 전역 규칙(청록=용기 안, 수직 진행에 따른 채도 계단, 렌더러 중복 금지)은 GR-2/GR-3에도 유효하며, 3.0에서 GR-3 지하 한정 규칙 확장만 추가한다.

### 3.0 팔레트 확장 — GR-2/GR-3 신규 토큰

GR-1 토큰(`NIGHT`/`FOREST`/`WET-MUD`/`MUD-REFLECT`/`WET-STONE`/`TIMBER-GREY`/`WARM-CORE`/`WARM-MID`/`WARM-FALL`/`TEAL-HI`/`TEAL-MID`/`TEAL-DEEP`/`RUST-1F`/`ASH-2F`/`ASH-DARK`/`BLOOD-DRY`/`PAPER`/`OCHRE-MARK`)은 전부 그대로 상속한다. GR-2 마을 야간 신과 GR-3 성 상·하층 신에서 컨셉아트가 새로 보여준 색만 아래에 추가한다.

| 토큰 | 헥스 | 관측 출처 | 용도 |
|---|---|---|---|
| `MOON-COLD` | `#3d4a58` | gr2-village-board 하늘, gr3-castle-upper-board 응접실 창밖 | **자연** 야간광(비 갠 하늘·달빛). 청록과 절대 혼동 금지 — 초자연이 아니라 순수 자연 냉색 |
| `BRASS-WARM` | `#b98a4a` | gr2-village-board 잡화점 황동 촛대 | GR-2 마을 계열 금속 소품. GR-1 다락의 검게 산화한 철제 촛대(`prop.candle`)와 재질을 분리하는 지역색 — 마을은 아직 놋쇠를 닦아 쓸 만큼 "사람이 있었다" |
| `WINE-DEEP` | `#3a1220` | gr2-inn-wine-cityhall-board 와인저장소 | 와인병 유리·잔여 액체, 지하 저장고의 유일한 채도 포인트 |
| `CELLAR-DAMP` | `#232a26` | gr2-inn-wine-cityhall-board 와인저장소 바닥 | 지하 저장고 젖은 돌바닥. `WET-STONE`보다 녹조·이끼가 강해 더 어둡고 푸르게 눌린다 |
| `GHOST-LINEN` | `#d8d2c0` | gr3-castle-upper-board 응접실 마네킹 드레스 | 성 상층의 창백한 직물(마네킹 드레스·침구·커튼 안감). 다른 어떤 톤보다 밝아 어둠 속에서 인체 형상으로 오독되도록 설계됐다 |
| `MARBLE-CHECK-LIGHT` / `MARBLE-CHECK-DARK` | `#c9c3b0` / `#1c1a18` | gr3-castle-upper-board 대현관 바닥 | 대현관 체크 대리석 바닥의 명/암 2톤 |
| `PORTRAIT-GOLD` | `#8a6b2e` | gr3-castle-upper-board 초상화 액자, 엘리노어 초상화 | 금박 액자·성 상층 장식 금속 |
| `HEARTH-DEEP` | `#7a2e14` | gr3-castle-upper-board 식당 벽난로 | 벽난로 실화. 촛불(`WARM-CORE`/`WARM-MID`)보다 채도가 높고 면적이 넓은 별도 난색 광원 |
| `TEAL-FLAME` | `#3ecab3` | gr3-castle-lower-lab-board 지하 복도 벽 횃불 | **지하 전용 예외 토큰** — 아래 "규칙 확장" 참고 |
| `VIRAX-GOLD` | `#c9a227` | gr3-castle-lower-lab-board 최종 실험실(의식실) | 의식실 전용 — 청록 배경 위에 떠도는 적금색 안개(LDD 5.5 "청록 중심+적금색 VIRAX 안개") |
| `REGINALD-DARK` | `#171012` | gr3-castle-lower-lab-board 레지널드 시트 | 레지널드 전용 의상색. 거의 검정에 가까운 짙은 자적(burgundy-black) |

**규칙 확장 1 — GR-2의 세 번째 축(자연광 vs 인공광 vs 청록)**: GR-1은 난색(인공: 촛불·랜턴) vs 청록(용기 안 초자연)의 2항 대비였다. GR-2는 실외 야간 신이 많아 축이 하나 늘어난다 — `MOON-COLD`(자연, 비 갠 밤하늘·달빛)가 배경 전체에 순수 톤으로 깔리고, 그 위에 `WARM-MID`/`BRASS-WARM`(인공, 창문·랜턴·촛대)이 국소적으로만 얹힌다. 즉 GR-2의 진짜 정보값은 "인공 온기가 있는 곳=아직 사람의 흔적"과 "자연의 냉기만 남은 곳=버려짐"의 대비이며, 청록은 여전히 그 위에 얹히는 세 번째 신호(초자연 — 분수 수면·잡화점 유리병·모리스 폐가 창)로만 유지한다. GR-1 전역 규칙 1(청록=용기 안)은 GR-2에서 전혀 완화되지 않는다.

**규칙 확장 2 — GR-3 지하는 청록이 "횃불 그 자체"가 된다**: `gr3-castle-lower-lab-board.jpg`의 서비스 복도·실험실을 보면, 청록이 더 이상 유리병·랜턴 같은 작은 용기 안에 갇혀 있지 않고 **벽걸이 횃불 자체가 청록 불꽃으로 타고 있다.** 이는 GR-1/GR-2 전 구간에서 지켜온 "청록=용기 안" 규칙의 명백한 예외이므로, 이 규칙을 지하 두 Area(`serviceCorridorB1`, `laboratoryB2`)에 한해 다음과 같이 확장한다: **"지상(광장·성 상층)의 청록은 아직 국소적 물건에 갇혀 있지만, 지하에서는 청록이 공간의 광원 자체로 확장된다 — VIRAX가 이미 공간 전체에 스며든 상태를 뜻한다."** 의식실(`ritualChamber`)은 이 확장 위에 `VIRAX-GOLD` 안개가 겹쳐 세 번째 조명 단계(감염의 정점, LDD 5.5)를 완성한다 — 상층(난색 지배)→지하(청록 지배)→의식실(청록+적금색 안개)로 이어지는 조명 언어의 단계적 전환이 GR-3 전체의 수직 하강을 색만으로 설명해야 한다.

---

### 3.1 챕터 2 배경 에셋

1.8절 목록의 배경 14종(허브 `villageSquare` + 4스포크 + 성문 + 엔딩) 전부를 아래에 기술한다. 카메라는 GR-1과 동일하게 **top-down 1280×720, 실외 약 70도 하이앵글 / 실내 지붕 제거 평면도**를 유지한다.

#### bg.villageSquare

1. **ID/역할** — `villageSquare`. 허브(Safe Zone), 4스포크 진입점, 수동 저장(석상·촛대).
2. **컨셉아트 근거** — `gr2-village-board.jpg` 좌상 "Ashvale 마을" 컷. **이 컷은 사실상 GR-1 `bg.ending`(image19) 정본과 동일한 장면을 다른 앵글로 재확인한 것**이다 — GR-2가 GR-1이 끝난 바로 그 광장에서 시작한다는 연속성이 컨셉아트 단계에서 이미 보장돼 있다.
3. **비주얼 설명** — 거대한 석상이 마른 분수 수반을 가로질러 완전히 쓰러져 있고, **목이 완전히 분리되어 몸에서 떨어진 채** 근처에 나뒹군다(LDD 텍스트는 "목 꺾인 석상"이라 쓰지만 아트가 보여주는 것은 절단·분리다 — 07번 문서가 `bg.ending`에서 이미 내린 것과 같은 판단으로 **아트를 정본으로 채택**한다). 그 뒤로 문장이 새겨진 돌 기둥, 지붕이 꺼진 목골조 폐가들이 늘어서고 찢어진 배너·빨랫줄이 사이사이 걸려 있다. 좌측에 철제 문장 간판이 사슬로 매달려 있고, 배경 언덕 위로 고딕 첨탑들이 안개 속에 솟아 있다(GR-3 예고, GR-1 `bg.bridge`가 이미 심어 둔 복선의 회수). 분수 수반에 고인 얕은 물만 `TEAL-DEEP`으로 빛나는 것이 화면 유일한 색이다.
4. **연속성** — GR-1 `bg.ending`과 **같은 석상·같은 분수**를 재사용하는 것이 원칙이다. 카메라만 게임플레이용 하이앵글로 재조정하고, 석상 파손 형태(머리 완전 분리)는 절대 어긋나지 않게 통일한다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, high-angle overhead view of a dead medieval village square, a colossal stone statue toppled across a dry fountain basin with its head fully severed and lying apart from the body, a carved stone pillar behind it, collapsing half-timbered houses with torn banners strung between them, a heraldic iron sign hanging on chains at the left, gothic castle spires faint on a distant hill through fog, the shallow water in the fountain basin glowing faint teal as the only color, overcast grey-blue sky after rain, wet leaf-strewn cobblestones, painterly horror concept art, palette #3d4a58 #3a4240 #2b3330 with one #0e4a45 accent --no vignette, rain streaks, text, watermark, characters, warm window lights, first-person perspective`
6. **구현 메모** — 1280×720. `villageSquare`는 sighting 트리거가 절대 없는 유일한 Area이므로(1.1) 배경에 위협 실루엣을 베이크하지 말 것.

#### bg.marketStreet

1. **ID/역할** — `marketStreet`. 상점가 잡화점, 장부 단서(자동 체크포인트).
2. **컨셉아트 근거** — `gr2-village-board.jpg` 우상 "잡화점과 장부" — 정본.
3. **비주얼 설명** — 좌우 선반에 유리병·항아리가 빼곡하고 그중 일부만 옅은 초록빛 액체(용기 안 — 규칙 위반 아님)를 담고 있다. 중앙 나무 탁자 위에 **펼쳐진 장부**가 놓이고 그 옆에 놋쇠(황동) 촛대(`BRASS-WARM`)가 강하게 빛나며 화면에서 가장 밝은 지점이 된다. 촛불 2개가 좌측에서 따로 타고 있어 이중 광원 구조(GR-1 `bg.cabinA`와 같은 문법). 안쪽 열린 문 너머로 비에 젖은 회색 골목(`marketAlley`로 이어지는 복도)이 살짝 보이고 랜턴 불빛이 걸려 있다. 우측 창은 차가운 `MOON-COLD` 빛.
4. **연속성** — 문틈으로 보이는 골목 재질(젖은 포석·랜턴)이 `bg.marketAlley`와 동일한 벽돌·간판 색을 써야 한다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of a cluttered general store interior, shelves packed with jars and bottles a few glowing faint green inside, a thick leather ledger open on a central wooden table beside a glowing brass candlestick as the brightest object, two candles burning separately on the left wall, an open doorway at the back revealing a rain-wet grey alley with a distant lantern, one cold moonlit window on the right, painterly horror concept art, palette #b98a4a #ffd79a #3d4a58 #2e2a22 --no vignette, text, watermark, characters, teal ambient tint, first-person perspective`
6. **구현 메모** — 1280×720. 장부는 `prop.ledger`로 별도 레이어 분리(모달 확대 대비).

#### bg.marketAlley

1. **ID/역할** — `marketAlley`. Hollow 첫 정면 조우(반사면).
2. **컨셉아트 근거** — **없음** — 전용 패널 없음. `gr2-village-board.jpg`의 골목 재질(젖은 포석, 목골조 벽, 청록 랜턴)과 `bg.marketStreet` 문틈 뷰에서 상속.
3. **비주얼 설명** — 좁고 긴 골목, 양옆 목골조 벽면이 화면 세로를 가른다. 중앙에 **금 간 거울**(설계 신규 프롭, `prop.crackedMirror`)이 벽에 기대 세워져 있고, 그 표면에 스치듯 반사되는 것이 sighting 트리거다. 청록 랜턴 하나가 벽 브래킷에 걸려 골목 안쪽으로 갈수록 어둡게 죽는 원근을 만든다(GR-1 전역 규칙 1 — 용기 안). 젖은 포석에 랜턴 빛이 짧게 반사된다. 골목 끝은 `houseExterior` 쪽으로 완전한 `NIGHT`.
4. **연속성** — `bg.marketStreet`와 같은 골목의 다른 각도이므로 벽돌·목골조 색과 청록 랜턴 형태를 통일한다(`prop.torch` 청록 변형 재사용).
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic overhead view of a narrow alley between half-timbered walls, a cracked standing mirror leaning against the wall at the center reflecting a distorted glimpse of something not quite human, a single teal lantern on an iron bracket casting cold light and a shadow grid, wet cobblestones with a short reflection, the alley darkening to near-black toward the far end, painterly horror concept art, palette #3d4a58 #241d16 #22c4ad #151d19 --no vignette, warm light, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. 거울 표면은 별도 알파 레이어로 분리해 sighting 발동 시 Hollow 실루엣을 겹쳐 그릴 수 있게 한다.

#### bg.houseExterior

1. **ID/역할** — `houseExterior`. 모리스 폐가 현관, 빗장 열기.
2. **컨셉아트 근거** — **없음** — 전용 패널 없음. `gr2-village-board.jpg` 좌상 광장 배경의 무너진 목골조 폐가 매싱에서 상속.
3. **비주얼 설명** — 지붕 일부가 꺼진 2층 목골조 집 현관. 문에 **나무 빗장**(`prop.doorBar`)이 걸려 있고 표면이 습기로 부풀었다. 창 하나에서만 아주 옅은 청록빛이 새어 나온다(내부 창의 예고 — `houseInterior`와 연속). 벽널은 `TIMBER-GREY`, 문 주변 나무는 빗물에 짙게 젖어 거의 검다. 주변 지면은 `MOON-COLD` 톤의 젖은 포석.
4. **연속성** — 창에서 새는 청록빛이 `houseInterior`의 창문 광원과 정확히 같은 색·밝기여야 한다(같은 창을 안팎에서 보는 것).
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic high-angle view of a decaying two-story half-timbered house entrance with a partially collapsed roof, a swollen wooden door bar across the entrance, one window leaking a faint teal glow from inside, weathered dark timber walls soaked black with rain, wet cobblestones in cold moonlight, painterly horror concept art, palette #4a463e #171d1b #3d4a58 with one #22c4ad window --no vignette, warm light, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. 빗장 프롭은 열림/닫힘 2상태로 별도 제작.

#### bg.houseInterior

1. **ID/역할** — `houseInterior`. 은신 연출 + 일기(○ 진실 조각).
2. **컨셉아트 근거** — `gr2-village-board.jpg` 좌하 "모리스의 집" — 정본.
3. **비주얼 설명** — 좌측 벽난로는 불이 꺼져 있고, **창문에서 냉랭한 청록빛이 들어온다** — 이 집이 GR-1 규칙 1의 유례없는 예외 사례(청록이 용기가 아니라 창을 통해 들어온다)인데, 이는 모리스의 집 자체가 VIRAX 감염의 물증이라는 서사로 해석해 예외를 정당화한다(3.0의 GR-3 지하 규칙 확장과 같은 논리를 미리 보여주는 사례). 침대는 이불이 헝클어지고, **바닥에 폭 넓은 끌림 자국**이 문 쪽으로 나 있다. 문이 열려 있고 그 너머 다른 방에 작은 촛불(`WARM-CORE`) 하나가 보인다 — 은신처(침대 밑)로 향하는 시선 유도. 일기(`prop.diary`)는 침대 옆 협탁 위에 놓여 있다.
4. **연속성** — 창문 청록빛은 `houseExterior`의 새는 빛과 동일 색. 침대·문 위치는 은신 연출(`house.hide`)의 좌표와 정확히 맞아야 한다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x670, orthographic floor-plan view of a ransacked bedroom, roof removed, a cold window letting in an eerie teal glow, a stone fireplace gone dark and cold, a disheveled bed with a wide drag mark scraped across the floor toward an open door, a small warm candle glowing faintly in another room visible through that doorway, a diary on a bedside table, damp stained floorboards, painterly horror concept art, palette #22c4ad #171d1b #e8a04e #3b3733 --no vignette, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. 끌림 자국은 GR-1 `bg.cabinB1` 긁힌 자국과 같은 시각 문법(폭 40px 내외) 재사용.

#### bg.innGroundFloor

1. **ID/역할** — `innGroundFloor`. 여관 1층(The Black Lamb), 수동 저장(2번째 촛대), 지하 입구.
2. **컨셉아트 근거** — `gr2-village-board.jpg` 우하 "여관" — **외관 컷만 존재**(실내 전용 패널 없음). 외관 재질·조명을 실내 입구 홀로 확장 상속.
3. **비주얼 설명** — 원본 외관 확정 사실: 돌+목골조 혼합 건물, 문 옆에 **청록 랜턴** 하나(규칙 1 사례), 위쪽에 짐승 머리(양/염소) 형태의 목제 간판이 사슬로 걸려 있다. 창 몇 개에서 여전히 **따뜻한 불빛**이 새어 나와 이 건물이 "아직 인공 온기가 남은 곳"임을 시각적으로 표시한다(3.0 규칙 확장 1). 실내 입구 홀은 이 외관의 재질을 계승해 돌바닥+목재 골조, 중앙에 봉헌 촛대(`prop.innCandle`, 놋쇠 기둥형), 게시판(`prop.innNoticeBoard`) 하나를 벽에 건다.
4. **연속성** — 문 옆 청록 랜턴은 반드시 유지(마을 전체 청록 네트워크의 한 매듭). 지하 계단 입구는 화면 어둡게 처리해 `innCellar`로의 하강을 예고.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of an inn's ground floor common room, stone and timber construction, a brass pillar candelabrum burning at the center as a votive save point, a wooden notice board with tattered papers on one wall, a few windows still holding warm inviting light, a teal lantern glow bleeding in near the entrance, a dark stairway descending into shadow at the back signaling a cellar below, damp wood floor, painterly horror concept art, palette #e8a04e #b98a4a #3d4a58 with one #22c4ad accent --no vignette, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. 실내 컨셉아트가 없으므로 아트 디렉터 확인 필요 항목으로 표시(07번 문서의 "미해결 결정 사항" 관례와 동일).

#### bg.innCellar

1. **ID/역할** — `innCellar`. 와인 선반 퍼즐(1.3), 자동 체크포인트(`wine.serpentBox`).
2. **컨셉아트 근거** — `gr2-inn-wine-cityhall-board.jpg` 좌상 "와인저장소" — 정본.
3. **비주얼 설명** — 좌우로 늘어선 나무 와인 선반(퍼즐 요구사항에 맞춰 **6단, I~VI 번호**를 새겨 넣어야 함 — 원본은 선반 수가 불특정하므로 이 부분만 연출 요구에 맞춰 조정). 바닥은 젖은 돌(`CELLAR-DAMP`)에 물웅덩이가 고여 우측 안쪽에서 나오는 **청록빛을 반사**한다(작은 유리병/등 형태 광원 — 규칙 1 준수). 좌측 끝에 촛불 하나가 첫 선반열만 겨우 밝힌다. 중앙 통로 바닥에 방향 시구가 적힌 약도(`prop.wineMap`)를 놓을 자리를 비워 둔다.
4. **연속성** — 안쪽 청록빛은 `wine.serpentBox`(뱀 나무 상자) 개방 이후 강해지는 연출의 기준광이 된다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of a wine cellar storeroom, two rows of wooden wine racks numbered I through VI facing each other across a narrow aisle, damp dark stone floor with a puddle reflecting a cold teal glow from something glowing at the far end, one candle barely lighting the nearest rack on the left, an open patch of floor at the center for a small map, painterly horror concept art, palette #3a1220 #232a26 #ffd79a #22c4ad --no vignette, text, watermark, characters, warm ambient tint, first-person perspective`
6. **구현 메모** — 1280×720. 6단 선반은 `wine.shelfI`~`VI` 인터랙션 좌표와 1:1 매핑되도록 균등 간격 배치.

#### bg.innCellarEscape

1. **ID/역할** — `innCellarEscape`. 환풍구 통로, Maw 근접 연출, 강제 편도 탈출.
2. **컨셉아트 근거** — **없음** — 전용 패널 없음. `innCellar`의 돌·목재 재질을 좁은 통로로 축소 상속.
3. **비주얼 설명** — 저장고보다 훨씬 좁은 돌 통로. 청록빛은 완전히 사라지고(위협이 국소 물건이 아니라 통로 전체를 채우는 상태로 전환 — GR-3 지하 규칙 확장과 유사한 논리를 미리 보여줌) 대신 화면 상단에 **환풍구**(`prop.airVent`, 격자 실루엣)가 유일한 밝은 탈출구로 빛난다. 바닥은 좁아지는 원근으로 압박감을 준다. GR-1 `bg.chase`처럼 "멈추면 안 되는 구간"이라 디테일보다 방향성이 우선.
4. **연속성** — `innCellar`의 돌 재질·색조를 계승하되 채도를 더 낮춘다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic overhead view of a narrowing stone service tunnel, walls closing in with converging perspective, a barred air vent glowing pale at the top of frame as the only bright exit cue, damp dark stone floor, no teal light anywhere, urgent and claustrophobic, painterly horror concept art, palette #171d1b #232a26 #c9c3b0 --no vignette, teal light, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. 환풍구는 `prop.airVent`로 별도 레이어 분리, 포탈 위치와 정렬.

#### bg.townHallExterior

1. **ID/역할** — `townHallExterior`. 외부 충돌음 연출.
2. **컨셉아트 근거** — **없음** — 전용 패널 없음. 광장 배경의 석조 건물 매싱과 첨탑 실루엣에서 상속(잡화점·여관과 달리 시청은 목골조가 아니라 관공서형 석조 건물로 차별화).
3. **비주얼 설명** — 화면 대부분을 채우는 육중한 석조 파사드, 아치형 정문, 좌우로 낮은 첨탑 장식. 계단 앞에 물웅덩이가 하늘을 반사(`MOON-COLD`)한다. 창은 전부 꺼져 있다(광장과 같은 무광 원칙). 정문 안쪽에서 아주 옅은 촛불빛이 새어 나와 `townHallInterior`로의 진입을 예고.
4. **연속성** — 석조 재질은 `townGate`의 성벽 재질과 통일해 "시청과 성문이 같은 마을 석재 계보"로 읽히게 한다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic high-angle view of a massive stone town hall facade with an arched entrance and low flanking towers, a puddle on the steps reflecting the cold night sky, all windows dark, a faint warm candle glow leaking from the entrance archway, painterly horror concept art, palette #3d4a58 #3a4240 with one thin #e8a04e sliver --no vignette, text, watermark, characters, lit windows, first-person perspective`
6. **구현 메모** — 1280×720. `civic.thud`(외부 충돌음) 사운드 트리거와 함께 재생될 배경이므로 정적 구도로 제작.

#### bg.townHallInterior

1. **ID/역할** — `townHallInterior`. 네 기둥·숯 흔적 탐색.
2. **컨셉아트 근거** — `gr2-inn-wine-cityhall-board.jpg` 우하 "시청 4개의 기둥" — 정본.
3. **비주얼 설명** — 길게 뻗은 홀, 좌우로 **네 개의 큰 석조 기둥**이 늘어서고 각 기둥에 문자가 새겨진 명패(엘리노어·아이작·마사·토머스의 원형)가 붙어 있다. 중앙에 낡은 긴 탁자와 흩어진 문서, 촛대 여러 개가 탁자를 따라 타고 있다. 안쪽 문이 열려 비바람 부는 바깥(위협 실루엣이 어렴풋이 비치는 원경)이 살짝 보인다 — 이 문틈이 "충돌음"의 시각적 근원이다. 기둥 밑동 한 곳에 **숯 흔적**(그을린 자국)을 추가해 텍스트 단서("네 기둥·숯 흔적")를 형태로 확정한다. 바닥은 금 간 체크 타일.
4. **연속성** — 기둥의 명패 문양(원형 장식)은 `townHallRecords`의 개별 명패(`prop.nameplate`) 4개와 같은 문장 디자인을 공유해야 "같은 네 이름"으로 읽힌다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of a long town hall chamber with four tall stone pillars in two rows, each pillar bearing a carved circular nameplate, one pillar base marked with a scorch stain, a long table down the center scattered with documents and several burning candles, cracked checkered floor tiles, a far door ajar to a stormy exterior with a faint distant silhouette, painterly horror concept art, palette #4a463e #ffd79a #1c1a18 #3d4a58 --no vignette, text, watermark, characters, teal light, first-person perspective`
6. **구현 메모** — 1280×720. 실루엣은 정지 데코레이션(1.5)이며 클릭 불가.

#### bg.townHallRecords

1. **ID/역할** — `townHallRecords`. 네 이름 필사(✠ 진실 조각).
2. **컨셉아트 근거** — `gr2-inn-wine-cityhall-board.jpg` 우상 "시청" — 정본.
3. **비주얼 설명** — 벽 전체가 압정으로 고정한 문서·공고문으로 뒤덮여 있고, 높은 책장이 안쪽까지 이어진다. 중앙 책상에 펼쳐진 책과 촛불 하나가 화면에서 가장 밝은 지점을 만들고, 그 위 선반에 **저울처럼 매달린 작은 청록 발광체**(규칙 1 준수 — 유리 용기 안)가 걸려 옅은 청록빛을 아래로 던진다. 바닥에 서류가 흩어지고 초록빛 낡은 러그가 깔려 있다. 안쪽 고딕 아치 창으로 비 오는 밤이 보인다.
4. **연속성** — 청록 발광체는 `townHallInterior`의 순수 난색 구성과 대비되어 "여기가 더 깊은 진실이 보관된 곳"임을 색으로 알린다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x670, orthographic floor-plan view of a records archive room, walls covered edge to edge with pinned documents and notices, tall bookshelves receding into the back, a central desk with an open book lit by a single candle as the brightest point, a small teal-glowing vessel hanging above the desk like a scale casting faint cold light, papers scattered on a worn green rug floor, a gothic arched window showing rain outside, painterly horror concept art, palette #ffd79a #22c4ad #b9a270 #3d4a58 --no vignette, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. 명패 4개(`prop.nameplate`)는 이 방 안 클릭 가능 인터랙션 좌표에 배치.

#### bg.townGate

1. **ID/역할** — `townGate`. 세 진실+네 이름 석판(1.4), 자동 체크포인트, GR-2 최종 판정.
2. **컨셉아트 근거** — **없음** — 전용 패널 없음. GR-1 `bg.gate`(돌벽+철문+난색 랜턴 2개)와 `villageSquare`의 철제 문장 간판 모티프를 계승해 구성.
3. **비주얼 설명** — GR-1 관문과 같은 계보의 육중한 돌벽·철문이지만, 이번엔 문 앞에 **△○✠ 세 홈이 파인 석판**(`prop.gateSlab`)이 놓여 세 진실 조각을 삽입하는 장치가 된다. 아치 양옆 랜턴은 여전히 난색(`prop.torch` 재사용)이지만, 석판의 세 홈은 진실이 채워질 때마다 청록으로 점등되도록(용기 안 규칙 — 홈 자체가 "그릇") 빈 홈은 어둡게, 채워진 홈만 `TEAL-MID`로 처리한다. 문 너머로 마을 광장이 아니라 이번엔 **성으로 가는 길**이 흐릿하게 이어진다.
4. **연속성** — 돌벽·철문 재질은 GR-1 `bg.gate`를 그대로 계승(같은 관문 건축 언어).
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic high-angle view of a rough stone rampart with a rusted iron gate, a stone slab in front of the gate carved with three empty sockets shaped as a triangle, a ring, and a cross, two warm lanterns flanking the arch, one socket glowing teal already filled while two remain dark and empty, a faint path toward a distant castle silhouette beyond the gate, painterly horror concept art, palette #3a4240 #6a4a33 #e8a04e #22c4ad --no vignette, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. 세 홈은 각각 알파 레이어로 분리해 진실 조각 보유 상태에 따라 점등/소등 전환.

#### bg.villageChaseFinal

1. **ID/역할** — `villageChaseFinal`. 마을 기상, 다중 위협 연출, 편도.
2. **컨셉아트 근거** — **없음** — 전용 패널 없음. `villageSquare`의 건물 매싱을 재사용하되 날씨를 격화시키고 위협 실루엣을 추가.
3. **비주얼 설명** — `villageSquare`와 같은 건물들이지만 비바람이 훨씬 거세지고(Wailer 호출 연출), 배경 곳곳에 **Hollow+Wailers 다수 실루엣**(1.5 — 다중 개체는 아트로만 근사)이 창문·골목 입구에 정지 데코레이션으로 베이크된다. 성 첨탑이 이전보다 훨씬 크고 가깝게 보여 "성에 가까워졌다"는 방향 정보를 준다. 색은 여전히 `MOON-COLD` 지배, 청록은 등장하지 않는다(GR-1 `bg.chase`와 동일 원칙 — 멈춰서 관찰하는 구간이 아니다).
4. **연속성** — 건물 실루엣·색은 `villageSquare`와 동일 원본에서 파생, 날씨·실루엣 밀도만 다르다(GR-1 `bg.cabinA`↔`bg.cabinA.visited` 페어 제작 방식과 동일 원칙).
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic high-angle view of the SAME dead village square as before but in violent storm weather, multiple dark humanoid silhouettes gathered at windows and alley mouths in the background, the gothic castle spires now larger and closer on the hill, urgent and directional composition, no teal light anywhere, painterly horror concept art, palette #3d4a58 #171d1b #2b3330 --no vignette, teal light, text, watermark, characters in foreground, first-person perspective`
6. **구현 메모** — 1280×720. 실루엣 전부 정지 데코레이션, 클릭 불가.

#### bg.gr2Ending

1. **ID/역할** — `ending`(GR-2). CHAPTER 2 COMPLETE, GR-3 전환 카드.
2. **컨셉아트 근거** — **없음** — GR-1 `bg.ending`과 같은 성격의 엔딩 카드. `townGate` 너머로 보이던 성을 정면으로 당겨 그린다.
3. **비주얼 설명** — 화면 대부분이 안개 속 **Blackwood Castle 정문**이다 — 청동 대문이 반쯤 열려 안쪽 대현관의 따뜻한 촛불빛이 아주 작게 새어 나온다(성 내부가 GR-3에서 난색 지배임을 미리 예고). 전경은 젖은 진입로, 하늘은 `MOON-COLD`. GR-1 엔딩(`bg.ending`)이 "무광의 마을"로 끝났다면 이 컷은 "저 안엔 아직 불이 켜져 있다"는 불길한 대비로 끝난다.
4. **연속성** — 성 첨탑 실루엣은 `townGate`/`villageChaseFinal`에서 계속 봐 온 것과 같은 실루엣.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, high-angle view centered on the entrance of a huge gothic castle in fog, tall bronze doors slightly ajar with a small warm candlelit glow leaking from deep inside the entrance hall, a wet approach path in the foreground, cold moonlit grey-blue sky, ominous and inviting at once, painterly horror concept art, palette #3d4a58 #3a4240 with one small #e8a04e glow --no vignette, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. HUD·비네트가 덮이므로 핵심 정보(문틈 촛불빛)를 중앙 250px 반경 안에 배치.

#### 3.1.1 챕터 2 핵심 소품

07번 문서 4장과 동일한 방식(위치별 그룹, top-down 오소그래픽, 4배 해상도 원본)으로 제작한다. 전용 컨셉아트가 있는 항목만 근거를 명시하고, 없는 항목은 인접 배경에서 재질을 상속한다.

| id | 위치 | 컨셉아트 근거 | 비주얼 요약 | 이미지 생성 프롬프트 |
|---|---|---|---|---|
| `prop.statue` | `villageSquare` | gr2-village-board (정본) | 목이 완전히 분리된 거대 석상 몸체, 이끼·풍화, 절단면만 밝게 | `top-down 2D game prop sprite, a colossal fallen stone statue body lying across a fountain rim, the neck cleanly severed with a paler cut surface, mossy weathered stone, painterly horror concept art, palette #5e5952 #9a958f #2d3a2c, transparent background, orthographic overhead view --no head nearby, blood, vignette, text, watermark, background` |
| `prop.fountain` | `villageSquare` | gr2-village-board (정본) | 마른 분수 수반, 고인 물만 청록 반사 | `top-down 2D game prop sprite, a dry stone fountain basin with a shallow pool of water glowing faint teal from sky reflection, cracked rim, moss at the base, painterly horror concept art, palette #3a4240 #0e4a45 #2d3a2c, transparent background, orthographic overhead view --no fountain spray, glow, vignette, text, watermark, background` |
| `prop.noticeBoard` | `villageSquare` | 없음(추정) | 낡은 목제 게시판, 찢어진 공고문 | `top-down 2D game prop sprite, a weathered wooden notice board with torn rain-soaked papers pinned and peeling, painterly horror concept art, palette #4a463e #b9a270 #2a2318, transparent background, orthographic overhead view --no readable text, vignette, watermark, background` |
| `prop.ledger` | `marketStreet` | gr2-village-board (정본) | 펼쳐진 장부, 손글씨 열, 황동 촛대와 짝 | `top-down 2D game prop sprite, a thick ledger open on a table with dense handwritten tally columns beside a glowing brass candlestick, painterly horror concept art, palette #b9a270 #b98a4a #ffd79a, transparent background, orthographic overhead view --no readable text, vignette, watermark, modern book, background` |
| `prop.marketShelf` | `marketStreet` | gr2-village-board (정본) | 유리병·항아리 빼곡한 선반 | `top-down 2D game prop sprite, a shop shelf crowded with glass jars and clay jugs, one or two jars holding faint green liquid inside their glass, painterly horror concept art, palette #4a463e #6b7052, transparent background, orthographic overhead view --no ambient glow outside jars, vignette, watermark, background` |
| `prop.crackedMirror` | `marketAlley` | 없음(추정) | 금 간 거울, sighting 반사면 | `top-down 2D game prop sprite, a tall standing mirror leaning against a wall with a spiderweb crack across the glass, a faint distorted reflection barely visible, tarnished wooden frame, painterly horror concept art, palette #3d4a58 #4a463e, transparent background, orthographic overhead view --no clear reflection, face, vignette, text, watermark, background` |
| `prop.doorBar` | `houseExterior` | 없음(추정) | 부푼 나무 빗장 | `top-down 2D game prop sprite, a swollen waterlogged wooden door bar across a doorway, iron brackets, painterly horror concept art, palette #4a463e #241d16, transparent background, orthographic overhead view --no vignette, text, watermark, background` |
| `prop.bed` / `prop.diary` | `houseInterior` | gr2-village-board (정본) | 헝클어진 침대, 협탁 위 일기 | `top-down 2D game prop sprite, a disheveled bed with tangled sheets beside a small bedside table holding a closed leather diary, cold teal window light falling across the fabric, painterly horror concept art, palette #d8d2c0 #22c4ad #4a1512, transparent background, orthographic overhead view --no vignette, text, watermark, background` |
| `prop.innNoticeBoard` / `prop.innCandle` | `innGroundFloor` | gr2-village-board (외관 근거) | 여관 게시판 + 놋쇠 기둥형 촛대(수동 저장) | `top-down 2D game prop sprite, a brass pillar candelabrum with a single tall flame beside a wooden inn notice board with weathered papers, painterly horror concept art, palette #b98a4a #ffd79a #4a463e, transparent background, orthographic overhead view --no vignette, text, watermark, background` |
| `prop.wineShelf` ×6 | `innCellar` | gr2-inn-wine-cityhall-board (정본) | 번호 I~VI 새겨진 나무 선반, 병목 정렬 | `top-down 2D game prop sprite, a wooden wine rack shelf holding a row of dusty bottles, a small carved roman numeral on the frame, painterly horror concept art, palette #3a1220 #4a463e #232a26, transparent background, orthographic overhead view --no readable label, vignette, text, watermark, background` |
| `prop.wineMap` | `innCellar` | gr2-inn-wine-cityhall-board (정본) | 중앙 약도 + 방향 시구 | `top-down 2D game prop sprite, a small hand-drawn diagram scroll on the cellar floor showing directional verses around a compass rose, aged paper, painterly horror concept art, palette #b9a270 #8a7549, transparent background, orthographic overhead view --no readable text, vignette, watermark, background` |
| `prop.serpentBox` | `innCellar` | 없음(추정) | 뱀이 감긴 나무 상자(VI 선반 위) | `top-down 2D game prop sprite, a carved wooden box with a serpent motif coiled around its lid resting on the sixth wine shelf, worn dark wood, painterly horror concept art, palette #3a1220 #4a463e #6b5233, transparent background, orthographic overhead view --no glow, vignette, text, watermark, background` |
| `prop.airVent` | `innCellarEscape` | 없음(추정) | 격자 환풍구, 유일한 밝은 탈출구 | `top-down 2D game prop sprite, a barred iron air vent grate glowing faintly pale from outside light, rusted frame, painterly horror concept art, palette #c9c3b0 #241d16, transparent background, orthographic overhead view --no teal, vignette, text, watermark, background` |
| `prop.hallPillar` | `townHallInterior` | gr2-inn-wine-cityhall-board (정본) | 원형 명패가 붙은 석조 기둥, 밑동 숯 흔적 | `top-down 2D game prop sprite, a tall stone pillar with a carved circular nameplate medallion, one side of its base scorched black, painterly horror concept art, palette #4a463e #1c1a18 #8a6b2e, transparent background, orthographic overhead view --no readable text, vignette, watermark, background` |
| `prop.nameplate` ×4 | `townHallRecords` | gr2-inn-wine-cityhall-board (간접) | 작은 원형 명패 4개(엘리노어·아이작·마사·토머스) | `top-down 2D game prop sprite, a small carved circular brass nameplate medallion mounted on a wooden stand, tarnished engraving, painterly horror concept art, palette #8a6b2e #4a463e, transparent background, orthographic overhead view --no readable text, vignette, watermark, background` |
| `prop.gateSlab` | `townGate` | 없음(추정, `bg.gate` 계보) | △○✠ 세 홈 석판, 채움 상태별 점등 | `top-down 2D game prop sprite, a stone slab with three carved empty sockets shaped as a triangle, a ring, and a cross, one socket glowing teal when filled and two dark when empty, weathered granite, painterly horror concept art, palette #3a4240 #22c4ad, transparent background, orthographic overhead view --no full glow on all sockets, vignette, text, watermark, background` |

**GR-2 신규 캐릭터 확인**: 1.8/2.7 목록과 `gr2-hub-area-view.png`를 대조한 결과 GR-2에는 `character.reginald`류의 신규 캐릭터 스프라이트가 없다. GR-2의 유일한 위협(Hollow/Maw/Wailers/Beast)은 전부 GR-1에서 이미 제작된 `enemy.hollow`를 재사용하거나(1.5) 배경에 베이크된 정지 실루엣으로만 존재한다.

---

### 3.2 챕터 3 배경 에셋

2.7절 목록의 배경 11종(상층 허브 + 하층 강제 편도 체인) 전부를 기술한다. 카메라 원칙은 3.1과 동일.

#### bg.castleGateChain

1. **ID/역할** — `castleGateChain`. 진입, 체인으로 봉쇄(복귀 불가 선언).
2. **컨셉아트 근거** — **없음** — 전용 패널 없음. 청동 대문 클로즈업이 `bg.gr2Ending`에 이미 그려져 있으므로 그 안쪽(통과 직후)을 그린다.
3. **비주얼 설명** — 화면 중앙에서 방금 통과한 청동 대문의 안쪽 면, 굵은 체인이 화면을 가로질러 당겨지는 동작 프레임(정지 아트로는 체인이 이미 걸린 상태). 문 안쪽은 곧바로 `greatHall`의 체크 대리석 바닥이 어렴풋이 이어지는 원경으로 연출해 다음 Area와의 연속성을 확보. 청동은 녹청(`#3d5a4a`)이 덮였고 촛불 하나가 문 옆 벽감에서 탄다.
4. **연속성** — 안쪽으로 보이는 체크 바닥·촛불 색은 `greatHall`과 동일해야 한다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic high-angle view of the inner side of massive bronze castle doors with a thick chain already drawn across them, verdigris-covered bronze, one candle burning in a wall niche beside the door, a glimpse of a checkered marble floor receding into the hall beyond, painterly horror concept art, palette #3d5a4a #1c1a18 #ffd79a --no vignette, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. `gate3.chain` 인터랙션 좌표에 체인 클로즈업 배치.

#### bg.greatHall

1. **ID/역할** — `greatHall`. 대현관(허브), 상층 자유 탐험 허브, 수동 저장.
2. **컨셉아트 근거** — `gr3-castle-upper-board.jpg` 좌상 "Ashvale 성" — 정본.
3. **비주얼 설명** — 흑백 체크 대리석 바닥(`MARBLE-CHECK-LIGHT`/`DARK`)이 화면 대부분을 채우고, 중앙 뒤편에 웅장한 계단이 두 갈래로 갈라지며 위층(`office2F`)으로 이어진다. 양옆 벽에 촛불 스콘스가 줄지어 타 화면을 고르게 데운다(`WARM-MID`). 계단 아래 작은 의자 하나(권좌형)가 놓여 있고, 문 근처 바닥에 **작은 청록 발광체**(유리병/등 — 규칙 1 준수) 하나가 놓여 옅은 빛을 던진다. 전경 좌측 바닥에 촛불 하나가 낮게 탄다. 벽은 짙은 목재 패널링과 기둥.
4. **연속성** — 계단 상단이 `office2F`로, 좌우 문이 `diningRoom`/`parlor`로 이어지므로 세 문 모두 같은 목재 패널·촛불 스콘스 언어를 공유해야 "같은 저택"으로 읽힌다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of a grand castle entrance hall with black-and-white checkered marble floor, a wide split staircase at the back leading up, rows of warm candle sconces lining the dark wood-paneled walls, an ornate throne-like chair at the base of the stairs, a small teal-glowing vessel on the floor near a side door casting faint cold light, one low candle burning in the foreground, painterly horror concept art, palette #c9c3b0 #1c1a18 #e8a04e #8a6b2e with one #22c4ad accent --no vignette, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. `hall.candle`(수동 저장) 좌표는 전경 촛불과 일치시킬 것.

#### bg.diningRoom

1. **ID/역할** — `diningRoom`. 식당, 정적 공포(따뜻한 재).
2. **컨셉아트 근거** — `gr3-castle-upper-board.jpg` 우상 "Ashvale 성 식당" — 정본.
3. **비주얼 설명** — 좌측 대형 벽난로에서 여전히 불이 타고 있다(`HEARTH-DEEP`, GR-1 `bg.cabinA`의 "안도" 패턴과 정반대로 여기선 불이 타고 있는데 아무도 없다는 사실 자체가 공포). 긴 연회 탁자 위에 은제 덮개 접시·식기가 그대로 차려져 있고, 여러 개의 촛대가 탁자를 따라 타며 화면 중앙을 밝힌다. 탁자 중앙 근처에 **작은 청록 발광 병**(규칙 1)이 놓여 있다. 벽에는 금박 액자 초상화들(`PORTRAIT-GOLD`)이 줄지어 걸려 있다. 안쪽 아치 통로 너머로 창백한 달빛이 비치는 복도가 보인다.
4. **연속성** — 벽난로·초상화 재질은 `parlor`와 공유(같은 저택의 두 방).
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of a grand dining hall, a large stone fireplace with live fire burning unattended on the left, a long banquet table set with a silver domed platter and full place settings, several candelabra burning down the table's length, a small teal-glowing bottle near the center of the table, gilt-framed portraits lining the walls, a distant archway showing cold moonlit corridor beyond, painterly horror concept art, palette #7a2e14 #ffd79a #8a6b2e #3d4a58 with one #22c4ad accent --no vignette, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. `dining.embers`/`dining.table` 두 인터랙션 좌표를 벽난로/탁자 각각에 배치.

#### bg.parlor

1. **ID/역할** — `parlor`. 응접실, 정적 공포(마네킹).
2. **컨셉아트 근거** — `gr3-castle-upper-board.jpg` 좌하 "Blackwood castle 응접실" — 정본.
3. **비주얼 설명** — *(2026-08-20 마스터 시나리오 기준 정정 — 마네킹 기술이 원문 1074~1079행과 달랐다: "창백한 드레스"가 아니라 **검은 드레스**, 그리고 얼굴은 비워두는 것이 아니라 **그려져 있어야 한다**.)* 좌측에 낡은 피아노, 펼쳐진 자장가 악보와 촛불 두어 개가 건반 위를 비춘다. 상단 좌측 아치창으로 차가운 `MOON-COLD` 달빛이 붉은 무늬 벽지 위로 길게 떨어진다. 벨벳 소파들은 단정하게 놓여 있고, 우측 벽난로 앞 높은 의자에 **검은 드레스를 입힌 나무 마네킹**이 앉아 있다 — 매끄러운 나무 얼굴 위에 서툰 솜씨로 눈·코·입이 그려져 있으며, 그 얼굴은 식당 상석 뒤 그림 속 엘리노어의 얼굴이다. 이 실루엣이 "고개를 돌리는" sighting 연출의 대상이다. 복도 쪽 초상화들은 대부분 얼굴이 긁혀 있지만 레지널드의 초상만 온전하다(1073행). 바닥 좌하단에 작은 청록 발광 병(규칙 1)이 놓여 있다. 짙은 붉은 러그, 금박 액자들.
4. **연속성** — 벽난로·액자 재질은 `diningRoom`과 공유.
5. **이미지 생성 프롬프트** *(2026-08-20 마스터 시나리오 기준 정정)* — `top-down 2D game background, 1280x720, orthographic floor-plan view of an ornate parlor, an old piano on the left with an open lullaby score and two candles lit on its lid, a tall arched window at the upper left letting in cold blue moonlight across red patterned wallpaper, neatly arranged velvet sofas, a wooden mannequin in a black gown seated in a high chair by a modest fireplace on the right with a crudely hand-painted face, gilt portraits along the wall with their faces scratched out except one intact male portrait, a small teal-glowing bottle on the floor lower left, dark red ornate rug, painterly horror concept art, palette #1c1a18 #3d4a58 #7a2e14 #8a6b2e with one #22c4ad accent --no vignette, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. 마네킹은 정지 아트지만 sighting 발동 시 자세가 미세하게 바뀐 2번째 상태 프레임을 별도 제작 권장(`GameController.triggerSighting()` 패턴 재사용).

#### bg.office2F

1. **ID/역할** — `office2F`. 2F 집무실, 일지 → 레지널드 등장(P1).
2. **컨셉아트 근거** — **없음** — 전용 패널 없음. `greatHall`/`diningRoom`의 목재 패널링·초상화 언어와 엘리노어 초상화(`gr3-castle-upper-board.jpg` 우하)의 액자 스타일을 계승해 구성.
3. **비주얼 설명** — 좁고 개인적인 방, 책상 위에 **펼쳐진 일지**(`prop.journal`)와 촛불 하나. 뒤쪽 벽에 무거운 커튼(`prop.curtain`)이 드리워져 있고 — 이 커튼 그림자가 P1 레지널드의 첫 등장 위치(5.3 "커튼 그림자에서 무음 접근")다. 벽에 엘리노어로 추정되는 초상화 액자가 하나 걸려 있어(`PORTRAIT-GOLD`) 이 방이 그녀와 관련된 개인 공간임을 암시한다. 창밖은 `MOON-COLD` 완전한 어둠.
4. **연속성** — 초상화 액자 스타일은 `gr3-castle-upper-board.jpg`의 엘리노어 초상화와 통일.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of a small private study, an open journal on a writing desk lit by a single candle, heavy dark curtains along the back wall pooling in deep shadow, a gilt-framed portrait of a young woman on a side wall, dark wood paneling, a pitch-black window, painterly horror concept art, palette #ffd79a #171012 #8a6b2e #1c1a18 --no vignette, text, watermark, characters, teal light, first-person perspective`
6. **구현 메모** — 1280×720. 커튼 뒤 그림자 영역을 알파 레이어로 분리해 `study.reginald` 발동 시 실루엣을 겹칠 수 있게 한다.

#### bg.corridorDescent

1. **ID/역할** — `corridorDescent`. 나선 계단 하강, P2 "문의 합창", 강제 편도.
2. **컨셉아트 근거** — **없음** — 전용 패널 없음. `serviceCorridorB1`(청록 횃불 복도)과 상층의 재질을 잇는 전환 구간으로, 위→아래로 갈수록 난색에서 청록으로 서서히 넘어가도록 구성(3.0 규칙 확장 2를 미리 보여주는 전조).
3. **비주얼 설명** — 좁은 나선 돌계단, 화면 상단은 아직 `WARM-MID` 촛불이 남아 있지만 하단으로 내려갈수록 조도가 떨어지고 벽 틈에서 **차가운 청록 기운**이 스며 나오기 시작한다(아직 완전한 횃불은 아니고 "새어 나오는" 단계). 양옆 문짝 여러 개가 늘어서 있고 그중 몇 개가 살짝 열려 안에서 회색 손 형상이 어렴풋이 비친다(정지 데코레이션, 5.3 "문의 합창").
4. **연속성** — 하단부 청록 기운은 `greatHallSealed`/`serviceCorridorB1`로 이어지는 색 전환의 시작점.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic overhead view of a narrow spiral stone staircase descending, warm candlelight lingering at the top of frame fading into a creeping cold teal seep from wall cracks toward the bottom, several doors lining the walls, a few ajar with faint grey hand shapes barely visible inside, painterly horror concept art, palette #e8a04e #232a26 #3ecab3 fading downward --no vignette, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. `portals`에 되돌아가는 항목이 없는 편도 Area이므로 정적 1장으로 충분.

#### bg.greatHallSealed

1. **ID/역할** — `greatHallSealed`. 1F 대현관(봉쇄됨), P3 정문 봉쇄 → 서비스 문.
2. **컨셉아트 근거** — **없음** — `bg.greatHall`의 파생(GR-1 `bg.cabinA`↔`bg.cabinA.visited` 페어 제작 방식과 동일 원칙).
3. **비주얼 설명** — `greatHall`과 **가구·바닥 배치가 완전히 동일한 같은 공간**이지만 상태가 뒤집힌다: 정문 앞을 **VIRAX 안개**(청록빛이 도는 짙은 안개, 이번엔 "공간 전체를 채운" 확장 사례로 다뤄 문을 완전히 가린다)가 가로막고, 촛불 스콘스 절반이 꺼져 있다. 초상화 아래 숨겨진 **서비스 문**(2.1의 정합성 보정 — "예배실" 생략)이 옅게 빛나는 틈으로 드러나 우회로임을 암시한다.
4. **연속성** — `greatHall`과 동일 카메라·가구 배치가 필수 조건(가구가 1px도 어긋나면 안 된다).
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of the SAME grand entrance hall as before but half the candle sconces now dark, a thick teal-tinted fog completely blocking the main bronze doors, a hidden service door glowing faintly at its edges beneath a portrait frame on a side wall, painterly horror concept art, palette #c9c3b0 #1c1a18 #3ecab3 fog --no vignette, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. `bg.greatHall`과 동일 원본 파생, 조명 레이어만 교체.

#### bg.serviceCorridorB1

1. **ID/역할** — `serviceCorridorB1`. B1 서비스 복도, P4 침묵 압박.
2. **컨셉아트 근거** — `gr3-castle-lower-lab-board.jpg` 좌상 "Ashvale 성 지하" — 정본. **규칙 확장 2 적용 구간(청록이 횃불 자체)**.
3. **비주얼 설명** — 좁은 아치형 돌 복도가 원근으로 길게 이어지고, 양옆 벽걸이 횃불이 전부 **청록 불꽃**(`TEAL-FLAME`)으로 타올라 통로 전체를 냉랭한 초록빛으로 물들인다(용기가 아니라 광원 자체 — 3.0 규칙 확장 2). 바닥 돌은 젖어 그 빛을 반사한다. 벽 한 곳에 그을린 표식(사슬/사슴뿔 형태)이 새겨져 있다. 왼쪽 중경에 육중한 철문 하나. 난색은 화면 어디에도 없다 — 여기서부터 GR-3은 완전히 청록 지배로 전환된다.
4. **연속성** — 이 청록 횃불 재질은 `laboratoryB2`로 그대로 이어진다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic overhead view of a narrow vaulted stone service corridor receding into the distance, rows of wall-mounted torches burning with literal teal-cyan flame lining both walls, wet stone floor reflecting the cold green-teal light, a scorched sigil carved into one wall, a heavy iron door in the mid-ground on the left, no warm light anywhere, painterly horror concept art, palette #232a26 #3ecab3 #171d1b --no vignette, warm light, orange, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. 청록 횃불 6~8개 등간격 배치, `service.silence` 인터랙션 지점은 복도 중앙 무광 구간에.

#### bg.laboratoryB2

1. **ID/역할** — `laboratoryB2`. B2 실험실, 유리관·엘리노어 흔적.
2. **컨셉아트 근거** — `gr3-castle-lower-lab-board.jpg` 우상 "지하 실험실에 누워있는 앨리노어" — 정본.
3. **비주얼 설명** — *(2026-08-20 마스터 시나리오 기준 정정 — 원문 1161~1165행의 **인간 크기 유리통 열**이 종전 기술·프롬프트에서 통째로 빠져 있었다. 이것은 엔딩 1288행 "유리통 속의 것들이 하나둘 눈을 떴다"의 전제 오브젝트이므로 반드시 배경에 그려져야 한다.)* 돔 형태의 천장 아래 돌로 된 실험실. **탁자 양옆으로 인간 크기의 유리통들이 줄지어 서 있고, 그 안에는 회색 피부와 빈 눈을 가진 사람들이 액체 속에 잠든 듯 떠 있다 — 몇몇은 아이의 크기다**(1161~1165행). 중앙에 **하얀 붕대 천으로 감긴 엘리노어의 몸**이 석재 제단/탁자 위에 눕혀 있고, 여러 관·전선이 그녀에게서 천장에 매달린 청록 랜턴 장치로 이어진다(`TEAL-FLAME` 지배, 규칙 확장 2 계속). 우하단 전경에는 **경고처럼 따뜻한 촛불 하나**가 타고 있어 이 방에서 유일하게 난색이 허용되는 지점이 된다(대비를 통해 "이곳에 아직 인간적인 무언가가 남아 있다"는 신호). 배경 우상단에 창백한 금빛으로 은은히 빛나는 조각상/형상이 흐릿하게 보인다(`VIRAX-GOLD`의 첫 등장). 천장에서 덩굴 같은 것이 늘어져 있다.
4. **연속성** — 청록 횃불/랜턴 재질은 `serviceCorridorB1`에서 계승. 우상단의 금빛 형상은 `ritualChamber`의 적금색 안개를 예고.
5. **이미지 생성 프롬프트** *(2026-08-20 마스터 시나리오 기준 정정 — 유리통 열 추가)* — `top-down 2D game background, 1280x720, orthographic floor-plan view of a domed stone laboratory chamber, two long rows of human-sized upright glass cylinder tanks flanking the room, each tank filled with cloudy liquid and holding a suspended grey-skinned hollow-eyed figure with a few tanks noticeably child-sized, a body wrapped in pale bandages lying on a stone altar table at the center, tubes and wires running up to a hanging teal-lit lantern apparatus above, teal ambient light dominating the room, a single warm candle burning in the lower right foreground as the only warm point, a faint pale golden glowing statue barely visible in the upper right background, hanging vine-like growth from the ceiling, painterly horror concept art, palette #3ecab3 #cfc7b8 #ffd79a with one #c9a227 accent --no vignette, text, watermark, first-person perspective`
6. **구현 메모** — 1280×720. `lab.tubes`/`lab.pedestal`/`lab.eleanor` 세 인터랙션 좌표를 유리통 열·빈 받침대·중앙 제단의 엘리노어 각각에 배치(`lab.tubes`는 좌우 유리통 열 위에 놓는다).

#### bg.ritualChamber

1. **ID/역할** — `ritualChamber`. 의식실, 최종 시퀀스(2.4).
2. **컨셉아트 근거** — `gr3-castle-lower-lab-board.jpg` 좌하 "최종 실험실" — 정본.
3. **비주얼 설명** — 대성당형 높은 궁륭 천장의 원형 홀. 벽을 따라 늘어선 석상들이 각자 손에 **청록으로 타는 등롱**을 들고 있어(규칙 확장 2 — 지하와 같은 지배색) 방 전체를 고르게 청록으로 채운다. 중앙 안쪽에 제단이 있고 그 위에 **천으로 감싸인 형상**(상자/육체)이 놓여 있다. 바닥에는 희미한 마법진이 새겨져 있다. 제단 주변에만 **적금색 안개**(`VIRAX-GOLD`)가 옅게 소용돌이쳐, 청록 배경 위에 뜨는 유일한 난색 계열 색이 된다 — LDD 5.5 "청록 중심+적금색 VIRAX 안개"를 정확히 시각화한 구도.
4. **연속성** — 벽면 등롱은 `laboratoryB2`/`serviceCorridorB1`의 청록 횃불과 같은 계보. 적금색 안개는 GR-1/GR-2의 `WARM-MID`/`WARM-CORE` 계열과 색상은 가깝지만 안개 형태로만 존재해 "불꽃이 아니라 감염이 스며나온 것"으로 구분한다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of a cathedral-like circular ritual chamber with a high vaulted ceiling, rows of stone statues along the walls each holding a teal-burning lantern casting the whole room in cold cyan-green light, a faint magic circle etched into the floor, a shrouded wrapped figure lying on a central stone altar table, a swirling warm gold-amber mist curling around the altar as the only warm color in the space, painterly horror concept art, palette #3ecab3 #171d1b #c9a227 #232a26 --no vignette, text, watermark, characters, orange flame, first-person perspective`
6. **구현 메모** — 1280×720. `ritual.approach`/`ritual.kneel`/`ritual.witness` 세 인터랙션이 모두 이 배경 위에서 발생하므로 제단이 화면 중앙 250px 반경 안에 오도록 구도 고정.

#### bg.gr3Ending

1. **ID/역할** — `ending`(GR-3). CHAPTER 3 / 엔딩.
2. **컨셉아트 근거** — **없음** — `ritualChamber`의 파생(제단 클로즈업 + 암전 직전 플래시).
3. **비주얼 설명** — `ritualChamber` 제단을 화면 중앙으로 당긴 클로즈업. 적금색 안개가 훨씬 짙어지고 청록 배경이 거의 백색에 가깝게 과다노출되며 암전으로 이어지는 정지 프레임(LDD S5 "시야 암전 직전"). 텍스트 카드가 겹쳐질 자리이므로 중앙 반경을 비워 둔다.
4. **연속성** — `ritualChamber`와 동일 팔레트, 밝기만 절정으로 올린다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, high-angle close-up of a ritual altar at the climax of light, teal ambient light overexposed toward near-white with thick swirling gold-amber mist, the frame center left empty for text, painterly horror concept art, palette #3ecab3 #ffffff #c9a227 --no vignette, characters, watermark, first-person perspective`
6. **구현 메모** — 1280×720. 중앙 250px 반경을 텍스트용으로 비워 둘 것(GR-1/GR-2 엔딩 카드 관례 계승).

#### 3.2.1 챕터 3 핵심 소품

| id | 위치 | 컨셉아트 근거 | 비주얼 요약 | 이미지 생성 프롬프트 |
|---|---|---|---|---|
| `prop.portrait` | `greatHall` | **마스터 시나리오 1048~1053행 (정본) — 2026-08-20 마스터 시나리오 기준 정정: 종전 "엘리노어 초상화"는 오기.** 대현관 정면 계단 위의 거대한 초상화는 **레지널드 블랙우드 경(제1대 영주)**이다 — "흰 피부, 검은 머리, 날카로운 눈, 목에 작은 펜던트를 단 남자", "명패에는 레지널드 블랙우드 경, 제1대 영주라고 적혀 있었다. 태어난 해는 있었지만, 죽은 해는 없었다." 엘리노어의 그림은 대현관이 아니라 **식당 상석 뒤**에 따로 걸려 있다(1061~1062행, `bg.diningRoom` 담당). | 금박 액자 속 창백한 피부·검은 머리·날카로운 눈의 남자 초상, 목에 작은 펜던트, 액자 아래 명패(사망 연도 칸이 비어 있음), 촛불 2개가 액자를 밝힘 | `top-down 2D game prop sprite, a large oil portrait of a pale sharp-eyed man with black hair wearing a small pendant at his throat, in a gilt frame flanked by two candles, a small brass nameplate beneath the frame, aged varnish, painterly horror concept art, palette #8a6b2e #ffd79a #7a2e14, transparent background, orthographic overhead view --no readable text, vignette, watermark, background` |
| `prop.footprints` | `greatHall` | **마스터 시나리오 1043~1046행 (정본) — 2026-08-20 마스터 시나리오 기준 정정: 종전 "안쪽으로만 / no return trail"은 원문을 정반대로 뒤집은 것.** 원문은 **왕복 흔적이며 같은 신발**이다 — "한 줄은 안쪽으로, 다른 한 줄은 다시 돌아온 방향으로. 같은 신발의 흔적이었다. 누군가 이 성 안을 홀로 걷고 있었다." 공포의 근거는 "들어가서 안 나왔다"가 아니라 "지금도 이 안을 혼자 걸어 다니고 있다"이다. | 흑백 체스판 대리석 위의 젖은 발자국 두 줄 — 한 줄은 안쪽으로, 다른 한 줄은 되돌아오는 방향으로, 같은 신발 자국 | `top-down 2D game prop sprite, two parallel trails of wet bootprints across a black and white checkered marble floor, one trail leading inward and the other leading back out, both made by the same pair of boots, painterly horror concept art, palette #c9c3b0 #3d4a58, transparent background, orthographic overhead view --no vignette, text, watermark, background` |
| `prop.hallCandle` | `greatHall` | gr3-castle-upper-board (정본) | 전경 낮은 촛불, 수동 저장 아이콘 | `top-down 2D game prop sprite, a single low candle burning on a marble floor, painterly horror concept art, palette #ffd79a #1c1a18, transparent background, orthographic overhead view --no vignette, text, watermark, background` |
| `prop.embers` / `prop.tableware` | `diningRoom` | gr3-castle-upper-board (정본) | 타는 벽난로 재, 은제 식기 세팅 | `top-down 2D game prop sprite, a stone fireplace with glowing warm embers and low flame, beside a silver domed serving platter and full formal table setting, painterly horror concept art, palette #7a2e14 #ffd79a #8a6b2e, transparent background, orthographic overhead view --no vignette, text, watermark, background` |
| `prop.mannequin` / `prop.piano` | `parlor` | **마스터 시나리오 1074~1079행 (정본) — 2026-08-20 마스터 시나리오 기준 정정: 종전 "창백한 드레스"와 `--no face detail`은 원문의 핵심을 지운다.** 원문은 **검은 드레스를 입힌 나무 마네킹**이며, "매끄러운 얼굴 위에는 서툰 솜씨로 눈과 코와 입이 그려져 있었다. 식당 그림 속 엘리노어의 얼굴이었다." 얼굴은 반드시 그려져 있어야 하고, 그 서툰 필치 자체가 공포의 근거다. | 벽난로 앞 높은 의자에 앉은 나무 마네킹, 검은 드레스, 매끄러운 나무 얼굴 위에 서툰 솜씨로 그려진 눈·코·입(식당의 엘리노어 그림과 같은 얼굴), 낡은 피아노와 펼쳐진 자장가 악보 | `top-down 2D game prop sprite, a wooden artist mannequin dressed in a black gown seated upright in a high chair, its smooth wooden face crudely hand-painted with clumsy eyes nose and mouth imitating a woman's face, and separately an old piano with an open lullaby score and two lit candles, painterly horror concept art, palette #1c1a18 #d8d2c0 #ffd79a, transparent background, orthographic overhead view --no vignette, text, watermark, background` |
| `prop.journal` / `prop.curtain` | `office2F` | 없음(추정) | 펼쳐진 일지, 커튼(레지널드 은신처) | `top-down 2D game prop sprite, an open handwritten journal on a desk beside a candle, and separately a heavy dark curtain pooling in deep shadow, painterly horror concept art, palette #b9a270 #171012 #ffd79a, transparent background, orthographic overhead view --no readable text, vignette, watermark, background` |
| `prop.hollowSilhouettes` | `corridorDescent` | 없음(추정, `enemy.hollow` 실루엣 재사용) | 문틈으로 비치는 다수 회색 손·형상 | `top-down 2D game prop sprite, several grey emaciated hands and partial silhouettes barely visible through ajar doors in a dark corridor, painterly horror concept art, palette #6e6a66 #171d1b, transparent background, orthographic overhead view --no full bodies, faces, vignette, text, watermark, background` |
| `prop.viraxFog` / `prop.serviceDoor` | `greatHallSealed` | 없음(추정) | 정문을 막은 청록 안개, 액자 아래 숨은 문 | `top-down 2D game prop sprite, a thick teal-tinted fog mass blocking a set of grand doors, and separately a faint door outline glowing at its edges beneath a portrait frame, painterly horror concept art, palette #3ecab3 #1c1a18, transparent background, orthographic overhead view --no vignette, text, watermark, background` |
| `prop.glassTubes` / `prop.pedestal` | `laboratoryB2` | **마스터 시나리오 1161~1165행 (정본) — 2026-08-20 마스터 시나리오 기준 정정: 종전 `--no visible body`는 이 소품의 존재 이유를 지운다.** 유리통은 빈 실험 기구가 아니라 **인간 크기이고 그 안에 사람이 들어 있는** 것이다 — "양옆으로 인간 크기의 유리통들이 줄지어 있었다. 그 안에는 사람들이 떠 있었다. … 회색 피부와 빈 눈을 가진 채, 액체 속에서 잠든 듯 떠 있었다. 몇몇은 아이의 크기였다." 엔딩 1288행("유리통 속의 것들이 하나둘 눈을 떴다")이 이 소품 위에 서 있다. | 인간 크기 직립 유리통 열, 각 통 안에 회색 피부·빈 눈의 형체가 액체 속에 떠 있음(일부는 아이 크기), 케이블이 천장 청록 랜턴 장치로 이어짐, 그리고 별도로 빈 석재 받침대 | `top-down 2D game prop sprite, a row of human-sized upright glass cylinder tanks filled with cloudy liquid, each holding a suspended grey-skinned hollow-eyed figure with some tanks child-sized, cables running from the tanks to an overhead teal lantern apparatus, and separately an empty stone pedestal awaiting an object, painterly horror concept art, palette #3ecab3 #cfc7b8 #232a26, transparent background, orthographic overhead view --no vignette, text, watermark, background` |
| `prop.ritualRing` / `prop.jadeBox` | `ritualChamber` | gr3-castle-lower-lab-board (정본, 프롤로그 자산 재사용 가능) | 삼중 링·생명나무·뱀십자 장치, 옥색 상자 | `top-down 2D game prop sprite, a triple concentric ring mechanism engraved with a tree-of-life and serpent-cross motif surrounding a small glowing jade-teal stone box on a stone altar, warm gold mist curling around it, painterly horror concept art, palette #3ecab3 #c9a227 #5ef0d8, transparent background, orthographic overhead view --no vignette, text, watermark, background` |

#### character.reginald

1. **ID/배치 위치** — `character.reginald`. `office2F`(`study.reginald`, P1 대면)와 `corridorDescent`/`greatHallSealed`(P2~P3 배경 실루엣)에서 등장. GR-1 `character.lucas`/`enemy.hollow`와 동일하게 top-down 3/4 하이앵글 스프라이트로 제작한다(CanvasRenderer가 세로가 긴 비율로 캐릭터를 그리는 관례를 계승).
2. **컨셉아트 근거** — `gr3-castle-lower-lab-board.jpg` 우하 "레지널드" — **정면 초상 + 전신 2컷(정면/측면) + 손 클로즈업(반지) + 카메오 로켓 목걸이 클로즈업을 갖춘 완성 캐릭터 시트가 이미 존재한다.**
3. **기획 의도** — 5.3 P1: "커튼 그림자에서 무음 접근"; 2.3: "실패 시 복구 지점은 `office2F` 자체(재진입 시 동일 텍스트 재생)" — 전투 대상이 아니라 **공간을 통제하는 정적 조우**로 설계됐다(5.2).
4. **비주얼 설명** — 시트를 그대로 따른다. 창백하고 여윈 귀족적 얼굴, 뒤로 넘긴 짙은 머리, 옅은 색 눈에 다크서클이 살짝 있어 병약함과 위압감이 동시에 읽힌다. 의상은 **거의 검정에 가까운 짙은 자적(`REGINALD-DARK`) 롱코트**에 높은 칼라, 코트 자락이 발목까지 내려온다. **손가락마다 반지**를 여러 개 끼고 있고, 목/가슴 쪽에 **여성의 초상이 그려진 카메오 로켓**(엘리노어)을 사슬에 걸고 있다 — 이 로켓이 그의 집착을 형태로 말하는 핵심 실루엣 요소이므로 top-down에서도 가슴 앞 사선 각도가 보이도록 그린다. 자세는 곧고 느리며 위협적이라기보다 "이미 모든 것을 통제하고 있다"는 정적인 자신감을 담는다. **무기를 들지 않는다**(1.1 "적을 제거하는 루트는 만들지 않는다" 원칙 계승, GR-1 `character.lucas` 메모와 동일 판단). 실루엣 판정: **곧은 자세 + 발목까지 오는 코트 + 가슴 앞의 작은 로켓 반짝임.**
5. **이미지 생성 프롬프트** — `2D game character sprite for a top-down horror game, three-quarter high-angle view from above, a pale gaunt aristocratic man with slicked-back dark hair and faint dark circles under pale eyes, wearing an almost-black burgundy floor-length coat with a high collar, rings on multiple fingers, a cameo locket with a painted miniature portrait of a woman hanging from a chain at his chest on a diagonal angle, standing perfectly upright and still, unarmed, calm and controlled posture, painterly horror concept art, palette #171012 #8a6b2e #cfc7b8 with a small #c9a227 locket glint, transparent background, full body, centered --no weapons, aggressive pose, vignette, text, watermark, background, glowing eyes`
6. **구현 메모** — 원본 고해상도 캐릭터 시트가 이미 있으므로(GR-1 `character.lucas`와 동일한 상황) **신규 디자인이 아니라 top-down 리타게팅 작업**이다. 렌더 크기는 `character.lucas`(44×60)와 동일 비율 권장, 원본 176×240 PNG 알파. 애니메이션은 정지 대면(P1) 1~2프레임이면 1차 납품이 성립하며(2.3이 이동 AI를 요구하지 않으므로), 복도 배경(`corridorDescent`)에 쓰이는 그림자 실루엣은 별도의 역광 검은 실루엣 1장(`enemy.hollow`의 창밖 정지 실루엣과 동일 패턴)으로 충분하다.

---

### 3.3 GR-2/GR-3 manifest.json 확장 초안

**실제 파일은 수정하지 않는다** — 아래는 3.1/3.2가 확정한 배경·캐릭터가 최종적으로 어떤 `manifest.json` 키:경로 쌍이 될지 보여주는 참고용 초안이다. 기존 `manifest.json`의 `bg.*`/`character.*` 명명 규칙(경로 패턴 `./public/assets/{characters|environment}/generated/{slug}-v{n}.png`)을 그대로 따랐다.

```json
{
  "images": {
    "bg.villageSquare": "./public/assets/environment/generated/village-square-hub-v1.png",
    "bg.marketStreet": "./public/assets/environment/generated/market-street-store-v1.png",
    "bg.marketAlley": "./public/assets/environment/generated/market-alley-mirror-v1.png",
    "bg.houseExterior": "./public/assets/environment/generated/morris-house-exterior-v1.png",
    "bg.houseInterior": "./public/assets/environment/generated/morris-house-interior-v1.png",
    "bg.innGroundFloor": "./public/assets/environment/generated/black-lamb-inn-ground-v1.png",
    "bg.innCellar": "./public/assets/environment/generated/inn-wine-cellar-v1.png",
    "bg.innCellarEscape": "./public/assets/environment/generated/inn-cellar-vent-escape-v1.png",
    "bg.townHallExterior": "./public/assets/environment/generated/town-hall-exterior-v1.png",
    "bg.townHallInterior": "./public/assets/environment/generated/town-hall-pillars-hall-v1.png",
    "bg.townHallRecords": "./public/assets/environment/generated/town-hall-records-room-v1.png",
    "bg.townGate": "./public/assets/environment/generated/village-town-gate-slab-v1.png",
    "bg.villageChaseFinal": "./public/assets/environment/generated/village-chase-final-v1.png",
    "bg.gr2Ending": "./public/assets/environment/generated/village-gate-opens-v1.png",

    "bg.castleGateChain": "./public/assets/environment/generated/castle-gate-chain-v1.png",
    "bg.greatHall": "./public/assets/environment/generated/castle-great-hall-v1.png",
    "bg.diningRoom": "./public/assets/environment/generated/castle-dining-room-v1.png",
    "bg.parlor": "./public/assets/environment/generated/castle-parlor-v1.png",
    "bg.office2F": "./public/assets/environment/generated/castle-office-2f-v1.png",
    "bg.corridorDescent": "./public/assets/environment/generated/castle-spiral-descent-v1.png",
    "bg.greatHallSealed": "./public/assets/environment/generated/castle-great-hall-sealed-v1.png",
    "bg.serviceCorridorB1": "./public/assets/environment/generated/castle-service-corridor-b1-v1.png",
    "bg.laboratoryB2": "./public/assets/environment/generated/castle-laboratory-b2-v1.png",
    "bg.ritualChamber": "./public/assets/environment/generated/castle-ritual-chamber-v1.png",
    "bg.gr3Ending": "./public/assets/environment/generated/castle-ritual-ending-v1.png",

    "character.reginald": "./public/assets/characters/generated/reginald-topdown-v1.png"
  }
}
```

---

### 3.4 제작 우선순위

07번 문서가 `02-asset-image-gap.md` 4절에서 확립한 P0(선행/저비용 필수) → P1(핵심 루프) → P2(리터치/일방향 연출) 관례를 그대로 GR-2/GR-3에 적용한다. 허브·체크포인트 Area(플레이어가 반드시 오래 머물거나 되돌아오는 곳)를 우선하고, 편도 연출 전용 Area(강제 이동·전환 카드)는 후순위로 둔다.

| 순위 | 대상 | 근거 |
|---|---|---|
| **P0** | 3.0 팔레트 확장 표(신규 토큰 정의) | 이후 모든 GR-2/GR-3 에셋 제작의 선행 조건, 비용 0 |
| **P0** | `bg.villageSquare`, `bg.greatHall` | 각 챕터의 허브(Safe Zone/자유 탐험 허브) — 플레이어가 가장 오래, 가장 자주 보는 화면. 정본 컨셉아트가 이미 있어 리스크도 가장 낮다 |
| **P0** | `bg.innCellar` + `prop.wineShelf`×6 + `prop.wineMap` + `prop.serpentBox` | GR-2 핵심 퍼즐(1.3)의 무대 전체 — 퍼즐 밸런스 검증이 이 에셋 없이는 시작할 수 없다 |
| **P0** | `character.reginald` | GR-3 서사 전환점(T3-5, 5.3 P1)의 유일한 신규 캐릭터. 이미 완성된 컨셉 시트가 있어 리타게팅 비용만 든다 — 가장 저비용 고효과 항목 |
| **P0** | `bg.ritualChamber` | 두 챕터 전체의 클라이맥스이자 시리즈 상징(6.3 "5순위" 항목이지만 시각적 완성도가 전체 톤을 좌우하므로 프로토타입 단계에서 먼저 확정해 둘 필요) |
| **P1** | `bg.marketStreet`, `bg.marketAlley`, `bg.houseExterior`, `bg.houseInterior`, `bg.innGroundFloor` | GR-2 동/서 스포크의 필수 진행 경로(허브 다음으로 가장 자주 왕복) + `prop.ledger`/`prop.diary`/`prop.crackedMirror` 등 진행 연동 소품 |
| **P1** | `bg.townHallInterior`, `bg.townHallRecords`, `bg.townGate` + `prop.nameplate`×4, `prop.gateSlab` | GR-2 종료 퍼즐(1.4)의 무대 — 세 진실+네 이름이 챕터 종료 게이팅이므로 P0 다음으로 시급 |
| **P1** | `bg.diningRoom`, `bg.parlor`, `bg.office2F` | GR-3 상층 필수 탐험 스포크(2.1) — 정적 공포 축적이 목표 시간(2.6)의 절반 이상을 차지하므로 허브 다음으로 시급 |
| **P1** | `bg.serviceCorridorB1`, `bg.laboratoryB2` | GR-3 하강 체인의 서사적 정점 직전 — 규칙 확장 2(청록 횃불)를 처음 시각화하는 구간이라 톤 검증이 필요 |
| **P2** | `bg.townHallExterior`, `bg.innCellarEscape`, `bg.villageChaseFinal`, `bg.gr2Ending` | GR-2의 편도/전환 전용 Area — 정보량이 적고 인접 배경 재질을 상속하므로 후순위 리터치로도 무방 |
| **P2** | `bg.castleGateChain`, `bg.corridorDescent`, `bg.greatHallSealed`, `bg.gr3Ending` | GR-3의 편도/전환 전용 Area — 특히 `greatHallSealed`는 `greatHall`의 상태 변화 파생이므로 P0 원본이 확정된 뒤에만 작업 가능(선후 관계상 자연히 후순위) |
| **P2** | 배경 베이크 실루엣류(`prop.hollowSilhouettes`, `villageChaseFinal`의 다중 위협 실루엣, `The Beast` 원경) | 1.5/2.3이 이미 "다중 개체 AI는 범위 밖, 아트로만 근사"라 확정한 항목 — 게임플레이에 영향이 없는 순수 분위기 데코레이션이라 가장 나중에 다듬어도 안전 |

---
