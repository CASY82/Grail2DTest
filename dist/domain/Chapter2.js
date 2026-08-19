export class Chapter2Progress {
    flags = new Set(['villageArrived']);
    items = new Set(['truthTriangle']);
    has(f) { return this.flags.has(f); }
    set(f) { this.flags.add(f); }
    owns(i) { return this.items.has(i); }
    addItem(i) { this.items.add(i); }
    /** 원문 비트 순서: 광장 → 북쪽 외성문 시도 → 게시판 → 동쪽 상점가 → 조우 → 폐가 → 서쪽 여관 → 남쪽 시청 → 성문. */
    objective() {
        if (this.has('chapter2Complete'))
            return 'CHAPTER 2 COMPLETE';
        if (this.has('nameSlotSolved'))
            return '깨어난 마을을 지나 Blackwood Castle로 달려라.';
        if (this.has('fourNamesKnown'))
            return '성문 석판의 세 홈과 네 석상의 명패를 채워라.';
        if (this.has('innFireStarted'))
            return '불타는 여관을 등지고, 광장 남쪽 시청에서 네 증인의 이름을 찾아라.';
        if (this.has('ironGateKeyTaken'))
            return '저장고에 불을 놓고 작은 통풍창으로 빠져나가라.';
        if (this.has('wineOrderSolved'))
            return '봉인된 뱀 상자를 돌려 성문 열쇠를 꺼내라.';
        if (this.owns('truthCircle'))
            return '서쪽 The Black Lamb 지하 저장고에서 와인 선반의 순서를 맞춰라.';
        if (this.has('hollowSighted'))
            return '뒷골목 끝 폐가로 몸을 숨기고 T. 모리스의 일기를 찾아라.';
        if (this.has('blackLambClueKnown'))
            return '상점가 뒷골목으로 이어지는 길을 살펴라.';
        if (this.has('gateTried'))
            return '동쪽 상점가에서 성문 열쇠의 행방을 찾아라.';
        return '광장 북쪽 길 끝의 외성문을 확인하라.';
    }
}
