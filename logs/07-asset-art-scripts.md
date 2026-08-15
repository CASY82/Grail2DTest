# 07. 에셋 아트 스크립트 (제작 지시서)

이 문서는 `02-asset-image-gap.md`가 식별한 GR-1 누락/placeholder 에셋 **전량**에 대해, 아티스트가 직접 드로잉하거나 AI 이미지 생성 툴에 그대로 투입할 수 있는 **제작 지시**를 담는다. 02번 문서가 "무엇이 없는가"를 다뤘다면 이 문서는 "그것이 어떻게 생겼는가"만 다룬다. **모든 비주얼 설명은 정본 docx 내부에 실제로 들어 있는 컨셉아트 이미지를 직접 열람한 결과를 1차 근거로 하며**(문서 텍스트와 이미지가 어긋나면 이미지를 우선했다), 대응 이미지가 없는 에셋은 "컨셉아트 없음 — 텍스트 근거 기반 추정"으로 명시했다. 작업 순서는 재우선순위화하지 말고 `02-asset-image-gap.md` 4절의 P0 → P1 → P2를 그대로 따른다(P0: docx 원본 반입 + `bg.cabinA.visited` 신설 → P1: `enemy.wolf`·조사 대상 `prop.*` 11종·`audio.*` → P2: `ui.icon.*`·`bg.*` 12종 리터치).

---

## 0. 컨셉아트 원본 대조표

`Grail_Chapter_Level_Design_v2_latest.docx`의 `word/media/*` 25장 중 **본문에 실제로 배치된 것은 14장**이고, 나머지 11장(`image1·2·5·7·8·9·12·13·14·17·18`)은 v1 잔여 파일로 본문 참조가 없다. `word/_rels/document.xml.rels`의 `rId` 매핑과 `w:drawing/a:blip` 등장 순서로 캡션을 짝지은 결과는 다음과 같다.

| 파일 | 본문 캡션 | GR-1 관련성 | 열람 |
|---|---|---|---|
| `image19.jpg` | (표지, 캡션 없음) — Ashvale 광장 대형 일러스트 | **`bg.ending` 정본** | ✅ |
| `image20.png` | 전체 진행 루트 | 다이어그램 | — |
| `image21.png` | 긴장도 목표 곡선 | 다이어그램 | — |
| `image3.jpg` | 적 컨셉아트 적용 보드 — 개체별 실루엣과 역할 | **`enemy.hollow` 정본** | ✅ |
| `image4.jpg` | 프롤로그 컨셉 보드 — 루카스의 생활 공간과 옥색 상자 | **`character.lucas` 정본** | ✅ |
| `image22.png` | GR-1 최신 Area View | 배치 검증용 | ✅ |
| `image6.jpg` | CHAPTER 1 컨셉아트 보드 — 숲, 첫 오두막, 둘째 오두막, 다락방 | **GR-1 배경 정본(8패널)** | ✅ |
| `image23.png` | 공통 퍼즐 흐름 | 다이어그램 | ✅ |
| `image24.png` | GR-2 허브 Area View | 범위 밖 | — |
| `image10.jpg` | Ashvale 마을 컨셉아트 보드 | **`bg.ending` 보조 + 소품 재질** | ✅ |
| `image11.jpg` | 여관·와인 저장고·시청 보드 | 범위 밖 | — |
| `image25.png` | GR-3 수직 Area View | 범위 밖 | — |
| `image15.jpg` | Blackwood Castle 상층 보드 | 범위 밖 | — |
| `image16.jpg` | 성 지하와 최종 실험실 보드 | 범위 밖 | — |
| `image1.png` (미참조) | 성 대현관 대형 일러스트 | **전역 조명 언어 캘리브레이션** | ✅ |
| `image2·5·7·12` (미참조) | v1 챕터 플로우 다이어그램 | 없음 | ✅(표본) |

### `image6.jpg` 8패널 내역 — GR-1 배경의 실질 정본

| 패널 | 캡션 | 대응 에셋 |
|---|---|---|
| 1 | Ashvale로 가는길 | `bg.forest` |
| 2 | 도적떼 조우 | (도입 시퀀스, 범위 밖) `character.lucas` 참고 |
| 3 | 다리가 무너짐 | `bg.bridge` |
| 4 | 첫번째 오두막 외관 | `bg.forest` 진입부 / `prop.signpost` |
| 5 | 첫번째 오두막 | **`bg.cabinA`** |
| 6 | 관리동 | 둘째 오두막 **외관**(내부 아님) |
| 7 | 관리동 다락 가는길 | **`bg.cabinB2`** |
| 8 | 관리동 다락방 | **`bg.attic`** |

**컨셉아트가 존재하지 않는 GR-1 배경**: `bg.cabinA.visited`, `bg.gate`, `bg.logging`, `bg.cabinB1`(외관만 있음), `bg.chase`. 이 5종은 인접 패널의 재질·조명을 상속해 추정으로 작성했으며 각 항목에 명시했다.

---

## 1. 전역 팔레트 — 컨셉아트에서 스포이트한 값

기존 placeholder SVG의 그라디언트나 텍스트 추론이 아니라 **`image6.jpg` / `image19.jpg` / `image1.png`에서 실제로 관측한 색**을 토큰화했다. 컨셉아트는 텍스트가 시사하는 것보다 **훨씬 어둡고, 훨씬 녹회색으로 눌려 있으며, 난색·청록이 차지하는 면적이 극히 작다** — 화면의 90%가 무채에 가깝고 나머지 10%가 색을 독점하는 구조다. 이 면적비를 지키는 것이 팔레트 자체보다 중요하다.

| 토큰 | 헥스 | 관측 출처 | 용도 |
|---|---|---|---|
| `NIGHT` | `#0c1210` | image6 전 패널 최암부 | 야외 야간 최암부. 순수 검정이 아니라 **녹기 있는 검정** |
| `FOREST` | `#151d19` | image6 p1 침엽수 매스 | 나무 덩어리, 통행 불가 영역 |
| `WET-MUD` | `#2e2a22` | image6 p1 진창길 | 젖은 흙길, 톱밥 지면 |
| `MUD-REFLECT` | `#4b544f` | image6 p1 바퀴 자국 고인 물 | 물 고인 곳이 하늘을 반사하는 색. **지면에서 유일하게 밝은 것** |
| `WET-STONE` | `#3a4240` | image19 젖은 포석 | 돌·철·바위 |
| `TIMBER-GREY` | `#4a463e` | image6 p6 관리동 외벽 | 풍화된 목재 외벽 |
| `WARM-CORE` | `#ffd79a` | image6 p5 촛불 심지 | 광원 코어. 화면 최고 명도, 면적 극소 |
| `WARM-MID` | `#e8a04e` | image6 p4 현관 랜턴 | 촛불·벽난로·랜턴 본체 |
| `WARM-FALL` | `#8a5626` | image6 p5 탁자면 감쇠 | 난색 감쇠 가장자리 |
| `TEAL-HI` | `#5ef0d8` | image4 옥색 상자 코어 | 청록 코어. **오직 용기 안에서만** |
| `TEAL-MID` | `#22c4ad` | image6 p8 다락 랜턴 | 청록 발광 본체 |
| `TEAL-DEEP` | `#0e4a45` | image19 분수 수면 | 청록이 물·돌에 반사된 잔광 |
| `RUST-1F` | `#4a2c1e` | 텍스트 근거(3.4) + p6 외벽 유추 | 둘째 오두막 1F 기준색 |
| `ASH-2F` | `#7d7873` | image6 p7 회벽 | 둘째 오두막 2F 기준색. **관측값이 텍스트 추정보다 밝다** |
| `ASH-DARK` | `#3b3733` | image6 p7 벽 그림자 | 2F 그림자 |
| `BLOOD-DRY` | `#4a1512` | image6 p7 침구·p8 벽 | 마른 피. 붉기보다 **갈흑에 가깝다** |
| `PAPER` | `#b9a270` | image10 장부 지면 | 양피지·문서·목판 표면 |
| `OCHRE-MARK` | `#a8955f` | image6 p8 벽 문양 | 벽에 그려진 문양의 안료색 |

### 전역 규칙 1 — **청록은 언제나 "용기 안"에 있다** (컨셉아트에서 도출한 최중요 발견)

문서 텍스트는 "난색 vs 청록 대비"만 말하지만, 실제 컨셉아트를 보면 청록이 나타나는 방식이 예외 없이 하나다: **작은 그릇·상자·등롱·유리병 안에 갇혀 있다.** 관측된 전 사례 —

- `image4` 창고 패널: 궤짝 안에 든 **옥색 돌 상자**
- `image6` p1: 숲길 표지판 기둥에 걸린 **청록으로 타는 랜턴**
- `image6` p8: 다락 좌측 궤짝 위의 **청록 랜턴**
- `image3`: The Hollow의 허리에 사슬로 매달린 **청록 유리병**
- `image10` 여관 / `image1` 성 대현관: 문 옆과 탁자 위의 **청록 랜턴·약병**
- `image19`: 분수 수반에 고인 물의 청록 **반사**(자체 발광 아님)

즉 청록은 분위기 조명이 아니라 **물건**이다. 따라서 어떤 에셋에도 청록 앰비언트 틴트를 깔지 말고, 반드시 (a) 발광하는 용기 자체, (b) 그 용기가 만든 반사·투사광 중 하나로만 그려라. 이 규칙 하나가 GR-1 전 에셋의 색 충돌을 방지한다. 부수 효과로 **루카스의 상자 · 청록 랜턴 · Hollow의 유리병이 같은 물건 가족으로 읽히며**, 플레이어는 설명 없이 "이 세계에는 저 빛을 담은 무언가의 네트워크가 있다"를 알게 된다.

### 전역 규칙 2 — 수직 진행(문서 3.4)

둘째 오두막은 `RUST-1F`(적갈) → `ASH-2F`(회백, 관측 `#7d7873`) → 다락(`NIGHT` 바닥 위 난색 촛불 + 청록 랜턴 1개) 순으로 채도가 빠지고 광원이 좁아진다. 세 배경을 세로로 나란히 놓으면 "적갈 → 회백 → 검정+점광 2개"의 한 줄로 읽혀야 한다. **청록이 허용되는 유일한 층은 다락**이며, 이는 컨셉아트 p7(청록 없음)과 p8(청록 랜턴 존재)의 차이로 이미 확정되어 있다.

### 전역 규칙 3 — 렌더러 중복 금지

`CanvasRenderer.drawBackground()`는 배경을 1280×720에 늘려 그린 뒤(`CanvasRenderer.ts:29`) 어둠 비네트(`drawDarkness()`)와 비 파티클(`drawRain()`)을 덮는다. **배경 아트에 비네트·빗줄기를 그려 넣지 말 것** — 이중 적용으로 뭉갠다. 컨셉아트 원본은 강한 비네트와 빗줄기를 갖고 있으므로, 리터치 시 이 두 요소를 제거하는 것이 반입 작업의 필수 단계다.

---

## 2. 배경 (`bg.*`) — 11종

모두 **1280×720 고정**. 컨셉아트는 1인칭 아이레벨이지만 이 프로토타입은 2D top-down이므로, 리터치 시 **재질·색·조명 배치는 원본에서 그대로 가져오고 카메라만 오소그래픽 하이앵글로 바꾼다.** 실내는 지붕을 제거한 평면도, 실외는 약 70도 하이앵글.

#### bg.bridge

1. **ID / 배치 위치** — `bg.bridge`. `Chapter1World.ts:13-22`, area `bridge`. 스폰 (180,520), 하단 전폭 벽 `{0,620,1280,82}`(강), 좌상단 벽 `{500,0,110,280}`. 장식 3개: `{80,580,520×38}`(무너진 상판), `{560,330,300×22}`, `{870,130,260×28}`. 상호작용 `bridge.look` (210,470,180×100).
2. **컨셉아트 근거** — `image6.jpg` 패널 3 "다리가 무너짐".
3. **기획 의도** — 3.1 1-1: "강 건너 도적·부서진 다리, 복귀 불가".
4. **비주얼 설명** — 원본을 보면 다리는 통나무 상판이 아니라 **밧줄에 널판을 엮은 현수교**이고, 그 널판들이 끊어져 강물 쪽으로 늘어져 흔들린다. 강은 잔잔한 검은 물이 아니라 **흰 포말이 터지는 급류** — 화면 하단 1/3을 채우며 이 구역에서 가장 밝은 면(`#8e9a95` 포말)이 되고, 그 밝기가 "건널 수 없음"을 명도만으로 전달한다. 강 건너편에는 도적 실루엣 4~5명이 **도끼를 치켜든 자세로** 검게 서 있고 그 사이에 말 한 마리가 섞여 있다 — 얼굴은 없고 실루엣만. 좌측 원경 안개 위로 **성의 첨탑 실루엣이 아주 흐리게 보인다**(GR-3 복선이 이미 첫 화면에 심어져 있다 — 텍스트에는 없는 정보이므로 반드시 반영할 것). 우측 나뭇가지에는 **난색 랜턴 하나**가 걸려 흔들린다. 지면은 `WET-MUD`에 젖은 풀, 부러진 각재가 흩어져 있다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic high-angle view of a collapsed rope-and-plank suspension bridge over white foaming rapids at night in heavy rain, broken planks dangling into the water, the churning white water being the brightest element, four or five black bandit silhouettes with raised axes and a horse on the far bank, a faint gothic castle spire silhouette on the distant left horizon through fog, a single warm lantern hanging from a branch on the right, muddy bank with scattered broken timber, painterly horror concept art, palette #0c1210 #2e2a22 #8e9a95 with one #e8a04e accent, no characters in foreground --no vignette, rain streaks, text, watermark, first-person perspective, teal light`
6. **구현 메모** — 1280×720 PNG/WebP. 정적 1장. 장식 `{80,580,520×38}`을 늘어진 널판 뭉치와 겹치게 배치할 것. 원본이 1인칭 액션 컷이므로 **루카스를 지우고 카메라를 올리는 리터치**가 핵심 작업이다.

#### bg.forest

1. **ID / 배치 위치** — `bg.forest`. `Chapter1World.ts:23-36`, area `forest`. 벽(나무 매스) `{300,160,80×300}` `{610,320,90×300}` `{900,80,70×300}`. 출구 4방향. 장식 3개 `{95,90,120×130}` `{430,510,120×120}` `{1000,410,110×140}`.
2. **컨셉아트 근거** — `image6.jpg` 패널 1 "Ashvale로 가는길", 패널 4 "첫번째 오두막 외관".
3. **기획 의도** — 3.2: "숲길/갈림길 | 적 직접 배치 없음 | 표지판·진흙 발자국·쓰러진 나무".
4. **비주얼 설명** — 원본의 지배 요소는 **깊게 패인 마차 바퀴 자국**이다. 길 한복판을 따라 두 줄의 깊은 홈이 이어지고 거기 고인 물이 하늘을 반사해(`MUD-REFLECT`) **어두운 화면에서 경로를 안내하는 유일한 밝은 선**이 된다 — 이 장치를 top-down으로 옮기면 4개 출구로 뻗는 길이 전부 "반사하는 물의 선"으로 읽혀 UI 없는 길 찾기가 성립한다. 양옆은 빈틈없는 침엽수(`FOREST`)로 캐노피가 하늘을 거의 덮고, 상단 중앙만 회청 하늘(`#39433f`)이 좁게 열린다. 좌측 나무 기둥에 **"Ashvale" 표지판이 철제 갈고리로 매달려 있고 그 아래 청록으로 타는 랜턴 하나가 걸려 있다**(전역 규칙 1의 첫 사례 — 이 랜턴이 GR-1에서 청록을 처음 보여준다). 우측에는 이끼 덮인 돌 표석/작은 사당이 서 있다. 난색은 화면 어디에도 없다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic overhead view of a rain-soaked forest crossroads at night, deep cart ruts filled with water reflecting the pale sky and forming the only bright guiding lines across the dark ground, dense black-green conifer walls with the canopy nearly closing overhead, a wooden hanging signpost on an iron hook at the left with a lantern burning cold teal-cyan beneath it, a mossy stone waymarker on the right, painterly horror concept art, palette #0c1210 #151d19 #2e2a22 #4b544f with one #22c4ad lantern, no warm light, no characters --no vignette, rain streaks, text, watermark, characters, orange light`
6. **구현 메모** — 1280×720. 청록 랜턴은 별도 알파 레이어로 출력해 `prop.torch`(랜턴형)로도 재사용한다. 진짜 통행로와 막다른 길은 **물 반사선의 유무**로 구분 — 밝기 차이 20% 이상.

#### bg.cabinA

