export class Chapter1Progress {
    flags = new Set();
    items = new Set();
    has(flag) { return this.flags.has(flag); }
    set(flag) { this.flags.add(flag); }
    owns(item) { return this.items.has(item); }
    addItem(item) { this.items.add(item); }
    hasAllWoodcuts() {
        return this.owns('woodcutTriangle') && this.owns('woodcutCircle') && this.owns('woodcutCross');
    }
    objective() {
        if (this.has('chapterComplete'))
            return 'CHAPTER 1 COMPLETE';
        if (this.has('chaseStarted'))
            return '녹슨 열쇠를 들고 다시 북쪽 관문으로 향하라.';
        if (this.has('puzzleSolved'))
            return '창밖의 인기척을 확인하라.';
        if (this.hasAllWoodcuts())
            return '다락으로 돌아가 △ ○ ✠ 그림자 봉인을 완성하라.';
        if (this.has('atticClueSeen'))
            return '일층 서재 · 창고 · 기도실에서 △ ○ ✠ 목판화를 찾아라.';
        if (this.has('routeKnown'))
            return '옛 벌목로의 랜드마크를 따라 둘째 오두막으로 이동하라.';
        if (this.has('gateChecked'))
            return '첫 오두막으로 돌아가 북쪽 관문 관리 기록을 찾아라.';
        if (this.has('mapFound'))
            return '지도에 표시된 북쪽 관문을 찾아 상태를 확인하라.';
        if (this.has('cabinVisited'))
            return '흩어진 양피지 더미에서 Ashvale 지도를 찾아 챙겨라.';
        return '숲을 따라 첫 오두막을 찾아라.';
    }
}
