export class Chapter3FlowService {
    p;
    constructor(p) {
        this.p = p;
    }
    interact(a, agencyLocked = false) {
        switch (a) {
            case 'gate3.chain':
                this.p.set('gateSealed');
                return { title: '당겨진 체인', body: '청동 성문이 등 뒤에서 닫힌다. 되돌아갈 수 없다.', autosave: true };
            case 'hall.portrait':
                this.p.set('portraitSeen');
                return { title: '엘리노어 초상화', body: '눈동자 위의 바니시만 새것처럼 젖어 있다.' };
            case 'hall.footprints':
                this.p.set('footprintsSeen');
                return { title: '젖은 발자국', body: '성 안쪽으로 향한 흔적만 있고 돌아온 흔적은 없다.' };
            case 'hall.candle': return { title: '봉헌 촛대', body: '대현관의 촛불을 밝혔다.', autosave: true };
            case 'dining.embers':
                this.p.set('emberSeen');
                return { title: '따뜻한 재', body: '수십 년 비어 있던 벽난로의 재가 아직 따뜻하다.' };
            case 'parlor.mannequin':
                this.p.set('mannequinSeen');
                return { title: '마네킹', body: '고개가 조금 전보다 가까운 쪽을 향한다.' };
            case 'study.journal':
                this.p.set('journalRead');
                return { title: '레지널드의 일지', body: '“엘리노어는 그릇이 아니라 열쇠다.” 마지막 잉크가 아직 마르지 않았다.', autosave: true };
            case 'study.reginald':
                this.p.set('reginaldEncountered');
                return { title: '커튼 뒤의 레지널드', body: '“너무 늦었군.” 실루엣이 계단 쪽을 가리킨다.', autosave: true, sighting: true };
            case 'descent.doors':
                this.p.set('doorsChorusSeen');
                return { title: '문의 합창', body: '양옆의 문들이 차례로 열리고 회색 손들이 계단을 더듬는다.' };
            case 'sealed.frontDoor':
                this.p.set('frontBlockedSeen');
                return { title: '봉쇄된 정문', body: '청록 안개가 문손잡이를 삼킨다.' };
            case 'sealed.serviceDoor':
                this.p.set('serviceDoorFound');
                return { title: '숨은 서비스 문', body: '초상화 아래 벽선이 문처럼 갈라진다.' };
            case 'service.silence':
                this.p.set('silenceNoted');
                return { title: '완전한 침묵', body: '발소리조차 뒤늦게 들린다.', autosave: true };
            case 'lab.pedestal':
                this.p.set('pedestalSeen');
                return { title: '빈 받침대', body: '무언가를 기다리는 원형 홈이 있다.' };
            case 'lab.eleanor':
                this.p.set('eleanorConfirmed');
                return { title: '엘리노어의 흔적', body: '유리관 명패의 이름과 초상화의 얼굴이 일치한다.', autosave: true };
            case 'ritual.approach':
                this.p.set('ritualEntered');
                return { title: '삼중 링', body: '생명나무와 뱀십자가 새겨진 장치가 천천히 돈다.', autosave: true };
            case 'ritual.kneel':
                this.p.set('boxOpened');
                return { title: '스스로 열린 상자', body: '옥색 상자가 떨어져 열리고 몸의 힘이 빠져나가기 시작한다.' };
            case 'ritual.dial': return { title: '저항', body: agencyLocked ? '손잡이는 돌아갔지만 장치는 아무 결과도 받아들이지 않는다.' : '링이 잠시 흔들리지만 곧 제자리로 돌아온다.' };
            case 'ritual.witness':
                this.p.set('chapter3Complete');
                return { title: '열린 문', body: '암전 직전 레지널드의 목소리가 들린다. “문이 열렸군요.”', complete: true };
            default: return { title: '조사', body: 'Blackwood의 오래된 침묵이 내려앉아 있다.' };
        }
    }
}
