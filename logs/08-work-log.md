# 08. 작업 일지

세션별 변경 이력. 새 세션은 맨 아래에 `## YYYY-MM-DD` 섹션으로 추가한다 (역순 아님 — 시간순).

---

## 2026-08-16

### 배경 이미지 대비 충돌 벽 정렬

`bg.forest`/`bg.logging`/`bg.chase` 배경이 실제 컨셉아트 PNG로 교체된 뒤에도 `Chapter1World.ts`의 충돌 벽(Rect)이 예전 placeholder 기준 좌표 그대로 남아 있어, 그림과 통행 가능 영역이 크게 어긋나 있었다.

- `wall-debug.html`(임시, 작업 후 삭제)로 배경 위에 벽/포탈/스폰을 그리는 오버레이 뷰어를 만들어 좌표 격자와 함께 스크린샷 대조.
- `forest`: 메인 통행로 한복판을 막던 벽 제거.
- `loggingRoad`: 개울(물)이 전혀 안 막혀 있던 것을 다리 판자 건너는 지점(y400~490)만 남기고 차단. 죽은 나무 밑동 신규 차단. 아무 장애물도 없는 길바닥을 막던 벽 제거.
- `chaseRoad`: 탈출로 한복판을 가로막던 벽 제거(당시엔 치명적 버그 — 챕터 완료 불가 가능성).
- `bridge`/`cabinA`/`gate`/`cabinB1`/`cabinB2`/`attic`은 대조 결과 이미 그림과 일치해 변경 없음.
- 검증: `npm run build && node tests/smoke.mjs` 통과.

### Hollow 비추격화 (설계 의도 수정)

기획 확인 결과, Hollow는 시나리오상 플레이어를 실제로 쫓아오면 안 되고 사운드 + 짧은 스침 목격만 있어야 한다는 요청.

- `ChaseService.ts`/`ChaseRules.ts`(추격 이동, 강제 경로, 재시작 유예시간) 삭제.
- `attic.window` 상호작용이 이제 `sighting:true`를 반환 → `GameController.triggerSighting()`이 Hollow를 창밖 근처에 2.4초만 표시하고 사라지게 함. 이동/추적 AI 없음, 포탈 봉쇄 없음, 붙잡힘 실패 상태 없음.
- 관련 유닛 테스트 3개(추격 경로/유예시간/벽 충돌) 삭제, `smoke.mjs`의 `startChase` 단언을 `sighting`으로 교체.
- `CLAUDE.md`/`README.md`의 "1:1 구현" 표·조작 안내에서 관련 서술 갱신.
- 검증: `npm run build && node --test tests/ && node tests/smoke.mjs` 통과 (8/8 + smoke).

### Shift 달리기 토글화

Shift를 누르고 있어야 달리던 것을, 한 번 누르면 유지·다시 누르면 해제되는 토글 방식으로 변경.

- `BrowserInput.ts`: `ShiftLeft`/`ShiftRight`의 keydown 엣지를 감지해 내부 `runToggled` 불리언을 반전. `MovementService`는 변경 없음(입력 계약이 동일한 `run: boolean`이라 그대로 소비).
- HUD 힌트 텍스트("Shift 달리기(토글)")와 README 조작표 갱신.
- 헤드리스 Edge로 실측: Shift 1회 → 소음 14m(달리기) 유지 → 키 떼도 유지 → Shift 1회 더 → 소음 5m(걷기) 복귀까지 스크린샷으로 확인.

### 그림자 봉인 퍼즐 재작업 — 10년차 게임 기획자 서브에이전트

Chapter 1 전체 플레이타임 목표 ~30분에 비해 퍼즐 파트가 너무 얇고(목판화 3개 줍기 + 슬라이더 1개), 정답 각도(거울 45°/촛대 30°)를 맞추는 데 인게임 힌트가 전혀 없어(원래 3D 셰도우캐스팅 전제였던 것으로 추정) 순전한 블라인드 추측이었던 문제를 general-purpose 서브에이전트(10년차 기획자 페르소나 지정)에게 위임.

- `ShadowPuzzleService`를 순수 `align()`(매 조작마다 즉시 재계산, 실패 카운트 불변)과 커밋용 `attempt()`로 분리.
- `ModalView`의 퍼즐 모달을 SVG 프로트랙터 다이얼 2개 + 실시간 겹침%/온도어 게이지로 재작성 — "봉인 확인"을 누르지 않아도 즉시 정렬 여부를 알 수 있음.
- 새 상호작용 `attic.mechanism`("받침대 테두리 살피기")으로 정답 각도에 대한 디제틱 힌트 추가(13칸 눈금 중 2칸만 닳아 있다는 환경 스토리텔링). `mechanismExamined` 플래그가 있어야 다이얼에 정답 눈금이 금색으로 강조됨 — 몰라도 실시간 %만으로 풀이는 가능.
- `cabinB1.diary`(낡은 일기, "순서보다 각도가 문제였다" 복선), 목판화 3종 습득 텍스트 보강, 봉인 성공 시 2단계 연출 추가.
- 추정 플레이타임: 퍼즐 구간 2~3분 → 8~10분.
- 검증: 서브에이전트가 `npm run build && node --test tests/ && node tests/smoke.mjs` 통과 확인 후, 내가 직접 재빌드+재테스트하고 localStorage에 진행 상태를 주입해 헤드리스 Edge로 실제 퍼즐 화면을 열어 다이얼 조작 → 100% 정렬 → 봉인 확인 → 보상 획득까지 스크린샷으로 재확인.
- 부수적으로 `CLAUDE.md`에 남아있던 삭제된 `ChaseService` 관련 서술 2곳(아키텍처 트리, "아직 반영 안 된 문서 항목")을 정리.

