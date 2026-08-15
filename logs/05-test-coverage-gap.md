# 05. 테스트 커버리지 갭

대상: `tests/smoke.mjs` (33행, 단일 파일). 실행: `npm run build && node tests/smoke.mjs`

---

## 1. 현재 검증 범위

| # | 검증 내용 | 근거 라인 | 평가 |
|---|---|---|---|
| T-1 | 모든 Area의 기본 spawn이 벽과 겹치지 않음 | `smoke.mjs:11` | 실용적. 맵 데이터 회귀를 실제로 막아준다 |
| T-2 | 모든 Portal의 목적지 spawn이 벽과 겹치지 않음 | `:14` | 좋음 |
| T-3 | Portal 이동 직후 다른 Portal이 즉시 재발동하지 않음 | `:15` | **특히 좋음.** 무한 순환 버그를 구조적으로 차단 |
| T-4 | 진행 플래그 순차 설정 (cabinVisited → gateChecked → routeKnown → atticOpened → atticClueSeen) | `:21-25` | 해피패스 1줄기 |
| T-5 | 목판화 3종 수집 후 `hasAllWoodcuts()` | `:26-27` | — |
| T-6 | 목판화 완비 시 `attic.puzzle`이 `openPuzzle` 반환 | `:28` | — |
| T-7 | `solvePuzzle()`이 열쇠 + 진실 조각 지급 | `:29` | 문서 0.1 보정 회귀 방지 |
| T-8 | `attic.window`가 `startChase` 반환 | `:30` | — |
| T-9 | 열쇠 소지 시 `gate.inspect`가 `complete` 반환 | `:31` | — |

**커버되는 계층**: Domain(`Chapter1Progress`, `Geometry`) 일부 + Application 1개(`Chapter1FlowService`) + Config(`Chapter1World`) 데이터 무결성.
**커버되지 않는 계층**: `MovementService`, `ChaseService`, `SaveGameService`, Infrastructure 전체, Presentation 전체.

한 문장 요약: **"맵 데이터가 깨지지 않았고, 정해진 순서대로 누르면 끝까지 간다"만 검증한다.**

---

## 2. 게임플레이 요구사항 대비 갭

### G-1. 진행 게이팅의 **부정 경로**를 전혀 검증하지 않음 — **P0**

가장 중요한 갭이다. `smoke.mjs:21-31`은 **의도된 순서로만** `flow.interact()`를 호출한다. 따라서 04 문서 §2에서 발견한 결함(관문 → 오두막 순서로 진행하면 첫 방문/재방문 루프가 붕괴)을 **정의상 검출할 수 없다.**

또한 `flow.interact()`를 직접 호출하므로 **포털의 `requireFlag`·인터랙션의 `visibleWhen`/`hiddenWhen`이 테스트 경로에 전혀 개입하지 않는다.** 즉 게이팅 로직 자체가 미검증 상태다.

**필요한 테스트**
```
- forest.toGate 통과 시 cabinVisited가 요구되는가 (현재는 실패할 테스트 = 결함 노출)
- forest.toLogging이 routeKnown 없이 막히는가
- cabinB2.attic이 atticOpened 없이 막히는가
- atticClueSeen 이전에 woodcut.* 인터랙션이 보이지 않는가 (GameController.interactionVisible)
- 이미 획득한 목판화 인터랙션이 숨겨지는가
```
문제는 이 판정 로직이 **Presentation(`GameController.ts:90-96` `interactionVisible`, `:72-80` `handlePortal`)에 있어 헤드리스 테스트가 불가능**하다는 점이다. → G-6 참조.

### G-2. 퍼즐 정답 판정이 Presentation에 있어 테스트 불가 — **P0**

문서 3.3의 "정답"과 "실패" 규칙 — 즉 이 챕터에서 가장 기획 의도가 밀집된 로직 — 이 `src/presentation/ModalView.ts:46`에 DOM 이벤트 핸들러와 함께 들어 있다.

```ts
const order = slots.join('')==='△○✠'; const aligned = mirror===45 && candle===30;
```

`Chapter1FlowService.solvePuzzle()`은 ModalView가 `true`를 반환한 **뒤에** 호출될 뿐이므로(`GameController.ts:104`), 스모크 테스트의 `flow.solvePuzzle()`(`smoke.mjs:29`)은 **보상 지급만 검증하고 정답 판정은 전혀 검증하지 않는다.**

이는 테스트 갭인 동시에 **아키텍처 위반**이다. `CLAUDE.md`와 `README.md`가 선언한 의존 방향(Domain ← Application ← Infrastructure/Presentation)에 따르면 퍼즐 규칙은 Domain 또는 Application에 있어야 한다. 현재는 렌더러를 Phaser로 교체하면 **퍼즐 정답이 함께 사라진다.**

