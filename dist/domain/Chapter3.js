export class Chapter3Progress {
    flags = new Set();
    items = new Set();
    has(f) { return this.flags.has(f); }
    set(f) { this.flags.add(f); }
    owns(i) { return this.items.has(i); }
    addItem(i) { this.items.add(i); }
    objective() {
        if (this.has('chapter3Complete'))
            return 'GRAIL COMPLETE';
        if (this.has('boxOpened'))
            return '열린 문 너머의 목소리를 마주하라.';
        if (this.has('ritualEntered'))
            return '의식 장치 앞에 무릎 꿇어라.';
        if (this.has('reginaldEncountered'))
            return '봉쇄된 성의 지하로 내려가라.';
        if (this.has('journalRead'))
            return '커튼 뒤 인기척을 확인하라.';
        return '성의 상층을 탐색하고 2층 집무실을 조사하라.';
    }
}