1. **ID / 배치 위치** — `bg.cabinA`. `Chapter1World.ts:37-47`, area `cabinA` **첫 방문 상태**. 940×470 단칸, 내부 칸막이 `{530,260,220×38}`. 상호작용: 양피지(270,220), 촛대(910,210), 관리 기록(810,400). 장식 `{250,380,180×100}` `{830,380,170×110}`.
2. **컨셉아트 근거** — `image6.jpg` 패널 5 "첫번째 오두막"(내부), 패널 4 "첫번째 오두막 외관".
3. **기획 의도** — 3.1 1-4: "빈 집 조사 | 괴물 양피지·봉헌 촛대, 안도".
4. **비주얼 설명** — 원본은 내 텍스트 추정과 광원 구성이 다르므로 **원본을 따른다**: 광원이 하나가 아니라 **둘**이다. (a) 좌측 벽의 **돌 벽난로에 실제로 불이 타고 있고**(`WARM-MID`, 바닥에 길고 밝은 반사 띠를 만든다), (b) 방 중앙 나무 탁자 위에 **촛불 대여섯 개가 한 무더기로** 꽂혀 있다(`WARM-CORE`). 두 광원 사이의 바닥이 화면에서 가장 밝고, 벽 쪽으로 갈수록 급격히 `NIGHT`로 떨어진다. 탁자 위와 **바닥 전면에 종이·서류가 흩뿌려져 있고**(단순한 어수선함이 아니라 누군가 급히 뒤진 흔적), 유리병 몇 개가 쓰러져 있다. 우측 벽은 **항아리와 단지가 빼곡한 높은 선반장**, 후면 좌측에 창 하나가 차가운 청회색(`#4a5a58`)을 들이고 있어 난색과 대비를 만든다. 천장 서까래가 굵게 노출. 바닥은 젖어 광택이 있는 널마루. 채도는 GR-1 전체에서 가장 높게 허용되는 구간이다(안도). **청록 사용 금지** — 원본 p5에 청록이 전혀 없다는 사실이 이 방이 아직 "정상"임을 말한다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of a woodsman cabin interior with the roof removed, a stone fireplace with live fire on the left wall casting a long bright reflection across a wet plank floor, a wooden table at the center crowded with five or six lit candles, papers and documents scattered over the table and all across the floor as if hastily searched, toppled glass bottles, a tall shelf unit packed with jars and crocks on the right, one small window at the back letting in cold blue-grey light, heavy exposed roof beams, painterly horror concept art, warm palette #2a1f16 #e8a04e #ffd79a with one cold #4a5a58 window, no characters --no vignette, text, watermark, characters, teal or cyan light, first-person perspective`
6. **구현 메모** — 1280×720. `bg.cabinA.visited`와 **완전히 동일한 카메라·가구 배치**로, 같은 레이어드 원본(PSD)에서 조명/소품 레이어만 바꿔 두 장을 출력할 것. 이것이 이 두 에셋 제작의 유일한 필수 조건이다.

#### bg.cabinA.visited

1. **ID / 배치 위치** — `bg.cabinA.visited` (**02번 문서 A-1 신설 제안분**). 동일 area `cabinA`, `cabinVisited` 플래그 이후 참조. 배경 ID 분기 코드가 함께 필요(A-2, 규모 S).
2. **컨셉아트 근거** — **없음** — `bg.cabinA`(image6 p5)의 파생으로 신규 제작. 상태 변화 연출 자체는 텍스트 근거만 존재한다.
3. **기획 의도** — 3.1 1-6: "오두막 재진입 | **정돈된 실내**·책장 조사"; 3.2 주의: "재방문 기록은 **조명으로 유도**".
4. **비주얼 설명** — 픽셀 단위로 같은 공간인데 **누군가 정리해 놓았다.** 바닥과 탁자에 흩뿌려져 있던 종이가 **탁자 위에 모서리를 맞춰 한 뭉치로 쌓여 있고**, 쓰러진 병은 세워졌으며, 의자는 탁자에 반듯이 밀려 들어가 있다. 흩어진 먼지·잎은 문가에 한 무더기로 쓸려 모여 있고 빗자루가 벽에 기대어 있다. **광원 구성이 뒤집힌다**: 벽난로 불은 꺼져 재만 남아 검고(좌측이 죽는다), 탁자 촛불도 꺼져 심지 연기 한 줄기만 오르며, 대신 **우하단 선반장 앞(810,400 관리 기록 위치)에 새 랜턴 하나가 켜져 있다** — 화면에서 유일한 광원이 정반대 구석으로 이동해 시선을 관리 기록으로 강제 유도한다(3.2의 "조명으로 유도"를 문자 그대로 구현). 색온도는 첫 방문보다 미세하게 차갑게(`WARM-MID`를 `#d0904a`로 탈채도), 그림자를 길게 늘린다. 문 안쪽에 젖은 발자국 한 쌍이 **바깥에서 안으로만** 나 있고 나가는 자국이 없다 — 대사 없이 "타자의 개입"을 전달하는 유일한 장치.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of the SAME cabin interior as before but tidied by someone unseen: the scattered papers now stacked in one neat squared pile on the table, bottles set upright, chair pushed under the table, leaves swept into a single heap by the door with a broom leaning nearby, the fireplace cold and full of grey ash, the table candles extinguished with thin smoke wisps, a single new lit lantern at the lower-right shelf as the only light source in the room, one pair of wet bootprints leading inward and never leaving, painterly horror concept art, colder palette #2a1f16 #d0904a #3b3733, long stretched shadows, uncanny, no characters --no vignette, text, watermark, characters, teal light, first-person perspective`
6. **구현 메모** — 1280×720. `bg.cabinA`와 동일 원본 파생. **가구 위치가 1px이라도 어긋나면 연출이 죽는다.** manifest 신규 키 + 렌더러 분기 필요.

#### bg.gate

1. **ID / 배치 위치** — `bg.gate`. `Chapter1World.ts:48-54`, area `gate`. 벽 `{780,90,330×450}`, 장식 `{805,105,280×420}`. 상호작용 `gate.lock` (720,270,110×120).
2. **컨셉아트 근거** — **없음** — 전용 패널이 없다. `image22.png`(GR-1 Area View)가 이 지점을 **"관문 돌벽 — 잠김·열쇠 필요"**로 표기하므로 철문 단독이 아니라 **돌벽에 박힌 문**으로 해석했다(텍스트만으로는 알 수 없던 정보). 재질은 `image19.jpg`의 젖은 포석·철물에서 상속.
3. **기획 의도** — 3.2: "북쪽 관문 | 관문·열쇠구멍·**횃불** | 첫 추격과 레벨 종료".
4. **비주얼 설명** — 화면 우측 1/3을 세로로 완전히 막는 **거친 돌 성벽**과 거기 박힌 녹슨 철문. 돌은 `WET-STONE`에 이끼와 물때가 줄무늬로 흘렀고, 철문은 `#6a4a33` 녹이 겹겹이 부풀어 원래 문살 형태를 반쯤 잃었다. 문살 틈으로 저 너머 안개와 마을 지붕 윤곽이 아주 흐리게 비쳐 **도달 불가**가 시각적으로 확인된다. 아치 양옆 벽 브래킷에 **난색 랜턴 2개**(원본 세계관은 벽 횃불보다 매다는 랜턴을 쓴다 — image6 p1/p2/p4, image10 여관에서 일관되게 관측됨)가 걸려 이 구역 유일한 난색이 되고, 젖은 포석에 길게 반사된다. 열쇠구멍 자리(720,270 부근)는 주변보다 반 톤 밝게 처리해 UI 없이 눈에 걸리게 한다. 좌측 2/3은 `bg.forest`의 진창길·침엽수와 연속되게.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic high-angle view of a rough wet stone rampart blocking the right third of the frame with a rusted iron gate set into it, moss and water streaks down the stone, blistered layered rust obscuring the bars, fog and faint unreachable rooftops beyond, two warm hanging lanterns on iron brackets flanking the arch as the only warm light reflecting on wet cobbles, muddy forest path continuing on the left, painterly horror concept art, palette #3a4240 #6a4a33 #e8a04e #151d19 --no vignette, rain streaks, text, watermark, characters, first-person perspective, teal light`
6. **구현 메모** — 1280×720. 랜턴 2개는 배경에 저강도 베이스 글로우만 굽고 **불꽃 코어는 비워 두어** `prop.torch` 스프라이트를 겹칠 수 있게 한다.

#### bg.logging

1. **ID / 배치 위치** — `bg.logging`. `Chapter1World.ts:55-64`, area `loggingRoad`. 벽 4개가 지그재그 통로 형성. 장식 `{350,80,120×160}`(그을린 참나무), `{610,480,180×25}`(개울), `{880,120,190×50}`(수레길).
2. **컨셉아트 근거** — **없음** — 전용 패널이 없다. `image6.jpg` 패널 1의 **바퀴 자국 물 반사** 처리와 패널 6(관리동 외관) 주변에 흩어진 벌목 잔해·물통 구조물을 재료로 상속해 구성했다.
3. **기획 의도** — 3.4: "조명은 옛 벌목로의 **울타리·그을린 참나무·개울 반사광**을 순차 지표로 사용한다".
4. **비주얼 설명** — 이 배경의 유일한 임무는 **좌→우 순차 랜드마크 4개의 명도 계단**이다. 화면을 4구간으로 나누고 각 랜드마크 자리에만 국소 명도를 올린다: (1) 좌측 부러진 목책 — 젖은 나무 `#5f5a4e`, (2) 중상단 벼락 맞은 참나무 — 탄 껍질 `#1a1512`에 갈라진 속살만 `#7a6449`, (3) 중하단 얕은 개울 — **이 구역 최고 명도**, 수면 `#4e6a66`에 잘게 부서지는 흰 하이라이트, (4) 우상단 수레바퀴 자국 — 두 줄 홈에 고인 물의 선형 반사(`MUD-REFLECT`). 나머지 지면은 톱밥 섞인 진창(`WET-MUD`)에 잘린 그루터기와 각재가 흩어지고, 원본 p6에서 관리동 옆에 서 있던 **나무 물통 구조물(급수탑)**을 우측 배경에 한 채 세워 두 구역을 잇는다. 오른쪽으로 갈수록 지면에 `BLOOD-DRY` 점적이 늘어난다(3.1 1-7).
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic overhead view of an old logging road at night in the rain, four sequential landmarks reading left to right: a broken post fence, a lightning-scorched oak with charred bark and one pale split of raw wood, a shallow creek that is the brightest element with fine white highlights, and two water-filled cart ruts reflecting the sky, muddy sawdust ground with cut stumps and scattered timber, a wooden water tower structure in the right background, sparse dark blood droplets increasing toward the right, painterly horror concept art, palette #2e2a22 #1a1512 #4e6a66 #4b544f, cold, no warm light --no vignette, rain streaks, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. 랜드마크 명도 순서를 **울타리 < 참나무 < 수레길 < 개울**로 고정. `prop.landmark.*` 4종을 위에 얹을 때 배경 쪽은 저강도 베이스로만 남긴다.

#### bg.cabinB1

1. **ID / 배치 위치** — `bg.cabinB1`. `Chapter1World.ts:65-78`, area `cabinB1`. 칸막이 `{420,90,28×360}` `{820,240,28×360}`이 **서재(좌)/창고(중)/기도실(우)** 3방으로 분할. 장식 `{210,155,165×200}` `{500,300,220×190}` `{880,330,170×200}`.
2. **컨셉아트 근거** — `image6.jpg` 패널 6 "관리동" — 단, 이 패널은 **외관뿐이며 1F 내부 컨셉아트는 존재하지 않는다.** 외벽 재질·핏자국 처리만 상속하고 내부 구성은 텍스트 근거 기반 추정.
3. **기획 의도** — 3.4: "둘째 오두막은 **1F 탁한 적갈색** → 2F 회백색 → 다락 촛불 대비".
4. **비주얼 설명** — 먼저 원본 외관에서 확정된 사실: 관리동은 **3층 높이의 크고 낡은 목조 건물**이고 외벽은 풍화된 회갈색 판자(`TIMBER-GREY`)이며, **2층 외벽 여러 곳에 검붉은 핏자국이 흘러내린 자국**이 밖에서 이미 보인다. 즉 이 건물은 안에 들어가기 전부터 유죄다 — 1F 배경에도 이 "밖에서 이미 보였다"는 연속성이 필요하다. 내부는 전 화면이 `RUST-1F` 지배: 바닥은 마른 피와 철녹이 스며든 탁한 적갈 널마루(이음새 `#2a170f`), 벽 하부는 습기로 얼룩진 목재. 광원은 판자 틈으로 들어오는 약한 외광 몇 줄뿐이고 그마저 적갈 바닥에 반사되어 **화면 전체가 한 색으로 물든다** — 이 공간에서 색은 정보를 주지 않고 형태만 준다. 세 방은 **형태 언어**로만 구분한다: 서재=수직선(책등·선반), 창고=불규칙 덩어리(자루·궤짝), 기도실=좌우대칭(제단·의자열). 창고 짐더미 주위에 파리가 검은 점으로 흩어지고, 바닥에는 무언가를 끌고 간 폭 40px가량의 긁힌 자국이 창고에서 계단 쪽으로 나 있다(`audio.sfx.metalDrag` 대응).
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of the ground floor of a large derelict three-story timber logging lodge, divided by partitions into three rooms: a study with tall bookshelves on the left, a storeroom of irregular sacks and crates in the middle, a symmetrical prayer room with an altar on the right, the whole floor drowned in one muddy reddish-brown tone, damp stained timber, thin shafts of weak exterior light through plank gaps, black flies over the crates, a wide drag scratch across the floor toward the stairs, painterly horror concept art, monochromatic palette #4a2c1e #2a170f #6b3f2a, oppressive and airless --no vignette, text, watermark, characters, teal or cyan light, first-person perspective`
6. **구현 메모** — 1280×720. placeholder SVG의 `#181412→#382a22` 계조를 감쇠 기준으로 승계. `bg.cabinB2`·`bg.attic`과 **동일한 건물 외형·창 위치**로 그려 층이 겹쳐 읽히게 할 것.

#### bg.cabinB2

1. **ID / 배치 위치** — `bg.cabinB2`. `Chapter1World.ts:79-88`, area `cabinB2`. 중앙 칸막이 `{500,250,300×38}`. 장식 `{360,350,200×100}`(침대), `{760,340,180×120}`. 상호작용 `b2.strap` (820,170,100×110). 포털 `b2.attic` (900,130).
2. **컨셉아트 근거** — `image6.jpg` 패널 7 "관리동 다락 가는길" — **거의 1:1 대응하는 가장 충실한 참조.**
3. **기획 의도** — 3.4: "1F 탁한 적갈색 → **2F 회백색** → 다락 촛불 대비".
4. **비주얼 설명** — 원본에서 확정된 것들: 벽은 **금이 간 회백색 회벽**(`ASH-2F` `#7d7873`, 관측값이 placeholder 추정보다 밝다 — 이 밝기가 1F 적갈과의 대비를 만드는 핵심이므로 어둡게 깔지 말 것). 우측에 **침대가 있고 침구에 검붉은 얼룩이 번져 있으며, 그 얼룩이 침대 밑으로 흘러 바닥까지 이어진다.** 좌측에는 작은 탁자와 촛불 두세 개, 그 위 선반에 단지와 두개골 하나, 천장에 **말린 약초 다발이 거꾸로 매달려 있다**, 벽에는 **오각별(펜타그램) 문양이 그려져 있고** 액자 하나가 걸렸다. 그리고 방 중앙 우측에 **나무 사다리가 이미 내려와 천장의 열린 다락 구멍으로 이어진다** — 구멍 안은 완전한 검정. 이 검은 사각형이 화면에서 가장 어두운 지점이자 유일한 목적지다. **텍스트(3.3 "천장까지 이어진 핏자국")와 아트(침대→바닥)가 어긋나는 지점**은 텍스트를 스펙으로 채택하되 아트의 재질·소품을 얹는다: 즉 핏자국은 침대에서 시작해 바닥을 지나 벽을 타고 천장문까지 이어지고(top-down이므로 벽면을 접어 펼친 형태로 그린다), 모든 스미어의 꼬리가 **천장문 방향으로 가늘어진다**(끌려 올라간 방향성). 난색 촛불은 좌측에만 아주 작게 허용하고 청록은 이 층에 **없다.**
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of the second floor of a derelict lodge, cracked pale grey-white lime plaster walls, a bed on one side with dark blood soaked into the sheets and running down onto the floor, the trail continuing across the floor and up the wall to a ceiling hatch, every smear tapering toward the hatch, a wooden ladder already lowered from the open hatch, the hatch opening a pure black rectangle, a small table with two or three candles, dried herb bundles hanging from the ceiling, a pentagram drawn on the wall, a framed picture, a shelf with a jug and a skull, painterly horror concept art, palette #7d7873 #3b3733 #4a1512 with a tiny #e8a04e candle, no teal --no vignette, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. placeholder `#161414→#302a28` 계조는 **관측값(`#7d7873`)에 맞춰 밝게 재조정**할 것. 핏자국 시작·끝 좌표를 침대 장식(360,350)과 `b2.strap`(820,170)에 정확히 맞춰야 `prop.bloodTrail`을 겹칠 때 어긋나지 않는다.

#### bg.attic