**권장 조치** — `ShadowPuzzle`(Domain) 또는 `ShadowPuzzleService`(Application)를 신설해 `validate(slots, mirror, candle) → {solved, failCount, hint}` 형태로 분리하고, `ModalView`는 입력 수집과 렌더만 담당하게 한다. 그러면 문서 3.3의 실패 규칙(3회/5회)도 함께 테스트 가능해진다. 규모 S~M, **P0**(MS-02/MS-03 수정과 동일 작업).

### G-3. `MovementService` 미검증 — **P1**

`src/application/MovementService.ts`는 순수 함수에 가까워 테스트하기 가장 쉬운데(`Player` + `AreaDefinition` + `InputState` + dt만 필요, DOM 의존 0) 테스트가 하나도 없다.

**필요한 테스트**
- 대각 이동 시 정규화되어 속도가 √2배가 되지 않는가 (`:11-12`)
- 속도 매핑 88/146/238과 소음 매핑 0/2/5/14가 입력 조합과 일치하는가 (`:17-18`)
- `crouch + run` 동시 입력 시 crouch 우선(`running = … && !input.crouch`, `:15`)
- 벽에 대각으로 밀 때 축 분리 이동으로 미끄러지는가 (`:21-22`)
- 화면 밖 클램프 (`:23-24`)

특히 **소음 매핑은 문서 1.3의 정본 수치를 코드에 고정하는 회귀 방어선**이므로 반드시 있어야 한다.

### G-4. `ChaseService` 미검증 — **P1**

챕터 클라이맥스의 유일한 AI인데 테스트가 없다.

**필요한 테스트**
- `hollow.active === false`면 이동하지 않고 `false` 반환 (`:7`)
- `catchDistance` 26px 경계에서 정확히 포획 판정 (`:14`)
- `pressure` 배율이 소음 14m 이상에서만 적용 (`:11`)
- **(수정 후)** 벽을 관통하지 않는가 — 현재는 관통한다(→ 03 §3). 이 테스트를 먼저 작성하면 실패 테스트로 결함을 문서화할 수 있다
- **(수정 후)** 추격 소요 시간이 20~35초 범위인가 — 시뮬레이션 테스트로 자동 검증 가능(현재 5.4초)

> 추격 지속 시간은 03 문서에서 다익스트라로 실측했듯 **코드만으로 계산 가능**하다. 이런 "레벨 디자인 수치 회귀 테스트"를 스모크에 넣으면 맵을 수정할 때마다 스펙 이탈을 자동 감지할 수 있다. 강력히 권장.

### G-5. `SaveGameService` / 체크포인트 미검증 — **P1**

`SaveGameService`는 `SaveRepository` 인터페이스에만 의존하므로(`ports/Ports.ts:13`) **인메모리 페이크 1개면 즉시 테스트 가능**한데 테스트가 없다.

**필요한 테스트**
- save → load 왕복에서 flags/items/areaId/lantern 무손실
- 문서 1.4의 체크포인트 5지점이 전부 저장을 발생시키는가 — 특히 **"다리"가 누락되어 있음**(→ 03 §6)을 이 테스트가 잡아야 한다
- 문서 1.4 "추격 중 저장 불가" 준수
- 손상된 JSON 로드 시 `null` 반환 (`LocalStorageSaveRepository.ts:11`)

### G-6. Presentation 로직의 테스트 불가능성 (구조 문제) — **P1**

게이팅·상호작용 가시성·추격 시작/종료·체크포인트 발동 등 **기획적으로 중요한 판정이 `GameController`에 몰려 있다.** `GameController`는 `performance.now()`와 `requestAnimationFrame`을 직접 사용해(`:21`, `:37`, `:43`) Node 환경에서 인스턴스화할 수 없다.

**권장 조치** — 순수 판정 함수들을 Application으로 추출한다.
- `interactionVisible()`(`:90-96`) → `Chapter1Progress.canSee(interaction)` (Domain)
- `handlePortal()`의 조건 검사(`:75-78`) → `ProgressGateService.canPass(portal, progress)` (Application)
- `enterArea()`의 체크포인트 판단(`:122`) → `CheckpointPolicy` (Application)

이후 `GameController`는 조립과 루프만 담당. 이렇게 하면 G-1/G-5가 전부 테스트 가능해진다. 규모 M, P1.

### G-7. 에셋 무결성 미검증 — **P2 / S**

`Chapter1World`의 모든 `backgroundAssetId`가 `manifest.json`에 존재하는지 검증하지 않는다. (감사 시점 수동 확인 결과 10개 `bg.*` + `character.lucas` + `enemy.hollow` **모두 정상 매칭**이지만, 로드 실패는 `console.warn`으로 조용히 넘어가므로(`ManifestAssetProvider.ts:24`) 오타가 나면 폴백 도형으로 렌더되어 **눈치채기 어렵다.**)

Node에서 `manifest.json`을 읽어 ID 집합을 대조하는 테스트는 5줄이면 된다. 02 문서의 `prop.*`/`audio.*` 확장 시 필수가 된다.

### G-8. 도달 가능성 / 소프트락 검증 없음 — **P2 / M**

