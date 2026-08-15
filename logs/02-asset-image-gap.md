# 02. 이미지 / 에셋 갭

## 요약

- `public/assets/manifest.json`에 등록된 논리 ID: **12개 (`images` 키 단일)**
- 그중 실제 아트: **0개**. 12개 전부 600~700바이트급 SVG placeholder(선형 그라디언트 + `feTurbulence` 노이즈 + 영문 라벨 텍스트) — 파일 크기와 내용으로 확인.
- manifest에 **ID조차 없는 요구 에셋**: 늑대, 조사 대상 프롭 전량(`prop.*`), UI(`ui.*`), 오디오(`audio.*`)
- 정본 docx 내부에 실제 컨셉아트·다이어그램 **25장**(`word/media/image1~25`, 총 약 6.6MB)이 들어 있으나 **프로젝트로 반입되지 않음**

---

## 1. manifest.json 등록 ID 전수 (12/12)

파일: `public/assets/manifest.json:2-15`
로더: `src/infrastructure/ManifestAssetProvider.ts:11-12` (실패해도 `CanvasRenderer` 폴백 도형으로 계속 실행)

| 논리 ID | 현재 파일 | 바이트 | 상태 | 실사(컨셉아트) 필요 근거 (docx) |
|---|---|---|---|---|
| `character.lucas` | `characters/lucas.svg` | 309 | **placeholder** — 원+사다리꼴 4패스, 방향/애니메이션 없음 | 프롤로그 보드 "루카스의 생활 공간"(문서 2장 리드). 1.2 캡슐 0.32m/1.70m 기준 비율 필요 |
| `enemy.hollow` | `characters/hollow.svg` | 382 | **placeholder** — 실루엣 1패스 + 눈 2개 | 1.3 리드: "적 컨셉아트 적용 보드 — **개체별 실루엣**과 역할을 반복 배치보다 고유 구간에 집중" |
| `bg.bridge` | `environment/bridge.svg` | 687 | **placeholder** — 라벨 `BLACKMERE WOOD — COLLAPSED BRIDGE` | 2.2 A-4 "다리 중앙 스크립트 붕괴", 3.1 1-1 "강 건너 도적·부서진 다리" |
| `bg.forest` | `environment/forest.svg` | 666 | **placeholder** — 라벨 `ASHVALE FOREST` | "CHAPTER 1 컨셉아트 보드 — **숲**, 첫 오두막, 둘째 오두막(벌목장 관리동), 다락방" |
| `bg.cabinA` | `environment/cabin-a.svg` | 663 | **placeholder** — 라벨 `FIRST CABIN` | 동 보드 "**첫 오두막**". 3.2 "첫 방문 안전, 재방문 **상태 변화**" → **상태별 2종 필요** (아래 A-1) |
| `bg.gate` | `environment/gate.svg` | 662 | **placeholder** — 라벨 `NORTH GATE` | 3.2 "관문·열쇠구멍·횃불", 3.1 1-13 "마을·성 공개" |
| `bg.logging` | `environment/logging-road.svg` | 668 | **placeholder** — 라벨 `OLD LOGGING ROAD` | 3.4 "울타리·그을린 참나무·**개울 반사광**을 순차 지표로 사용" |
| `bg.cabinB1` | `environment/cabin-b1.svg` | 671 | **placeholder** — 그라디언트 `#181412→#382a22` | 3.4 "1F **탁한 적갈색**" — 그라디언트가 의도를 근사 반영(부분 충족) |
| `bg.cabinB2` | `environment/cabin-b2.svg` | 671 | **placeholder** — 그라디언트 `#161414→#302a28` | 3.4 "2F **회백색**" — 부분 충족 |
| `bg.attic` | `environment/attic.svg` | 673 | **placeholder** — 그라디언트 `#121313→#2c2925` | 동 보드 "**다락방**", 3.4 "다락 **촛불 대비**" — 현재 난색 대비 약함 |
| `bg.chase` | `environment/chase.svg` | 664 | **placeholder** — 라벨 `HOLLOW CHASE` | 3.4 "다락→관문 The Hollow 1" (단, 이 구역 자체가 문서에 없는 창작 구역 → 04 문서 N-07) |
| `bg.ending` | `environment/ending.svg` | 667 | **placeholder** — 라벨 `ASHVALE VILLAGE` | 4장 리드 "Ashvale 마을 컨셉아트 보드 — 광장·잡화점·모리스 폐가" |

