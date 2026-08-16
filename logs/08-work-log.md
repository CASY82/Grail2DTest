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