현재 테스트는 각 포털을 **개별적으로** 검사할 뿐 **그래프 전체**를 보지 않는다.

**필요한 테스트**
- 모든 Area가 `bridge`에서 도달 가능한가 (플래그 조건 포함 BFS)
- 진행 플래그의 임의 부분집합 상태에서 소프트락(어디로도 갈 수 없음)이 없는가
- 각 `requireFlag`가 해당 시점에 **획득 가능한가** (예: `routeKnown`은 `cabinA`에서만 얻는데 `cabinA` 도달이 보장되는가)

세이브 로드로 임의 중간 상태에서 시작할 수 있으므로(`GameController.restore()`, `:125-129`) 이 검증은 실질적 가치가 있다.

### G-9. 문서 수치 회귀 테스트 부재 — **P1 / S**

가장 비용 대비 효과가 큰 항목이다. **문서의 정본 수치를 테스트 코드에 상수로 박아두면**, 이후 누가 코드를 만지다 수치를 바꿔도 즉시 잡힌다.

```js
// LDD v2.0 §1.3 — 정본 수치. 변경 시 문서 개정이 선행되어야 함
assert(noiseFor({crouch:true})  === 2,  'LDD 1.3: 앉아 이동 2m');
assert(noiseFor({})             === 5,  'LDD 1.3: 걷기 5m');
assert(noiseFor({run:true})     === 14, 'LDD 1.3: 달리기 14m');
// LDD v2.0 §1.3 — The Hollow 3.8 m/s @ 45.8 px/m
assert(Math.abs(hollow.speed/45.8 - 3.8) < 0.05, 'LDD 1.3: Hollow 3.8m/s');
// LDD v2.0 §3.4 — 추격 20~35초
assert(chaseSeconds >= 20 && chaseSeconds <= 35, 'LDD 3.4: 추격 20~35초');
```

마지막 항목은 **현재 실패한다(5.4초)** — 그게 정확히 이 테스트의 존재 이유다. 실패하는 스펙 테스트를 `pending` 목록으로 두고 하나씩 지워나가는 방식을 권장한다.

### G-10. 테스트 인프라 자체의 한계 — **P2**

| 항목 | 현재 | 문제 |
|---|---|---|
| 실행 방식 | `node tests/smoke.mjs` 단일 파일, 첫 실패에서 예외 던지고 중단 | 실패 1건이 나머지를 가린다. `node:test` 사용 시 전체 결과를 볼 수 있음(외부 의존성 0) |
| 대상 | `dist/*.js`를 import (`smoke.mjs:1-4`) | `npm run build` 선행 필수. 빌드를 잊으면 **낡은 코드를 테스트**한다 |
| CI | 없음 | `package.json:6-10`에 `test` 스크립트조차 없음 — `npm test`가 동작하지 않는다 |
| 커버리지 측정 | 없음 | 정량 파악 불가 |

**즉시 조치(S)** — `package.json`에 `"test": "npm run build && node --test tests/"` 추가하고 `node:test`의 `describe/it`으로 재구성. Node 18+ 내장이라 의존성 추가 없음.

---

## 3. 우선순위별 액션 아이템

| # | 항목 | 규모 | 우선순위 | 비고 |
|---|---|---|---|---|
| TC-1 | 퍼즐 판정을 Application으로 추출 + 정답/실패 규칙 테스트 | S~M | **P0** | MS-02/MS-03 수정과 동일 작업. 이걸 하면 04 §3의 결함 3건이 전부 테스트로 고정됨 |
| TC-2 | 게이팅 부정 경로 테스트 (관문 선행 진행) | S | **P0** | 04 §2 결함 노출용. 먼저 실패 테스트로 작성 |
| TC-3 | 문서 수치 회귀 테스트 (G-9) | S | **P1** | 스펙 이탈 자동 감지. 비용 대비 효과 최대 |
| TC-4 | `MovementService` / `ChaseService` 단위 테스트 | S | **P1** | DOM 의존 없음 — 지금 바로 가능 |
| TC-5 | `SaveGameService` + 체크포인트 5지점 테스트 (페이크 repo) | S | **P1** | "다리" 누락 노출 |
| TC-6 | `package.json`에 `test` 스크립트 + `node:test` 전환 | S | **P1** | 의존성 0 |
| TC-7 | Presentation 판정 로직 Application 추출 (G-6) | M | P1 | TC-2의 선행 조건 |
| TC-8 | manifest ID ↔ World assetId 대조 테스트 | S | P2 | `prop.*` 확장 시 필수화 |
| TC-9 | 도달 가능성 / 소프트락 BFS 테스트 | M | P2 | 세이브 중간 상태 대응 |

**한 줄 결론** — 지금의 스모크 테스트는 **맵 데이터 회귀 방어로는 잘 작동**하지만(T-1~T-3는 실제로 가치 있다), **기획 의도를 지키는 테스트는 0건**이다. 문서 수치와 게이팅 규칙을 테스트로 고정하는 작업(TC-1~TC-3)이 새 기능 구현보다 우선한다.
