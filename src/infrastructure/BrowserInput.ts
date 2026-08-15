import type { InputPort, InputState } from '../application/ports/Ports.js';

export class BrowserInput implements InputPort {
  private readonly down = new Set<string>();
  private readonly pressed = new Set<string>();
  private runToggled = false;

  constructor() {
    window.addEventListener('keydown', (e) => {
      if (!this.down.has(e.code)) this.pressed.add(e.code);
      this.down.add(e.code);
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => this.down.delete(e.code));
    window.addEventListener('blur', () => { this.down.clear(); this.pressed.clear(); });
  }

  poll(): InputState {
    // Shift toggles the run state on press rather than requiring it to be held.
    const leftShiftPressed = this.take('ShiftLeft');
    const rightShiftPressed = this.take('ShiftRight');
    if (leftShiftPressed || rightShiftPressed) this.runToggled = !this.runToggled;
    const result: InputState = {
      up:this.isDown('KeyW','ArrowUp'), down:this.isDown('KeyS','ArrowDown'), left:this.isDown('KeyA','ArrowLeft'), right:this.isDown('KeyD','ArrowRight'),
      run:this.runToggled, crouch:this.down.has('ControlLeft') || this.down.has('ControlRight'),
      interactPressed:this.take('KeyE') || this.take('Enter'), lanternPressed:this.take('KeyF'), escapePressed:this.take('Escape'), debugPressed:this.take('Backquote')
    };
    return result;
  }

  clearPressed(): void { this.pressed.clear(); }

  private isDown(...codes: string[]): boolean { return codes.some(c => this.down.has(c)); }
  private take(code: string): boolean { const hit = this.pressed.has(code); this.pressed.delete(code); return hit; }
}
