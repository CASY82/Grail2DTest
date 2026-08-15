# GRAIL — Chapter 1 HTML5 Prototype

GRAIL의 기존 3D 레벨디자인을 **2D top-down survival horror**로 옮긴 Chapter 1 프로토타입입니다.
외부 런타임 엔진에 종속되지 않는 HTML5 Canvas 구현이며, 객체지향 + 레이어드 아키텍처로 분리되어 있습니다.

## 현재 구현 범위

- 붕괴된 다리 → Ashvale 숲
- 첫 오두막 조사
- 북쪽 관문 잠금 확인
- 첫 오두막 재방문 / 관리 기록
- 옛 벌목로
- 둘째 오두막 1F / 2F / 다락
- △ ○ ✠ 목판화 수집 (환경 스토리텔링 텍스트 포함) + 선택적 일기 단서(`cabinB1.diary`)
- 받침대 눈금 조사(`attic.mechanism`)로 얻는 각도 힌트(디제틱, 45°/30° 눈금이 닳아 있음)
- 그림자 봉인 퍼즐 — 손잡이를 돌리는 즉시 SVG 다이얼과 겹침 %/온도어로 실시간 피드백, 맹목적 추측 없음
- 녹슨 관문 열쇠 + △ 진실 조각 획득 (2단계 연출: 봉인이 맞물리는 소리 → 서랍이 열림)
- Hollow 목격 연출(사운드 + 짧은 스침, 추격 없음)
- 북쪽 관문 개방 / Chapter 1 종료
- 걷기 / 달리기 / 앉기별 소음 반경
- 등잔 ON/OFF와 시야 변화
- 봉헌 촛대 및 핵심 진행 LocalStorage 저장
- 에셋 Manifest 교체 구조
- 에셋 로드 실패 시 fallback 렌더링

## 바로 실행

Node.js가 설치되어 있다면 별도 패키지 설치 없이 현재 포함된 `dist/`를 실행할 수 있습니다.

```bash
cd grail-ch1-html5
npm run dev
```

브라우저에서:

```text
http://localhost:4173
```

`npm run dev`는 외부 서버 패키지가 아니라 Node.js 기본 `http` 모듈을 사용하는 `server.mjs`를 실행합니다.

## 개발 / 다시 빌드

TypeScript 소스를 수정한 뒤:

```bash
npm install
npm run check
npm run build
npm run dev
```

### 조작

| 키 | 기능 |
|---|---|
| W/A/S/D | 이동 |
| Shift | 달리기 토글(한 번 누르면 유지, 다시 누르면 해제) |
| Ctrl | 앉아서 이동 |
| E | 조사 / 상호작용 |
| F | 등잔 ON/OFF |
| Esc | 일시정지 정보 |
| ` | 충돌/소음 Debug 표시 |

## 아키텍처

```text
src/
├─ domain/                 # 순수 게임 규칙 / 모델
│  ├─ Chapter1.ts          # 진행 플래그, 아이템, 목표
│  ├─ Player.ts
│  ├─ Hollow.ts
│  ├─ Geometry.ts
│  └─ World.ts             # Area / Portal / Interaction 정의
│
├─ application/            # Use Case / 게임 서비스
│  ├─ Chapter1FlowService.ts
│  ├─ MovementService.ts
│  ├─ SaveGameService.ts
│  └─ ports/Ports.ts       # Renderer/Input/Save/Asset/Audio/Modal 추상화
│
├─ infrastructure/         # HTML5 / Browser 구현
│  ├─ CanvasRenderer.ts
│  ├─ BrowserInput.ts
│  ├─ ManifestAssetProvider.ts
│  ├─ LocalStorageSaveRepository.ts
│  └─ WebAudioPort.ts
│
├─ presentation/           # 게임 루프 / UI
│  ├─ GameController.ts
│  └─ ModalView.ts
│
└─ config/
   └─ Chapter1World.ts     # CH1 맵/배치 데이터
```

### 의존 방향

```text
Presentation ─────┐
                  ▼
Infrastructure -> Application -> Domain
                  ▲
                  │ Ports(interface)
```

`Domain`은 Canvas, DOM, LocalStorage를 알지 못합니다.
`Application` 역시 구체 Canvas Renderer를 직접 참조하지 않고 Port를 통해 사용합니다.

따라서 나중에 Phaser를 사용하고 싶다면 예를 들어:

```text
CanvasRenderer
      ↓ 교체
PhaserRenderer implements RendererPort
```

형태로 바꿀 수 있습니다. Chapter1FlowService나 Chapter1Progress는 유지할 수 있습니다.

## 에셋 교체

모든 실제 파일 경로는 다음 파일에 집중되어 있습니다.

```text
public/assets/manifest.json
```

예:

```json
{
  "images": {
    "character.lucas": "./public/assets/characters/lucas-final.webp",
    "enemy.hollow": "./public/assets/characters/hollow-final.webp",
    "bg.forest": "./public/assets/environment/forest-final.webp"
  }
}
```

게임 로직에서는 `lucas-final.webp` 같은 경로를 사용하지 않고 `character.lucas`라는 ID만 사용합니다.
따라서 그림 파일을 바꾸더라도 Domain/Application 코드는 수정하지 않습니다.

현재 SVG들은 **교체 전용 placeholder**입니다.

자세한 내용은 `public/assets/README.md` 참고.

## 맵 교체 / Tiled 도입

현재 CH1 맵은 `src/config/Chapter1World.ts`에 데이터로 정의했습니다.
추후 Tiled를 도입할 경우 이 데이터를 직접 없애기보다 다음 Adapter를 추가하는 방식을 권장합니다.

```text
Tiled JSON/TMJ
     ↓
TiledWorldLoader (Infrastructure)
     ↓
WorldDefinition (Domain)
```

그러면 게임 로직은 Tiled 파일 포맷에 의존하지 않습니다.

권장 Tiled Object Layer:

```text
Collision
Portal
Interaction
Checkpoint
EnemyTrigger
AudioZone
Decoration
```

## CH1 진행 데이터

주요 진행 상태는 플래그로 관리합니다.

```text
cabinVisited
  ↓
gateChecked
  ↓
routeKnown
  ↓
atticOpened
  ↓
atticClueSeen
  ↓
(mechanismExamined — 선택, 각도 힌트 조사 여부)
  ↓
woodcutTriangle / Circle / Cross
  ↓
puzzleSolved
  ↓
chaseStarted
  ↓
chapterComplete
```

대규모 확장 시 Chapter별 State Machine 또는 Quest Graph로 옮기기 쉽도록 문자열 이벤트와 화면 코드를 분리했습니다.

## 테스트

```bash
npm run build
node tests/smoke.mjs
```

검증 내용:

- 각 Area 기본 Spawn이 Wall과 충돌하지 않는지
- Portal 이동 직후 다른 Portal이 즉시 재발동하지 않는지
- CH1 필수 진행 플래그가 순서대로 동작하는지
- △ ○ ✠ 수집 및 퍼즐 보상
- Hollow 목격(sighting) 플래그
- 열쇠 획득 후 북쪽 관문 완료

## 다음 확장 우선순위

1. 실제 컨셉아트 기반 배경/캐릭터 스프라이트 교체
2. Tiled 기반 레벨 에디팅 Adapter
3. 장애물 기반 시야(Line-of-Sight)
4. 등잔 피탐지 증가
5. 정신력 시스템
6. 애니메이션 State Machine
7. 사운드 에셋 Manifest / spatial audio
8. Gamepad / 모바일 입력 Adapter
9. Chapter 2 Safe Hub + Spoke 구조