**판정** — 12개 전부 교체 대상. 다만 `bg.cabinB1/B2/attic`의 색상 계조는 문서 3.4의 수직 진행 색 구분을 의도적으로 반영한 흔적이 있으므로, 실제 아트 제작 시 **이 색값을 팔레트 기준으로 승계**할 것을 권장한다.

### A-1. 첫 오두막 "상태 변화" 배경이 1종뿐 (실질 누락)

문서가 GR-1 전체에서 가장 강조하는 연출인데 배경 ID가 1개다.

> 3.2 첫 오두막 | 첫 방문 안전, **재방문 상태 변화** | … | 재방문 기록은 **조명으로 유도**
> 3.4 블록아웃 Done: "**첫 오두막 상태 변화**와 두 번째 오두막 역할을 명확히 구분해야 한다."
> 3.1 1-6 | 오두막 재진입 | **정돈된 실내**·책장 조사

현재 `cabinA` 구역은 첫 방문/재방문 모두 동일한 `bg.cabinA`와 동일한 장식 사각형 2개를 사용한다(`src/config/Chapter1World.ts:38`, `:46`). 인터랙션 표시/숨김만 바뀔 뿐 **공간이 시각적으로 변하지 않는다.**

→ **`bg.cabinA.visited`(가칭) ID 신설 필요.** 렌더러는 `frame.area.backgroundAssetId` 단일 참조이므로(`CanvasRenderer.ts:28`), 플래그에 따라 배경 ID를 바꾸는 분기가 함께 필요하다(작업 규모 S).

---

## 2. 논리 ID 자체가 없는 누락 에셋

`public/assets/README.md:13-19`가 이미 ID 규칙(`character.*` / `enemy.*` / `bg.*` / `prop.*` / `ui.*` / `audio.*`)을 선언해 두었으나, **manifest에는 `character`/`enemy`/`bg` 3계열만 존재한다.**

### 2-1. 적 (`enemy.*`)

| 제안 ID | docx 근거 | 현재 |
|---|---|---|
| `enemy.wolf` | 1.3 적 감지표: "**늑대** \| 움직임 12m \| 18m \| — \| 4.8m/s \| **GR-1 유도 연출**" / 3.4: "숲길 \| 늑대 1~2(연출) \| **소리·눈빛만**, 접근 시 후퇴 유도" | **ID·파일·코드 전부 없음** (→ 01 문서 MS-10) |
| `enemy.wolf.eyes` | 3.1 1-3: "**늑대 눈빛만 노출**, 이동 유도" | 없음. 눈빛은 본체와 별개 스프라이트로 분리하는 편이 연출 제어에 유리(추정) |

GR-2/GR-3용 `enemy.maw` / `enemy.wailer` / `enemy.beast` / `character.reginald`는 이번 리포지토리 범위(GR-1) 밖이므로 갭으로 계상하지 않는다.

### 2-2. 조사 대상 프롭 (`prop.*`) — **전량 누락**

문서 3.2 "배치 포인트" 열에 나열된 오브젝트 중 **이미지 에셋을 가진 것은 0개**다. 현재 조사 대상은 반투명 사각형(`CanvasRenderer.ts:42`, `rgba(185,162,112,.14)`)으로만 표시되고, 주변 장식은 단색 사각형(`:37`)이다.

