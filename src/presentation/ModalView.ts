import type { ModalPort } from '../application/ports/Ports.js';

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

  showShadowPuzzle(): Promise<boolean> {
    this.open=true; this.puzzle.classList.remove('hidden');
    const pieces=['△','○','✠']; const slots=['△','△','△']; let mirror=0; let candle=0;
    const render=()=>{
      this.puzzle.innerHTML=`
        <h2>그림자 교차</h2>
        <p>세 목판화를 왼쪽부터 배치하고, 촛대와 거울 각도를 조절해 그림자를 하나의 봉인으로 겹쳐라.</p>
        <div class="puzzle-slots">
          ${slots.map((s,i)=>`<button data-slot="${i}">${['왼쪽','중앙','오른쪽'][i]}: ${s}</button>`).join('')}
        </div>
        <div class="puzzle-slots">
          <button data-mirror="-15">거울 ◀</button><button class="active">거울 ${mirror}°</button><button data-mirror="15">거울 ▶</button>
          <button data-candle="-15">촛대 ◀</button><button class="active">촛대 ${candle}°</button><button data-candle="15">촛대 ▶</button>
        </div>
        <div class="status" id="puzzle-status">문양과 그림자의 겹침을 확인한다.</div>
        <div class="puzzle-slots"><button id="validate">봉인 확인</button><button id="cancel">나중에</button></div>`;
      this.puzzle.querySelectorAll<HTMLButtonElement>('[data-slot]').forEach(btn=>btn.onclick=()=>{ const i=Number(btn.dataset.slot); const current=pieces.indexOf(slots[i] ?? '△'); slots[i]=pieces[(current+1)%pieces.length] ?? '△'; render(); });
      this.puzzle.querySelectorAll<HTMLButtonElement>('[data-mirror]').forEach(btn=>btn.onclick=()=>{ mirror=Math.max(-90,Math.min(90,mirror+Number(btn.dataset.mirror))); render(); });
      this.puzzle.querySelectorAll<HTMLButtonElement>('[data-candle]').forEach(btn=>btn.onclick=()=>{ candle=Math.max(-90,Math.min(90,candle+Number(btn.dataset.candle))); render(); });
    };
    return new Promise(resolve=>{
      const attach=()=>{
        const validate=this.puzzle.querySelector<HTMLButtonElement>('#validate'); const cancel=this.puzzle.querySelector<HTMLButtonElement>('#cancel');
        if (!validate || !cancel) return;
        validate.onclick=()=>{
          const status=this.puzzle.querySelector<HTMLElement>('#puzzle-status');
          const order=slots.join('')==='△○✠'; const aligned=mirror===45 && candle===30;
          if (order && aligned) { this.puzzle.classList.add('hidden'); this.open=false; resolve(true); return; }
          if (status) status.textContent = !order ? '홈의 순서가 맞지 않는다. 벽에 새겨진 △ ○ ✠를 다시 본다.' : '문양은 맞지만 그림자가 갈라져 있다. 거울은 오른쪽 45°, 촛대는 오른쪽 30° 부근에서 겹쳐 보인다.';
        };
        cancel.onclick=()=>{ this.puzzle.classList.add('hidden'); this.open=false; resolve(false); };
      };
      const observer=new MutationObserver(()=>attach()); observer.observe(this.puzzle,{childList:true,subtree:true});
      const originalRender=render; const wrapped=()=>{ originalRender(); attach(); }; void wrapped;
      render(); attach();
      const cleanup=()=>observer.disconnect();
      Promise.resolve().then(()=>{ /* keep observer until resolve path */ });
      void cleanup;
    });
  }

  async showEnding(): Promise<void> {
    await this.showMessage('CHAPTER 1 COMPLETE', '녹슨 관문이 열리고, 비에 잠긴 Ashvale 마을과 멀리 Blackwood Castle의 실루엣이 드러난다. CHAPTER 2로 이어진다.', 'Enter를 눌러 엔딩 화면 닫기');
  }

  private escape(value:string):string { return value.replace(/[&<>'"]/g,ch=>({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[ch] ?? ch)); }
}