1. **ID / 배치 위치** — `bg.attic`. `Chapter1World.ts:89-98`, area `attic`. 장식 `{540,225,200×150}`(퍼즐 장치), `{895,170,135×150}`(창). 상호작용: `attic.clue` (300,200,150×100), `attic.puzzle` (555,240,170×120), `attic.window` (900,180,120×130).
2. **컨셉아트 근거** — `image6.jpg` 패널 8 "관리동 다락방" — **전역 시각 언어(난색 vs 청록)가 한 화면에 완성되어 있는 정본 이미지.**
3. **기획 의도** — 3.4: "다락 **촛불 대비**"; 3.3: "촛대와 거울 각도를 조절해 세 그림자를 하나의 봉인으로 중첩".
4. **비주얼 설명** — 원본이 매우 구체적이므로 그대로 따른다. 벽은 어두운 녹회색 풍화 판자. **후면 벽에 큰 문양 세 개가 안료(`OCHRE-MARK`)로 그려져 있다**: 왼쪽에 내부에 표식이 든 **삼각형(△)**, 중앙에 큰 **원/고리(○)**, 오른쪽에 **지팡이를 감은 뱀 형태의 문장**. 방 중앙에는 **둥근 나무 탁자 위에 검은 철제 3지 촛대가 놓이고 초 세 자루가 타고 있다** — `WARM-CORE` 코어에서 나온 난색이 탁자면과 그 주변 바닥만 밝힌다. 좌측에는 궤짝 위에 **청록으로 타는 랜턴**이 놓여 벽과 바닥에 차가운 `TEAL-MID` 빛을 던지고, 그 빛과 촛불 빛이 바닥 중간에서 만나 **GR-1 전체에서 가장 강한 색 경계선**을 만든다. 우측 벽에는 초 두 자루가 꽂혀 있고 그 아래로 **검붉은 핏자국이 넓게 튀어 흘러내렸으며**, 원형 나무 바퀴 같은 물건이 걸려 있다. 바닥과 서까래는 거의 `NIGHT`로 잠긴다.
   > **설계 판단(불일치 해소)**: 문서 3.3은 세 문양을 "△ ○ ✠"로, 청록 광원을 "거울"로 규정하지만, 컨셉아트의 세 번째 문양은 **뱀이 감긴 지팡이**이고 청록 광원은 **랜턴**이다. 아트를 정본으로 삼되 게임 기능(퍼즐 정답이 ✠, 3.3의 거울 각도 조작)을 깨지 않기 위해, ✠는 **십자에 뱀이 감긴 하이브리드 문장**으로 그리고, 다락에는 **청록 랜턴과 거울을 모두** 배치한다(랜턴이 광원, 거울이 조작 장치). 이 판단은 추정이며 아트 디렉터 확인이 필요하다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic floor-plan view of a cramped attic at night, dark weathered green-grey plank walls, three large ochre symbols painted on the far wall: a triangle with marks inside, a large ring, and a serpent coiled around a staff, a round wooden table at the center holding a black iron three-armed candelabrum with three lit candles casting a warm pool, a lantern burning cold teal-cyan on a crate at the left throwing cyan light across the wall and floor, the sharp meeting line between warm and teal on the floorboards, two wall candles on the right below a wide dark blood splatter running down the planks, a wooden wheel hanging on the wall, floor and rafters sunk to near black, painterly horror concept art, palette #0c1210 #e8a04e #22c4ad #a8955f #4a1512 --no vignette, text, watermark, characters, first-person perspective`
6. **구현 메모** — 1280×720. placeholder `#121313→#2c2925` 계조 승계하되 **난색·청록 대비를 대폭 강화**(02 문서 지적: "현재 난색 대비 약함"). 창(895,170)은 Hollow 실루엣 등장 지점이므로 **창 너머를 완전히 비워** 둘 것. 청록 투사광은 별도 레이어로 출력해 퍼즐 성공 시 발광 강화에 재사용.

#### bg.chase

1. **ID / 배치 위치** — `bg.chase`. `Chapter1World.ts:99-105`, area `chaseRoad`. 벽 4개가 지그재그 도주로 형성. 장식 `{1170,250,60×220}`(관문). 상호작용 `chase.gate` (1160,280).
2. **컨셉아트 근거** — **없음** — `image22.png`가 이 구간을 별도 Area로 그리지 않는다(04번 문서 N-07의 "문서에 없는 창작 구역"이 Area View로도 확인된다). 따라서 `bg.forest`(image6 p1)와 `bg.gate`의 재료만 재조합해 **새 장소로 보이지 않게** 만든다.
3. **기획 의도** — 3.4: "다락→관문 The Hollow 1 | 창밖 등장 후 직선 추격, 관문 전 시야 이탈".
4. **비주얼 설명** — image6 p1의 진창길·바퀴 자국·침엽수를 그대로 쓰되 **좌→우로 갈수록 나무 밀도가 낮아지고 통로가 넓어진다**(속도감과 "출구가 보인다"). 벽 위치의 나무 매스는 `bg.forest`보다 더 눌러(`#0f1613`) 통로 명도만 살린다. 우측 끝 관문에 난색 랜턴 2개가 화면 유일한 목표점으로 빛나고, 그 빛이 젖은 길 위에 **화면 폭 1/3까지 뻗은 반사 띠**를 만들어 광원이 곧 도주 방향이 되게 한다. 지면 물웅덩이를 통로를 따라 규칙적으로 배치해 달릴 때 리듬을 만든다. 청록 랜턴은 이 구역에 **두지 않는다** — 청록은 멈춰서 관찰하는 물건이고, 이 구역은 멈추면 안 되는 구간이다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, orthographic overhead view of a narrow zigzag escape path through night forest in rain, near-black conifer masses forming walls that thin out toward the right as the path widens, muddy track with rhythmic water puddles and cart ruts, at the far right a rusted gate in a stone wall lit by two warm lanterns, the warm light stretching a long reflection band a third of the way down the wet path as the only destination cue, painterly horror concept art, palette #0c1210 #0f1613 #2e2a22 with a single #e8a04e goal light, urgent and directional --no vignette, rain streaks, text, watermark, characters, teal light, first-person perspective`
6. **구현 메모** — 1280×720. 플레이 중 시선이 우측에만 머무르므로 좌측 디테일에 시간을 쓰지 말 것. 관문 그래픽은 `bg.gate`에서 잘라 재사용해 동일 오브젝트임을 보장한다.

#### bg.ending

1. **ID / 배치 위치** — `bg.ending`. `Chapter1World.ts:106-108`, area `ending`. 벽·포털·상호작용 전무, 스폰 (640,360) 중앙 고정. 사실상 엔딩 카드.
2. **컨셉아트 근거** — `image19.jpg`(문서 표지 대형 일러스트, 이 구역의 **정본**) + `image10.jpg` 패널 1 "Ashvale 마을".
3. **기획 의도** — 3.1 1-13: "열쇠 사용 | 마을·성 공개, GR-2 전환".
4. **비주얼 설명** — 원본이 매우 구체적이며, 내 초안의 텍스트 추정("목이 꺾인 석상이 서 있다")은 **틀렸다** — 실제로는 **거대한 석상이 통째로 넘어져 분수 수반을 가로질러 누워 있고, 잘려나간 머리가 몸에서 떨어져 나뒹군다.** 그 뒤로 문장이 새겨진 돌 기둥이 서 있고, **분수 수반에 고인 물만 청록으로 빛난다**(`TEAL-DEEP`~`TEAL-MID` — 전역 규칙 1의 "반사" 사례이자 GR-2로 이어지는 유일한 색 신호). 배경에는 목골조(half-timbered) 폐가들이 지붕이 꺼진 채 늘어서고, 찢어진 천 배너와 빨랫줄이 건물 사이에 늘어져 있으며, 좌상단에 문장이 박힌 철제 간판이 사슬로 매달려 있다. **좌상단 원경 언덕 위로 거대한 고딕 성이 안개 속에 솟아 있다** — 첨탑이 여럿인 대성당형 실루엣으로, 화면에서 두 번째로 중요한 정보다. 하늘은 비 그친 직후의 회보라(`#5a5f68`), 지면은 젖은 포석에 낙엽이 깔렸다. **불 켜진 창이 단 하나도 없다** — 사람이 있어야 할 곳의 완전한 무광이 이 컷의 공포다. 벤치가 뒤집혀 있고 나무는 전부 잎이 없다.
5. **이미지 생성 프롬프트** — `top-down 2D game background, 1280x720, high-angle view over a dead medieval village square at dusk after rain, a colossal stone statue toppled and lying across the rim of a dry fountain with its severed head fallen separately nearby, a carved stone pillar behind it, the shallow water left in the fountain basin glowing faint teal-cyan as the only color, collapsing half-timbered houses with torn cloth banners strung between them, a heraldic iron sign hanging on chains at the upper left, a huge gothic multi-spired castle silhouette on a hill in the fog at the far upper left, bare leafless trees, overturned benches, wet leaf-strewn cobblestones, not a single lit window anywhere, overcast grey-violet sky, painterly horror concept art, palette #5a5f68 #3a4240 #2b3330 with one #22c4ad accent --no vignette, text, watermark, characters, warm window lights, first-person perspective`
6. **구현 메모** — 1280×720. HUD와 어둠 비네트가 그대로 덮이므로(`drawDarkness()`는 area 무관 실행) **중앙 (640,360) 반경 250px 안에 핵심 정보**(넘어진 석상 + 청록 분수)를 배치하고, 상단에 놓이는 성 첨탑은 어두워지므로 명도를 한 단계 올릴 것.

---

## 3. 캐릭터 / 적 — 4종

`CanvasRenderer`가 `character.lucas`를 44×60, `enemy.hollow`를 46×68로 그린다(`:49`, `:57`) — **세로가 긴 비율**이므로 순수 수직 top-down이 아니라 **3/4 하이앵글(약 60~70도) 스프라이트**로 제작해야 배경(오소그래픽 평면도)과 맞물린다. 이는 코드 rect에서 역산한 **추정 판단**이다.

#### character.lucas

1. **ID / 배치 위치** — `character.lucas`. `CanvasRenderer.ts:49` — 플레이어 좌표 기준 `(-22,-30)`에 44×60. 전 area 공통.
2. **컨셉아트 근거** — `image4.jpg` "루카스" 패널 — **정면/측면/후면 턴어라운드 + 표정 6종 + 재질 스와치 5종 + 기어 분해도를 갖춘 완전한 캐릭터 시트가 이미 존재한다.** 추가로 `image6.jpg` 패널 2·3의 인게임 액션 컷.
3. **기획 의도** — 시트 원문: "LUCAS BENNETT — DELIVERY WORKER. A delivery worker from a small village in rural England. In his 30s. Lean and resilient from years of hard labor. Haunted by nightmares he can't explain. Just wants to do his job and return home."
4. **비주얼 설명** — 시트를 그대로 따른다. 30대, 마르고 단단한 체구, 짧고 헝클어진 짙은 머리, 수염이 조금 자란 지친 얼굴. 복장은 **여러 겹의 갈색-올리브**: 목에 두른 후드 겸 카울, 무릎까지 오는 낡은 롱코트(밑단이 심하게 해졌다), 허리를 감아 묶은 천, 파우치가 달린 가죽 벨트, 정강이까지 오는 끈 부츠. **어깨에 크로스로 멘 가죽 새첼백**이 그의 직업(배달부)을 한눈에 말하는 실루엣 요소다 — top-down에서도 이 가방의 사선이 보이도록 각도를 잡아라. 시트가 명시한 재질 5종을 질감에 반영한다: 두껍고 거친 모직(바래고 해짐) / 부드러워진 가죽(갈라지고 얼룩짐) / 손으로 짠 거친 리넨(찢어지기 쉬움) / 부식된 철(습기와 세월로 곰보) / 바닥에 눌어붙은 흙과 진흙. 기어 분해도에는 파우치·서류·반지·**작은 청록 유리병**·나이프가 있다. **무기를 든 자세로 그리지 말 것**(1.1 "적을 제거하는 루트는 만들지 않는다") — 시트 노트도 "avoids conflict but will fight if he must"로 적혀 있다. 인게임에서는 `image6` p2·p3처럼 **옥색 돌 상자를 두 손으로 가슴에 안은 자세**가 존재하며, 그때 상자에서 나온 `TEAL-HI`가 그의 얼굴과 손을 아래에서 비춘다 — 이 라이팅이 캐릭터를 어둠 속에서 식별하게 하는 유일한 장치다. 실루엣 판정: **좁은 어깨 + 사선 가방끈 + 가슴 앞의 청록 한 점.**
5. **이미지 생성 프롬프트** — `2D game character sprite for a top-down horror game, three-quarter high-angle view from above, a lean weary delivery worker in his thirties, short messy dark hair and stubble, layered brown and olive clothing: a hood-cowl at the neck, a frayed knee-length long coat, cloth wrapped at the waist, a leather belt with pouches, tall laced boots, a leather satchel slung across the chest on a diagonal strap, worn wool and cracked leather with caked mud, unarmed, both hands cradling a small glowing jade-teal stone box against his chest lighting his face and hands from below, painterly horror concept art, palette #4a3f30 #2a2318 with a #5ef0d8 key light, transparent background, full body, centered --no weapons drawn, vignette, text, watermark, background, heroic pose, armor`
6. **구현 메모** — 스프라이트 44×60 렌더 → 원본 **176×240 PNG 알파**. 애니메이션: 4방향 × 대기 2 / 걷기 4 / 달리기 4 / 앉기 1 = **최소 40프레임**. 등잔 ON/OFF와 상자 발광은 **별도 오버레이 레이어**로 분리해 프레임 수를 늘리지 않는다. 1차 납품은 하향 대기 1프레임으로도 placeholder 교체가 성립한다. **시트가 이미 있으므로 이 에셋은 신규 디자인이 아니라 리타게팅 작업이다** — 비용 재추정 권장.

#### enemy.hollow

1. **ID / 배치 위치** — `enemy.hollow`. `CanvasRenderer.ts:57` — `(-23,-34)`에 46×68. `ChaseService` 활성 시에만 렌더, 주 무대는 `chaseRoad`와 `attic.window` 등장 컷.
2. **컨셉아트 근거** — `image3.jpg` 좌상단 "hollow (enemy1)" — **정면 전신 + 측면 실루엣 스터디 4종 + 자세 스터디 2종을 갖춘 완성 보드.**
3. **기획 의도** — 1.3 리드: "적 컨셉아트 적용 보드 — **개체별 실루엣과 역할**을 반복 배치보다 고유 구간에 집중"; 1.3 표: "움직임만 | 3.8m/s | 기본 추격".
4. **비주얼 설명** — 원본이 내 초안 추정("젖은 옷의 잔해가 몸에 붙어 있다")과 다르다 — **아트의 Hollow는 거의 벌거벗었다.** 확정 사항: 극도로 여윈 인간형으로 **갈비뼈와 척추, 골반뼈가 피부를 밀고 나와 있고**, 피부는 물에 오래 담근 잿빛(`#6e6a66`~`#4b4744`)이며 목·어깨·관절 주변만 생살이 벗겨져 검붉다(`#5a2420`). 머리는 완전히 민머리이고 **눈은 발광하지 않는 검은 함몰**, **입이 벌어진 채 고정**되어 있다. 팔이 비정상적으로 길어 손끝이 무릎 아래까지 내려오고, 등이 굽어 목이 앞으로 길게 뽑혀 있다. 하체에는 걸레 같은 천 한 장만 감겨 있고, **손목과 발목에 끊어진 쇠사슬 잔해**가 남아 있다 — 이것이 "실험체였다"는 서사를 형태로 말하는 결정적 디테일이므로 반드시 유지할 것. 그리고 **허리춤에 사슬로 매단 작은 청록 유리병 하나**가 걸려 흔들린다(전역 규칙 1의 사례 — 이 병 하나가 Hollow를 루카스의 상자, 숲의 랜턴과 같은 계보에 묶는다). 실루엣 스터디는 전부 **머리가 옆으로 늘어진 채 비틀거리는 자세**로, 좌우 어깨 높이가 어긋난다. **금지: 뿔, 발톱, 이빨 클로즈업, 발광하는 눈** — 괴수가 아니라 "사람이었던 것"이어야 1.1의 무력감이 성립한다.
5. **이미지 생성 프롬프트** — `2D game enemy sprite for a top-down horror game, three-quarter high-angle view from above, an emaciated near-naked humanoid taller than a man, ribs spine and hip bones pushing through waterlogged grey skin, raw dark red flesh exposed at the neck shoulders and joints, completely bald, eye sockets as non-glowing black hollows, mouth fixed open, abnormally long arms hanging past the knees, hunched back with the neck craned forward, a single rag wrapped at the hips, broken shackle remnants at wrists and ankles, a small teal-glowing glass vial hanging from a chain at its hip, head lolling to one side, uneven shoulders, painterly horror concept art, palette #6e6a66 #4b4744 #5a2420 with one #22c4ad vial, transparent background, full body, centered --no horns, claws, fangs, glowing eyes, armor, vignette, text, watermark, background`
6. **구현 메모** — 원본 **184×272 PNG 알파** → 46×68 렌더. 애니메이션: 4방향 × 추격 걷기 4프레임 = 16프레임 + **창밖 등장 전용 정지 실루엣 1장**(역광으로 검게 뭉갠 버전, `attic.window` 컷용). 청록 유리병은 별도 발광 레이어로 분리하면 어둠 속 추격 중 **적의 위치를 알려주는 유일한 단서**로 기능한다 — 1.1의 "무력한 시점"에서 플레이어에게 남기는 최소한의 정보. 1차 납품은 정지 실루엣 1장 + 하향 추격 2프레임.

#### enemy.wolf

