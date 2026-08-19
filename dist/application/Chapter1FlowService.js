export class Chapter1FlowService {
    progress;
    constructor(progress) {
        this.progress = progress;
    }
    interact(action) {
        switch (action) {
            case 'bridge.lookBack':
                this.progress.set('bridgeObserved');
                return { title: '붕괴된 다리', body: '강 건너편에서 도적들의 실루엣이 흔들린다. 그들은 더 이상 건너오지 못한다 — 대신 시선이 천천히 움직인다. 숲 안쪽에 남은 짐마차. 곡물도, 도구도, 여벌 옷도. 모두 저쪽에 있었다. 하지만 손은 이미 품속의 옥색 돌 상자를 더 세게 움켜쥐고 있었다. ‘이게 전부다.’ 돌아갈 길은 완전히 끊겼다.' };
            case 'cabin.parchment':
                this.progress.set('cabinVisited');
                return { title: '괴물 양피지', body: '젖은 양피지에는 인간처럼 걷지만 인간이 아닌 것에 대한 경고가 적혀 있다. 봉헌 촛대가 희미하게 타오른다.', autosave: true };
            case 'cabin.lamp':
                this.progress.set('cabinLampSeen');
                return { title: '집 앞의 램프', body: '집 앞에 놓인 램프에는 불이 켜져 있다. 최근까지 사용된 흔적이 분명히 남아 있다. 그러나 램프의 불빛은 바람이 불지 않는데도 아주 미세하게 흔들리고 있었다. 그리고 오두막 안에서는 아무 소리도 들리지 않았다.' };
            case 'cabin.ransacked':
                this.progress.set('cabinRansackedSeen');
                return { title: '뒤집힌 오두막 안', body: '서랍은 전부 열려 있었고 바닥에는 양피지들이 흩어져 있었다. 의자는 넘어져 있었고 책장은 절반쯤 비워져 있었다. 누군가 급하게 집안을 뒤지고 나간 것 같은 현장이다. 가운데 커다란 식탁 아래에도 양피지 더미가 쌓여 있고, 왼쪽 창가의 침대 역시 양피지로 가득하다.' };
            case 'cabin.map':
                this.progress.set('mapFound');
                this.progress.addItem('ashvaleMap');
                return { title: 'Ashvale 지도', body: '양피지 더미를 밟고 미끄러져 넘어진 자리에서 한 장을 집어 들었다. 그 양피지는 Ashvale의 지도였다. Ashvale 주변의 지형과 길이 상세하게 표시되어 있었고, Ashvale로 가는 길목에는 거대한 돌벽 하나가 표시되어 있었다. “여행 시작할 때 이런 돌벽이 있다는 얘기는 듣지 못했는데 말이지.” 지도 상으로 길과 돌벽이 만나는 부분에 열쇠 그림이 그려져 있었다. “열쇠가 필요한 건가. 지금은 열려 있을 수도 있겠지. 일단 가봐야겠군.”', autosave: true };
            case 'cabin.candle':
                return { title: '봉헌 촛대', body: '촛불을 다시 밝혔다. 현재 상태가 저장된다.', autosave: true };
            case 'gate.inspect':
                if (this.progress.owns('rustedGateKey')) {
                    if (!this.progress.has('chaseStarted')) {
                        return { title: '북쪽 관문', body: '열쇠는 손에 들어왔다. 그러나 다락에 무언가를 두고 온 감각이 등에 붙어 떨어지지 않는다. 창밖을 확인하지 않은 채로는 이 문을 열 수 없다.' };
                    }
                    return { title: '북쪽 관문', body: '녹슨 열쇠가 맞물린다. 지도에 표시돼 있던 그 열쇠 그림 그대로다. 철제로 보강된 참나무 문이 무겁게 밀려나고, 관문 너머로 Ashvale 마을과 성의 윤곽이 드러난다.', complete: true };
                }
                this.progress.set('gateChecked');
                return { title: '잠긴 북쪽 관문', body: '정말 비현실적인 광경이었다. 고작 마을 하나를 지키겠다고 성곽을 지어놓은 수준의 벽이었다. 성인 남자 키 두배만한 크기의 벽이었고 굉장히 두꺼웠다. 벽에 있는 유일한 통로인 문은 오래된 참나무로 되어있었고 철제로 보강되어있었다. 딱봐도 부실 수 있을만한 문은 아니었다. “잠겨있군. 어디가서 열쇠를 찾아야 하지…” 첫 오두막의 관리 기록을 다시 확인해야 할 것 같다.', autosave: true };
            case 'cabin.record':
                this.progress.set('routeKnown');
                return { title: '북쪽 관문 관리 기록', body: '책장 가장 아래 칸에서 유독 한 권만이 앞으로 조금 튀어나와 있었다. 표지에는 희미하게 ‘북쪽 관문 관리 기록’이라고 적혀 있다. 습기 때문에 대부분의 글자는 번져 있었지만, 마지막 장의 몇 줄은 겨우 읽을 수 있었다 — ‘북쪽 관문의 예비 열쇠는 벌목장 관리동의 철제 서랍에 보관한다. 관리동으로 가려면 뒤편 울타리를 넘어 벼락 맞은 참나무까지 간 뒤, 얕은 개울을 따라 오래된 수레길로 들어설 것.’', autosave: true };
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
            case 'forest.howl':
                this.progress.set('howlHeard');
                return { title: '나무 사이의 울음', body: '나무 사이에서 늑대의 울음과 비슷한 소리가 메아리쳤다. 그러나 그 울음은 어딘가 이상했다. 너무 길었고, 너무 낮았고, 너무… 인간 같았다.' };
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
            case 'logging.handprints':
                this.progress.set('followerFelt');
                return { title: '따라오는 것', body: '더 안쪽으로 들어갈수록 나무와 돌, 잘린 밑동 위에 검붉은 손자국이 이어졌다. 누군가 크게 다친 채 관리동을 향해 걸어간 것처럼 보였다. 그때 등 뒤에서 젖은 낙엽을 밟는 소리가 들렸다. 그가 멈추자 소리도 멎었다. 다시 걸음을 옮기자, 그것도 일정한 거리를 둔 채 따라오기 시작했다. 결국 뒤를 돌아보았다 — 아무것도 없었다. 흔들리는 나뭇가지와 그가 지나온 발자국만 보였다. 하지만 다시 앞을 향했을 때, 조금 전까지 없었던 피 묻은 손자국 하나가 바로 옆 나무에 찍혀 있었다.' };
            case 'logging.cabinB':
                this.progress.set('cabinBObserved');
                return { title: '공터의 둘째 오두막', body: '수레길 끝에서 서로를 향해 기울어진 두 그루의 고사목이 나타났다. 그 사이에는 녹슨 쇠사슬이 끊어진 채 늘어져 있다 — 과거 벌목장 경계를 표시하던 출입구인 듯하다. 그 너머 공터 한가운데에 첫 번째 오두막보다 훨씬 크고 높은 삼층 구조의 오두막이 서 있다. 낡은 이층 위로 비뚤어진 지붕과 작은 다락방 창문이 솟아 있고, 다락방 창문 안쪽에서는 불빛과 비슷한 것이 잠깐 흔들리다 사라졌다. 외벽에는 검붉게 말라붙은 핏자국이 길게 번져 있고, 닫힌 문틈으로는 썩은 고기와 곰팡이가 뒤섞인 듯한 악취가 흘러나온다.' };
            case 'logging.plaque':
                this.progress.set('plaqueSeen');
                return { title: '녹이 슨 명패', body: '현관 옆에는 녹이 슨 명패가 비스듬히 매달려 있었다. ‘북부 벌목장 관리동.’ 기록에서 읽은 이름 그대로다. 예비 열쇠가 보관되었다면 바로 이곳이었다. “……빌어먹을.”' };
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
            case 'store.barrels':
                this.progress.set('storeBarrelsSeen');
                return { title: '곰팡이 핀 오크통', body: '곰팡이가 핀 오크통과 나무 궤짝들이 발 디딜 틈 없이 쌓여 있다. 숨을 얕게 쉬며 궤짝들을 밀어내고 마지막 오크통을 옆으로 굴리자, 바닥에 넓게 말라붙은 핏자국이 드러났다.' };
            case 'store.tools':
                this.progress.set('storeToolsSeen');
                return { title: '벽에 걸린 톱과 도끼', body: '벽에는 톱과 도끼가 걸려 있었다. 날에는 검붉은 피와 말라붙은 살점이 엉겨 있었다. 한쪽에는 피를 잔뜩 흡수해 뻣뻣해진 밧줄 다발과 정체불명의 고깃덩어리가 섞인 약초 꾸러미가 놓여 있다.' };
            case 'store.mannequin':
                this.progress.set('storeMannequinSeen');
                return { title: '낡은 마네킹', body: '구석의 낡은 마네킹은 팔다리가 기괴한 방향으로 꺾인 채 벽에 기대어 있었다. 사람이 아니라는 것을 알면서도 눈을 떼기가 어렵다.' };
            case 'cellar.crates':
                this.progress.set('cellarCratesSeen');
                return { title: '소금에 절인 식량', body: '소금에 절인 식량 상자들이 줄지어 쌓여 있다. 마지막 상자 하나만 뚜껑이 안쪽에서 긁힌 자국투성이다.' };
            case 'cellar.marks':
                this.progress.set('cellarMarksSeen');
                return { title: '벽의 손톱자국', body: '돌벽 낮은 곳에 손톱으로 그은 자국이 수십 줄 새겨져 있다. 날짜를 세던 것처럼, 또는 다른 무언가처럼.' };
            case 'b2.watchHint':
                this.progress.set('triangleHintFound');
                return { title: '벽난로 위의 회중시계', body: '‘멈춘 시간.’ 서재 벽난로 위에서 멈춰 버린 회중시계를 발견했다. 시계 뒷면에는 아직 닦이지 않은 피가 끈적하게 묻어 있었다.' };
            case 'rear.mildewHint':
                this.progress.set('circleHintFound');
                return { title: '곰팡내가 유독 진한 구석', body: '침상 발치 쪽 바닥에서 유독 눅눅하고 시큼한 냄새가 올라온다. 오래 방치된 무언가가 안쪽에서 썩어가고 있는 냄새다.' };
            case 'wing.waxHint':
                this.progress.set('crossHintFound');
                return { title: '두껍게 굳은 촛농', body: '기도대 앞바닥에 촛농이 유난히 두껍게 굳어 쌓여 있다. 누군가 이 자리에서 오래도록, 몇 번이고 무릎을 꿇었던 흔적이다.' };
            case 'wing.clockDecoy':
                this.progress.set('wingClockDecoySeen');
                return { title: '아직 가는 회중시계', body: '서재 책상 서랍의 회중시계. 낡았지만 바늘은 여전히 째깍이며 돌고 있다. 뒷면도 깨끗하다 — 멈춘 시간이 아니다.' };
            case 'wing.bagDecoy':
                this.progress.set('wingBagDecoySeen');
                return { title: '말끔한 짐 꾸러미', body: '선반 위에 짐 꾸러미가 하나 더 놓여 있다. 가죽끈도 멀쩡하고 곰팡내도 나지 않는다 — 최근에 챙긴 짐이지, 오래 방치돼 썩은 짐이 아니다.' };
            case 'wing.statueDecoy':
                this.progress.set('wingStatueDecoySeen');
                return { title: '팔 없는 성인상', body: '구석의 작은 성인상은 두 팔이 부러져 나갔다. 하지만 고개는 그대로다 — 목이 잘린 형상이 아니다.' };
            case 'b2.clockDecoy':
                this.progress.set('b2ClockDecoySeen');
                return { title: '깨진 회중시계', body: '2층 선반의 회중시계는 유리가 깨지고 바늘이 부러져 나갔다. 멈춘 것이 아니라 망가진 것이다. 뒤쪽에는 먼지만 쌓여 있다.' };
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
                return { title: '다락의 빈 받침대', body: '서랍장 위쪽 벽에 삼각형, 원, 뱀이 감긴 십자가 깊게 새겨져 있고, 각 도형 아래에는 얇은 나무판을 세울 수 있을 만한 빈 받침대가 하나씩 놓여 있다. 그 사이에 세워진 작고 오래된 거울의 테두리에는 짧은 문장이 칼로 새겨져 있었다 — ‘셋은 서로 다른 형상을 지녔으나, 빛 앞에서는 하나의 봉인이 된다.’ 서랍장 옆면에는 다른 문장도 있었다 — ‘멈춘 시간 뒤에 첫째가 숨고, 썩은 짐 아래에 둘째가 잠들며, 목 잃은 기도 아래에 마지막이 엎드려 있다.’ 이곳에 세워야 할 물건들이 아래층 어딘가에 숨겨져 있는 것이 분명했다. 받침대 가장자리에도 뭔가 새겨진 것 같다 — 손끝으로 훑어봐야 알 것 같다.' };
            case 'attic.mechanism':
                this.progress.set('mechanismExamined');
                return { title: '받침대의 눈금', body: '거울과 촛대가 앉는 두 홈 테두리에 눈금이 촘촘히 새겨져 있다. 15도씩, 열세 칸. 그런데 유독 두 칸만 반들거린다 — 거울 쪽은 가운데서 오른쪽으로 세 칸, 촛대 쪽은 두 칸. 누군가 이 두 자리에만 셀 수 없이 손을 얹었던 흔적이다.' };
            case 'woodcut.triangle':
                this.progress.addItem('woodcutTriangle');
                return { title: '△ 목판화', body: '멈춘 회중시계를 들어 올리자 벽과 선반 사이에 얇은 나무판 하나가 끼워져 있는 것이 보였다. 삼각형 문양이 새겨진 낡은 목판화였다. 나무 받침 안쪽에 누군가 “미안하다”고 긁어 놓았다.' };
            case 'woodcut.circle':
                this.progress.addItem('woodcutCircle');
                return { title: '○ 목판화', body: '창고 마지막 오크통을 굴려 드러난 핏자국 아래로 나무판의 둥근 테두리가 희미하게 비쳤다. 칼끝을 틈에 밀어 넣고 바닥에 들러붙은 그것을 힘껏 뜯어냈다 — 원형 문양이 새겨진 두 번째 목판화였다.' };
            case 'woodcut.cross':
                this.progress.addItem('woodcutCross');
                return { title: '✠ 목판화', body: '기도실의 목 잘려 나간 여신상 밑동을 양손으로 붙잡아 들어 올리자, 그 아래 파인 틈새에서 뱀이 감긴 십자 문양의 마지막 목판화가 모습을 드러냈다. 여신상의 목은 깨진 것이 아니라, 도구로 정교하게 잘려 나간 흔적이다.' };
            case 'cabinB1.diary':
                return { title: '책상 위 낡은 일기', body: '“…다락의 것을 가두려면 순서보다 각도가 문제였다. 거울과 촛불이 서로를 정확히 겨눠야 그림자가 하나로 접힌다. 몇 번이고 돌려 보다 눈금을 다 닳게 했다…” 뒷장은 물에 젖어 알아볼 수 없다.' };
            case 'attic.puzzle':
                if (!this.progress.hasAllWoodcuts()) {
                    return { title: '그림자 봉인', body: '세 홈이 비어 있다. △ ○ ✠ 목판화를 모두 찾아야 한다.' };
                }
                if (this.progress.has('puzzleSolved')) {
                    return { title: '열린 서랍', body: '이미 열린 서랍 안쪽에서 차가운 바람이 새어 나온다. 꺼내 든 붉게 물든 녹슨 열쇠는 지도에 표시된 북쪽 관문의 열쇠와 같은 모양이었다.' };
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
