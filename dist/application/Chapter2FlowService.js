import { SequencePuzzleService } from './SequencePuzzleService.js';
export class Chapter2FlowService {
    p;
    wine = new SequencePuzzleService(['V', 'II', 'IV', 'I', 'III', 'VI']);
    names = new SequencePuzzleService(['eleanor', 'isaac', 'martha', 'thomas']);
    constructor(p) {
        this.p = p;
    }
    interact(a) {
        if (a.startsWith('wine.shelf')) {
            const n = a.slice(10);
            const f = this.wine.click(n);
            if (f.solved)
                this.p.set('wineOrderSolved');
            return { title: `와인 선반 ${n}`, body: f.solved ? '여섯 병목이 차례로 내려앉고 VI 선반의 뱀 상자가 돌아간다.' : f.reset ? '병이 깨지는 소리와 함께 장치가 처음으로 돌아간다. 근처 발소리가 빨라진다.' : `맞물렸다. ${f.progress}/6`, sighting: f.reset };
        }
        if (a.startsWith('civic.name.')) {
            const n = a.slice(11);
            const f = this.names.click(n);
            if (f.solved) {
                this.p.set('fourNamesKnown');
                this.p.addItem('truthCross');
            }
            return { title: '원형 명패', body: f.solved ? '엘리노어, 아이작, 마사, 토머스. 네 이름이 이어지고 ✠ 진실 조각이 떨어진다.' : f.reset ? '울음이 번지며 순서가 지워진다.' : '이름 하나가 기록에 이어졌다.' };
        }
        switch (a) {
            case 'square.candle':
            case 'inn.candle': return { title: '봉헌 촛대', body: '불꽃을 바로 세웠다. 현재 여정이 저장된다.', autosave: true };
            case 'market.ledger':
                this.p.set('blackLambClueKnown');
                return { title: '잡화점 장부', body: '“검은 양의 지하, 북쪽 별에서 시작하라.” 여관 저장고를 가리킨다.', autosave: true };
            case 'alley.mirror':
                this.p.set('hollowSighted');
                return { title: '금 간 거울', body: '내 뒤에 길쭉한 얼굴이 서 있다. 돌아보는 순간 그것도 움직이기 시작한다.', startPursuit: true };
            case 'house.hide':
                this.p.set('hidSuccessfully');
                return { title: '침대 밑', body: '젖은 발이 문턱에서 멈췄다가 천천히 멀어진다.' };
            case 'house.diary':
                this.p.set('diaryRead');
                this.p.addItem('truthCircle');
                return { title: '모리스의 일기', body: 'VIRAX는 병이 아니라 문이었다. 일기 표지에서 ○ 진실 조각을 얻었다.', autosave: true };
            case 'wine.hint':
                this.p.set('wineHintRead');
                return { title: '방향 시구', body: '북쪽 별 V, 남쪽 그림자 II, 서쪽 불 IV, 동쪽 물 I, 중앙 심장 III, 봉인된 뱀 VI.' };
            case 'wine.serpentBox':
                this.p.set('ironGateKeyTaken');
                this.p.addItem('ironGateKey');
                return { title: '뱀 나무 상자', body: '상자가 돌아가며 철제 성문 열쇠가 드러난다.', autosave: true };
            case 'escape.lamp':
                this.p.set('innFireStarted');
                return { title: '떨어진 등잔', body: '불길 뒤로 거대한 입이 닫힌다. 환풍구는 아직 열려 있다.' };
            case 'civic.record': return { title: '붉은 줄의 기록', body: '네 희생자의 순서는 엘리노어, 아이작, 마사, 토머스다.', autosave: true };
            case 'gate2.slot':
                this.p.set('gateTried');
                if (!['truthTriangle', 'truthCircle', 'truthCross'].every(x => this.p.owns(x)))
                    return { title: '세 진실의 석판', body: '아직 채우지 못한 진실이 있다.' };
                this.p.set('truthSlotLit');
                if (!this.p.has('fourNamesKnown'))
                    return { title: '빛나는 석판', body: '세 홈은 빛나지만 문은 움직이지 않는다. 이름이 없다.' };
                this.p.set('nameSlotSolved');
                return { title: '열린 청동문', body: '세 진실과 네 이름이 맞물려 성문이 열린다.', autosave: true };
            case 'chase2.gate':
                this.p.set('chapter2Complete');
                return { title: 'Blackwood 성문', body: '깨어난 마을의 울음 뒤로 청동 성문이 닫힌다.', complete: true };
            default: return { title: '조사', body: '사라진 마을 사람들의 흔적만 남아 있다.' };
        }
    }
}