1. **ID / 배치 위치** — `enemy.wolf`. **신규 ID, 배치 코드 없음**(02 문서 A-3, MS-10). 배치 예정지는 `forest` area 갈림길 주변, 벽 `{610,320,90×300}` 뒤편처럼 접근하면 시야에서 빠지는 위치. `image22.png` Area View의 **S1(첫 울음 지점)** 표기가 숲길 갈림길 직전임을 확인했으므로, 이 지점을 기준으로 배치한다.
2. **컨셉아트 근거** — **없음.** `image3.jpg` 적 보드는 hollow / The Maw / The Wailers / The Beast of Ashvale **4종만** 다루며 늑대 패널이 존재하지 않는다. 아래는 전적으로 텍스트 근거(3.4 "소리·눈빛만") + Hollow와의 배타적 대비 설계에 의한 **추정**이다.
3. **기획 의도** — 3.4: "숲길 | 늑대 1~2(연출) | **소리·눈빛만**, 접근 시 후퇴 유도".
4. **비주얼 설명** — **역할 = 경고이자 길잡이. Hollow의 정반대로 설계한다.** Hollow 실루엣이 수직·비대칭·긴 팔이라면 늑대는 **수평·낮음·좌우대칭**이다: 어깨 높이가 낮고 등선이 길며, 위에서 보면 삼각형 머리 + 유선형 몸통 + 낮게 늘어뜨린 꼬리가 한 덩어리로 읽힌다. 털은 젖어 뾰족하게 갈라진 짙은 회갈(`#39332c`~`#22201c`)로 `FOREST` 배경에 거의 묻히고, 등줄기와 귀 끝의 빗물 하이라이트(`MUD-REFLECT`)만 형태를 드러낸다. **표정·이빨을 그리지 않는다** — 공격하지 않고 다가가면 물러나는 개체다. 몸은 플레이어를 향하되 뒷발은 이미 물러날 방향으로 틀어 두어 "떠날 준비가 된" 인상을 만든다. **청록을 절대 넣지 않는다** — 전역 규칙 1에 따르면 청록은 용기 안에 든 물건이고, 늑대는 자연 존재이지 그 네트워크의 일부가 아니다. 이 배제가 GR-1 시각 문법을 지킨다.
5. **이미지 생성 프롬프트** — `2D game creature sprite for a top-down horror game, three-quarter high-angle view from above, a large lean wolf standing low and horizontal, wet spiked dark grey-brown fur blending into forest shadow, only cold rain highlights along the spine and ear tips, triangular head, tail hanging low, hind legs already turned to retreat, mouth closed, no aggression, painterly horror concept art, palette #39332c #22201c #4b544f, transparent background, full body, centered --no glowing eyes, teal or cyan, bared fangs, snarl, blood, vignette, text, watermark, background`
6. **구현 메모** — 렌더 크기 추정 **56×40**(가로가 긴 유일한 캐릭터 에셋, 원본 224×160). 애니메이션: 정지 경계 2프레임 + 후퇴 걷기 3프레임. 노출 시간이 짧으므로 `enemy.wolf.eyes`보다 우선순위가 낮다.

#### enemy.wolf.eyes

1. **ID / 배치 위치** — `enemy.wolf.eyes`. 신규 ID. `forest` area 갈림길(3.1 1-3) 어둠 속 전용. 본체와 분리하는 이유는 연출 제어라는 02번 문서의 추정을 그대로 따른다.
2. **컨셉아트 근거** — **없음** — 텍스트 근거 기반 추정.
3. **기획 의도** — 3.1 1-3: "갈림길 | 유일 통행로 선택 | **늑대 눈빛만 노출**, 이동 유도".
4. **비주얼 설명** — 화면에 늑대는 없고 **눈 두 점만** 있다. 스스로 빛나는 것이 아니라 플레이어 등잔을 되받는 타페텀 반사이므로 색은 **탁한 황록 `#8f9660`** — 채도를 낮게 유지한다. **청록 절대 금지**: 청록은 용기에 든 초자연이고 늑대 눈이 청록이 되는 순간 Hollow·랜턴·상자와 위계가 섞인다. 두 점은 완전히 같은 밝기·같은 높이(수평 정렬)여야 짐승으로 읽히며, 높이가 어긋나면 사람으로 오독된다. 각 점 주위에 6px 정도의 아주 좁은 감쇠 헤일로만 두고 바깥은 즉시 `NIGHT`. 두 눈 간격은 눈 지름의 약 3배.
5. **이미지 생성 프롬프트** — `2D game effect sprite, two small horizontally aligned animal eyeshine dots glowing dull yellow-green in pure blackness, tapetum reflection catching a distant lantern, very tight falloff halo, nothing else visible, no face, no silhouette, palette #8f9660 on #0c1210, transparent background, centered --no teal, cyan, blue, red, face, fur, animal body, vignette, text, watermark`
6. **구현 메모** — **32×12 스프라이트**(원본 128×48). 깜빡임 3프레임 루프 + 알파 페이드 등퇴장. 트리거는 "플레이어가 일정 거리 안에 들어오면 알파 0으로 페이드아웃" 하나면 충분하므로 **실제 늑대 AI 없이 3.1 1-3 비트를 성립시킬 수 있는 가장 싼 에셋** — P1 안에서 우선 착수 권장.

---

## 4. 프롭 (`prop.*`) — 26종

스프라이트 크기는 `Chapter1World.ts`의 rect에서 역산했고, 원본은 모두 그 4배 해상도 PNG 알파로 제작한다. top-down 오소그래픽(배경과 동일 각도), 자체 그림자는 하단에 짧게만.

### 4-1. 첫 오두막

#### prop.parchment

1. **ID / 배치 위치** — `prop.parchment`. `Chapter1World.ts:42`, `cabin.parchment` (270,220,100×80), `hiddenWhen:'cabinVisited'`.
2. **컨셉아트 근거** — `image6.jpg` 패널 5(탁자와 바닥에 흩뿌려진 서류 다발), `image4.jpg` 조앤 시트 하단(편지·문서·밀랍 소품 컷).
3. **기획 의도** — 3.1 1-4: "빈 집 조사 | **괴물 양피지**·봉헌 촛대, 안도".
4. **비주얼 설명** — 원본에서 이 오두막의 서류는 **한 장이 아니라 흩뿌려진 다발**이다. 따라서 이 프롭도 "탁자 위 낱장 하나"가 아니라 **여러 장이 겹쳐 흩어진 무더기 중 맨 위 한 장이 펼쳐진** 형태로 그린다. 재질은 `PAPER`(`#b9a270`)에 습기 얼룩이 가장자리에서 안쪽으로 번져 `#8a7549`. 네 모서리가 제각기 다르게 말려 올라가 직사각형이 아닌 유기적 실루엣. 펼쳐진 면에는 **잉크로 그린 거친 인체 해부 스케치** — 팔이 길고 등이 굽은 형상이 `enemy.hollow`의 실루엣과 은근히 닮아 재방문 후에 의미가 생긴다 — 그 옆에 손이 떨린 필기가 뭉개진 획으로만. 촛불이 좌측 벽난로와 중앙 탁자 양쪽에서 오므로 그림자가 두 방향으로 옅게 갈라진다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a scattered pile of aged parchment sheets on a table with the topmost sheet spread open, corners rolled unevenly, water stains bleeding inward from the edges, crude ink anatomical sketches of an elongated hunched humanoid and shaky illegible handwriting, warm candlelight from two directions casting split soft shadows, painterly horror concept art, palette #b9a270 #8a7549 #2a2318, transparent background, orthographic overhead view --no readable text, vignette, watermark, modern paper, background`
6. **구현 메모** — 스프라이트 **100×80**(원본 400×320). 정적 1장.

#### prop.candle

1. **ID / 배치 위치** — `prop.candle`. `Chapter1World.ts:43`, `cabin.candle` (910,210,80×80). **수동 저장 지점.** 다락 `attic.puzzle` 장치의 촛대와 형태 공유.
2. **컨셉아트 근거** — `image6.jpg` 패널 8(다락 탁자 위 **검은 철제 3지 촛대에 초 세 자루**) — 이것이 봉헌 촛대의 정본 형태다. `image10.jpg` 패널 2(황동 기둥형 촛대)는 GR-2 상점용 변형.
3. **기획 의도** — 1.4: "**봉헌 촛대** 점화 = 수동 저장(GR-1 오두막)".
4. **비주얼 설명** — 원본을 따라 **검게 산화된 철제 3지 촛대**로 확정한다(놋쇠 아님 — 놋쇠는 GR-2 상점의 재질이다). 위에서 보면 세 팔이 120도로 뻗은 **삼각 대칭 실루엣**이 되며, 이 삼각형이 세이브 포인트의 전역 아이콘 역할을 하므로 GR-2/GR-3에서도 재사용 가능하도록 지역색을 빼고 그린다. 초 세 자루는 길이가 서로 다르고, 촛농이 팔을 타고 굳어 흘러내린 `#e8dcc0` 덩어리를 만든다. 불꽃 셋은 `WARM-CORE` 코어에 `WARM-MID` 헤일로. 받침에는 굳은 밀랍 층과 함께 오래된 봉헌 흔적(작은 동전, 마른 꽃)이 놓여 "종교적 장치"임을 형태로 말한다. **꺼짐/켜짐 2종 필요**, 꺼짐 상태는 심지 끝이 검게 탄 채 연기 한 줄기만.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a blackened wrought-iron three-armed votive candelabrum seen from directly above, arms at 120 degrees forming a triangular silhouette, three candles of different heights with hardened wax runs down the arms, three flames with hot white-orange cores, a pool of dried wax on the base with old votive offerings, a small coin and a dried flower, painterly horror concept art, palette #1c1a18 #e8dcc0 #ffd79a #e8a04e, transparent background, orthographic overhead view --no brass, gold, teal, vignette, text, watermark, background`
6. **구현 메모** — 스프라이트 **80×80**(원본 320×320). **점등/소등 2장 + 불꽃 흔들림 3프레임 루프.** 불꽃만 별도 레이어로 출력해 `bg.attic`·`bg.cabinA`의 촛불 위에도 재사용.

#### prop.record

1. **ID / 배치 위치** — `prop.record`. `Chapter1World.ts:44`, `cabin.record` (810,400,160×80), `visibleWhen:'gateChecked'`. `image22.png` Area View가 이 지점을 **C2(재방문: 관리 기록)**로 표기.
2. **컨셉아트 근거** — `image10.jpg` 패널 2 "잡화점과 장부" — **펼쳐진 장부의 완성 컷이 존재한다**(GR-2 소품이지만 재질·조명·구도가 그대로 이식 가능).
3. **기획 의도** — 3.3 진입 단서: "첫 오두막 재방문의 북쪽 관문 **관리 기록**: 뒤편 울타리→벼락 맞은 참나무→얕은 개울→옛 수레길".
4. **비주얼 설명** — 원본 장부를 그대로 참조한다: 두꺼운 가죽 장정이 펼쳐져 **두 페이지가 넓게 열려 있고**, 지면은 세월로 누렇게 바래 가장자리가 갈색으로 물들었으며(`#c8b487`→가장자리 `#8a7549`), 손글씨 숫자 열이 여러 단으로 빼곡하다. 원본에는 **페이지에 검붉은 얼룩이 한 점 번져 있다** — 이 디테일을 반드시 가져올 것(관리인의 운명을 한 점으로 말한다). 가죽 표지는 기름때로 어두운 갈색(`#3d2c1d`). GR-1 버전의 차이점: 펼친 면 여백에 **다른 필체로 랜드마크 4개를 순서대로 그린 약도**가 있고 네 지점에만 잉크가 진하게 눌려 있다. 첫 방문 때 닫힌 채 꽂혀 있던 것이 재방문 시 펼쳐져 있다는 사실 자체가 연출이므로, 펼침 각도가 명확히 보여야 한다. `bg.cabinA.visited`의 새 랜턴이 바로 위에서 비추므로 페이지가 화면에서 가장 밝은 면이 된다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a thick leather-bound ledger lying open on a shelf, two pages spread wide, aged paper yellowed with browned edges, dense columns of handwritten tally figures, one dark red stain blotted into the page, a hand-drawn route sketch of four landmarks in the margin in different handwriting with four ink marks pressed hard, oil-darkened brown leather cover, lit from directly above by a lantern making the pages the brightest surface, painterly horror concept art, palette #3d2c1d #c8b487 #8a7549 #4a1512, transparent background, orthographic overhead view --no readable text, vignette, watermark, modern book, background`
6. **구현 메모** — 스프라이트 **160×80**(원본 640×320). 정적 1장. 모달 확대가 필요해지면 약도 부분만 640×400 별도 제작(선택).

#### prop.map

1. **ID / 배치 위치** — `prop.map`. **상호작용 자체가 없다**(02 문서 MS-15). **중요 정정**: `image22.png` Area View가 첫 오두막을 "**첫 방문: 지도 / 재방문: 관리 기록**"으로 명시하고 지도에 **C1(첫 단서)** 라벨을 붙였다 — 즉 지도는 부가 소품이 아니라 **첫 방문의 대표 단서**이며, 현재 첫 방문 인터랙션이 양피지 하나뿐인 것은 Area View 기준 누락이다. 배치 제안: `cabinA` (420,200,120×90) 신규 상호작용, `hiddenWhen:'cabinVisited'`.
2. **컨셉아트 근거** — **없음**(지도 단독 컷 없음). `image4.jpg` 조앤 시트 하단의 문서·편지 소품 컷에서 재질을 상속.
3. **기획 의도** — 6.1: "**Ashvale 지도** | GR-1 첫 오두막 | GR-1 길 찾기/GR-2 방향 | 문서 탭 재열람".
4. **비주얼 설명** — 벽에 철제 못 네 개로 고정된 손그림 지도. 종이가 아니라 얇게 무두질한 가죽(`#a08b5f`)이라 모서리가 딱딱하게 말려 들뜬다. 그려진 것: 중앙에 Ashvale 마을, 남쪽으로 숲과 두 오두막, 강과 끊어진 다리는 선 하나로, 벌목로는 점선으로. **북쪽 성 방향은 그리다 만 채 잉크가 끊겨 있다** — GR-3 복선이자 "이 지도를 그린 사람이 그 이상 가지 못했다"는 정보. 이는 `image6` p3과 `image19`가 둘 다 성을 **원경 실루엣으로만** 보여주는 처리와 같은 문법이다. 잉크는 바랜 세피아(`#5c4326`), 마을 위치에만 나중에 다른 사람이 덧칠한 붉은 X(`BLOOD-DRY`).
5. **이미지 생성 프롬프트** — `top-down 2D game prop, a hand-drawn medieval map on tanned leather nailed to a wall with four iron nails, stiff curled lifting corners, showing a village at the center, forest and two cabins to the south, a river and a broken bridge as single strokes, a dotted logging trail, and a northern route toward a castle left unfinished where the ink simply stops, faded sepia ink with one later red X over the village, painterly horror concept art, palette #a08b5f #5c4326 #4a1512, transparent background --no readable place names, vignette, watermark, modern cartography, background`
6. **구현 메모** — 벽면 스프라이트 **120×90**(원본 480×360) + 모달 확대판 **900×640** 별도. 상호작용 신설이 선행돼야 하므로 착수 순서는 조사 대상 프롭 중 뒤쪽이나, **Area View 기준으로는 누락 단서**이므로 01/04번 문서의 게이팅 수정과 함께 다루는 것이 옳다.

### 4-2. 북쪽 관문

#### prop.gateLock

1. **ID / 배치 위치** — `prop.gateLock`. `Chapter1World.ts:52`, `gate.lock` (720,270,110×120). `chaseRoad`의 `chase.gate`(1160,280)도 같은 액션을 재사용하므로 **두 area 공용.**
2. **컨셉아트 근거** — **없음**(관문 패널 부재). `image19.jpg`의 철제 간판·사슬 금속 처리에서 재질 상속.
3. **기획 의도** — 3.2: "관문·**열쇠구멍**·횃불"; 3.1 1-5 "잠긴 문 조사 | 녹슨 열쇠 필요".
4. **비주얼 설명** — 철문 세로살에 걸린 주먹만 한 판형 자물쇠와 두꺼운 사슬. 표면은 녹이 겹겹이 부풀어 원래 형태를 반쯤 잃었고(`#6a4a33` 위 `#8a5f3c` 부푼 녹), **열쇠구멍만 최근 누군가 만진 듯 녹이 벗겨져 금속 바탕(`#9a958f`)이 드러나 있다** — 이 한 점이 화면 유일한 밝은 지점이 되어 UI 없이 상호작용 위치를 지시한다(3.4 Done 기준 "관문 방향을 UI 없이 45초 안에 재확인"에 직결). 사슬은 팽팽하지 않고 늘어져 무게를 표현. 랜턴 난색을 좌상단에서 받아 우하단으로 짧은 그림자.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a fist-sized rusted iron padlock and thick slack chain hanging on a gate bar, layered blistered rust obscuring its original shape, the keyhole alone rubbed clean showing bare bright metal as if recently touched, warm lantern light from the upper left, painterly horror concept art, palette #6a4a33 #8a5f3c #9a958f, transparent background, orthographic overhead view --no glow, vignette, text, watermark, modern padlock, background`
6. **구현 메모** — 스프라이트 **110×120**(원본 440×480). 상태 2장: 잠김 / 열림(사슬이 바닥에 떨어진 상태). `chaseRoad`에서는 60×220 장식 위에 축소 배치.

#### prop.torch