### 주의

이번 세션의 앞선 대화에서 "10년차 기획자 agent를 이용해줘"를 곧바로 구현 위임으로 해석해 실행했으나, 사용자 의도는 **플랜(설계안) 리뷰 후 승인 → 구현**이었다. 결과물은 검증까지 마쳤고 사용자가 "일단 바뀐 건 냅두라"고 확인해 되돌리지 않았지만, **앞으로 "이용해줘"류 지시는 결과물을 바로 구현할지, 계획만 먼저 받을지 모호하면 먼저 확인할 것.**

### 30분 플레이타임 최종 점검 — 정량 감사

퍼즐 재작업 이후 실제로 ~30분이 나오는지 사용자가 직접 확인 요청. `logs/03-scale-numeric-mismatch.md`가 썼던 방식(그리드 BFS로 실측 경로 거리 산출)을 그대로 재현해 두 개의 임시 스크립트(작업 후 삭제)로 측정했다.

- **이동 시간**: 골든 패스(다리→숲→첫 오두막→관문→[재방문]첫 오두막→벌목로→둘째 오두막 1F/2F/다락→[퍼즐 후 되돌아 나가기]→관문)를 32구간으로 쪼개 각 구간을 현재 `Chapter1World.ts` 벽 데이터(플레이어 반경만큼 inflate) 기준 BFS 최단거리로 실측. 총 21,220px → 걷기 속도(146px/s) 기준 **2.42분**. chaseRoad는 여전히 어떤 포탈에서도 연결되지 않아 실제 플레이에서 진입되지 않음(오프닝된 영역, 버그 아님 — 이전에도 확인됨).
- **읽기 시간**: 골든 패스에서 반드시 뜨는 모달(타이틀 포함 13개)과 선택 비트 4개(다리 회상, 촛대, 받침대 눈금 힌트, 일기) 전부의 title+body 글자 수를 세어 몰입형 정독 속도(초당 7.5자 + 모달당 고정 1.4초)로 환산. 필수만 **2.76분**, 선택 비트 포함 **3.59분**.
- **퍼즐 조작 시간**: 위 두 스크립트로는 측정 불가(사용자 입력 의존) — 라이브 % 피드백 덕분에 힌트를 봤다면 약 30~60초, 안 봤다면 라이브 피드백만으로도 대략 1.5~3분 선에서 수렴할 것으로 추정(맹목적 추측이었던 이전 버전의 "최악 49회 제출"보다는 훨씬 짧다).
- **합산과 결론**: 측정된 이동+읽기만 6~7분. 여기에 퍼즐 조작(1~3분), 그리고 실제 플레이어는 최단경로 봇이 아니라 갈림길에서 헤매고 배경을 구경하고 조작을 익히는 시간이 있으므로 2~2.5배 보정을 적용해도 대략 **12~18분** — **30분 목표에는 여전히 30~50% 부족**하다.
- **결론을 사용자에게 그대로 보고**, 추가로 무엇을 더 만들지는 임의로 진행하지 않고 사용자 확인을 기다림(지난 "주의" 항목 반영) → 사용자가 "플랜만 먼저" 선택.

### 플랜모드 → 벌목로/숲 콘텐츠 보강 구현

`EnterPlanMode`로 전환해 플랜을 작성(`~/.claude/plans/eventual-waddling-robin.md`), Plan 서브에이전트로 독립 검증 후 사용자 승인받아 구현. 계획 전문은 위 플랜 파일 참고, 핵심만 기록:

- **Phase 1 (검증됨)**: `cabin.record`가 약속만 하고 안 지키던 벌목로 4대 랜드마크(울타리·벼락맞은참나무·개울·수레길)를 `loggingRoad.interactions`에 실제로 추가(`logging.fence/oak/creek/cart`, 전부 soft·no-gate, `hiddenWhen` 자기 플래그로 1회성). `cabinA`에 `cabin.bootprint`(`visibleWhen:'routeKnown'`) 추가.
- **Phase 2 (신규 설계, 배경 아트 재대조 후 확정)**: 골든 패스에서 5회 통과하는데 인터랙션이 0개였던 `forest`에 1회성 분위기 비트 3개(`forest.markedTree`/`puddleTracks`/`eyes`) 추가. 좌표는 실제 `forest-wolf-eyes-v1.png`를 그리드 오버레이로 다시 대조해서 확정(계획서에 명시한 "구현 시 재검증" 약속 이행) — `forest.eyes`는 애초 계획했던 decoration3 자리 대신, 실제 눈빛 아트가 있는 나무 기둥 벽(`{900,80,70,300}`) 인근으로 재배치.
- 신규 `ProgressFlag` 7개(`fenceExamined`/`oakExamined`/`creekExamined`/`cartExamined`/`markedTreeSeen`/`puddleTracksSeen`/`forestEyesSeen`), 전부 `objective()` 사다리엔 안 들어감(선택 콘텐츠, `mechanismExamined`와 동일 취급).
- 새 테스트 3개 추가(loggingRoad 랜드마크가 포탈 안 막는지, forest 비트가 포탈 안 막는지, cabinA bootprint 게이팅) — `tests/p0-systems.test.mjs` 8→11개, 전부 통과. `tests/smoke.mjs`에도 8개 인터랙션 호출+플래그 확인 추가.
- **구현 후 재감사**: 같은 임시 스크립트를 다시 돌려(작업 후 삭제) 갱신치 확인 — 이동 2.42→2.58분, 읽기(선택 포함) 3.59→4.83분. 측정 합계 6~7분 → **7.9~10.4분**. 2~2.5배 현실 보정 시 **약 15.8~26분** — 30분 목표에 근접했지만 정확히 도달했다는 보장은 없음(플랜에 이미 명시한 한계).
- 헤드리스 Edge + localStorage 세이브 주입으로 새 인터랙션 3개(숲/벌목로/첫오두막 각 1개씩) 실제 동작 스크린샷 확인. 흥미로운 점: 기존에 이미 있던 `Chapter1Progress.objective()`의 `routeKnown` 텍스트("옛 벌목로의 랜드마크를 따라...")와 `GameController.currentArea()`의 `cabinA` 재방문 부제("...젖은 발자국과...")가 이번에 추가한 콘텐츠와 정확히 맞아떨어짐 — 원래 텍스트가 미리 약속해뒀던 걸 뒤늦게 구현한 셈.
- 검증: `npm run build && node --test tests/ && node tests/smoke.mjs` 통과(11/11 + smoke).