| 제안 ID | docx 근거 (3.2 / 3.3 / 6.1) | 대응 코드 위치 |
|---|---|---|
| `prop.parchment` | 3.1 1-4 "괴물 양피지" | `Chapter1World.ts:42` |
| `prop.candle` | 1.4 "**봉헌 촛대** 점화 = 수동 저장", 3.2 "지도·양피지·**촛대**·관리 기록" | `Chapter1World.ts:43` |
| `prop.record` | 3.3 진입 단서 "북쪽 관문 **관리 기록**" | `Chapter1World.ts:44` |
| `prop.map` | 6.1 "**Ashvale 지도** \| GR-1 첫 오두막" | **인터랙션 자체 없음** (→ MS-15) |
| `prop.gateLock` | 3.2 "관문·**열쇠구멍**" | `Chapter1World.ts:52` |
| `prop.torch` | 1.2 "횃불 20분", 3.2 "관문·열쇠구멍·**횃불**" | 없음 (→ MS-09) |
| `prop.bloodTrail` | 3.1 1-8 "천장 **핏자국** 조사", 3.3 "2층 침대에서 천장까지 이어진 핏자국" | 장식 사각형만 |
| `prop.strap` / `prop.ladder` | 3.3 "**가죽 고리**를 당겨 **접이식 사다리**를 내린다" | `Chapter1World.ts:86` |
| `prop.pocketWatch` | 3.3 목판화 위치 "서재의 **멈춘 회중시계** 뒤 △" | `Chapter1World.ts:73` |
| `prop.rottenCargo` | 3.3 "창고의 **썩은 짐** 아래 ○" | `Chapter1World.ts:74` |
| `prop.goddessStatue` | 3.3 "기도실의 **목 잘린 여신상** 밑동 ✠" | `Chapter1World.ts:75` |
| `prop.mirror` / `prop.pedestal` | 3.1 1-9 "벽·**거울**·서랍 조사 \| △○✠·**빈 받침대**·수색 암호" | `Chapter1World.ts:94-95` |
| `prop.woodcut.triangle/circle/cross` | 3.3 "△ ○ ✠ 목판화" — 6.4 "**문양의 형태/질감 구분**" 요구상 텍스처가 있는 아트 필요 | 현재 **폰트 글리프**로만 표기(`GameController.ts:133`, `ModalView.ts:22`) |
| `prop.rustedKey` / `prop.truthShard` | 6.1 "녹슨 관문 열쇠 / △ 진실 조각" | 텍스트 표기만 |
| `prop.landmark.fence/oak/creek/cartTrack` | 3.2 벌목로 "울타리·벼락 참나무·개울·수레길" | 장식 사각형 3개 (→ MS-11) |
| `prop.signpost` / `prop.footprints` / `prop.fallenTree` | 3.2 숲길 "**표지판·진흙 발자국·쓰러진 나무**" | 장식 사각형 3개 |

### 2-3. UI (`ui.*`) — **현재는 불필요, 단 2건 예외**

`style.css`와 `ModalView.ts`를 검토한 결과 UI는 **순수 CSS + Canvas 텍스트**이며 이미지 의존이 없다.

| UI 요소 | 구현 방식 | 이미지 필요? |
|---|---|---|
| HUD 프레임/목표/조작 안내/소음 표시 | `CanvasRenderer.drawHud()` — `fillRect` + `fillText` (`:76-86`) | 불필요 (폴리시 단계에서 프레임 텍스처는 선택) |
| 메시지 오버레이 | `style.css:7-10` 순수 CSS, 반투명 배경 | 불필요 |
| 퍼즐 모달 | `style.css:12-18` + DOM 버튼 | 불필요 |
| 소지품 표시 | `GameController.ts:131-136` — `△ · ○ · ✠ · 녹슨 열쇠` **텍스트 연결** | **필요** — 아래 U-1 |
| 상호작용 프롬프트 `[E] …` | `CanvasRenderer.ts:84` 텍스트 | 불필요 |

**U-1. 문양 아이콘의 폰트 의존 리스크** — △(U+25B3) ○(U+25CB) ✠(U+2720)를 시스템 폰트로 직접 출력한다. `style.css:1`의 폰트 스택은 `Inter, Pretendard, system-ui, sans-serif`로 심볼 폰트 폴백이 없어, 특히 **✠(U+2720)는 미지원 환경에서 두부(□) 렌더링 위험**이 실재한다. 문서 6.4가 "문양의 **형태/질감** 구분"을 Done 기준으로 못 박은 만큼, `ui.icon.triangle/circle/cross` 3개 ID를 만들어 SVG로 교체할 것을 권장한다(S).

**U-2. `style.css` 셀렉터 미스매치(버그)** — `style.css:15-18`의 `.puzzle button`, `.puzzle .status` 규칙은 대상 요소의 클래스가 `modal`이라(`index.html:13` `<section id="puzzle" class="modal hidden">`) **적용되지 않는다.** 퍼즐 버튼이 브라우저 기본 스타일로 렌더링되어 게임 톤과 어긋난다. 셀렉터를 `#puzzle button` / `#puzzle .status`로 바꾸면 해결(S, 2줄).

### 2-4. 오디오 (`audio.*`) — **manifest에 키 자체가 없음**

`public/assets/README.md:19`는 `audio.*` 규칙을 문서화했지만 `manifest.json`은 `images` 하나뿐이고(`:2`), 로더 인터페이스도 이미지 전용이다(`Ports.ts:14` `AssetProvider.getImage`만 존재). 즉 **오디오 에셋 파이프라인이 아예 없다.**

문서 3.4가 GR-1에 요구하는 사운드:

| 제안 ID | docx 원문 |
|---|---|
| `audio.step.wet` / `audio.step.wet.echo` | "플레이어와 **보조를 맞추다 함께 멈추는 젖은 발소리**" |
| `audio.amb.cabinB1.flies` / `audio.sfx.metalDrag` | "1F **파리·금속 끌림**" |
| `audio.amb.attic.cello` / `audio.sfx.mirrorResonance` | "다락 **낮은 첼로 지속음과 거울 공명**" |
| `audio.sfx.wolfHowl` | 3.1 1-2 "**늑대 울음이 사람 저음으로 변조**" |
| `audio.amb.rain` | 3.1/3.2 전반, 2.2 A-1 "비 시작" |

현재는 `WebAudioPort`가 48/73/91/110Hz 사인파 4종으로 전 구역을 커버한다(`WebAudioPort.ts:38`). 또한 `pulse('step')`은 **정의만 되어 있고 호출처가 0곳**이다(→ MS-13).

---

## 3. 정본 docx 내부 컨셉아트 미반입 (가장 즉효성 높은 항목)

`Grail_Chapter_Level_Design_v2_latest.docx` 내부에 실제 이미지 25장이 포함되어 있다(총 약 6.6MB).

```
word/media/image1.png   2,402,433 B   ← 최대. 표지/전체 루트 다이어그램 추정
word/media/image3.jpg     295,343 B
word/media/image4.jpg     351,490 B
word/media/image6.jpg     570,680 B
word/media/image10.jpg    322,378 B
word/media/image11.jpg    306,717 B
word/media/image15.jpg    322,523 B
word/media/image16.jpg    311,660 B
word/media/image19.jpg    316,268 B
… (총 png 16 + jpg 9 = 25개)
```

문서 본문이 참조하는 보드 캡션과 대조하면(순서 기반 **추정**):

- "전체 진행 루트 / 긴장도 목표 곡선" (00장) → 다이어그램류 PNG
- "**적 컨셉아트 적용 보드** — 개체별 실루엣과 역할" (1.3 직후) → Hollow/늑대 실루엣 원본
- "프롤로그 컨셉 보드 — 루카스의 생활 공간과 옥색 상자" (2장) → `character.lucas` 원본
- "GR-1 최신 Area View" / "**CHAPTER 1 컨셉아트 보드 — 숲, 첫 오두막, 둘째 오두막(벌목장 관리동), 다락방**" (3장 리드) → `bg.forest` / `bg.cabinA` / `bg.cabinB1/B2` / `bg.attic` 원본
- "공통 퍼즐 흐름 — 관찰→단서 수집→조합→조작→보상" (3.3) → 퍼즐 UI 레이아웃 참고

**권고** — 파이프라인 첫 단계는 신규 제작이 아니라 **반입**이다. 표준 라이브러리만으로 추출 가능하므로 비용이 사실상 0이다.

```python
import zipfile
z = zipfile.ZipFile("Grail_Chapter_Level_Design_v2_latest.docx")
for n in z.namelist():
    if n.startswith("word/media/"):
        open("public/assets/source/" + n.split("/")[-1], "wb").write(z.read(n))
```

반입 후 (1) 어떤 이미지가 어느 보드인지 육안 매핑 → (2) 1280×720 top-down 배경으로 리터치 → (3) `manifest.json` 경로만 교체. `src/` 코드 수정은 **`bg.cabinA.visited` 분기 1건을 제외하면 불필요**하다(`ManifestAssetProvider`가 논리 ID만 참조하는 설계 덕분 — 이 부분은 잘 되어 있다).

---

## 4. 액션 아이템 요약

| # | 항목 | 규모 | 우선순위 |
|---|---|---|---|
| A-1 | docx `word/media/*` 25장 추출 → `public/assets/source/` | S | **P0** (선행 작업, 비용 0) |
| A-2 | `bg.cabinA.visited` ID 신설 + 플래그별 배경 분기 | S | **P0** (문서 3.4 Done 기준 직결) |
| A-3 | `enemy.wolf` / `enemy.wolf.eyes` ID + 연출 트리거 | M | P1 |
| A-4 | `prop.*` 20여 종 신설 — 우선 조사 대상 11개(인터랙션 보유분)부터 | M | P1 |
| A-5 | `manifest.json`에 `audio` 키 + `AssetProvider.getAudio()` 확장 | M | P1 |
| A-6 | `ui.icon.triangle/circle/cross` SVG (폰트 두부 리스크 제거) | S | P2 |
| A-7 | `style.css` 셀렉터 `.puzzle` → `#puzzle` 수정 (2줄) | S | P1 (즉시 수정 가능) |
| A-8 | `bg.*` 12종 실제 컨셉아트 리터치 교체 | L | P2 (반입 후 순차) |