1. **ID / 배치 위치** — `prop.torch`. **코드 없음**(02 문서 MS-09). 배치 제안: `gate` 관문 장식 `{805,105,280×420}` 좌우 2곳, `chaseRoad` 관문(1170,250) 좌우 2곳, `forest` 표지판 기둥 1곳(청록 변형).
2. **컨셉아트 근거** — `image6.jpg` 패널 1(표지판 아래 **청록 랜턴**), 패널 2·3(나뭇가지에 매단 **난색 랜턴**), 패널 4(오두막 현관 난색 랜턴), `image10.jpg` 패널 4(여관 문 옆 청록 랜턴).
3. **기획 의도** — 1.2 "횃불 20분"; 3.2 "관문·열쇠구멍·**횃불**".
4. **비주얼 설명** — **중요 정정**: 문서 텍스트는 "횃불"이라 쓰지만 **컨셉아트 전 패널에서 관측되는 것은 예외 없이 "매다는 철제 랜턴"이다.** 아트를 정본으로 삼아 이 프롭을 **랜턴**으로 제작하고, ID만 `prop.torch`로 유지한다(코드 영향 0). 형태: 사각 또는 육각 철제 프레임에 흐린 유리를 끼우고 고리로 매단 랜턴, 철은 검게 산화(`#241d16`)했고 유리는 그을음과 빗물 자국으로 뿌옇다. **두 변형이 필요하다**: (a) **난색 랜턴** — 내부 불꽃이 `WARM-CORE`, 유리를 통과하며 `WARM-MID`로 퍼지고 프레임 살이 만든 그림자 격자가 주변 바닥에 드리운다(이 격자 그림자가 랜턴 프롭의 서명이다). (b) **청록 랜턴** — 동일 프레임에 불꽃 대신 `TEAL-MID` 광원이 들어 있고, 유리에 성에 같은 미세 결정이 앉아 있으며 그림자 격자도 청록으로 떨어진다. 전역 규칙 1에 따라 청록 변형은 **초자연이 관측된 지점에만** 설치한다. 매단 사슬은 비바람에 살짝 기울어 있다.
5. **이미지 생성 프롬프트** — (난색) `top-down 2D game prop sprite, a hanging wrought-iron lantern with sooty frosted glass panels suspended from a chain hook, blackened oxidized iron frame, a flame inside glowing hot white-orange through the glass, the frame bars casting a grid of shadow onto the ground around it, rain streaks on the glass, tilted slightly by wind, painterly horror concept art, palette #241d16 #ffd79a #e8a04e, transparent background, orthographic overhead view --no open torch flame, vignette, text, watermark, background` / (청록) 위 프롬프트에서 `a flame inside glowing hot white-orange` → `a cold teal-cyan light inside with frost crystals forming on the glass`, 팔레트 → `#241d16 #5ef0d8 #22c4ad`.
6. **구현 메모** — 스프라이트 **70×90**(원본 280×360), 난색/청록 2종. **불꽃 흔들림 4프레임 루프 필수**(난색) / **규칙적 맥동 3프레임**(청록) — 두 광원의 성질 차이를 움직임으로 구분한다. GR-1에서 유일하게 상시 움직이는 광원이므로 정지 상태면 화면이 죽는다. 1.2의 "횃불 20분" 시스템이 구현되면 소진 3단계가 추가로 필요.

### 4-3. 벌목로 랜드마크

네 랜드마크는 **명도 계단**(울타리 < 참나무 < 수레길 < 개울)을 지켜야 순차 유도가 성립한다. 넷을 나란히 놓고 그레이스케일로 변환했을 때 밝기 순서가 그대로 보여야 한다. **네 항목 모두 전용 컨셉아트 없음** — `image6.jpg` 패널 1의 바퀴 자국 반사 처리와 패널 6 주변 벌목 잔해에서 재질을 상속한 추정이다.

#### prop.landmark.fence

1. **ID / 배치 위치** — `prop.landmark.fence`. `loggingRoad` 좌측. 현재 대응 장식 없음 — 신규 배치 제안 (150,200,140×70).
2. **컨셉아트 근거** — **없음**(텍스트 근거 기반 추정).
3. **기획 의도** — 3.3: "뒤편 **울타리**→벼락 맞은 참나무→얕은 개울→옛 수레길".
4. **비주얼 설명** — 가로로 이어지다 중간이 무너진 목책. 위에서 보면 말뚝 6~7개가 불규칙 간격으로 늘어서고 **그중 둘이 쓰러져 지면에 X자를 만든다** — 이 X자 파손이 "여기가 그 울타리"라는 유일한 식별 특징이므로 반드시 유지. 젖은 나무는 `#4a4238`에 빗물 하이라이트 `#5f5a4e`, 말뚝 밑동에 이끼(`#2d3a2c`), 가로대에 늘어진 낡은 철사. 네 랜드마크 중 **가장 어둡다.**
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a broken wooden post fence seen from above, six or seven irregular posts with two collapsed forming an X on the ground, wet dark grey-brown timber with faint rain highlights, moss at the bases, sagging old wire, painterly horror concept art, palette #4a4238 #5f5a4e #2d3a2c, transparent background, orthographic overhead view, darkest of a landmark set --no vignette, text, watermark, background, bright light`
6. **구현 메모** — 스프라이트 **140×70**(원본 560×280). 정적 1장.

#### prop.landmark.oak

1. **ID / 배치 위치** — `prop.landmark.oak`. `Chapter1World.ts:62` 장식 `{350,80,120×160}`.
2. **컨셉아트 근거** — **없음**(텍스트 근거 기반 추정). `image6.jpg` 패널 1의 침엽수 실루엣 명도를 기준으로 대비를 잡았다.
3. **기획 의도** — 3.4: "**그을린 참나무**"; 3.3: "벼락 맞은 참나무".
4. **비주얼 설명** — 벼락이 위에서 아래로 쪼갠 굵은 참나무. top-down에서는 줄기 단면과 방사형 가지가 보이므로 **몸통 중앙에서 한쪽으로 벌어진 검은 균열**이 핵심 실루엣이다. 탄 껍질은 거의 검정(`#1a1512`), 균열 안쪽 갈라진 생목만 창백한 `#7a6449`로 드러나 대비를 만든다 — 어두운 배경에서 이 밝은 균열선 하나로 랜드마크가 성립한다. 가지는 전부 잎을 잃고 부러졌고, 뿌리 주변 흙이 방사형으로 그을려 검다. 젖은 탄재가 빗물에 녹아 나무 아래로 검은 물줄기를 흘린다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a massive oak split by lightning seen from above, charred near-black bark, one pale exposed split of raw wood running down the trunk as the only bright element, all branches leafless and broken, scorched radial soil at the roots, black ash-water bleeding downhill in the rain, painterly horror concept art, palette #1a1512 #7a6449 #2e2a22, transparent background, orthographic overhead view --no green foliage, vignette, text, watermark, background`
6. **구현 메모** — 스프라이트 **120×160**(원본 480×640). 정적 1장. 명도 순서 2위.

#### prop.landmark.creek

1. **ID / 배치 위치** — `prop.landmark.creek`. `Chapter1World.ts:62` 장식 `{610,480,180×25}`.
2. **컨셉아트 근거** — **없음** — 다만 `image6.jpg` 패널 3의 **흰 포말 급류**가 이 세계의 물 표현 기준을 제공하므로 그 명도·하이라이트 처리를 축소해 적용했다.
3. **기획 의도** — 3.4: "**개울 반사광**을 순차 지표로 사용한다".
4. **비주얼 설명** — 네 랜드마크 중 **가장 밝고, 유일하게 움직이는 것처럼 보여야 한다.** 폭이 좁고 얕은 개울이 화면을 가로로 가르며, 수면은 하늘을 반사해 `#4e6a66`~`#6a8480`, 돌에 부딪히는 곳만 잘게 흰 하이라이트(`#c4d2ce` — 패널 3 포말의 축소판). 바닥의 둥근 자갈이 물 아래로 굴절되어 흐릿하게 비친다. 물가 진흙은 `TEAL-DEEP`으로 어둡게 눌러 수면 밝기를 띄운다. 반사광에 미세한 청록 편향은 허용하되 **발광은 아니다** — 전역 규칙 1에 따라 이것은 하늘색 반사이지 용기에 담긴 초자연이 아니다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a narrow shallow creek crossing horizontally, the water surface reflecting a pale sky and forming the brightest element of the scene, fine white highlights where water breaks over stones, rounded pebbles refracted under the surface, dark teal-black mud at the banks, painterly horror concept art, palette #4e6a66 #6a8480 #c4d2ce #0e4a45, transparent background, orthographic overhead view --no glowing water, magic, vignette, text, watermark, background`
6. **구현 메모** — 스프라이트 **180×25**(원본 720×100). **수면 반짝임 3프레임 루프** — 유일하게 애니메이션이 필요한 랜드마크이며, 이 움직임이 "여기를 보라"는 유도의 실체다.

#### prop.landmark.cartTrack

1. **ID / 배치 위치** — `prop.landmark.cartTrack`. `Chapter1World.ts:62` 장식 `{880,120,190×50}`.
2. **컨셉아트 근거** — `image6.jpg` 패널 1 — **바퀴 자국에 물이 고여 하늘을 반사하는 처리가 원본에 그대로 있다.** 네 랜드마크 중 유일하게 직접 근거가 있는 항목.
3. **기획 의도** — 3.3: "얕은 개울→**옛 수레길**"; 3.2: "랜드마크 순서 추적".
4. **비주얼 설명** — 원본 그대로: **평행한 두 줄의 깊게 패인 홈에 빗물이 고여 하늘을 반사하는 두 줄의 선형 띠**(`MUD-REFLECT` `#4b544f`). 이 두 줄이 화면 우측(둘째 오두막) 방향을 명확히 가리켜 랜드마크이자 방향 지시자로 이중 기능한다 — 원본에서 이 처리가 어두운 숲길의 길 안내를 전담하고 있다는 점이 이 프롭의 존재 이유다. 홈 사이 둔덕에는 밟히지 않은 잡초와 톱밥. 홈 가장자리 한 군데에 최근 지나간 듯 진흙이 새로 밀려 올라와 있고 그 옆에 `BLOOD-DRY` 점적 두엇. 명도는 개울보다 낮고 참나무보다 높다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, two parallel deep cart wheel ruts filled with rainwater forming two linear reflective bands pointing to the right, untrampled weeds and sawdust on the ridge between them, one patch of freshly pushed-up mud at a rut edge, two small dried blood droplets beside it, painterly horror concept art, palette #2e2a22 #4b544f #4a1512, transparent background, orthographic overhead view --no vignette, text, watermark, background, bright light`
6. **구현 메모** — 스프라이트 **190×50**(원본 760×200). 정적 1장. 두 줄이 항상 화면 우측을 향하도록 고정(좌우 반전 사용 금지).

### 4-4. 숲길 지표

#### prop.signpost

1. **ID / 배치 위치** — `prop.signpost`. `forest` area, 장식 `{95,90,120×130}` 또는 갈림길 중앙.
2. **컨셉아트 근거** — `image6.jpg` 패널 1("Ashvale" 표지판)과 패널 4("BLACKMERE WOOD" 표지판) — **두 컷 모두에 완성 디자인이 있다.**
3. **기획 의도** — 3.2: "숲길/갈림길 | **표지판**·진흙 발자국·쓰러진 나무".
4. **비주얼 설명** — 원본 형태를 그대로 따른다: 나무 기둥에서 옆으로 뻗은 팔에 **널판 하나가 두 개의 철제 갈고리로 매달려 흔들리는** 구조다(못 박은 고정식이 아니다 — 흔들린다는 사실이 바람과 불안을 전달한다). 널판은 세로결이 거칠게 드러난 회갈색 판재(`#4a4238`)에 **글자가 음각으로 파여 있고 그 홈에 물과 이끼가 고여 어둡다**. 기둥은 수직이 아니라 8~12도 기울어져 있어 위에서 볼 때 그림자가 어긋난다. 원본 패널 1은 이 표지판 **아래에 청록 랜턴을 매달아** 두었으므로, 갈림길용 변형에는 `prop.torch`(청록)를 세트로 배치할 것. 훼손 변형(다른 갈림길용)에서는 널판 한 장을 도끼로 찍어 글자를 지운 형태로 제작해 첫 불안을 전달한다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a leaning wooden signpost, a single plank board hanging from a side arm on two iron hooks so it can swing, coarse vertical wood grain, lettering carved as intaglio grooves filled with dark water and moss, weathered grey-brown timber, the post tilted about ten degrees, painterly horror concept art, palette #4a4238 #2d3a2c #5f5a4e, transparent background, orthographic overhead view --no readable text, vignette, watermark, modern sign, background`
6. **구현 메모** — 스프라이트 **120×130**(원본 480×520). 2종(정상 / 도끼 훼손). 정적. 청록 랜턴은 `prop.torch` 스프라이트로 별도 합성.

#### prop.footprints

1. **ID / 배치 위치** — `prop.footprints`. `forest` 갈림길 지면(장식 `{430,510,120×120}` 인근). `bg.cabinA.visited`의 실내 발자국과 **같은 신발 자국**이어야 한다.
2. **컨셉아트 근거** — **없음**(진흙 발자국 단독 컷 없음). `image6.jpg` 패널 1의 진창 재질과 물 고임 반사 처리에서 상속.
3. **기획 의도** — 3.2: "표지판·**진흙 발자국**·쓰러진 나무".
4. **비주얼 설명** — 진흙에 눌린 부츠 자국 5~7쌍이 통행 가능한 길 쪽으로 이어진다. **자국 안에 물이 고여 주변보다 밝게 반사되므로**(`MUD-REFLECT`, 원본 바퀴 자국과 같은 원리) 어둠 속에서 점선처럼 읽혀 경로를 지시한다. 앞쪽 자국일수록 가장자리가 뭉개져 오래됐고 뒤쪽 몇 개는 테두리가 날카로워 새것이다 — 시간 방향이 형태에 담긴다. 밑창은 단순한 가로 홈 3줄로 통일해 다른 자국과 구별 가능하게. 한 쌍만 보폭이 비정상적으로 넓어(달렸거나 끌려갔다) 이후 벌목로 핏자국과 서사적으로 연결된다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, five to seven pairs of boot prints pressed into wet mud leading in one direction, each print filled with water reflecting brighter than the surrounding ground so they read as a dotted trail, older prints with softened edges and newer ones sharp, a simple three-groove sole pattern, one pair with an abnormally long stride, painterly horror concept art, palette #2e2a22 #4b544f, transparent background, orthographic overhead view --no vignette, text, watermark, background, blood`
6. **구현 메모** — 스프라이트 **120×120**(원본 480×480), 좌우 이음새를 맞춰 타일 반복 가능하게. 정적 1장.

#### prop.fallenTree

1. **ID / 배치 위치** — `prop.fallenTree`. `forest` area, 장식 `{1000,410,110×140}` 또는 통로를 좁히는 위치. **`image22.png` Area View가 이것을 "쓰러진 나무 (폐쇄)"로 표기** — 즉 장식이 아니라 **통행 차단 장치**다(텍스트에는 없던 정보).
2. **컨셉아트 근거** — **없음**(단독 컷 없음). 배치 근거는 `image22.png`, 재질은 `image6.jpg` 패널 1·6의 젖은 목재.
3. **기획 의도** — 3.2 "쓰러진 나무" + Area View "폐쇄"; 1.2 Space "낮은 장애물 넘기"의 미래 대상.
4. **비주얼 설명** — 뿌리째 뽑혀 길을 비스듬히 가로지른 침엽수. 위에서 보면 좌측에 흙을 물고 들어 올려진 **부채꼴 뿌리 원반**(`#33302a`에 잔뿌리 실루엣)이 있고 우측으로 줄기가 길게 뻗어 화면 밖으로 나간다. **줄기 위쪽 면만 빗물 하이라이트를 받고 아래쪽은 완전히 검다** — 이 밝기 차이가 "넘을 수 있는 높이"를 형태로 알린다. 껍질은 습기로 검게 젖었고(`#2a2620`) 벗겨진 자리에 흰 목질(`#8a7f6a`)이 드러난다. 줄기 아래 어둠은 은신처처럼 보이되 실제 기능은 없다(오독을 유도해 긴장만 만든다). Area View가 "폐쇄"로 규정하므로 **통로를 실제로 막는 폭**이어야 한다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, an uprooted conifer lying diagonally and fully blocking a forest path, a fan-shaped root disc holding soil on the left, the trunk extending off frame to the right, only the upper surface of the trunk catching cold rain highlights while the underside is pure black, wet blackened bark with patches of pale stripped wood, painterly horror concept art, palette #2a2620 #8a7f6a #4b544f, transparent background, orthographic overhead view --no green foliage, vignette, text, watermark, background`
6. **구현 메모** — 스프라이트 **220×110**(원본 880×440, 장식 rect보다 넓게 잡아 통로를 실제로 좁힌다). 정적 1장.

### 4-5. 둘째 오두막 1F — 세 방 랜드마크

세 오브젝트는 각각 목판화 1개를 숨기며, 3.2 주의 "각 목판화는 고유 랜드마크와 결합"에 따라 **형태 언어가 겹치면 안 된다**: 시계=원형/정밀, 짐=불규칙 덩어리, 여신상=수직 대칭/파손. **셋 다 전용 컨셉아트 없음**(1F 내부 패널 자체가 없다) — 재질은 `image6.jpg` 패널 5의 선반·항아리, 패널 7의 두개골·단지에서 상속했다.

#### prop.pocketWatch

1. **ID / 배치 위치** — `prop.pocketWatch`. `Chapter1World.ts:73`, `wood.tri` (235,190,120×80), `visibleWhen:'atticClueSeen'`. 서재 책장 장식 `{210,155,165×200}`. **△ 목판화 위치.**
2. **컨셉아트 근거** — **없음**(텍스트 근거 기반 추정).
3. **기획 의도** — 3.3: "서재의 **멈춘 회중시계** 뒤 △"; 수색 암호 "멈춘 시간 뒤에 첫째가 숨고".
4. **비주얼 설명** — 책장 선반에 사슬째 걸려 늘어진 황동 회중시계. 뚜껑이 열려 문자판이 위를 향하고 유리에 방사형 금이 갔다. **바늘이 멈춘 각도가 정확히 읽혀야 한다** — 정각을 피한 어중간하고 불편한 위치에 고정(정각이 아니라는 사실이 "시간이 멎었다"를 만든다). 황동은 산화해 초록 녹(`#5c6b4e`)이 테를 먹었고 문자판은 누렇게 바랜 `#c8b487`. **시계 뒤 그림자 안에 목판 모서리 한 조각이 살짝 삐져나와** 조사 전에도 무언가 있음을 암시한다. 사슬은 선반 아래로 늘어져 정지.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, an open brass pocket watch hanging by its chain on a bookshelf, dial facing up, radial cracks in the glass, hands frozen at an awkward off-hour angle, green oxidation creeping along the brass rim, yellowed dial, one corner of a hidden wooden plaque just visible in the shadow behind it, painterly horror concept art, palette #8a7a4e #5c6b4e #c8b487 #2a170f, transparent background, orthographic overhead view --no readable numerals, glow, vignette, watermark, modern watch, background`
6. **구현 메모** — 스프라이트 **120×80**(원본 480×320). 정적 1장 + 회수 후 1장(뒤의 목판이 사라진 빈 그림자).

