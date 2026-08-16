import { Chapter1Progress } from '../domain/Chapter1.js';
import { centerOf, distance, rectsOverlap } from '../domain/Geometry.js';
import { Hollow } from '../domain/Hollow.js';
import { Pursuer } from '../domain/Pursuer.js';
import { Player } from '../domain/Player.js';
import { Chapter1FlowService } from '../application/Chapter1FlowService.js';
import { Chapter2FlowService } from '../application/Chapter2FlowService.js';
import { Chapter3FlowService } from '../application/Chapter3FlowService.js';
import { Chapter2Progress } from '../domain/Chapter2.js';
import { Chapter3Progress } from '../domain/Chapter3.js';
import { RitualSequenceService } from '../application/RitualSequenceService.js';
import { MovementService } from '../application/MovementService.js';
import { PursuitService } from '../application/PursuitService.js';
import { ShadowPuzzleService } from '../application/ShadowPuzzleService.js';
export class GameController {
    worlds;
    input;
    renderer;
    assets;
    audio;
    modal;
    static SIGHTING_SECONDS = 2.4;
    progress = new Chapter1Progress();
    progress2 = new Chapter2Progress();
    progress3 = new Chapter3Progress();
    player = new Player({ x: 180, y: 520 });
    hollow = new Hollow();
    pursuer = new Pursuer();
    flow = new Chapter1FlowService(this.progress);
    flow2 = new Chapter2FlowService(this.progress2);
    flow3 = new Chapter3FlowService(this.progress3);
    ritual = new RitualSequenceService();
    movement = new MovementService();
    pursuit = new PursuitService();
    shadowPuzzle = new ShadowPuzzleService();
    saves;
    areaId = 'bridge';
    chapterId = 1;
    previousTime = performance.now();
    busy = false;
    portalCooldown = 0;
    sightingTimer = 0;
    pursuitGrace = 0;
    debug = false;
    constructor(worlds, input, renderer, assets, audio, modal, saveService) {
        this.worlds = worlds;
        this.input = input;
        this.renderer = renderer;
        this.assets = assets;
        this.audio = audio;
        this.modal = modal;
        this.saves = saveService;
    }
    async start() {
        await this.assets.load();
        const snapshot = this.saves.load();
        this.chapterId = await this.modal.showChapterSelect();
        this.areaId = this.chapterId === 1 ? 'bridge' : this.chapterId === 2 ? 'villageSquare' : 'castleGateChain';
        this.player.position = this.chapterStartPosition(this.chapterId);
        if (snapshot && (snapshot.chapterId ?? 1) === this.chapterId)
            this.restore(snapshot);
        this.enterArea(this.areaId, { x: this.player.position.x, y: this.player.position.y }, false);
        await this.modal.showMessage(`GRAIL · CHAPTER ${this.chapterId}`, '공격 수단은 없다. 조사하고, 소리를 관리하고, 필요하면 도망쳐라.', 'Enter/E · 시작');
        this.input.clearPressed();
        requestAnimationFrame(t => this.loop(t));
    }
    loop(now) {
        const dt = Math.min(.033, (now - this.previousTime) / 1000);
        this.previousTime = now;
        if (!this.modal.isOpen() && !this.busy)
            this.update(dt);
        this.render();
        requestAnimationFrame(t => this.loop(t));
    }
    update(dt) {
        this.portalCooldown = Math.max(0, this.portalCooldown - dt);
        this.ritual.update(this.player, dt, this.chapterId === 3 && this.progress3.has('boxOpened'));
        if (this.hollow.active) {
            this.sightingTimer = Math.max(0, this.sightingTimer - dt);
            if (this.sightingTimer <= 0)
                this.hollow.active = false;
        }
        const state = this.input.poll();
        if (state.escapePressed)
            void this.pauseInfo();
        if (state.debugPressed)
            this.debug = !this.debug;
        if (state.lanternPressed)
            this.player.lanternOn = !this.player.lanternOn;
        this.movement.update(this.player, this.currentArea(), state, dt);
        if (this.pursuitGrace > 0) {
            this.pursuitGrace = Math.max(0, this.pursuitGrace - dt);
            const cfg = this.currentArea().pursuit;
            if (this.pursuitGrace <= 0 && cfg?.onEnter)
                this.activatePursuit(cfg);
        }
        if (this.pursuer.active && this.pursuit.update(this.pursuer, this.player, this.currentArea(), dt)) {
            this.busy = true;
            void this.handleCatch();
            return;
        }
        this.handlePortal();
        if (state.interactPressed)
            void this.handleInteraction();
    }
    render() {
        const area = this.currentArea();
        const interaction = this.nearestInteraction();
        const portal = this.nearestPortal();
        const blockedPortalIds = area.portals.filter(p => p.requireFlag && !this.activeProgress.has(p.requireFlag)).map(p => p.id);
        const prompt = interaction?.label ?? (portal ? `${blockedPortalIds.includes(portal.id) ? '잠김 · ' : ''}${portal.label}` : undefined);
        const visibleInteractionIds = area.interactions.filter(i => this.interactionVisible(i)).map(i => i.id);
        this.renderer.render({
            area, player: this.player, hollow: this.hollow, pursuer: this.pursuer, objective: this.activeProgress.objective(),
            ...(prompt ? { prompt } : {}), noiseRadiusMeters: this.player.noiseRadiusMeters, inventoryText: this.inventoryText(), blockedPortalIds, visibleInteractionIds, debug: this.debug
        });
    }
    currentArea() {
        const base = this.worlds[this.chapterId].areas[this.areaId];
        if (!base)
            throw new Error(`Area ${this.areaId} is missing from chapter ${this.chapterId}`);
        if (this.areaId !== 'cabinA' || !this.activeProgress.has('gateChecked'))
            return base;
        return { ...base, backgroundAssetId: 'bg.cabinA.visited', subtitle: '재방문 · 젖은 발자국과 열린 관리 기록', decorations: [...base.decorations, { rect: { x: 575, y: 475, w: 130, h: 18 }, fallback: '#151918', alpha: .72 }, { rect: { x: 760, y: 330, w: 42, h: 18 }, fallback: '#4b3a30', alpha: .8 }] };
    }
    handlePortal() {
        if (this.portalCooldown > 0)
            return;
        const portal = this.currentArea().portals.find(p => rectsOverlap(this.player.bounds(), p.rect));
        if (!portal)
            return;
        if (portal.requireFlag && !this.activeProgress.has(portal.requireFlag)) {
            this.portalCooldown = 1.1;
            this.busy = true;
            void this.modal.showMessage(portal.label, portal.denyMessage ?? '아직 갈 수 없다.').finally(() => { this.busy = false; });
            return;
        }
        this.enterArea(portal.target, portal.spawn, true);
        this.portalCooldown = .8;
    }
    nearestPortal() {
        return this.currentArea().portals.filter(p => distance(this.player.position, centerOf(p.rect)) < 95).sort((a, b) => distance(this.player.position, centerOf(a.rect)) - distance(this.player.position, centerOf(b.rect)))[0];
    }
    nearestInteraction() {
        return this.currentArea().interactions.filter(i => this.interactionVisible(i) && distance(this.player.position, centerOf(i.rect)) < 105).sort((a, b) => distance(this.player.position, centerOf(a.rect)) - distance(this.player.position, centerOf(b.rect)))[0];
    }
    interactionVisible(i) {
        if (i.visibleWhen && !this.activeProgress.has(i.visibleWhen))
            return false;
        if (i.hiddenWhen && this.activeProgress.has(i.hiddenWhen))
            return false;
        const itemByAction = { 'woodcut.triangle': 'woodcutTriangle', 'woodcut.circle': 'woodcutCircle', 'woodcut.cross': 'woodcutCross' };
        const item = itemByAction[i.action];
        if (item && this.activeProgress.owns(item))
            return false;
        return true;
    }
    async handleInteraction() {
        const interaction = this.nearestInteraction();
        if (!interaction)
            return;
        this.busy = true;
        try {
            const result = this.chapterId === 1 ? this.flow.interact(interaction.action) : this.chapterId === 2 ? this.flow2.interact(interaction.action) : this.flow3.interact(interaction.action, this.ritual.agencyLocked);
            await this.modal.showMessage(result.title, result.body);
            this.input.clearPressed();
            if (result.openPuzzle) {
                const solved = await this.modal.showShadowPuzzle({
                    align: input => this.shadowPuzzle.align(input),
                    attempt: input => this.shadowPuzzle.attempt(input),
                    hintAvailable: this.progress.has('mechanismExamined'),
                    mirrorTarget: ShadowPuzzleService.ANSWER.mirrorAngle,
                    candleTarget: ShadowPuzzleService.ANSWER.candleAngle,
                    onFeedback: feedback => {
                        if (feedback.event === 'threat-approaches') {
                            this.audio.pulse('error');
                            this.audio.pulse('step');
                        }
                        else if (!feedback.solved)
                            this.audio.pulse('error');
                    }
                });
                if (solved) {
                    this.flow.solvePuzzle();
                    this.audio.pulse('success');
                    await this.modal.showMessage('봉인이 맞물리다', '세 그림자가 겹치는 순간, 다락 전체가 숨을 멈춘 듯 조용해진다. 받침대 안쪽에서 나무가 갈리는 소리가 낮게 울린다.');
                    this.input.clearPressed();
                    await this.modal.showMessage('열린 서랍', '서랍이 열린다. 녹슨 관문 열쇠, 경고 쪽지, △ 진실 조각을 획득했다.');
                    this.input.clearPressed();
                    this.save();
                }
            }
            if (result.sighting) {
                this.triggerSighting();
                this.save();
            }
            if (result.startPursuit) {
                const cfg = this.currentArea().pursuit;
                if (cfg)
                    this.activatePursuit(cfg);
                this.save();
            }
            if (result.complete) {
                if (this.chapterId === 1)
                    this.progress.set('chapterComplete');
                this.hollow.active = false;
                this.pursuer.active = false;
                const end = this.chapterId === 1 ? 'ending' : this.chapterId === 2 ? 'ending2' : 'ending3';
                this.enterArea(end, { x: 640, y: 360 }, false);
                this.save();
                await this.modal.showEnding(this.chapterId);
                this.input.clearPressed();
                this.chapterId = await this.modal.showChapterSelect();
                this.areaId = this.chapterId === 1 ? 'bridge' : this.chapterId === 2 ? 'villageSquare' : 'castleGateChain';
                this.player.position = this.chapterStartPosition(this.chapterId);
                this.player.controlMultiplier = 1;
                this.enterArea(this.areaId, this.player.position, false);
            }
            else if (result.autosave)
                this.save();
        }
        finally {
            this.busy = false;
        }
    }
    triggerSighting() {
        // Scripted glimpse (GR-1 attic window, or GR-3's brief Reginald reveal) — never tracks the player.
        this.hollow.assetId = this.chapterId === 3 ? 'character.reginald' : 'enemy.hollow';
        this.hollow.position = { x: 960, y: 230 };
        this.hollow.active = true;
        this.sightingTimer = GameController.SIGHTING_SECONDS;
        this.audio.pulse('hollow');
    }
    activatePursuit(cfg) {
        this.pursuer.active = true;
        this.pursuer.position = { ...cfg.spawn };
        this.pursuer.speed = cfg.speed;
        this.pursuer.assetId = cfg.enemyAssetId;
        this.audio.pulse('hollow');
    }
    async handleCatch() {
        const cfg = this.currentArea().pursuit;
        this.pursuer.active = false;
        try {
            await this.modal.showMessage(cfg?.catchTitle ?? '붙잡히다', cfg?.catchBody ?? '차가운 손이 스치고 지나간다.');
            this.input.clearPressed();
            this.player.position = { ...this.currentArea().spawn };
            this.pursuitGrace = 1.5;
        }
        finally {
            this.busy = false;
        }
    }
    enterArea(target, spawn, autosave) {
        this.areaId = target;
        this.player.position = { ...spawn };
        this.audio.setAmbience(this.currentArea().ambience);
        this.hollow.active = false;
        this.pursuer.active = false;
        this.pursuitGrace = 0;
        const pursuit = this.currentArea().pursuit;
        if (pursuit?.onEnter)
            this.activatePursuit(pursuit);
        if (autosave && ['cabinB1', 'cabinB2', 'attic'].includes(target))
            this.save();
    }
    restore(snapshot) {
        this.areaId = snapshot.areaId;
        this.player.position = { x: snapshot.playerX, y: snapshot.playerY };
        this.player.lanternOn = snapshot.lanternOn;
        snapshot.flags.forEach(f => this.activeProgress.set(f));
        snapshot.items.forEach(i => this.activeProgress.addItem(i));
    }
    inventoryText() {
        const icons = [];
        if (this.activeProgress.owns('woodcutTriangle'))
            icons.push('△');
        if (this.activeProgress.owns('woodcutCircle'))
            icons.push('○');
        if (this.activeProgress.owns('woodcutCross'))
            icons.push('✠');
        if (this.activeProgress.owns('rustedGateKey'))
            icons.push('녹슨 열쇠');
        for (const [id, label] of [['truthTriangle', '△ 진실 조각'], ['truthCircle', '○ 진실 조각'], ['truthCross', '✠ 진실 조각'], ['ironGateKey', '철 열쇠']])
            if (this.activeProgress.owns(id))
                icons.push(label);
        return `소지품: ${icons.length ? icons.join(' · ') : '없음'}`;
    }
    async pauseInfo() {
        if (this.busy)
            return;
        this.busy = true;
        await this.modal.showMessage('PAUSE', `현재 목표: ${this.activeProgress.objective()}\n저장은 봉헌 촛대 및 핵심 진행 시 자동으로 수행된다.`, 'Enter/Escape · 계속');
        this.input.clearPressed();
        this.busy = false;
    }
    get activeProgress() { return this.chapterId === 1 ? this.progress : this.chapterId === 2 ? this.progress2 : this.progress3; }
    chapterStartPosition(chapter) { return chapter === 2 ? { x: 635, y: 500 } : { x: 180, y: 520 }; }
    save() { this.saves.save(this.areaId, this.player, this.activeProgress, this.chapterId); }
}
