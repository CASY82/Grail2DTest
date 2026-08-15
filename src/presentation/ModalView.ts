import type { ModalPort, ShadowPuzzleModalOptions } from '../application/ports/Ports.js';

export class ModalView implements ModalPort {
  private open = false;
  constructor(private readonly overlay: HTMLElement, private readonly puzzle: HTMLElement) {}
  isOpen(): boolean { return this.open; }

  showMessage(title: string, body: string, hint = 'Enter 또는 E를 눌러 계속'): Promise<void> {
    this.open = true; this.overlay.classList.remove('hidden');
    this.overlay.innerHTML = `<h1>${this.escape(title)}</h1><p>${this.escape(body)}</p><div class="hint">${this.escape(hint)}</div>`;
    return new Promise(resolve => {
      const close = (e: KeyboardEvent) => {
        if (!['Enter','KeyE','Escape','Space'].includes(e.code)) return;
        window.removeEventListener('keydown', close); this.overlay.classList.add('hidden'); this.open=false; resolve();
      };
      window.addEventListener('keydown', close);
    });
  }

  showShadowPuzzle(options: ShadowPuzzleModalOptions): Promise<boolean> {
    const { align, attempt, hintAvailable, mirrorTarget, candleTarget, onFeedback } = options;
    this.open = true; this.puzzle.classList.remove('hidden');
    const pieces = ['△', '○', '✠'];
    const slots = ['△', '△', '△'];
    let mirror = 0; let candle = 0; let candlesExtinguished = 0;
    let statusText = '문양을 놓고 손잡이를 돌리면, 그림자가 그 자리에서 바로 움직인다.';

    const tempWord = (pct: number): string => {
      if (pct >= 97) return '완전히 겹쳤다';
      if (pct >= 80) return '뜨겁다';
      if (pct >= 55) return '따뜻하다';
      if (pct >= 30) return '미지근하다';
      if (pct >= 10) return '차갑다';
      return '얼음장 같다';
    };

    const renderDial = (label: string, key: 'mirror' | 'candle', angle: number, target: number, aligned: boolean): string => {
      const r = 62; const cx = 78; const cy = 76;
      const point = (deg: number, radius: number) => {
        const rad = (deg * Math.PI) / 180;
        return { x: cx + radius * Math.sin(rad), y: cy - radius * Math.cos(rad) };
      };
      const ticks: string[] = [];
      for (let deg = -90; deg <= 90; deg += 15) {
        const isWorn = hintAvailable && deg === target;
        const outer = point(deg, r); const inner = point(deg, isWorn ? r - 15 : r - 8);
        ticks.push(`<line x1="${inner.x.toFixed(1)}" y1="${inner.y.toFixed(1)}" x2="${outer.x.toFixed(1)}" y2="${outer.y.toFixed(1)}" stroke="${isWorn ? '#d9b568' : '#54635e'}" stroke-width="${isWorn ? 3 : 1.4}" />`);
      }
      const needle = point(angle, r - 6);
      const needleColor = aligned ? '#7fd6b8' : '#cfd6d3';
      return `<div class="dial">
        <svg viewBox="0 0 156 88" width="156" height="88" role="img" aria-label="${this.escape(label)} 각도 ${angle}도">
          <path d="M ${(cx - r).toFixed(1)} ${cy} A ${r} ${r} 0 0 1 ${(cx + r).toFixed(1)} ${cy}" fill="none" stroke="#39433f" stroke-width="1" />
          ${ticks.join('')}
          <line x1="${cx}" y1="${cy}" x2="${needle.x.toFixed(1)}" y2="${needle.y.toFixed(1)}" stroke="${needleColor}" stroke-width="3" />
          <circle cx="${cx}" cy="${cy}" r="4" fill="${needleColor}" />
        </svg>
        <div class="dial-label">${this.escape(label)} ${angle}°${aligned ? ' · 정렬됨' : ''}</div>
        <div class="puzzle-slots"><button data-${key}="-15">◀ 15°</button><button data-${key}="15">15° ▶</button></div>
      </div>`;
    };

    const render = (): void => {
      const alignment = align({ slots: [...slots], mirrorAngle: mirror, candleAngle: candle });
      this.puzzle.innerHTML = `
        <h2>그림자 봉인</h2>
        <p>목판화 세 개를 순서대로 놓고, 거울과 촛대의 손잡이를 돌려 그림자를 하나로 겹쳐라. 확인 없이도 지금 얼마나 가까운지 바로 보인다.</p>
        <div class="puzzle-slots">
          ${slots.map((s, i) => `<button data-slot="${i}">${['왼쪽', '중앙', '오른쪽'][i]}: ${s}</button>`).join('')}
        </div>
        <div class="order-status">${alignment.orderCorrect ? '문양 순서 · 맞음' : '문양 순서 · 아직 어긋나 있다'}</div>
        <div class="puzzle-dials">
          ${renderDial('거울', 'mirror', mirror, mirrorTarget, alignment.mirrorAligned)}
          ${renderDial('촛대', 'candle', candle, candleTarget, alignment.candleAligned)}
        </div>
        <div class="overlap-meter">
          <div class="overlap-label">겹침 ${alignment.overlapPercent}% · ${tempWord(alignment.overlapPercent)}</div>
          <div class="overlap-bar"><div class="overlap-fill" style="width:${alignment.overlapPercent}%"></div></div>
        </div>
        <div id="puzzle-candles" aria-live="polite">촛불: ${Array.from({ length: 3 }, (_, i) => i < candlesExtinguished ? '·' : '🕯️').join(' ')}</div>
        <div class="status" id="puzzle-status">${this.escape(statusText)}</div>
        <div class="puzzle-slots"><button id="validate">봉인 확인</button><button id="cancel">나중에</button></div>`;
      this.puzzle.querySelectorAll<HTMLButtonElement>('[data-slot]').forEach(btn => btn.onclick = () => { const i = Number(btn.dataset.slot); const current = pieces.indexOf(slots[i] ?? '△'); slots[i] = pieces[(current + 1) % pieces.length] ?? '△'; render(); });
      this.puzzle.querySelectorAll<HTMLButtonElement>('[data-mirror]').forEach(btn => btn.onclick = () => { mirror = Math.max(-90, Math.min(90, mirror + Number(btn.dataset.mirror))); render(); });
      this.puzzle.querySelectorAll<HTMLButtonElement>('[data-candle]').forEach(btn => btn.onclick = () => { candle = Math.max(-90, Math.min(90, candle + Number(btn.dataset.candle))); render(); });
      const validate = this.puzzle.querySelector<HTMLButtonElement>('#validate');
      const cancel = this.puzzle.querySelector<HTMLButtonElement>('#cancel');
      if (validate) validate.onclick = () => {
        const feedback = attempt({ slots: [...slots], mirrorAngle: mirror, candleAngle: candle });
        candlesExtinguished = feedback.candlesExtinguished;
        onFeedback?.(feedback);
        if (feedback.solved) { this.puzzle.classList.add('hidden'); this.open = false; resolve(true); return; }
        statusText = `${feedback.message} · 겹침 ${feedback.overlapPercent}%`;
        render();
      };
      if (cancel) cancel.onclick = () => { this.puzzle.classList.add('hidden'); this.open = false; resolve(false); };
    };
    let resolve!: (value: boolean) => void;
    const promise = new Promise<boolean>(r => { resolve = r; });
    render();
    return promise;
  }

  async showEnding(): Promise<void> {
    await this.showMessage('CHAPTER 1 COMPLETE', '녹슨 관문이 열리고, 비에 잠긴 Ashvale 마을과 멀리 Blackwood Castle의 실루엣이 드러난다. CHAPTER 2로 이어진다.', 'Enter를 눌러 엔딩 화면 닫기');
  }

  private escape(value:string):string { return value.replace(/[&<>'"]/g,ch=>({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[ch] ?? ch)); }
}