#### prop.rottenCargo

1. **ID / 배치 위치** — `prop.rottenCargo`. `Chapter1World.ts:74`, `wood.circle` (520,400,140×85). 창고 장식 `{500,300,220×190}`. **○ 목판화 위치.**
2. **컨셉아트 근거** — **없음**(텍스트 근거 기반 추정).
3. **기획 의도** — 3.3: "창고의 **썩은 짐** 아래 ○"; 암호 "썩은 짐 아래에 둘째가 잠들며".
4. **비주얼 설명** — 젖은 삼베 자루 4~5개가 서로 기대어 무너진 더미. **형태 언어는 "불규칙한 덩어리"** — 직선이 하나도 없어야 시계(정밀)·여신상(대칭)과 구분된다. 자루 천은 곰팡이로 얼룩덜룩(`#4a4436` 바탕에 `#6b7052` 반점), 아래쪽 자루는 내용물이 썩어 액체가 새어 바닥에 검은 얼룩(`#241c14`)을 만들고 그 위에 파리가 검은 점으로 붙어 있다. 맨 아래 자루가 눌려 들려 **그 틈으로 어둠이 보인다** — 목판이 여기 있다는 지시. 자루 위 공기에 아주 옅은 흐림 레이어를 얹어 냄새를 시각화한다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a collapsed pile of four or five wet burlap sacks leaning together, no straight lines anywhere, mould-blotched fabric, dark liquid seeping from the bottom sack into a black stain on the floor, black flies clustered on the stain, the lowest sack lifted slightly revealing a dark gap beneath, a faint haze above, painterly horror concept art, palette #4a4436 #6b7052 #241c14, transparent background, orthographic overhead view --no clean sacks, vignette, text, watermark, background`
6. **구현 메모** — 스프라이트 **140×85**(원본 560×340). **파리 2프레임 루프**로 `audio.amb.cabinB1.flies`와 동기. 회수 후 1장.

#### prop.goddessStatue

1. **ID / 배치 위치** — `prop.goddessStatue`. `Chapter1World.ts:75`, `wood.cross` (900,410,120×100). 기도실 장식 `{880,330,170×200}`. **✠ 목판화 위치.**
2. **컨셉아트 근거** — **간접** — `image19.jpg`/`image10.jpg`의 **목이 잘려 넘어진 광장 석상**이 이 세계의 "참수된 석상" 처리 기준을 제공한다(절단면·풍화·이끼). 기도실 석상 자체의 컷은 없다.
3. **기획 의도** — 3.3: "기도실의 **목 잘린 여신상** 밑동 ✠"; 암호 "목 잃은 기도 아래에 마지막이 엎드려 있다".
4. **비주얼 설명** — 좌우 완전 대칭의 석상 — **다만 목 위가 없다.** 광장 석상 참조에 따라 절단면은 풍화가 아니라 **날붙이로 친 평면**이라 매끈하고 색이 밝다(`#9a958f`, 주변 석재 `#5e5952`보다 확연히 밝아 최근 절단임을 말한다). 잘린 머리는 근처에 없다(광장 석상은 머리가 옆에 나뒹구는 반면 이쪽은 사라졌다 — 이 차이가 "누가 가져갔다"를 만든다). 상은 두 손을 모은 기도 자세이고 그 손 안쪽에 마른 꽃과 촛농이 쌓여 오래 봉헌되었음을 보여준다. 받침대 밑동에는 이끼와 먼지가 두껍고 **한쪽이 살짝 벌어져** 목판이 들어갈 틈을 형태로 지시한다. 대칭·수직이 형태 언어이며, 그 대칭이 머리 부재로 깨져 있다는 점이 공포의 전부다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a perfectly bilaterally symmetric stone goddess statue with its head cleanly severed, the cut surface flat and noticeably paler than the weathered stone around it, no head anywhere nearby, hands clasped in prayer holding dried flowers and old wax, thick moss and dust at the plinth, one side of the plinth base slightly ajar revealing a gap, painterly horror concept art, palette #5e5952 #9a958f #2d3a2c, transparent background, orthographic overhead view --no blood, gore, face, vignette, text, watermark, background`
6. **구현 메모** — 스프라이트 **120×100**(원본 480×400). 정적 1장 + 회수 후 1장. 밑동 틈은 별도 알파 레이어로.

### 4-6. 목판화 3종 — 색 없이 형태만으로 구분

**컨셉아트 근거**: 세 목판 자체의 전용 컷은 **없다.** 다만 `image6.jpg` 패널 8의 다락 벽 문양이 **문양 디자인 언어**를 제공한다 — 어두운 판자 위에 `OCHRE-MARK`(`#a8955f`) 안료로 그려진 큰 문양들이며, △는 내부에 표식이 든 삼각형, ○는 굵은 단일 고리, 세 번째는 **지팡이를 감은 뱀** 형태다. 문서 3.3이 세 번째를 ✠로 규정하므로 앞서 `bg.attic`에서 내린 판단대로 **십자에 뱀이 감긴 하이브리드**로 그린다.

문서 6.4 Done 기준 "문양의 **형태/질감** 구분"을 만족해야 하므로, 세 목판은 **그레이스케일 변환 후에도, 4배 축소 후에도 형태와 질감만으로 즉시 구분**되어야 한다. 아래 규칙은 서로 배타적으로 설계했다.

| 항목 | △ triangle | ○ circle | ✠ cross |
|---|---|---|---|
| 판재 외곽 | **각진 오각형**(모서리 뾰족) | **완전한 원형** | **세로로 긴 팔각형** |
| 표면 질감 | 거친 **세로 직선 우드그레인** | 매끈하게 닳은 **동심원 나이테** | 거칠게 **십자 교차로 판 정** 자국 |
| 문양 각인 | **음각**(파여 들어감, 안쪽 그림자) | **양각**(솟아오름, 위쪽 하이라이트) | **관통**(뚫려 있어 뒤가 비침) |
| 가장자리 | 날카로운 신선한 단면 | 손때로 둥글게 닳음 | 불에 그을려 검게 탄 테두리 |

#### prop.woodcut.triangle

1. **ID / 배치 위치** — `prop.woodcut.triangle`. `wood.tri` 회수물(`Chapter1World.ts:73`). 현재 폰트 글리프 `△`로만 표기(`GameController.ts:133`).
2. **컨셉아트 근거** — **부분** — `image6.jpg` 패널 8 벽 문양의 삼각형(내부 표식 포함)에서 문양 형태를 상속. 목판 자체는 없음.
3. **기획 의도** — 3.3 "서재의 멈춘 회중시계 뒤 △"; 6.4 "문양의 형태/질감 구분".
4. **비주얼 설명** — 손바닥만 한 **각진 오각형** 판재. 표면은 대패질 없이 쪼갠 결이라 세로 직선 우드그레인이 굵게 살아 있고(`#6b5233`에 `#4a3a24` 결), 중앙의 △는 칼로 **깊게 파낸 음각**이라 안쪽 벽면에 짙은 그림자가 고인다. 원본 벽 문양을 따라 삼각형 **내부에 작은 표식 하나**를 함께 파 넣어 벽 문양과의 대응을 시각적으로 확정한다. 세 변은 자를 대지 않고 그은 듯 미세하게 흔들리고 꼭짓점은 과하게 깊이 파여 구멍처럼 어둡다. 가장자리는 최근 잘린 듯 날카롭고 단면색이 밝다. **촛불에 비추면 음각 안쪽에만 그림자가 남아 △ 그림자를 정확히 투사한다** — 퍼즐 원리가 형태에 내장돼야 한다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a palm-sized angular pentagonal wooden plaque with sharp fresh-cut edges, coarse split vertical wood grain, a triangle deeply carved as an intaglio groove into the center with dark shadow pooling inside the cut and one small mark carved inside the triangle, the three lines slightly wavering as if cut freehand, corners gouged extra deep, painterly horror concept art, palette #6b5233 #4a3a24 #2a170f, transparent background, orthographic overhead view --no paint, color fill, glow, vignette, text, watermark, background`
6. **구현 메모** — 스프라이트 **64×64**(원본 256×256). 정적 1장 + 퍼즐 슬롯 삽입 상태 1장. **그레이스케일 검수 필수** — 세 목판을 채도 0으로 만들었을 때 구분되지 않으면 반려.

#### prop.woodcut.circle

1. **ID / 배치 위치** — `prop.woodcut.circle`. `wood.circle` 회수물(`Chapter1World.ts:74`).
2. **컨셉아트 근거** — **부분** — `image6.jpg` 패널 8 벽 문양의 굵은 단일 고리에서 상속.
3. **기획 의도** — 3.3 "창고의 썩은 짐 아래 ○"; 6.4 형태/질감 구분.
4. **비주얼 설명** — **완전한 원형** 판재로, 통나무를 가로로 얇게 켠 조각이라 표면에 **동심원 나이테**가 그대로 드러난다(`#7a6449`에 `#5a4632` 테). 중앙의 ○ 문양은 **양각** — 주변을 깎아내려 고리만 솟아 있고 그 위쪽 면에 하이라이트가 걸린다. 오래 만져 가장자리가 둥글게 닳아 광이 나고(손때 `#8a7550`), 썩은 짐 아래 있었으므로 아래쪽 절반에 검은 얼룩과 곰팡이가 번져 있다. 양각과 나이테가 **같은 동심원 계열**이라 문양과 질감이 하나로 읽히는 것이 이 판의 특징이며, 각진 △와 정반대 인상을 만든다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a perfectly round wooden disc cut across a log showing concentric growth rings, a thick ring carved in relief standing proud of the surface with a highlight on its top face, edges worn smooth and glossy from handling, dark mould staining across the lower half, painterly horror concept art, palette #7a6449 #5a4632 #241c14, transparent background, orthographic overhead view --no paint, color fill, glow, vignette, text, watermark, background`
6. **구현 메모** — 스프라이트 **64×64**(원본 256×256). 정적 1장 + 삽입 상태 1장.

#### prop.woodcut.cross

1. **ID / 배치 위치** — `prop.woodcut.cross`. `wood.cross` 회수물(`Chapter1World.ts:75`).
2. **컨셉아트 근거** — **부분/불일치** — `image6.jpg` 패널 8의 세 번째 벽 문양은 ✠가 아니라 **지팡이를 감은 뱀**이다. 아트와 문서 3.3의 불일치를 앞서 내린 판단(십자+뱀 하이브리드)으로 해소한다. 이 결정은 **추정**이며 아트 디렉터 확인 필요.
3. **기획 의도** — 3.3 "기도실의 목 잘린 여신상 밑동 ✠"; 6.4 형태/질감 구분.
4. **비주얼 설명** — **세로로 긴 팔각형** 판재(△의 각짐과도, ○의 원형과도 겹치지 않는 제3의 외곽). 표면은 정으로 십자 교차 방향으로 판 자국이 촘촘해 두 방향 해칭처럼 보인다. 중앙의 문양은 **십자를 관통시켜 뚫고, 그 세로 기둥을 뱀 한 마리가 감아 오르는 형태를 얕은 음각으로 덧새긴다** — 뚫린 십자(형태 판별)와 새겨진 뱀(세계관 연결)이 한 판에 공존한다. 완전히 뚫려 있어 뒤편 배경이 비치므로, **세 판 중 유일하게 '구멍'을 가진 판**이 되어 저시력 조건에서도 즉시 구분된다. 테두리는 불에 그을려 검게(`#241d16`) 탄화되어 부슬거리고, 기도실 출신답게 표면에 굳은 촛농 방울 두엇(`#e8dcc0`). **촛불을 통과시키면 십자 형태의 빛이 반대편에 투사된다** — 다른 두 판이 그림자를 만든다면 이 판은 빛을 만든다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a tall octagonal wooden plaque with dense rough cross-hatched chisel marks over the whole surface, a cross shape cut completely through the board so the background shows through the opening, a serpent coiling up the vertical shaft carved as a shallow intaglio around the opening, charred blackened edges, two hardened candle wax drips on the face, painterly horror concept art, palette #5c4a35 #241d16 #e8dcc0, transparent background, orthographic overhead view --no paint, color fill, glow, vignette, text, watermark, background`
6. **구현 메모** — 스프라이트 **64×64**(원본 256×256). **알파 채널에 실제 관통 구멍**을 뚫을 것(검게 칠하지 말 것). `ui.icon.cross`와 동일 벡터 원본에서 파생.

### 4-7. 다락 · 2F 장치

#### prop.strap

1. **ID / 배치 위치** — `prop.strap`. `Chapter1World.ts:86`, `b2.strap` (820,170,100×110). `bg.cabinB2` 핏자국 종점과 일치.
2. **컨셉아트 근거** — **부분** — `image6.jpg` 패널 7에 **사다리와 열린 천장 구멍은 있으나 가죽 고리는 보이지 않는다**(원본은 이미 사다리가 내려온 상태를 그린다). 고리 자체는 텍스트 근거 기반 추정.
3. **기획 의도** — 3.3: "핏자국 끝의 **가죽 고리**를 당겨 접이식 사다리를 내린다".
4. **비주얼 설명** — 천장문 판 가장자리에서 늘어진 낡은 가죽 고리. 가죽은 기름이 빠져 갈라지고 뒤틀린 `#43301f`, 접힌 자리마다 흰 균열. **고리 끝 손이 닿았던 부분만 반들반들 검게 닳아 있고**(`#241a12`) 그 위에 `BLOOD-DRY` 지문이 겹쳐 있다 — 마지막으로 이걸 당긴 사람의 상태를 한 점으로 말한다. 완전히 늘어져 정지해 있으나 아주 미세하게 비틀려 있어 최근 당겨졌다 되돌아간 인상. 회백색 2F 배경에서 이 프롭만 갈색이라 시선이 자동으로 걸린다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, an old cracked leather pull strap hanging from the edge of a ceiling hatch, oil-starved twisted leather with white cracks along the folds, the grip end worn glossy black from handling with a dried blood fingerprint over it, hanging slack with a slight twist, painterly horror concept art, palette #43301f #241a12 #4a1512, transparent background, orthographic overhead view --no clean leather, vignette, text, watermark, background`
6. **구현 메모** — 스프라이트 **100×110**(원본 400×440). 정적 1장. `prop.ladder`와 세트 제작.

#### prop.ladder

1. **ID / 배치 위치** — `prop.ladder`. `Chapter1World.ts:84` 포털 `b2.attic` (900,130,130×80), `requireFlag:'atticOpened'`.
2. **컨셉아트 근거** — `image6.jpg` 패널 7 — **전개 상태의 완성 컷이 존재한다.**
3. **기획 의도** — 3.2: "접이식 사다리·문양·암호·거울 | **사다리는 즉시 상호작용**".
4. **비주얼 설명** — 원본을 따른다: **거친 각재로 짠 단순한 목재 사다리**로, 세로 기둥 둘에 가로대 7~8개를 박은 형태이며 정교한 접이식 금속 기구가 아니라 **손으로 짠 물건**처럼 보여야 한다. 목재는 2F 회백 톤에 맞춰 색이 빠진 `#6b6157`, 가로대 중앙만 발에 닳아 밝다. 위쪽 끝은 천장의 **열린 사각 구멍**에 걸쳐 있고 **그 구멍 안은 완전한 검정** — 원본에서 이 검은 사각형이 화면 최암부이자 유일한 목적지로 기능하므로 반드시 순흑으로 유지할 것. 전개 순간 떨어지는 먼지 입자 몇 점. **접힘/전개 2상태 필수**: 접힘 상태는 천장 판에 밀착돼 위에서 보면 겹친 가로 선 몇 개로만 보인다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a crude hand-built wooden ladder leaning up into an open square ceiling hatch, two side rails and seven or eight rough rungs, rung centers worn pale from footsteps, the hatch opening a pure black square, bleached grey-brown timber, a few falling dust motes, painterly horror concept art, palette #6b6157 #3b3733 #0c1210, transparent background, orthographic overhead view --no modern aluminium ladder, metal folding mechanism, vignette, text, watermark, background`
6. **구현 메모** — 스프라이트 **130×180**(전개 시 rect보다 아래로 길게, 원본 520×720). **접힘/전개 2장 + 중간 2프레임**(총 4장) — "즉시 상호작용" 요구상 애니메이션은 0.4초 이내.

#### prop.bloodTrail