### 관리동(둘째 오두막) 1F 확장 구현

`logs/09-remaining-work-2026-08-16.md` 4장의 확장 설계를 기준으로 기존 1F 퍼즐 구역의 좌/중/우 배치와 `atticClueSeen` 게이팅은 유지하면서 관리동 전체를 5개 Area로 확장했다.

- 필수 동선: `loggingRoad → cabinB1Hall(현관홀) → cabinB1(기존 서재·창고·기도실) → cabinB1Rear(숙소·작업장) → cabinB2`.
- 선택 동선: 현관홀에서 `cabinB1Office`, 후관에서 `cabinB1Cellar`로 왕복. 진행 게이트 없이 언제든 건너뛸 수 있다.
- imagegen으로 기존 `cabin-b1-v1.png`의 카메라·팔레트·건축 스타일을 참조해 신규 배경 4장(`cabin-b1-hall/office/rear/cellar-v1.png`)을 제작하고 manifest에 등록했다.
- 신규 soft/1회성 조사 8개(출입 기록부·우비·인부 명부·구역 지도·침상·톱날 정리대·식량 상자·손톱자국)와 자기 숨김용 `ProgressFlag` 8개를 추가했다. 목표 우선순위와 기존 퍼즐 진행에는 영향을 주지 않는다.
- 포탈 왕복 스폰, 벽 충돌, 조사 지점/포탈 비겹침, 3개 목판화의 기존 게이팅 보존 테스트를 추가했다.
- 검증: `npm test` 통과(13/13 + world/progression smoke), TypeScript 빌드 및 `dist/` 동기화 완료.

### 목판화 수색 퍼즐 심화 — 힌트 체인·구역 분산·디코이

`logs/09-remaining-work-2026-08-16.md` 5~6장의 최종 개정안을 구현했다. 기존 다락 암호 원문은 유지하고 목판화 회수만 관리동 스파인 전체에 분산했다.

- 정답 배치: `cabinB2`의 멈춘 회중시계 뒤 △, `cabinB1Rear`의 썩은 짐 아래 ○, `cabinB1` 기도실의 목 잃은 여신상 아래 ✠.
- 힌트 체인: `b2.watchHint`→`triangleHintFound`, `rear.mildewHint`→`circleHintFound`, `wing.waxHint`→`crossHintFound`. 다락 단서를 본 뒤 힌트가 나타나고, 힌트를 조사한 뒤에만 대응 목판화가 보인다.
- 디코이 6종: Wing 3종, 2F 탁상시계, 관리사무소 목상, 후관 여행 가방. 전부 `atticClueSeen` 이후 노출되고 전용 `hiddenWhen` 플래그로 1회 조사 후 사라진다.
- HUD 목표를 “건물 곳곳에서 △ ○ ✠ 목판화를 찾아라.”로 수정하고 △/○ 습득 대사를 새 위치에 맞췄다. 다락의 정본 암호 문장은 수정하지 않았다.
- 변경된 오브젝트가 배경에도 보이도록 imagegen 편집으로 Wing·후관·2층 배경 `v2` 3장을 제작해 manifest를 교체했다. 기존 `v1` 3장은 `public/assets/backups/2026-08-16-puzzle-pre-redesign/`에 복사했고 `.gitignore`로 백업 전체를 제외했다.
- 테스트를 힌트→정답 가시성 체인, 디코이 6종의 일회성/포탈 비겹침, v2 manifest 사용까지 확장했다.
- 검증: `npm test` 통과(16/16 + world/progression smoke), `npm run check`, `git diff --check`, 백업 경로 `git check-ignore` 확인 완료.

### 1358년 시대 고증 수정

`logs/10-anachronism-review-2026-08-16.md`의 시계류·톱 형태 판정을 코드와 이미지에 반영했다.

- 회중시계/손목시계/탁상시계를 각각 멈춘·흐르는·깨진 모래시계로 재설계해 `"멈춘 시간 뒤"` 암호와 정답/디코이 구별을 유지했다.
- `톱날 정리대`를 틀톱·직선 손톱·2인용 긴 톱으로 명시하고 배경의 원형 톱날을 제거했다.
- Wing·후관·2층 배경을 고증 수정 `v3`로 교체하고 직전 `v2` 이미지는 기존 Git 제외 백업 폴더로 이동했다.
- 상세 판정·프롬프트 의도·백업·검증 기록은 `logs/11-anachronism-fix-2026-08-16.md`에 분리해 남겼다.

