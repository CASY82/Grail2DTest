export class Chapter3Progress {
    flags = new Set();
    items = new Set();
    ritualBeatRaw = 0;
    has(f) { return this.flags.has(f); }
    set(f) { this.flags.add(f); }
    owns(i) { return this.items.has(i); }
    addItem(i) { this.items.add(i); }
    /**
     * 의식실 클라이맥스의 비트 순서(접근1→레지널드2→상자3→안치4→저항5→각성).
     * 세이브에는 ProgressFlag만 저장되므로, 저장된 플래그에서 하한을 되살려
     * 중간에 다시 불러와도 시퀀스가 영구히 막히지 않게 한다.
     */
    get ritualBeat() { return Math.max(this.ritualBeatRaw, this.has('boxOpened') ? 3 : this.has('ritualEntered') ? 1 : 0); }
    advanceRitual(beat) { this.ritualBeatRaw = Math.max(this.ritualBeatRaw, beat); }
    objective() {
        if (this.has('chapter3Complete'))
            return 'GRAIL COMPLETE';
        if (this.has('boxOpened'))
            return '받침대 위에서 벌어지는 일을 끝까지 지켜보라.';
        if (this.has('ritualEntered'))
            return '등 뒤의 발소리를 확인하라.';
        if (this.has('eleanorConfirmed'))
            return '실험실 안쪽의 의식실로 들어가라.';
        if (this.has('silenceNoted'))
            return '푸른 횃불의 복도 끝, 실험실로 내려가라.';
        if (this.has('serviceDoorFound'))
            return '초상화 아래의 작은 문으로 지하로 내려가라.';
        if (this.has('reginaldEncountered'))
            return '봉쇄된 성의 지하로 내려가라.';
        if (this.has('journalRead'))
            return '커튼 그림자 속의 인기척을 확인하라.';
        if (this.has('gateSealed'))
            return '성의 상층을 탐색하고 2층 집무실의 일지를 읽어라.';
        return '안쪽 벽에 걸린 체인을 당겨 청동 성문을 닫아라.';
    }
}