1. **ID / 배치 위치** — `prop.bloodTrail`. 현재 장식 사각형만(`Chapter1World.ts:87`). `cabinB2` 침대(360,350) → 천장문(820,170) 경로 전체 + `loggingRoad` 우측 점적 + `attic` 우측 벽에 재사용.
2. **컨셉아트 근거** — `image6.jpg` 패널 7(침구에 밴 피와 바닥으로 흘러내린 자국), 패널 8(다락 우측 벽의 넓게 튄 핏자국), 패널 6(관리동 **외벽**의 흘러내린 자국) — **세 컷 모두에 실제 혈흔이 그려져 있다.**
3. **기획 의도** — 3.1 1-8 "천장 **핏자국** 조사"; 3.3 "2층 침대에서 천장까지 이어진 핏자국".
4. **비주얼 설명** — 원본에서 확정된 것: 이 세계의 피는 **선홍이 아니라 갈흑에 가까운 검붉음**(`#4a1512`)이고, 마른 가장자리는 더 검게 산화해 `#2e120f`로 번지며, 회백 벽·목재 위에서 **거의 검게 보이다가 가까이서만 붉은 기가 드러난다.** 채도를 올리지 말 것 — 원본의 탁함이 사실적 공포를 만든다. 형태는 방울이 아니라 **끌린 자국**이며 모든 스미어의 꼬리가 천장문 방향으로 가늘어진다. 3구간 분할: (a) 침대 위 넓게 밴 시작부(원본 p7 그대로 — 침구에 스며 번진 형태), (b) 바닥→벽을 타고 오르는 중간부(폭이 좁아지고 **다섯 갈래 손자국**이 두어 번 섞인다), (c) 천장문 가장자리에서 끊기는 종단부. 다락 벽용 변형은 p8처럼 **위에서 아래로 흘러내린 넓은 튐 자국**으로 별도 제작.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite sheet, a dried blood drag trail in three connected segments: a wide soaked start on bedding, a narrowing smear crossing the floor and climbing a wall with occasional five-fingered streaks, and a terminating edge at a ceiling hatch, every smear tapering in the same direction, oxidized brown-black at the edges with slightly redder centers, reading almost black at a distance, painterly horror concept art, desaturated palette #4a1512 #2e120f, transparent background, orthographic overhead view --no bright red, gore, body parts, vignette, text, watermark, background`
6. **구현 메모** — 3분할: (a) **200×100**, (b) **160×260**, (c) **120×80**(각 원본 4배) + 다락 벽용 (d) **180×140**. 정적. 벌목로 점적은 (c)를 축소·회전해 재사용.

#### prop.mirror

1. **ID / 배치 위치** — `prop.mirror`. `attic.puzzle` (555,240,170×120) 구성 요소. 장식 `{540,225,200×150}`.
2. **컨셉아트 근거** — **없음 / 불일치** — `image6.jpg` 패널 8의 다락에는 **거울이 없고 대신 청록 랜턴이 놓여 있다.** 앞서 내린 판단(랜턴=광원, 거울=조작 장치로 양립)에 따라 거울은 신규 설계이며, 아트의 청록 광원 성질만 상속한다.
3. **기획 의도** — 3.3 정답: "촛대와 **거울** 각도를 조절해 세 그림자를 하나의 봉인으로 중첩"; 3.4 "거울 공명".
4. **비주얼 설명** — 회전 가능한 목제 스탠드에 걸린 타원 거울. **거울면의 색 규칙은 전역 규칙 1을 따른다**: 거울은 스스로 청록을 만들지 않고, 좌측 청록 랜턴의 빛을 받아 **그 빛만 골라 반사한다**(난색 촛불은 정상적인 난색으로 반사). 즉 화면에 청록 부채꼴이 두 개 생기는데 하나는 랜턴 직사광, 하나는 거울 반사광이며, 퍼즐은 후자의 각도를 맞추는 것이다 — 이 규칙 덕분에 아트와 문서가 모두 성립한다. 은박이 벗겨진 반점마다 `TEAL-HI`가 점점이 밝고, 유리에 오래된 얼룩과 세로 균열 하나. **거울에 비치는 것은 다락 천장이 아니라 아무것도 아닌 검은 공간**이어야 한다(반사가 논리적으로 틀렸다는 사실을 조용히 심는다). 프레임은 손때 묻은 어두운 목재(`#3a2c1e`)에 양옆 놋쇠 조절 나사만 반들거린다. 상태 3종: 오각도 / 정답 각도(청록 부채꼴이 벽의 세 목판을 정확히 통과) / 봉인 성립(반사광 전체가 `TEAL-HI`로 포화).
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, an oval mirror on a rotating wooden stand in a dark attic, catching teal-cyan light from an off-screen lantern and throwing it back as a sharp cyan fan, flaking silver backing showing as bright cyan speckles, an old vertical crack and stains in the glass, the reflection showing only empty blackness instead of the room, worn dark timber frame with polished brass adjustment screws, painterly horror concept art, palette #3a2c1e #22c4ad #5ef0d8 #0c1210, transparent background, orthographic overhead view --no face, reflection of a person, vignette, text, watermark, background`
6. **구현 메모** — 스프라이트 **170×120**(원본 680×480). **각도 3상태 3장**, 반사 부채꼴은 별도 가산합성(additive) 레이어 1장으로 분리해 각도에 따라 회전.

#### prop.pedestal

1. **ID / 배치 위치** — `prop.pedestal`. `attic.clue` (300,200,150×100) / `attic.puzzle` 구성 요소. 3.1 1-9의 "빈 받침대".
2. **컨셉아트 근거** — **간접** — `image6.jpg` 패널 8의 좌측 **궤짝(청록 랜턴이 놓인 나무 상자)**이 이 방의 목재 가구 재질 기준을 제공한다. 홈이 파인 받침대 자체의 컷은 없다. 5.4 의식실의 "빈 받침대"와 형태를 공유해 시리즈 상징을 심을 것.
3. **기획 의도** — 3.1 1-9: "벽·거울·서랍 조사 | △○✠·**빈 받침대**·수색 암호".
4. **비주얼 설명** — 낮은 목제 받침대 위에 △○✠ 세 개의 **홈이 왼쪽부터 나란히** 파여 있다(3.3 정답 "왼쪽 △, 중앙 ○, 오른쪽 ✠"). 각 홈은 대응 목판의 외곽 형태 그대로 파여 있어 **목판을 갖고 있지 않아도 어떤 모양이 어디 들어가는지 홈만 보고 알 수 있다** — 6.4의 형태 구분 요구가 퍼즐 가독성으로 직결되는 지점이다. 홈 바닥에 먼지가 균일하게 앉았으나 **세 홈 모두 가장자리에만 먼지가 없다**(누군가 한 번은 끼웠다가 뺐다). 나무는 다락 톤의 `#4a3a2a`, 홈 안쪽은 거의 검다. 세 조각을 모두 끼우면 홈 틈으로 `TEAL-DEEP`이 아주 미약하게 새어 나오기 시작한다 — 전역 규칙 1대로 이때 받침대는 처음으로 "용기"가 된다.
5. **이미지 생성 프롬프트** — `top-down 2D game prop sprite, a low wooden pedestal with three empty recessed slots cut left to right in the exact outline shapes of an angular pentagon, a circle, and a tall octagon, dust settled evenly inside each slot but wiped clean along the rims, dark aged timber, slot interiors nearly black, painterly horror concept art, palette #4a3a2a #241c14 #0e4a45, transparent background, orthographic overhead view --no glow, painted symbols, vignette, text, watermark, background`
6. **구현 메모** — 스프라이트 **150×100**(원본 600×400). 상태 4장: 빈 상태 / 1개 / 2개 / 3개(청록 미광). 목판 3종의 외곽 벡터를 감산해 홈을 만들면 형태가 자동 일치.

### 4-8. 보상 아이템

#### prop.rustedKey

1. **ID / 배치 위치** — `prop.rustedKey`. 현재 텍스트 표기만(`GameController.ts:131-136`). 획득처 다락 서랍, 사용처 `gate.lock`.
2. **컨셉아트 근거** — **간접** — `image4.jpg` 루카스 기어 분해도에 **열쇠 소품 컷**이 포함되어 있어 이 세계의 열쇠 조형(큰 고리 머리, 비대칭 날)을 상속했다.
3. **기획 의도** — 6.1: "**녹슨 관문 열쇠** | GR-1 다락 | 북쪽 관문 | 사용 후 제거".
4. **비주얼 설명** — 손바닥 길이의 커다란 철제 열쇠. **자물쇠(`prop.gateLock`)와 짝임이 형태로 보여야 하므로** 열쇠 머리의 원형 고리와 자물쇠 열쇠구멍의 곡률을 같은 원에서 딴다. 전체가 두꺼운 붉은 녹(`#6a4a33`)에 덮였고 **날 부분만 최근 문지른 듯 금속 바탕(`#9a958f`)이 드러나** 자물쇠의 "닦인 열쇠구멍"과 시각적으로 호응한다. 머리 고리에 삭은 붉은 실 한 가닥이 묶인 채 남아 있다. 날의 홈은 비대칭 3단으로 명확히 그려 소지품 아이콘에서도 열쇠임이 즉시 읽히게.
5. **이미지 생성 프롬프트** — `top-down 2D game item sprite, a large hand-length iron key heavily coated in red rust, the bit end rubbed back to bare bright metal, a round bow whose curvature matches a padlock keyhole, a frayed red thread knotted through the bow, asymmetric three-step bit pattern, painterly horror concept art, palette #6a4a33 #9a958f #4a1512, transparent background, orthographic overhead view, item icon composition --no glow, magic, vignette, text, watermark, background`
6. **구현 메모** — **56×24**(월드 드롭용) + **48×48 소지품 아이콘**(정사각 크롭, 대각선 배치). 정적. 소지품 텍스트 옆 아이콘 UI 변경이 선행 필요.

#### prop.truthShard

1. **ID / 배치 위치** — `prop.truthShard`. 현재 텍스트 표기만. 획득처 다락 서랍, 사용처는 GR-2 성문 석판(범위 밖).
2. **컨셉아트 근거** — `image4.jpg` "루카스집 창고" 패널의 **옥색 돌 상자** — 궤짝 안에서 발광하는 평평한 청록 석판으로, 이 조각의 **재질·발광 성질의 직계 원본**이다. 추가로 `image6.jpg` 패널 2·3에서 루카스가 안고 뛰는 상자의 발광 확산 참조.
3. **기획 의도** — 6.1: "**△ 진실 조각** | GR-1 다락 서랍 | GR-2 성문 석판"; 0.1의 정합성 보정으로 추가.
4. **비주얼 설명** — **GR-1에서 유일하게 소지 가능한 발광체**이자 옥색 상자의 직계 파편. 원본 상자를 보면 발광은 표면 전체가 아니라 **각인된 문양 선을 따라** 흘러나오며, 색은 코어에서 `TEAL-HI`(`#5ef0d8`) 가장자리로 갈수록 `TEAL-MID`로 식는다 — 이 감쇠 방식을 그대로 축소 적용한다. 손가락 두 마디 크기의 삼각형 석편, 재질은 돌인데 표면이 유리질로 매끄럽고 **파단면 한쪽만 거칠어** 더 큰 무언가에서 떨어져 나온 조각임을 형태로 말한다(GR-2 석판과 맞물릴 자리). 겉면에 △가 얕게 각인돼 있고 **발광은 그 각인선과 균열에서만** 새어 나온다 — 즉 이 물건은 "성물"이 아니라 **깨진 부품**이다. 주변에 좁은 청록 헤일로와 표면 근처 공기의 미세한 성에.
5. **이미지 생성 프롬프트** — `top-down 2D game item sprite, a triangular stone shard the size of two finger joints, glassy smooth on one face and rough on the fracture edge as if broken from something larger, a shallow triangle glyph engraved on the surface with teal-cyan light bleeding out only along the engraved lines and hairline cracks, hot cyan at the core cooling toward the edges, a tight halo and faint frost on the surrounding air, painterly horror concept art, palette #2a3a3a #22c4ad #5ef0d8, transparent background, orthographic overhead view, item icon composition --no warm light, fire, vignette, text, watermark, background`
6. **구현 메모** — **40×40** + **48×48 소지품 아이콘**. **발광 맥동 3프레임 루프** — 난색은 불규칙하게 흔들리고 청록은 **규칙적으로 맥동**해야 두 광원의 성질 차이가 전달된다(전역 규칙 1의 운동 버전). GR-2/GR-3 재사용되므로 지역색 없이 제작.

---

## 5. UI 아이콘 (`ui.icon.*`) — 3종

**컨셉아트 근거: 전 항목 없음.** 문서에 UI 컨셉아트가 전혀 포함되어 있지 않다(퍼즐 관련 이미지 `image23.png`도 순수 플로우 다이어그램이며 UI 목업이 아니다). 아래는 02번 문서 U-1과 6.4 Done 기준에 기반한 설계이며, 문양 형태만 `image6.jpg` 패널 8의 벽 문양에서 상속한다.

02번 문서 U-1의 근거: `style.css:1` 폰트 스택에 심볼 폰트 폴백이 없어 **✠(U+2720)가 두부(□)로 렌더링될 위험**이 실재한다. 세 아이콘은 소지품 표시(`GameController.ts:131-136`)와 퍼즐 모달(`ModalView.ts:22`)의 글리프를 대체하며, `prop.woodcut.*`의 외곽·질감 규칙을 **단순화 계승**해야 목판을 주웠을 때 같은 물건임이 즉시 연결된다.

#### ui.icon.triangle

1. **ID / 배치 위치** — `ui.icon.triangle`. 신규 ID. 소지품 스트립과 퍼즐 모달 버튼 좌측.
2. **컨셉아트 근거** — 없음(문양 형태만 `image6.jpg` p8 상속).
3. **기획 의도** — 6.4: "청각 단서 방향 표시, 전체 자막, **문양의 형태/질감 구분**, 카메라 흔들림 감소 옵션을 제공한다".
4. **비주얼 설명** — 각진 오각형 배지 안에 **속이 빈 삼각형 외곽선**. 선 굵기는 아이콘 폭의 1/8로 두껍게, 꼭짓점은 뾰족하게. 색은 HUD 텍스트색과 동일한 `#cdd4d0` 단색, 미획득은 `#4a5350`. 획득 시 배지 배경에만 `WARM-FALL` 계열의 옅은 채움을 넣어 "나무 조각"임을 암시. **판별 규칙: 선이 비어 있고, 외곽이 각졌다.**
5. **이미지 생성 프롬프트** — `flat 2D UI icon for a horror game inventory, a hollow triangle outline with thick strokes and sharp corners inside an angular pentagonal badge, monochrome #cdd4d0 on transparent background, crisp vector style, no gradients, no glow, readable at 24 pixels --no text, watermark, 3d, bevel, background, color`
6. **구현 메모** — **SVG 원본** + 48×48 / 24×24 PNG 폴백. 인라인 SVG로 넣으면 폰트 의존이 완전히 사라진다. 애니메이션 불필요.

#### ui.icon.circle

1. **ID / 배치 위치** — `ui.icon.circle`. 동일.
2. **컨셉아트 근거** — 없음(문양 형태만 `image6.jpg` p8 상속).
3. **기획 의도** — 동 6.4.
4. **비주얼 설명** — 원형 배지 안에 **속이 꽉 찬 원반**(삼각형이 '빈 선', 원이 '찬 면'이라 색 없이 구분된다). 원반 둘레에 얇은 동심원 링 하나를 더해 나이테 질감을 1획으로 요약. 미획득 시 `#4a5350` 단색 실루엣. **판별 규칙: 면이 채워져 있고, 외곽이 완전한 원이다.**
5. **이미지 생성 프롬프트** — `flat 2D UI icon for a horror game inventory, a solid filled disc with one thin concentric ring around it inside a perfectly circular badge, monochrome #cdd4d0 on transparent background, crisp vector style, no gradients, no glow, readable at 24 pixels --no text, watermark, 3d, bevel, background, color`
6. **구현 메모** — SVG + 48/24px PNG. 애니메이션 불필요.

#### ui.icon.cross

1. **ID / 배치 위치** — `ui.icon.cross`. 동일. **두부 렌더링 리스크의 실제 대상이므로 3종 중 최우선.**
2. **컨셉아트 근거** — 없음. `prop.woodcut.cross`와 같은 아트/문서 불일치를 공유하며 같은 판단(십자+뱀)을 따르되, **24px 가독성 때문에 아이콘에서는 뱀을 생략**한다.
3. **기획 의도** — 동 6.4 + 02번 문서 U-1.
4. **비주얼 설명** — 세로로 긴 팔각 배지 안에 **끝이 넓어지는 파테(patté) 십자** — 일반 라틴 십자가 아니라 네 팔 끝이 벌어져 24px에서도 삼각/원과 혼동되지 않는다. 십자 중앙에 작은 사각 구멍을 뚫어 `prop.woodcut.cross`의 "관통" 규칙을 아이콘에도 계승. 미획득 시 `#4a5350`. **판별 규칙: 팔이 넷이고, 중앙이 뚫려 있고, 외곽이 세로로 길다.**
5. **이미지 생성 프롬프트** — `flat 2D UI icon for a horror game inventory, a cross patté with flared arm ends and a small square hole punched through its center, inside a tall octagonal badge, monochrome #cdd4d0 on transparent background, crisp vector style, no gradients, no glow, unmistakable at 24 pixels --no latin cross, serpent, religious ornament, text, watermark, 3d, bevel, background, color`
6. **구현 메모** — SVG + 48/24px PNG. `prop.woodcut.cross`와 **동일 벡터 원본에서 파생**(뱀 레이어만 끔). 애니메이션 불필요.

---

## 6. 오디오 (`audio.*`) — 8종

**컨셉아트 근거: 전 항목 해당 없음**(문서에 사운드 자료가 포함되어 있지 않다). 다만 컨셉아트가 확정한 **공간의 재질**이 사운드 설계의 물리적 근거가 되므로, 각 항목에 어느 패널의 어떤 재질을 소리로 옮기는지 명시했다.