### GR-2/GR-3 플레이어블 확장 및 전체 배경 제작

`logs/12-chapter2-3-level-design-2026-08-16.md`를 구현 정본으로 삼아 10년차 게임 개발자·게임 디자이너 역할 에이전트가 병렬로 작업했다.

- GR-2 14개 Area와 GR-3 11개 Area, 각 챕터 진행 모델/플로우, 와인 6단·네 이름 순서 퍼즐, 세 진실 석판, 레지널드 조우, 하층 편도 동선, 의식실 조작력 감쇠를 구현했다.
- 시작 및 챕터 완료 후 GR-1/2/3 선택 UI를 추가하고, 저장 스냅샷에 `chapterId`를 추가했다. 기존 `chapterId` 없는 세이브는 GR-1로 읽어 하위 호환한다.
- built-in imagegen으로 GR-2/GR-3 코드가 참조하는 배경 25종을 각각 별도 생성해 1280×720 RGB PNG로 정규화하고 manifest에 연결했다. 레지널드는 176×240 RGBA top-down 스프라이트로 추가했다.
- 에셋 자동 대조 결과: 참조 배경 ID 25개, manifest/파일 누락 0개, 크기·포맷 오류 0개, 고유 경로 25/25. 전체 contact sheet와 핵심 P0 5종을 직접 시각 검수했다.
- `index.html`의 제목과 Canvas 접근성 라벨을 Chapter 1–3 범위로 갱신했다.
- 검증: `npm run check`, `npm run build`, `/mnt/f/Nodejs/node.exe --test tests/` 21/21, 기존 `tests/smoke.mjs` 통과. 정적 HTTP로 `index.html`과 manifest 응답도 확인했다.
- 미검증: 실제 브라우저 키보드 플레이스루와 390×844 모바일 화면 캡처는 현재 환경에서 수행하지 못했다. 전투 확률 결과가 없는 내러티브 탐험형 프로토타입이므로 별도 Monte Carlo 대상은 없다.

### 챕터 선택 입력 차단 수정

- 시작 화면에 챕터 버튼은 표시됐지만 부모 `.overlay`의 `pointer-events:none` 때문에 마우스·터치 선택이 차단되던 문제를 수정했다.
- `.chapter-select button`에 포인터 입력과 명확한 focus 스타일을 추가하고, 클릭/터치 외에도 숫자키 1~3, 방향키, Enter/Space 선택을 지원한다.
- 회귀 테스트를 추가하고 `npm run check`, 빌드, 전체 22/22 테스트, 기존 GR-1 스모크 테스트를 통과했다.

### 새로고침 캐시 무효화

- 새 게임/세이브 초기화와 무관하게, 일반 새로고침 때 코드·manifest·이미지가 최신 파일로 다시 로드되도록 개발 서버에 `no-store, no-cache, must-revalidate` 헤더를 적용했다.
- manifest fetch에 `cache:'no-store'`를 지정하고 페이지 로드별 토큰을 manifest와 이미지 URL에 붙였다.
- `localStorage` 저장 키와 저장소 로직은 변경하지 않아 진행 데이터는 새로고침 후에도 유지된다.
- `npm run check`, 빌드, 전체 22/22 테스트, 기존 GR-1 스모크 테스트 통과.

### GR-2 광장 도로와 포탈 동선 정렬

- 실제 `village-square-hub-v1.png`의 도로/성 원경을 기준으로 허브 포탈을 재배치했다: The Black Lamb 여관은 남쪽 기존 성문 길, Blackwood 성 방향은 오른쪽 상단, 상점가는 왼쪽 길, 시청은 위쪽 길.
- 공용 포탈의 자동 스폰이 광장 복귀 시 플레이어를 반대편 끝에 놓던 문제를 해결하기 위해 명시적 target spawn을 지원하고, 네 스포크의 복귀 위치를 각 광장 입구 안쪽으로 고정했다.
- GR-2 시작 위치를 광장 남쪽 중앙으로 옮겨 여관 접근 거리를 줄였다.
- 배경 도로 좌표와 왕복 스폰을 고정하는 회귀 테스트를 추가했다. `npm run check`, 빌드, 전체 23/23 테스트, 기존 GR-1 스모크 테스트 통과.

### GR-2 시청·상점가 복원 및 촛대 간격 수정

- 첫 광장 재배치에서 함께 옮겨 가독성이 떨어진 시청과 상점가를 각각 기존 상단 중앙·오른쪽 하단 출구로 복원했다. Blackwood 성 방향은 오른쪽 상단, 여관은 남쪽에 유지해 네 경로를 모두 분리했다.
- 각 스포크에서 광장으로 돌아오는 위치도 복원된 출구 안쪽으로 맞췄다.
- 남쪽 여관 안내와 우선 표시가 겹치던 `square.candle`을 왼쪽 아래로 이동하고, 여관 포탈과 중심 거리 180px 초과를 회귀 테스트로 고정했다.
- `npm run check`, 빌드, 전체 23/23 테스트, 기존 GR-1 스모크 테스트 통과.

### GR-2/GR-3 실추격 시스템 도입 · CLAUDE.md GR-2/GR-3 매핑 추가

