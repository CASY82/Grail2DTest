export interface ShadowPuzzleInput { slots: readonly string[]; mirrorAngle: number; candleAngle: number; }

/**
 * Pure, side-effect-free snapshot of how close the current dial/slot state is to the answer.
 * Safe to recompute on every single adjustment (slot cycle, ±15° step) to drive live 2D
 * visual feedback in the modal — the player never has to "commit" a guess to learn whether
 * they are getting warmer or colder.
 */
export interface ShadowPuzzleAlignment {
  orderCorrect: boolean;
  mirrorAligned: boolean;
  candleAligned: boolean;
  mirrorError: number;
  candleError: number;
  /** 0-100 combined "seal strength". Only rises once the woodcut order is correct — a wrong
   *  symbol casts a shadow of the wrong shape entirely, no matter the angle. */
  overlapPercent: number;
  solved: boolean;
}

export type ShadowPuzzleEvent = 'none' | 'candles-flicker' | 'threat-approaches';
export interface ShadowPuzzleFeedback extends ShadowPuzzleAlignment {
  failures: number;
  candlesExtinguished: number;
  event: ShadowPuzzleEvent;
  message: string;
}

export class ShadowPuzzleService {
  static readonly ANSWER = { slots: ['△', '○', '✠'], mirrorAngle: 45, candleAngle: 30 } as const;
  static readonly TOLERANCE = 7.5;
  static readonly STEP_DEGREES = 15;
  private failures = 0;

  /** Live read — call as often as the UI needs, never mutates state. */
  align(input: ShadowPuzzleInput): ShadowPuzzleAlignment {
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
  attempt(input: ShadowPuzzleInput): ShadowPuzzleFeedback {
    const alignment = this.align(input);
    if (alignment.solved) {
      return { ...alignment, failures: this.failures, candlesExtinguished: 0, event: 'none', message: '세 그림자가 하나의 봉인으로 겹쳤다.' };
    }
    this.failures += 1;
    const event: ShadowPuzzleEvent = this.failures % 3 === 0 ? 'threat-approaches' : 'candles-flicker';
    const reason = !alignment.orderCorrect
      ? '홈의 순서가 어긋나 그림자가 서로 다른 모양으로 갈라진다.'
      : '문양은 맞지만 그림자가 아직 완전히 겹치지 않는다.';
    const message = `${reason} 세 촛불이 흔들리다 꺼진다.${event === 'threat-approaches' ? ' 차가운 기척이 가까워진다.' : ''}`;
    return { ...alignment, failures: this.failures, candlesExtinguished: 3, event, message };
  }
}
