import { Chapter1Progress } from '../domain/Chapter1.js';

export interface ActionResult {
  title: string;
  body: string;
  autosave?: boolean;
  openPuzzle?: boolean;
  startChase?: boolean;
  complete?: boolean;
}

export class Chapter1FlowService {
  constructor(private readonly progress: Chapter1Progress) {}

  interact(action: string): ActionResult {
    switch (action) {
      case 'bridge.lookBack':
        this.progress.set('bridgeObserved');
        return { title: '붕괴된 다리', body: '강 건너편에서 도적들의 실루엣이 흔들린다. 돌아갈 길은 완전히 끊겼다.' };
      case 'cabin.parchment':
        this.progress.set('cabinVisited');
        return { title: '괴물 양피지', body: '젖은 양피지에는 인간처럼 걷지만 인간이 아닌 것에 대한 경고가 적혀 있다. 봉헌 촛대가 희미하게 타오른다.', autosave: true };
      case 'cabin.candle':
        return { title: '봉헌 촛대', body: '촛불을 다시 밝혔다. 현재 상태가 저장된다.', autosave: true };
      case 'gate.inspect':
        if (this.progress.owns('rustedGateKey')) {
          return { title: '북쪽 관문', body: '녹슨 열쇠가 맞물린다. 관문 너머로 Ashvale 마을과 성의 윤곽이 드러난다.', complete: true };
        }
        this.progress.set('gateChecked');
        return { title: '잠긴 북쪽 관문', body: '오래된 자물쇠다. 녹슨 열쇠가 필요하다. 첫 오두막의 관리 기록을 다시 확인해야 할 것 같다.', autosave: true };
      case 'cabin.record':
        this.progress.set('routeKnown');
        return { title: '북쪽 관문 관리 기록', body: '“뒤편 울타리 → 벼락 맞은 참나무 → 얕은 개울 → 옛 수레길.” 둘째 오두막으로 이어지는 옛 벌목로다.', autosave: true };
      case 'cabinB.strap':
        this.progress.set('atticOpened');
        return { title: '가죽 고리', body: '핏자국 끝의 가죽 고리를 당기자 접이식 사다리가 천천히 내려온다.' };
      case 'attic.clue':
        this.progress.set('atticClueSeen');
        return { title: '다락의 빈 받침대', body: '△ ○ ✠ 홈과 거울. 쪽지에는 “멈춘 시간 뒤 / 썩은 짐 아래 / 목 잃은 기도 아래”라고 적혀 있다.' };
      case 'woodcut.triangle':
        this.progress.addItem('woodcutTriangle');
        return { title: '△ 목판화', body: '서재의 멈춘 회중시계 뒤에서 삼각형 목판화를 찾았다.' };
      case 'woodcut.circle':
        this.progress.addItem('woodcutCircle');
        return { title: '○ 목판화', body: '창고의 썩은 짐 아래에서 원형 목판화를 찾았다.' };
      case 'woodcut.cross':
        this.progress.addItem('woodcutCross');
        return { title: '✠ 목판화', body: '기도실의 목 잃은 여신상 밑동에서 십자 목판화를 찾았다.' };
      case 'attic.puzzle':
        if (!this.progress.hasAllWoodcuts()) {
          return { title: '그림자 봉인', body: '세 홈이 비어 있다. △ ○ ✠ 목판화를 모두 찾아야 한다.' };
        }
        if (this.progress.has('puzzleSolved')) {
          return { title: '열린 서랍', body: '이미 열린 서랍 안쪽에서 차가운 바람이 새어 나온다.' };
        }
        return { title: '그림자 봉인', body: '목판화 세 개와 촛대, 거울을 조작할 수 있다.', openPuzzle: true };
      case 'attic.window':
        if (!this.progress.has('puzzleSolved')) return { title: '창문', body: '빗물만 유리를 타고 흐른다.' };
        this.progress.set('chaseStarted');
        return { title: '창밖', body: '나무 사이에 서 있던 Hollow가 고개를 든다. 다음 순간 창문 아래에서 젖은 발소리가 달리기 시작한다.', autosave: true, startChase: true };
      default:
        return { title: '조사', body: '특별한 것은 없다.' };
    }
  }

  solvePuzzle(): void {
    this.progress.set('puzzleSolved');
    this.progress.addItem('rustedGateKey');
    this.progress.addItem('truthTriangle');
  }
}