`logs/12-chapter2-3-level-design-2026-08-16.md` 1.5/2.3은 GR-1의 "Hollow는 추격하지 않는다" 결정을 그대로 계승해 GR-2/GR-3도 전부 `sighting`(2.4초 스침 후 소멸) 패턴으로 설계했으나, 사용자가 "챕터2부터는 괴물이 쫓아오지 않는다, 쫓아올 수 있게 해달라"고 요청 — GR-2/GR-3에 한해 완전한 추격/붙잡힘 시스템으로 뒤집었다(GR-1의 Hollow는 그대로 유지, 사용자가 범위를 GR-2/GR-3로 명시적으로 한정).

- 신규 `domain/Pursuer.ts`(GR-2/GR-3 전용 단일 추격자 엔티티)와 `application/PursuitService.ts`(순수 서비스 — 매 프레임 플레이어 방향으로 축 분리 이동, 벽에 막힘, bounds 겹침으로 포획 판정). `MovementService.moveAxis`와 동일한 충돌 방식을 재사용해 별도 문서 없이도 일관된 동작을 보장.
- `domain/World.ts`에 `AreaDefinition.pursuit`(엔티티 스폰/속도/포획 메시지/`onEnter` 자동발동 여부) 추가, `WorldFactory.room()`이 선택 인자로 받는다.
- 적용 지점 5곳: GR-2 `marketAlley`(Hollow, `alley.mirror` 상호작용으로 발동 — `ActionResult.startPursuit`), `innCellarEscape`(Maw, 진입 즉시 발동), `villageChaseFinal`(다중 위협 근사, 진입 즉시 발동). GR-3 `corridorDescent`/`greatHallSealed`(레지널드 추격 페이즈 P2/P3, 진입 즉시 발동). 이산 클릭 퍼즐인 `innCellar`(와인 선반)와 정지된 대면 연출인 `office2F`(`study.reginald`)는 의도적으로 제외 — 각각 LDD의 "실패해도 게임오버 없음" 퍼즐 원칙과 "대면"(추격 아님) 서술을 존중.
- `GameController`에 `pursuer`/`pursuit`/`pursuitGrace` 필드와 `activatePursuit()`/`handleCatch()` 추가. 포획 시 메시지 표시 → 현재 Area 스폰 지점으로 복귀 → 1.5초 유예 후 `onEnter` 추격 자동 재개. 진행 플래그/아이템은 잃지 않는다(다른 시스템과 동일한 무손실 원칙). Area 전환 시 추격은 항상 해제.
- `Chapter1FlowService.ActionResult`에 `startPursuit` 필드 추가, `Chapter2FlowService`의 `alley.mirror`를 `sighting`에서 `startPursuit`로 교체, `escape.lamp`의 `sighting`은 제거(이미 지역 진입 시 자동 발동이므로 중복).
- 기존 GR-1 전용 `Hollow.assetId` 필드를 추가해 `triggerSighting()`이 챕터3에서는 `character.reginald` 스프라이트를 쓰도록 수정(레지널드 "대면" 스침 연출이 Hollow 그림으로 잘못 표시되던 기존 불일치 수정, GR-1 동작은 그대로).
- `CanvasRenderer`에 `drawPursuer()` 추가(`enemy.maw`처럼 전용 아트가 없는 경우 fallback 사각형).
- `CLAUDE.md`에 신규 "설계 문서 vs 구현 — GR-2/GR-3 매핑" 섹션(추격 시스템 설명 포함)을 추가하고, GR-1 매핑의 무추격 결정 문구에 "GR-1 한정" 범위를 명시, 인트로/아키텍처 절도 챕터 1–3 전체 반영으로 갱신, 이미 구현된 GR-2/GR-3를 "아직 반영되지 않은 문서 항목"에서 제거.
- 신규 테스트 3개(`tests/chapter2-3.test.mjs`): 추격 존 5곳의 스폰 좌표가 벽과 겹치지 않고 진입 지점과 충분히 떨어져 있는지, `alley.mirror`가 `startPursuit`를 반환하는지, `PursuitService`가 벽에 막히고 포획을 판정하는지.
- 검증: `npm run build && node --test tests/`(26/26) `&& node tests/smoke.mjs` 통과. 실제 브라우저 플레이스루는 이 환경에서 `server.mjs`의 로컬 포트가 WSL↔Windows 간 curl로 응답하지 않아 수행하지 못함(기존 세션들과 동일한 환경 제약, 코드 변경으로 인한 문제 아님) — 미검증.

### 마스터 시나리오 정본화 · 대조 감사 (문서만, 코드 무수정)

사용자가 `f:\AI\develop\casy\used\Grail 게임 시나리오.md`(인물·사건·대사가 담긴 원작 서사 원고)를 지목하며 "이 시나리오가 모든 게임의 최우선 정본이어야 한다"고 요청. 이 파일 전문(1320행)을 통독한 뒤 LDD/`logs/12`/현재 구현/CLAUDE.md와 챕터별로 전수 대조했다. 코드는 이번 세션에 건드리지 않았다.

