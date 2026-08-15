export class ShadowPuzzleService {
    static ANSWER = { slots: ['△', '○', '✠'], mirrorAngle: 45, candleAngle: 30 };
    static TOLERANCE = 7.5;
    static STEP_DEGREES = 15;
    failures = 0;
    /** Live read — call as often as the UI needs, never mutates state. */
    align(input) {
        const orderCorrect = input.slots.join('') === ShadowPuzzleService.ANSWER.slots.join('');
        const mirrorError = Math.abs(input.mirrorAngle - ShadowPuzzleService.ANSWER.mirrorAngle);
        const candleError = Math.abs(input.candleAngle - ShadowPuzzleService.ANSWER.candleAngle);
        const mirrorAligned = mirrorError <= ShadowPuzzleService.TOLERANCE;
        const candleAligned = candleError <= ShadowPuzzleService.TOLERANCE;
        const overlapPercent = orderCorrect ? Math.round(Math.max(0, 100 - (mirrorError + candleError))) : 0;
        return { orderCorrect, mirrorAligned, candleAligned, mirrorError, candleError, overlapPercent, solved: orderCorrect && mirrorAligned && candleAligned };
    }
    /** Commits a sealing attempt (the "봉인 확인" lever). By the time the player pulls it they
     *  already know from the live dial whether they are aligned, so failing here is a deliberate
     *  choice, not a blind guess. Escalates a purely atmospheric audio cue every third miss —
     *  never movement, never pursuit. */
    attempt(input) {
        const alignment = this.align(input);
        if (alignment.solved) {
            return { ...alignment, failures: this.failures, candlesExtinguished: 0, event: 'none', message: '세 그림자가 하나의 봉인으로 겹쳤다.' };
        }
        this.failures += 1;
        const event = this.failures % 3 === 0 ? 'threat-approaches' : 'candles-flicker';
        const reason = !alignment.orderCorrect
            ? '홈의 순서가 어긋나 그림자가 서로 다른 모양으로 갈라진다.'
            : '문양은 맞지만 그림자가 아직 완전히 겹치지 않는다.';
        const message = `${reason} 세 촛불이 흔들리다 꺼진다.${event === 'threat-approaches' ? ' 차가운 기척이 가까워진다.' : ''}`;
        return { ...alignment, failures: this.failures, candlesExtinguished: 3, event, message };
    }
}
