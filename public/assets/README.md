# Asset swap guide

게임 로직에서는 파일 경로를 직접 참조하지 않습니다. `manifest.json`의 **Asset ID**만 사용합니다.

예: Lucas 캐릭터를 교체하려면

```json
"character.lucas": "./public/assets/characters/lucas-final.webp"
```

처럼 경로만 변경하면 됩니다. 기존 ID를 유지하면 Domain/Application 코드는 수정하지 않습니다.

## 권장 ID 규칙
- `character.*`: 플레이어/NPC
- `enemy.*`: 적
- `bg.*`: Area 배경
- `prop.*`: 조사 가능한 오브젝트
- `ui.*`: UI
- `audio.*`: BGM/SFX (현재 프로토타입은 WebAudio fallback 사용)

이미지 로드에 실패해도 CanvasRenderer의 fallback 도형으로 계속 실행되도록 설계되어 있습니다.