`manifest.json`에는 `images` 키만 있고 오디오 파이프라인 자체가 없다(02 문서 2-4). 8종은 `manifest.json`에 `audio` 키를 추가하고 `AssetProvider.getAudio()`를 확장한 뒤 투입한다(A-5, P1). 현재 `WebAudioPort`의 사인파 4종(`WebAudioPort.ts:38`)은 이 에셋 투입 시 ambience 베드 역할만 남기고 볼륨을 낮춘다. 공통 사양: 48kHz / 16bit, OGG(주) + M4A(폴백), 앰비언스 −24 LUFS, 단발 SFX 피크 −6dBFS.

#### audio.amb.rain

1. **ID / 배치 위치** — `audio.amb.rain`. `ambience:'rain'`인 3곳(`bridge`, `forest`, `gate`) + `logging`/`chase` 변형. `drawRain()`이 비를 그리는 구역과 동일 집합.
2. **재질 근거** — `image6.jpg` 패널 1·3·4: 비가 **진창·나뭇잎·물웅덩이·널판 지붕**에 떨어지는 네 종류의 표면이 한 화면에 있다. 이 네 표면이 그대로 레이어 구성이 된다.
3. **기획 의도** — 1.1: "**비**, 안개, 발소리, 문틈, 상태가 바뀐 생활 공간이 직접 점프스케어보다 먼저 긴장을 누적한다".
4. **사운드 디자인 스크립트** — 3레이어. (a) **기반**: 넓게 퍼진 핑크노이즈성 빗소리, 6kHz 위로 −9dB 롤오프해 "젖은 공기"를 만든다. 완전한 화이트노이즈는 금지 — 귀가 5분 안에 무시해 긴장 누적이 실패한다. (b) **중간**: 나뭇잎 타격음 레이어, 밀도를 30초 주기로 ±15% 흔들어 비가 강해졌다 약해지는 느낌. (c) **디테일**: 3~8초 간격 랜덤으로 굵은 물방울이 **나무 널판과 고인 물**에 떨어지는 단발음 — 가장 중요한 레이어로, 이것이 있어야 플레이어가 발소리를 들으려 귀를 기울인다. **길이 2분 30초 심리스 루프.** 감정 목표는 공포가 아니라 **피로와 무방비**.
5. **구현 메모** — OGG 스테레오 약 2.5MB. 실내(`cabin`)에서는 동일 파일에 2kHz LPF + −12dB를 걸어 "벽 너머의 비"로 재사용 — 파일 1개로 실내외를 모두 커버한다.

#### audio.step.wet

1. **ID / 배치 위치** — `audio.step.wet`. `MovementService` 이동 상태와 연결. **주의: `WebAudioPort.pulse('step')`은 정의만 있고 호출처가 0곳**(MS-13)이므로 호출부 연결이 함께 필요.
2. **재질 근거** — `image6.jpg` 패널 1의 깊은 진창과 고인 물, 패널 5·7의 젖어 광택 나는 널마루 — **바깥은 흡착, 실내는 삐걱임**으로 표면이 명확히 갈린다.
3. **기획 의도** — 3.4: "플레이어와 보조를 맞추다 함께 멈추는 **젖은 발소리**".
4. **사운드 디자인 스크립트** — 2레이어 × 3속도 × 2표면. (a) **기반(실외)**: 젖은 진흙에 발이 박혔다 빠지는 흡착음 — 80~200Hz 임팩트와 점성 있는 중역. (a') **기반(실내)**: 젖은 널판의 삐걱임과 마른 나무 타격. (b) **디테일**: 신발 가죽 삐걱임 + 물 튀김 잔향 80ms. 속도별 3세트: 앉기(흡착음만, −18dB, 잔향 없음) / 걷기(기준) / 달리기(임팩트 +4dB, 물 튀김 증가, 호흡 레이어). **각 6~8개 배리에이션**을 라운드로빈 — 같은 샘플이 두 번 연속 나오면 즉시 게임처럼 들리고 몰입이 깨진다. 길이 각 0.3~0.5초, 루프 없음. 감정 목표는 **자기 존재의 소음화.**
5. **구현 메모** — 표면×속도 폴더로 6~8개씩 총 40여 개 짧은 OGG. 재생 간격은 `MovementService`의 88/146/238px/s에 비례.

#### audio.step.wet.echo

1. **ID / 배치 위치** — `audio.step.wet.echo`. `loggingRoad` 진입 후(3.1 1-7) 상시. GR-1에서 가장 중요한 사운드 연출.
2. **재질 근거** — 동일(원본 파생 처리).
3. **기획 의도** — 3.4: "플레이어와 **보조를 맞추다 함께 멈추는** 젖은 발소리".
4. **사운드 디자인 스크립트** — `audio.step.wet` 실외 걷기 세트를 원본으로 **다르게 가공한다**: (a) 200~400ms 지연, (b) 3kHz LPF + 약한 초기반사 리버브로 "조금 떨어진 곳"에 배치, (c) 피치 −2 semitone(체중이 더 나가는 존재), (d) 볼륨 −10dB — 들릴락 말락 해야 플레이어가 스스로 의심하기 시작한다. **핵심 규칙은 정지 동작**: 플레이어가 멈추면 에코 발소리는 **한 발 더 딛고 나서** 멈춘다(지연 250ms 후 1스텝 추가 재생 뒤 정지). 이 한 걸음이 이 에셋의 전부다 — "내 소리의 반향"이라는 해석을 무너뜨리는 유일한 증거. 길이 각 0.4초, 루프 없음, 팬은 항상 플레이어 뒤쪽 채널로 미세하게 치우침. 감정 목표: **동반자가 있다는 확신 없는 확신.**
5. **구현 메모** — 별도 녹음 불필요, 파생 처리로 제작. 필요한 코드는 "정지 시 1스텝 추가 재생" 한 줄 로직이며, **이 로직 없이 파일만 넣으면 연출이 성립하지 않는다.**

#### audio.amb.cabinB1.flies

1. **ID / 배치 위치** — `audio.amb.cabinB1.flies`. area `cabinB1`. 창고 구역(`{500,300,220×190}`) 중심의 위치 기반 감쇠 권장.
2. **재질 근거** — `image6.jpg` 패널 6 관리동 외벽의 핏자국 — **밖에서 이미 보이는 혈흔**이 안에 무엇이 있었는지 예고하므로, 이 소리는 그 예고의 회수다.
3. **기획 의도** — 3.4: "**1F 파리**·금속 끌림".
4. **사운드 디자인 스크립트** — 2레이어. (a) **기반**: 여러 마리 날갯짓이 겹친 저역 웅웅거림(120~180Hz 중심), 밀도를 계속 미세 변화시켜 "덩어리가 움직인다"는 인상. 단일 톤이 되면 기계음처럼 들리므로 **최소 5개 소스를 서로 다른 피치로** 겹칠 것. (b) **디테일**: 개별 파리가 귀 근처를 스치는 단발 도플러 — 8~20초 간격 랜덤, 팬을 빠르게 가로지름. 이 순간에만 소리가 크게 튀어야 하며 그 놀람이 유일한 위협 요소다. **길이 60초 심리스 루프.** 창고에서 멀어지면 −18dB까지 감쇠하되 0이 되지는 않는다 — 이 층 어디서도 벗어날 수 없다는 감각. 감정 목표: **혐오와 부패의 확정.**
5. **구현 메모** — 모노 OGG 약 500KB(위치 기반 감쇠용). `bg.cabinB1` 아트의 파리 점 위치와 일치시킬 것.

#### audio.sfx.metalDrag

1. **ID / 배치 위치** — `audio.sfx.metalDrag`. area `cabinB1`, 랜덤 트리거(진입 후 20~60초 사이 1회, 이후 90초 이상 간격). `bg.cabinB1` 바닥 긁힌 자국과 같은 방향에서 들려야 한다.
2. **재질 근거** — `image6.jpg` 패널 5·7의 **젖은 널마루** — 마찰 대상은 돌이 아니라 물기 있는 나무다. 이 차이가 소리의 고역 성분을 결정한다.
3. **기획 의도** — 3.4: "1F 파리·**금속 끌림**".
4. **사운드 디자인 스크립트** — 3레이어. (a) **기반**: 무거운 금속이 젖은 나무 바닥을 긁는 저역 마찰음, 1.5~3초 지속, 일정하지 않고 **두세 번 걸렸다 다시 미끄러진다**(연속음이면 기계, 끊기면 누군가 끌고 있다). (b) **중간**: 금속 이가 나뭇결에 걸리는 짧은 고역 스크래치들. (c) **디테일**: 끌림이 멈춘 뒤 **0.5초의 완전한 침묵**, 그다음 금속이 바닥에 놓이는 낮은 "쿵". **이 침묵이 소리보다 무섭다.** 길이 3~4초, 루프 없음, 3개 배리에이션. 반드시 **화면 밖·다른 방 방향**에서 재생하고 그 방에 가면 아무것도 없다. 감정 목표: **확인 불가능한 동거인.**
5. **구현 메모** — 모노 OGG × 3. 6.4의 "청각 단서 방향 표시" Done 기준을 위해 트리거에 방향 벡터를 실어 둘 것.

#### audio.amb.attic.cello

1. **ID / 배치 위치** — `audio.amb.attic.cello`. area `attic`. 진입 즉시 페이드인 4초.
2. **재질 근거** — `image6.jpg` 패널 8 — 좁고 낮은 판자 방에 촛불과 청록 랜턴 둘뿐인 공간. **잔향이 짧고 저역이 벽에 먹히는 방**이므로 리버브를 길게 걸지 말 것.
3. **기획 의도** — 3.4: "다락 **낮은 첼로 지속음**과 거울 공명".
4. **사운드 디자인 스크립트** — 2레이어. (a) **기반**: 첼로 C현 부근(약 65Hz)의 지속음을 활로 아주 느리게 밀어 만든 롱톤. **비브라토 금지** — 흔들리지 않는 음이 사람이 연주하지 않는 것처럼 들린다. 평균율에서 **−12센트** 낮춰 미세하게 어긋나게 하면 청자가 원인을 모른 채 불편해진다. (b) **디테일**: 활이 현을 긁는 노이즈 성분만 −20dB로 얹고, 30초 주기로 아주 약하게 음량이 부풀었다 꺼진다(누군가 계속 켜고 있다는 인상). **화성 진행 금지, 멜로디 금지** — 음 하나가 4분간 지속된다. 길이 2분 심리스 루프. 퍼즐 3회 실패 시 반음 위로 올라가는 변형 1종 추가(3.3 실패 규칙 연동). 감정 목표: **탈출 불가능한 공간의 압력.**
5. **구현 메모** — OGG 약 2MB. 실제 첼로 녹음이 어렵다면 신스 톱 + 현 노이즈 임펄스로 대체 가능하나 **활 노이즈 레이어는 반드시 실물 질감**을 쓸 것.

#### audio.sfx.mirrorResonance

1. **ID / 배치 위치** — `audio.sfx.mirrorResonance`. `attic.puzzle` — 거울 각도 조절 시마다 + 봉인 성립 시 1회.
2. **재질 근거** — `image6.jpg` 패널 8의 **청록 랜턴 유리**. 앞서 정한 대로 다락의 청록 광원은 랜턴이므로, 이 소리는 **거울 유리와 랜턴 유리가 함께 공진**하는 것으로 설계하면 아트와 사운드가 같은 물건을 가리킨다.
3. **기획 의도** — 3.4: "다락 낮은 첼로 지속음과 **거울 공명**".
4. **사운드 디자인 스크립트** — 2종. (a) **각도 조절음**: 유리 가장자리를 젖은 손가락으로 문지를 때 나는 배음 풍부한 고역 링잉. 정답 각도에 가까워질수록 **주파수가 올라가고 배음이 정렬**되어(불협 → 협화) 플레이어가 귀로 정답에 접근할 수 있게 한다 — 3.3의 정답 각도 단서가 게임 내에 없다는 04번 문서 지적을 **사운드로 보완하는 설계**이며 이 에셋의 가장 중요한 기능이다. 길이 0.6초, 각도 단계별 8종. (b) **봉인 성립음**: 유리 링잉 + 저역 임팩트 + 임팩트 직전에 부풀어 오르는 역방향 리버브(pre-verb). 길이 2.5초. 이때만 `audio.amb.attic.cello`를 1초간 −20dB 덕킹해 성립 순간을 침묵으로 강조한다. 감정 목표: (a) **탐색의 보상 신호**, (b) **되돌릴 수 없는 것을 열었다는 확신.**
5. **구현 메모** — 모노 OGG × 9. (a)는 실시간 피치 시프트 대신 **개별 파일 8개**가 WebAudio 구현이 단순하다. 봉인음은 `prop.mirror`의 청록 포화 상태 아트와 프레임 동기.

#### audio.sfx.wolfHowl

1. **ID / 배치 위치** — `audio.sfx.wolfHowl`. `forest` 진입 시 1회(3.1 1-2), 갈림길 도달 시 1회(1-3, `enemy.wolf.eyes` 등장과 동기). `image22.png` Area View의 **S1(첫 울음 지점)** 표기가 다리→갈림길 사이임을 확인했으므로 첫 재생 위치를 그에 맞춘다.
2. **재질 근거** — 해당 없음(적 보드에 늑대가 없으므로 소리가 이 개체의 **유일한 정본**이 된다 — 그만큼 이 에셋의 완성도가 늑대 연출 전체를 결정한다).
3. **기획 의도** — 3.1 1-2: "숲길 진입 | 걷기·앉기·달리기 | **늑대 울음이 사람 저음으로 변조**".
4. **사운드 디자인 스크립트** — **한 소리 안에서 정체가 바뀌는 모핑**이 전부다. 3구간. (a) 0.0~1.2초: 명백한 늑대 하울 — 멀고, 리버브가 길고, 정상적이다. 플레이어가 "숲에 늑대가 있구나"로 안심하듯 분류하게 만든다. (b) 1.2~2.0초: 포먼트가 서서히 인간 성대 쪽으로 이동한다. 피치는 그대로 유지한 채 **포먼트만** 옮기는 것이 핵심 — 피치를 내리면 그냥 큰 짐승이 되고, 포먼트를 옮겨야 "사람이 내는 소리"가 된다. (c) 2.0~3.5초: 저음의 인간 신음으로 착지한 뒤 갑자기 끊긴다(**페이드아웃 금지** — 뚝 끊겨야 무언가가 입을 다문 것이 된다). 총 3.5초, 루프 없음, 2종 배리에이션. 재생 직후 4초간 다른 모든 SFX를 −6dB 덕킹해 여운을 비운다. 감정 목표: **자연이라 믿었던 것의 분류 실패** — GR-1에서 초자연이 처음 청각으로 확정되는 순간.
5. **구현 메모** — 스테레오 OGG × 2, 각 약 400KB. `enemy.wolf.eyes` 스프라이트 페이드인과 (b) 구간 시작을 프레임 단위로 맞출 것 — **눈이 나타나는 순간에 소리가 사람으로 변해야** 두 에셋이 하나의 연출이 된다.

---

## 7. 제작 체크리스트

- [ ] **반입 선행** — `word/media/`의 GR-1 관련 6장(`image3·4·6·10·19·22`)을 `public/assets/source/`로 복사(02 문서 A-1, 비용 0). 이 문서의 모든 비주얼 설명은 그 6장을 옆에 띄워 놓고 읽어야 의도가 전달된다.
- [ ] **비네트·빗줄기 제거** — 컨셉아트 원본은 강한 비네트와 빗줄기를 갖고 있다. 배경 리터치 시 반드시 제거할 것(`drawDarkness()`/`drawRain()`와 이중 적용 방지).
- [ ] **청록 검역(전역 규칙 1)** — 청록이 **용기 안이나 그 반사**로만 나타나는지 확인. 허용 목록: `bg.forest`(표지판 랜턴), `bg.attic`(궤짝 랜턴), `bg.ending`(분수 반사), `character.lucas`(옥색 상자), `enemy.hollow`(허리 유리병), `prop.torch`(청록 변형), `prop.mirror`(반사), `prop.pedestal`(3개 삽입 시), `prop.truthShard`, `prop.landmark.creek`(하늘 반사, 발광 아님). **앰비언트 청록 틴트는 어디에도 금지.**
- [ ] **수직 진행 검수** — `bg.cabinB1`/`bg.cabinB2`/`bg.attic`을 세로로 나란히 놓고 적갈 → 회백(`#7d7873`) → 흑+점광 2개로 읽히는지 확인. **2F는 관측값대로 밝게** 유지할 것(placeholder보다 밝다).
- [ ] **상태 변화 검수** — `bg.cabinA`↔`bg.cabinA.visited` 교차 전환 시 가구가 1px도 움직이지 않고 **조명 위치만 좌상단→우하단으로 이동**하는지 확인.
- [ ] **그레이스케일 검수** — `prop.woodcut.*` 3종과 `ui.icon.*` 3종을 채도 0으로 나란히 놓고 색 없이 구분되는지 확인(6.4 Done 기준).
- [ ] **명도 계단 검수** — `prop.landmark.*` 4종 그레이스케일에서 울타리 < 참나무 < 수레길 < 개울 순인지 확인.
- [ ] **실루엣 검수** — `enemy.hollow`(수직·비대칭·긴 팔·굽은 목)와 `enemy.wolf`(수평·낮음·대칭)를 검은 실루엣으로 만들어 3m 거리에서 구분되는지 확인(1.3 리드).
- [ ] **미해결 결정 사항(아트 디렉터 확인 필요)** — (1) 다락 세 번째 문양이 ✠인가 뱀지팡이인가(본 문서는 하이브리드로 처리), (2) 다락 청록 광원이 랜턴인가 거울인가(본 문서는 둘 다 배치로 처리), (3) `prop.torch`를 횃불로 만들 것인가 랜턴으로 만들 것인가(본 문서는 아트를 따라 랜턴).