- 신규 `logs/13-master-scenario-canon-audit-2026-08-16.md`: 정본 우선순위(마스터 시나리오 > LDD > `logs/12` 파생 설계)를 명문화하고, GR-1/GR-2/GR-3 각 챕터를 시나리오 원문과 표로 대조했다. 기존 `logs/00-06`(LDD 기준 감사)과 배치되지 않으며 상호 보완적이다.
- 확인된 강한 일치: 다리 붕괴, 벌목로 랜드마크 문구, 다락 암호 원문, 와인 선반 순서/힌트, 레지널드 추격 4페이즈 구조(대면→문의 합창→봉쇄→침묵), 서비스 문 위치.
- 새로 발견한 핵심 불일치(우선순위순, 전부 후속 세션 대상):
  1. GR-3 엔딩 `ritual.witness`의 "문이 열렸군요" 대사가 레지널드로 오귀속되어 있음 — 원문은 엘리노어(를 통해 말하는 무언가)의 대사이며, 이 반전이 엔딩의 핵심 공포 포인트다.
  2. `study.reginald` 대사 톤이 원문(차분한 감사 → 도망치면 성 전체를 울리는 경고)과 다르게 위협조로 축약됨.
  3. GR-2 `house.diary`의 "VIRAX는 병이 아니라 문이었다"는 원문에 없는 재정의 — VIRAX는 원래 시장이 되살아난 사람들에게 붙인 이름.
  4. GR-3 corridorDescent/greatHallSealed의 오늘 추가한 추격 스프라이트(`character.reginald`)가 원문상 부정확 — 실제로 쫓는 것은 VIRAX/재소환된 존재들이고 레지널드 본인은 물리적으로 쫓아오지 않는다.
  5. GR-1 다락 서랍 보상의 "△ 진실 조각"(`truthTriangle`)은 시나리오 원문(열쇠+경고 쪽지 두 가지뿐)에 없는 발명 — 단 GR-2/GR-3 게이팅이 전부 이 위에 세워져 있어 되돌리지 않는 것을 권장.
  6. "1358년" 시대 설정은 LDD·마스터 시나리오 어디에도 없음(`logs/10`이 LDD 기준으로 이미 확인했고 이번에 시나리오 기준으로도 재확인) — `logs/11`의 회중시계→모래시계 교체가 여전히 유효한 전제인지 사용자 재확인 필요.
  7. 그 외: GR-1 지도(Ashvale 지도+열쇠 표시) 미구현(`logs/04`의 LDD 기준 MS-15와 이중 확인), 다락 암호의 서수(첫째/둘째/마지막) 축약(`logs/04` §3-2와 이중 확인), GR-2 시청 네 비문("그녀가 처음 쓰러졌다" 등)과 "토머스 모리스=T.모리스 폐가 일기 저자" 콜백 미반영, 폐가 지하실의 아이·엔딩 에필로그(성 첨탑 두 그림자) 미회수 서사 훅.
- `CLAUDE.md`에 "정본 우선순위" 섹션을 신설(인트로 바로 아래)해 위 우선순위와 핵심 불일치 요약·`logs/13` 링크를 명시했다. 기존 "설계 문서 vs 구현" 섹션들은 구조를 유지하되 이 신설 섹션이 상위 참조점이 되도록 배치했다.
- 검증: 문서 전용 변경이라 빌드/테스트 대상 없음(참고로 `npm run build`/`node --test tests/`가 이 세션 앞부분 작업으로 이미 26/26 통과 상태였고, 이번 문서 변경으로 재확인할 코드 변경은 없었다).

## 2026-08-19

### 마스터 시나리오 정합성 QA 감사 (챕터별 3인 병렬, 코드 무수정)

사용자가 "`used`의 문서들을 읽고 마스터 시나리오대로 연출·개발이 되어 있는지 10년차 QA로 검사"를 요청. GR-1/GR-2/GR-3를 각각 담당하는 QA 에이전트 3인을 병렬 투입해 마스터 시나리오 원문(1319행)과 구현을 비트 단위로 전수 대조했다. **코드는 일절 수정하지 않았다.**

- 결과 요약: 시나리오 비트 114개 중 구현 22 / 부분 44 / 누락 48. 결함 64건(Blocker 1 · Critical 8 · Major 26 · Minor 29).
- 챕터별 누락률: GR-1 36%(44비트), GR-2 36%(28비트), GR-3 52%(42비트).
- 시각화 리포트(Artifact): https://claude.ai/code/artifact/b2bb99a0-9f1d-456d-85a3-c9f09c38c136

**즉시 조치 대상(P0)**
1. `GameController.ts:162` — 챕터 완료 시 `enterArea('ending3')` 직후 `save()`가 호출돼 localStorage에 엔딩 Area가 기록된다. 새로고침 후 해당 챕터를 고르면 포탈·상호작용이 없는 `ending3`에 영구히 갇힌다(`ending`/`ending2` 동일). **유일한 진행 불가 결함.**
2. 옥색 돌 상자가 `ItemId`에도 인벤토리에도 없다 — 3개 챕터 QA가 독립적으로 각각 지적. GR-3 `ritual.kneel` 한 문장에만 등장.
3. `gate2.slot`이 `ironGateKey`를 검사하지 않아 **The Black Lamb 여관 아크 전체(장부→와인 퍼즐→철 열쇠→방화→탈출)를 건너뛰고 챕터 2 클리어 가능** — 시뮬레이션으로 확정. `ironGateKey`는 사문화된 아이템.
4. GR-3 의식실 클라이맥스의 원문 대사 6줄 중 0줄 구현(레지널드 재등장·Grail 유리병·엘리노어 각성 전부 부재). `ritual.witness` 화자 오귀속, `hall.portrait`(레지널드→엘리노어 오귀속), `lab.eleanor`(반생반사→표본 왜곡), `house.diary` VIRAX 재정의도 미수정 상태 그대로.

**주의 — logs/13 감사 문서에 오판정 8건**

