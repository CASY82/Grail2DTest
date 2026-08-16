export class Chapter1FlowService {
    progress;
    constructor(progress) {
        this.progress = progress;
    }
    interact(action) {
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
            case 'cabin.bootprint':
                return { title: '진흙 발자국', body: '문턱 안쪽까지 진흙 발자국이 이어져 있다. 벌목로 방향에서 들어왔다가, 다시 그쪽으로 나간 자국이다.' };
            case 'forest.markedTree':
                this.progress.set('markedTreeSeen');
                return { title: '나무의 낯선 표식', body: '나무껍질에 칼로 그은 표식이 남아 있다. 방향을 가리키는 것 같기도, 무언가를 경고하는 것 같기도 하다.' };
            case 'forest.puddleTracks':
                this.progress.set('puddleTracksSeen');
                return { title: '웅덩이 옆 발자국', body: '웅덩이 가장자리에 발자국이 찍혀 있다. 맨발이다. 이 비에, 이 추위에.' };
            case 'forest.eyes':
                this.progress.set('forestEyesSeen');
                return { title: '나무 사이의 눈빛', body: '나무 사이로 노란 눈이 번뜩인다. 눈을 깜빡이는 사이, 사라졌다.' };
            case 'logging.fence':
                this.progress.set('fenceExamined');
                return { title: '허물어진 뒤편 울타리', body: '오래전에 무너진 울타리다. 널빤지 하나에 손톱으로 그은 자국이 줄지어 있다 — 날짜를 세던 흔적 같다.' };
            case 'logging.oak':
                this.progress.set('oakExamined');
                return { title: '벼락 맞은 참나무', body: '몸통이 반으로 갈라진 채 서 있다. 갈라진 틈 안쪽이 그을려 있다. 관리 기록이 말한 그 나무다.' };
            case 'logging.creek':
                this.progress.set('creekExamined');
                return { title: '개울의 판자다리', body: '얕은 개울 위에 낡은 판자가 걸쳐 있다. 판자 한쪽 끝에 마른 핏자국이 배어 있다.' };
            case 'logging.cart':
                this.progress.set('cartExamined');
                return { title: '버려진 수레와 통나무 더미', body: '바퀴가 빠진 수레 위로 통나무가 무너져 쌓여 있다. 오래전에 일이 멈춘 채로 방치된 모습이다.' };
            case 'hall.ledger':
                this.progress.set('hallLedgerSeen');
                return { title: '출입 기록부', body: '낡은 출입 기록부에 마지막 날짜까지 이름이 빼곡하다. 그 아래로는 아무도 서명하지 않았다.' };
            case 'hall.coats':
                this.progress.set('hallCoatsSeen');
                return { title: '걸린 우비', body: '비에 젖은 우비 네 벌이 옷걸이에 그대로 걸려 있다. 밖은 아직도 비가 온다.' };
            case 'office.roster':
                this.progress.set('officeRosterSeen');
                return { title: '인부 명부', body: '벌목 인부 명단 옆에 낯선 손글씨로 이름 셋이 덧붙여져 있다. 모두 붉은 줄이 그어져 있다. 명단 아래에는 “서재, 창고, 기도실 — 각자 맡은 곳에 남긴다.”라고 작게 적혀 있다.' };
            case 'office.map':
                this.progress.set('officeMapSeen');
                return { title: '벌목 구역 지도', body: '벽에 걸린 벌목 구역 지도. 북쪽 한 구역에 못으로 몇 번이고 표시를 지운 흔적이 있다.' };
            case 'rear.bunk':
                this.progress.set('rearBunkSeen');
                return { title: '정리된 침상', body: '담요가 각 잡혀 개어 있는 침상. 벌목꾼의 것이라기엔 지나치게 깔끔하다.' };
            case 'rear.workbench':
                this.progress.set('rearWorkbenchSeen');
                return { title: '틀톱 정리대', body: '나무틀에 맨 손톱과 긴 2인용 톱이 가지런히 걸려 있다. 그중 하나만 곧은 쇠날이 심하게 무뎌져 있다 — 나무가 아닌 다른 것을 벤 것처럼.' };
            case 'cellar.crates':
                this.progress.set('cellarCratesSeen');
                return { title: '소금에 절인 식량', body: '소금에 절인 식량 상자들이 줄지어 쌓여 있다. 마지막 상자 하나만 뚜껑이 안쪽에서 긁힌 자국투성이다.' };
            case 'cellar.marks':
                this.progress.set('cellarMarksSeen');
                return { title: '벽의 손톱자국', body: '돌벽 낮은 곳에 손톱으로 그은 자국이 수십 줄 새겨져 있다. 날짜를 세던 것처럼, 또는 다른 무언가처럼.' };
            case 'b2.watchHint':
                this.progress.set('triangleHintFound');
                return { title: '습기 밴 모래 자국', body: '침대 머리맡 작은 궤 위에 젖은 모래가 가늘게 흩어져 있다. 그 뒤의 모래시계는 유리가 온전한데도 축축한 모래가 위쪽에 엉겨 붙어 한 알도 흐르지 않는다.' };
            case 'rear.mildewHint':
                this.progress.set('circleHintFound');
                return { title: '곰팡내가 유독 진한 구석', body: '침상 발치 쪽 바닥에서 유독 눅눅하고 시큼한 냄새가 올라온다. 오래 방치된 무언가가 안쪽에서 썩어가고 있는 냄새다.' };
            case 'wing.waxHint':
                this.progress.set('crossHintFound');
                return { title: '두껍게 굳은 촛농', body: '기도대 앞바닥에 촛농이 유난히 두껍게 굳어 쌓여 있다. 누군가 이 자리에서 오래도록, 몇 번이고 무릎을 꿇었던 흔적이다.' };
            case 'wing.clockDecoy':
                this.progress.set('wingClockDecoySeen');
                return { title: '흐르는 모래시계', body: '서재 선반의 모래시계. 낡았지만 마른 모래는 목을 지나 아래로 꾸준히 흐르고 있다. 멈춘 시간이 아니다.' };
            case 'wing.bagDecoy':
                this.progress.set('wingBagDecoySeen');
                return { title: '말끔한 짐 꾸러미', body: '선반 위에 짐 꾸러미가 하나 더 놓여 있다. 가죽끈도 멀쩡하고 곰팡내도 나지 않는다 — 최근에 챙긴 짐이지, 오래 방치돼 썩은 짐이 아니다.' };
            case 'wing.statueDecoy':
                this.progress.set('wingStatueDecoySeen');
                return { title: '팔 없는 성인상', body: '구석의 작은 성인상은 두 팔이 부러져 나갔다. 하지만 고개는 그대로다 — 목이 잘린 형상이 아니다.' };
            case 'b2.clockDecoy':
                this.progress.set('b2ClockDecoySeen');
                return { title: '깨진 모래시계', body: '선반의 모래시계는 유리가 깨져 모래가 전부 쏟아졌다. 멈춘 것이 아니라 망가진 것이다. 뒤쪽에는 먼지만 쌓여 있다.' };
            case 'office.kneelingIcon':
                this.progress.set('officeIconDecoySeen');
                return { title: '기도하는 목상', body: '책상 위 작은 나무 성상이 무릎을 꿇고 기도하는 자세로 놓여 있다. 목도, 얼굴도 멀쩡하다 — 기도하는 형상이지, 목 잘린 형상이 아니다.' };
            case 'rear.satchel':
                this.progress.set('rearSatchelDecoySeen');
                return { title: '여행 가방', body: '정리된 침상 곁에 여행 가방이 놓여 있다. 열어 보아도 곰팡이 냄새 하나 없이 깔끔하다. 챙겨서 떠나려던 짐이지, 버려져 썩은 짐이 아니다.' };
            case 'cabinB.strap':
                this.progress.set('atticOpened');
                return { title: '가죽 고리', body: '핏자국 끝의 가죽 고리를 당기자 접이식 사다리가 천천히 내려온다.' };
            case 'attic.clue':
                this.progress.set('atticClueSeen');
                return { title: '다락의 빈 받침대', body: '△ ○ ✠ 세 홈과 그 위의 작은 거울. 쪽지에는 “첫째는 멈춘 시간 뒤 / 둘째는 썩은 짐 아래 / 마지막은 목 잃은 기도 아래”라고 적혀 있다. 문양의 순서가 맞아야 그림자가 제 모양으로 겹친다. 받침대 가장자리에도 뭔가 새겨진 것 같다 — 손끝으로 훑어봐야 알 것 같다.' };
            case 'attic.mechanism':
                this.progress.set('mechanismExamined');
                return { title: '받침대의 눈금', body: '거울과 촛대가 앉는 두 홈 테두리에 눈금이 촘촘히 새겨져 있다. 15도씩, 열세 칸. 그런데 유독 두 칸만 반들거린다 — 거울 쪽은 가운데서 오른쪽으로 세 칸, 촛대 쪽은 두 칸. 누군가 이 두 자리에만 셀 수 없이 손을 얹었던 흔적이다.' };
            case 'woodcut.triangle':
                this.progress.addItem('woodcutTriangle');
                return { title: '△ 목판화', body: '젖은 모래가 엉겨 멈춘 모래시계 뒤에서 삼각형 목판화를 찾았다. 나무 받침 안쪽에 누군가 “미안하다”고 긁어 놓았다.' };
            case 'woodcut.circle':
                this.progress.addItem('woodcutCircle');
                return { title: '○ 목판화', body: '숙소 구석 썩은 짐 아래에서 원형 목판화를 찾았다. 짐 보따리는 오래전에 여행 채비를 마친 채로 버려진 것 같다 — 아무도 이 집을 떠나지 못했다.' };
            case 'woodcut.cross':
                this.progress.addItem('woodcutCross');
                return { title: '✠ 목판화', body: '기도실의 목 잃은 여신상 밑동에서 십자 목판화를 찾았다. 여신상의 목은 깨진 것이 아니라, 도구로 정교하게 잘려 나간 흔적이다.' };
            case 'cabinB1.diary':
                return { title: '책상 위 낡은 일기', body: '“…다락의 것을 가두려면 순서보다 각도가 문제였다. 거울과 촛불이 서로를 정확히 겨눠야 그림자가 하나로 접힌다. 몇 번이고 돌려 보다 눈금을 다 닳게 했다…” 뒷장은 물에 젖어 알아볼 수 없다.' };
            case 'attic.puzzle':
                if (!this.progress.hasAllWoodcuts()) {
                    return { title: '그림자 봉인', body: '세 홈이 비어 있다. △ ○ ✠ 목판화를 모두 찾아야 한다.' };
                }
                if (this.progress.has('puzzleSolved')) {
                    return { title: '열린 서랍', body: '이미 열린 서랍 안쪽에서 차가운 바람이 새어 나온다.' };
                }
                return { title: '그림자 봉인', body: '목판화 세 개와 촛대, 거울을 조작할 수 있다. 손잡이를 돌리자 그림자가 그 자리에서 바로 흔들린다.', openPuzzle: true };
            case 'attic.window':
                if (!this.progress.has('puzzleSolved'))
                    return { title: '창문', body: '빗물만 유리를 타고 흐른다.' };
                this.progress.set('chaseStarted');
                return { title: '창밖', body: '나무 사이로 무언가 고개를 든다. 낮게 울리는 숨소리가 창밖을 스쳐 지나가고, 다시 빗소리만 남는다.', autosave: true, sighting: true };
            default:
                return { title: '조사', body: '특별한 것은 없다.' };
        }
    }
    solvePuzzle() {
        this.progress.set('puzzleSolved');
        this.progress.addItem('rustedGateKey');
        this.progress.addItem('truthTriangle');
    }
}
