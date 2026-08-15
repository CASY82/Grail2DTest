export class BrowserInput {
    down = new Set();
    pressed = new Set();
    constructor() {
        window.addEventListener('keydown', (e) => {
            if (!this.down.has(e.code))
                this.pressed.add(e.code);
            this.down.add(e.code);
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code))
                e.preventDefault();
        });
        window.addEventListener('keyup', (e) => this.down.delete(e.code));
        window.addEventListener('blur', () => { this.down.clear(); this.pressed.clear(); });
    }
    poll() {
        const result = {
            up: this.isDown('KeyW', 'ArrowUp'), down: this.isDown('KeyS', 'ArrowDown'), left: this.isDown('KeyA', 'ArrowLeft'), right: this.isDown('KeyD', 'ArrowRight'),
            run: this.down.has('ShiftLeft') || this.down.has('ShiftRight'), crouch: this.down.has('ControlLeft') || this.down.has('ControlRight'),
            interactPressed: this.take('KeyE') || this.take('Enter'), lanternPressed: this.take('KeyF'), escapePressed: this.take('Escape'), debugPressed: this.take('Backquote')
        };
        return result;
    }
    clearPressed() { this.pressed.clear(); }
    isDown(...codes) { return codes.some(c => this.down.has(c)); }
    take(code) { const hit = this.pressed.has(code); this.pressed.delete(code); return hit; }
}