`logs/13`이 "✅ 일치"로 통과시킨 항목 중 8건이 코드 확인 결과 사실과 달랐다. 공통 원인은 **인터랙션 ID의 존재만 확인하고 실제 문자열을 원문과 대조하지 않은 것**이다 — `dining.table`/`parlor.piano`/`lab.tubes`는 `Chapter3FlowService`에 `case`가 아예 없어 필러로 폴백하고(GR-2에도 동일 유형 9건, 총 12건), GR-1 경고 쪽지 원문은 게임에 표시되지 않으며, GR-2 광장 4방향은 좌표상 여관↔시청이 상하 반전이다. 반대로 `logs/13`이 미해결로 남긴 GR-1 서수(첫째/둘째/마지막)는 이미 해소돼 있었다. CLAUDE.md가 `logs/13`을 "반드시 먼저 읽을 것"으로 가리키고 있어 오판정이 다음 작업의 전제가 된다 — 재작성 또는 정정 표기 필요.

**주의 — 검증 인프라 사각지대**

`tests/smoke.mjs`는 `chapter1World`/`Chapter1FlowService`만 import한다. CLAUDE.md 코딩 규칙의 "Area/Portal/Interaction 추가 시 smoke가 자동 검증한다"는 서술은 **GR-2/GR-3에 적용되지 않으며**, GR-1에 대해서도 플래그 선후 관계·게이팅은 검증하지 않는다("순서는 smoke가 검증"도 과한 서술). 이번에 발견한 필러 폴백 12건과 여관 스킵 경로가 정확히 이 사각지대에서 나왔다. smoke를 3개 월드로 확장하고 **모든 인터랙션 `action`이 FlowService `default`로 떨어지지 않는지** 검증하는 어서션을 추가할 것.

**logs/12를 고쳐야 하는 지점(코드보다 선행)**

`prop.portrait`("엘리노어 초상화 (정본)" → 원문은 레지널드), `prop.footprints`("안쪽으로만/no return trail" → 원문은 왕복 흔적·같은 신발), `bg.parlor`·`prop.mannequin`("창백한 드레스/--no face detail" → 원문은 검은 드레스 + 그려진 엘리노어의 얼굴), `bg.laboratoryB2`(인간 크기 유리통 열 누락 — 엔딩 전제 오브젝트). 정정하지 않으면 다음 아트 발주에서 같은 오류가 재생산된다.

**정본 목록에 없는 used/ 문서 2종**

`grail_ai_video_shot_based_script.html`(같은 시나리오의 숏 단위 연출 대본 S01–S09 + 인물 외형 스크립트)와 `20260809_기획서_CH2_'블랙미어 숲' 초입 연출 및 시스템 개선.docx`(미반영 기획 검토안 — 소등 트리거 연출, 퇴로 차단 외길 강제, 숲속 생존 NPC, Wailer 소음 반응은 시점과 무관한 항목인데 전부 미구현). 정본 체계 편입 여부에 대한 사용자 판단 필요.

**사용자 결정 대기 항목**: "1358년" 전제 유효성(회중시계→모래시계 치환 근거) · 서막(조앤·20 노블·H.의 편지) 게임 내 도입 여부 · CH2 기획 검토안 편입 여부 · GR-1 둘째 오두막 5구역 확장을 되돌릴지 의도적 확장으로 문서화할지.

- 검증: `npm run check` / `npm run build` / `node tests/smoke.mjs` 전부 통과, `dist/`는 `src/`와 동기화 상태(stale 0). 3챕터 전 Area 월드 무결성(스폰-벽 충돌, 포탈 목적지, 즉시 재발동, 추격자 스폰) 위반 0건. 그림자 봉인 퍼즐 정답↔힌트 계산 일치, 와인 선반 순서 원문 일치 확인.

## 2026-08-20

### QA 감사 64건 코드 반영 (개발 4인 병렬 + 조율)

전날(2026-08-19) 감사에서 나온 결함 64건(Blocker 1 · Critical 8 · Major 26 · Minor 29)을 전부 코드에 반영했다. 파일 소유권을 4분할해 병렬 작업했고(Systems / GR-1 / GR-2 / GR-3), `ItemId`에 `jadeBox`/`ashvaleMap`/`warningNote`를 조율자가 선반영해 교차 의존을 끊었다. `dist/` 동시 쓰기 경합을 막기 위해 작업 중에는 `npm run build`를 금지하고 `tsc --noEmit`만 쓰게 했다.

**Blocker/Critical**
- 엔딩 Area 소프트락: `GameController.restore()`가 `ending`/`ending2`/`ending3` 스냅샷을 챕터 시작 지점으로 폴백. 완료 시 엔딩 스냅샷을 저장하지 않도록도 함께 수정. 회귀 테스트 추가(수정을 되돌리면 실패하는 것 확인).
- 옥색 돌 상자(`jadeBox`)를 세 챕터 기본 소지 + 소지품 상시 표시, `boxOpened` 이후 제거.
- GR-2 여관 아크 스킵: `gate2.slot`에 `ironGateKey` 검사 추가. 실증 스킵 경로 재현 → 차단 확인.
- GR-3 클라이맥스를 6비트로 분해(`approach → reginald → kneel → pedestal → dial → witness`), 레지널드 재등장·Grail 유리병·받침대 안치·엘리노어 각성 복원.
- `ritual.witness` 화자를 엘리노어(를 통해 말하는 무언가)로 정정. `hall.portrait`를 레지널드로, `lab.eleanor`를 중앙 탁자 위 반생반사 상태로 정정. 엔딩을 "챕터 클리어"에서 파국(변이→유리통 각성→첨탑의 두 그림자)으로 교체.
- `house.diary` VIRAX 재정의 삭제, 원문 3단 복원.

