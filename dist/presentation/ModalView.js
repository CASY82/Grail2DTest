export class ModalView {
    overlay;
    puzzle;
    open = false;
    constructor(overlay, puzzle) {
        this.overlay = overlay;
        this.puzzle = puzzle;
    }
    isOpen() { return this.open; }
    showChapterSelect() {
        this.open = true;
        this.overlay.classList.remove('hidden');
        this.overlay.innerHTML = '<h1>GRAIL</h1><p>플레이할 챕터를 선택하세요.</p><div class="chapter-select"><button data-ch="1">GR-1 숲</button><button data-ch="2">GR-2 마을</button><button data-ch="3">GR-3 성</button></div><div class="hint">클릭/터치 · 숫자키 1–3 · 방향키 후 Enter</div>';
        const buttons = [...this.overlay.querySelectorAll('[data-ch]')];
        let selected = 0;
        const focusSelected = () => { buttons[selected]?.focus(); };
        return new Promise(resolve => {
            const choose = (chapter) => {
                window.removeEventListener('keydown', onKey);
                this.overlay.classList.add('hidden');
                this.open = false;
                resolve(chapter);
            };
            const onKey = (event) => {
                if (['Digit1', 'Digit2', 'Digit3', 'Numpad1', 'Numpad2', 'Numpad3'].includes(event.code)) {
                    event.preventDefault();
                    choose(Number(event.code.at(-1)));
                    return;
                }
                if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.code)) {
                    event.preventDefault();
                    selected = (selected + (event.code === 'ArrowLeft' || event.code === 'ArrowUp' ? -1 : 1) + buttons.length) % buttons.length;
                    focusSelected();
                }
                else if (event.code === 'Enter' || event.code === 'Space') {
                    event.preventDefault();
                    choose((selected + 1));
                }
            };
            buttons.forEach((button, index) => button.onclick = () => choose((index + 1)));
            window.addEventListener('keydown', onKey);
            focusSelected();
        });
    }
    showMessage(title, body, hint = 'Enter 또는 E를 눌러 계속') {
        this.open = true;
        this.overlay.classList.remove('hidden');
        this.overlay.innerHTML = `<h1>${this.escape(title)}</h1><p>${this.escape(body)}</p><div class="hint">${this.escape(hint)}</div>`;
        return new Promise(resolve => {
            const close = (e) => {
                if (!['Enter', 'KeyE', 'Escape', 'Space'].includes(e.code))
                    return;
                window.removeEventListener('keydown', close);
                this.overlay.classList.add('hidden');
                this.open = false;
                resolve();
            };
            window.addEventListener('keydown', close);
        });
    }
    showShadowPuzzle(options) {
        const { align, attempt, hintAvailable, mirrorTarget, candleTarget, onFeedback } = options;
        this.open = true;
        this.puzzle.classList.remove('hidden');
        const pieces = ['△', '○', '✠'];
        const slots = ['△', '△', '△'];
        let mirror = 0;
        let candle = 0;
        let candlesExtinguished = 0;
        let statusText = '문양을 놓고 손잡이를 돌리면, 그림자가 그 자리에서 바로 움직인다.';
        const tempWord = (pct) => {
            if (pct >= 97)
                return '완전히 겹쳤다';
            if (pct >= 80)
                return '뜨겁다';
            if (pct >= 55)
                return '따뜻하다';
            if (pct >= 30)
                return '미지근하다';
            if (pct >= 10)
                return '차갑다';
            return '얼음장 같다';
        };
        const renderDial = (label, key, angle, target, aligned) => {
            const r = 62;
            const cx = 78;
            const cy = 76;
            const point = (deg, radius) => {
                const rad = (deg * Math.PI) / 180;
                return { x: cx + radius * Math.sin(rad), y: cy - radius * Math.cos(rad) };
            };
            const ticks = [];
            for (let deg = -90; deg <= 90; deg += 15) {
                const isWorn = hintAvailable && deg === target;
                const outer = point(deg, r);
                const inner = point(deg, isWorn ? r - 15 : r - 8);
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
        const render = () => {
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
            this.puzzle.querySelectorAll('[data-slot]').forEach(btn => btn.onclick = () => { const i = Number(btn.dataset.slot); const current = pieces.indexOf(slots[i] ?? '△'); slots[i] = pieces[(current + 1) % pieces.length] ?? '△'; render(); });
            this.puzzle.querySelectorAll('[data-mirror]').forEach(btn => btn.onclick = () => { mirror = Math.max(-90, Math.min(90, mirror + Number(btn.dataset.mirror))); render(); });
            this.puzzle.querySelectorAll('[data-candle]').forEach(btn => btn.onclick = () => { candle = Math.max(-90, Math.min(90, candle + Number(btn.dataset.candle))); render(); });
            const validate = this.puzzle.querySelector('#validate');
            const cancel = this.puzzle.querySelector('#cancel');
            if (validate)
                validate.onclick = () => {
                    const feedback = attempt({ slots: [...slots], mirrorAngle: mirror, candleAngle: candle });
                    candlesExtinguished = feedback.candlesExtinguished;
                    onFeedback?.(feedback);
                    if (feedback.solved) {
                        this.puzzle.classList.add('hidden');
                        this.open = false;
                        resolve(true);
                        return;
                    }
                    statusText = `${feedback.message} · 겹침 ${feedback.overlapPercent}%`;
                    render();
                };
            if (cancel)
                cancel.onclick = () => { this.puzzle.classList.add('hidden'); this.open = false; resolve(false); };
        };
        let resolve;
        const promise = new Promise(r => { resolve = r; });
        render();
        return promise;
    }
    async showEnding(chapter = 1) {
        const body = chapter === 1 ? '녹슨 관문 너머 Ashvale 마을이 드러난다.' : chapter === 2 ? '마을을 벗어나 Blackwood Castle 안으로 들어선다.' : '문이 열렸다. GRAIL의 첫 여정이 끝난다.';
        await this.showMessage(`CHAPTER ${chapter} COMPLETE`, body, 'Enter를 눌러 챕터 선택으로 돌아가기');
    }
    escape(value) { return value.replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch] ?? ch)); }
}