**Major/Minor**
- 필러 폴백 12건(GR-2 9 + GR-3 3) 전부 `case` 신설. 스모크에 자동 검출 어서션을 넣어 재발을 막는다.
- GR-1: 관리 기록 3행 복원("철제 서랍" 포함), 거울 테두리 각인, 목판화 3개+힌트를 `cabinB1` 3실로 회수, 창고 소품 3종, 벌목로 추종 연출, Ashvale 지도, 경고 쪽지 원문 4행, 첫 오두막 재방문 연출 방향 정정, `chaseRoad` 제거, `chaseStarted`를 완료 필수 조건화, 등잔 기본 OFF.
- GR-2: 명패를 비문 라벨 + 섞인 배치로 재설계, 방화→탈출 순서 정정 및 `innFireStarted` 게이팅, `townHallExterior` 추격 신설, 부엌 뒷문 포탈, 네 석상 4개, 광장 방위 반전 수정 + 표지판, 날씨(비 그침), `market.ledger` 원문 복원(퍼즐 정답 유출 제거).
- GR-3: `study.reginald` 3단 톤 복원 + `descent.voice` 분리, 일지 6행, `hall.footprints` 왕복 흔적, 추격 스프라이트 `enemy.hollow`, 마네킹 검은 드레스+엘리노어 얼굴, 2층 동선(`parlor.stairs`) 복원, `RitualSequenceService` 시상수 12s→3.5s.

**결정 사항 (사용자 판단 항목에 대한 처리)**
- **"1358년" 전제 폐기 → 회중시계 원복.** 마스터 시나리오 621~622행이 명시하고 1358년은 어느 정본에도 없다. `tests/p0-systems.test.mjs`의 `1358 puzzle props` 테스트는 방향을 뒤집어 재작성(모래시계 재도입 시 실패).
- **서막 도입** — 챕터 1 시작 시 프롤로그 모달 3장.
- **GR-1 1층 5구역 확장은 유지** — 목판화만 원문 3실로 회수하고 확장 자체는 CLAUDE.md에 의도적 차이로 문서화.
- **CH2 기획 검토안(`20260809_기획서_CH2_…docx`)은 미적용** — 정본 목록에 없는 제안 단계 문서(TBD 다수·1인칭 전제)이며, 소등 이벤트/외길 강제/생존 NPC/Wailer는 QA 수정이 아니라 별도 기능 개발이다.

**조율자가 처리한 통합 작업**
- `tests/p0-systems.test.mjs` — 옛 결정을 못박던 단언 3건 갱신(목판화 위치 2건, 1358년 테스트 1건).
- `tests/chapter2-3.test.mjs` — 의식실 경로를 6비트로, 광장 테스트를 픽셀 하드코딩에서 **방위 의미 단언**으로 재작성.
- 엔딩 순서 정정: GR-3 담당이 `ritual.witness`를 원문 1279행까지 확장한 결과 `ModalView`의 변이 패널(1235~1248)이 시간 역행이 됐다. 변이 서술을 `ritual.dial` 말미로 옮기고 모달 패널을 제거해 원문 순서를 1:1로 복원.
- `CLAUDE.md` 갱신 — 정본 우선순위 섹션에 `logs/13` 오판정 경고, "2026-08-20 마스터 시나리오 반영분(되돌리지 말 것)" 섹션 신설, 추격 적용 지점/포획 처리/스모크 규칙 갱신.

**주의 — `logs/13`은 신뢰할 수 없다**

`logs/13`이 "✅ 일치"로 통과시킨 항목 중 8건이 오판정이었다. 원인은 **인터랙션 ID의 존재만 확인하고 실제 문자열을 원문과 대조하지 않은 것**이다. CLAUDE.md에 경고를 명시했다. 앞으로 시나리오 대조는 감사 문서가 아니라 원문과 코드를 직접 볼 것.

**검증**: `npm run check` 통과 · `npm run build` 통과 · `node tests/smoke.mjs` 통과(CH1-3 월드 무결성 + 인터랙션 커버리지 + 엔딩 복원 + CH1 진행) · `node --test tests/p0-systems.test.mjs tests/chapter2-3.test.mjs` 26/26 · CH2/CH3 정상 경로 완주 및 CH2 스킵 경로 차단을 스크립트로 확인. 브라우저 실플레이는 기존 세션들과 동일한 WSL↔Windows 포트 제약으로 미수행.

**남은 판단 대상**
- `truthCross`가 네 이름 퍼즐 해결과 동시에 지급되는 기존 설계 때문에 `gate2.slot`의 "세 진실은 채웠으나 이름이 없다"(`truthSlotLit` 단독) 분기가 도달 불가한 죽은 분기다. 근본 해결은 `civic.pillars`를 ✠의 별도 출처로 옮기는 것 — 감사 범위를 넘는 설계 변경이라 보류.
- `PortalDefinition`에 `hiddenWhen`이 없어 GR-3 레지널드 대면 후 상층 포탈 차단은 미구현. 마네킹 텍스트 교체와 `descent.voice`로 대체 표현했다.
- `manifest.json`의 `bg.chase`는 `chaseRoad` 제거로 미사용 항목이 됐다(제거하지 않고 남겨둠).
- `Chapter2World.ts`의 x=1200 포탈 rect가 우측 벽과 10px 겹친다(기존 코드, 스모크 미검사 항목).
