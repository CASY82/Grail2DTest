import { Chapter1Progress } from '../domain/Chapter1.js';
import { centerOf, distance, rectsOverlap } from '../domain/Geometry.js';
import { Hollow } from '../domain/Hollow.js';
import { Player } from '../domain/Player.js';
import { Chapter1FlowService } from '../application/Chapter1FlowService.js';
import { MovementService } from '../application/MovementService.js';
import { ShadowPuzzleService } from '../application/ShadowPuzzleService.js';
export class GameController {
    world;
    input;
    renderer;
    assets;
    audio;
    modal;
    static SIGHTING_SECONDS = 2.4;
    progress = new Chapter1Progress();
    player = new Player({ x: 180, y: 520 });
    hollow = new Hollow();
    flow = new Chapter1FlowService(this.progress);
    movement = new MovementService();
    shadowPuzzle = new ShadowPuzzleService();
    saves;
    areaId = 'bridge';
    previousTime = performance.now();
    busy = false;
    portalCooldown = 0;
    sightingTimer = 0;
    debug = false;
    constructor(world, input, renderer, assets, audio, modal, saveService) {
        this.world = world;
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
        if (snapshot)
            this.restore(snapshot);
        this.enterArea(this.areaId, { x: this.player.position.x, y: this.player.position.y }, false);
        await this.modal.showMessage('GRAIL · CHAPTER 1', '2D HTML5 프로토타입. 공격 수단은 없다. 조사하고, 소리를 관리하고, 필요하면 도망쳐라.', 'Enter/E · 시작');
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
        this.handlePortal();
        if (state.interactPressed)
            void this.handleInteraction();
    }
    render() {
        const area = this.currentArea();
        const interaction = this.nearestInteraction();
        const portal = this.nearestPortal();
        const blockedPortalIds = area.portals.filter(p => p.requireFlag && !this.progress.has(p.requireFlag)).map(p => p.id);
        const prompt = interaction?.label ?? (portal ? `${blockedPortalIds.includes(portal.id) ? '잠김 · ' : ''}${portal.label}` : undefined);
        const visibleInteractionIds = area.interactions.filter(i => this.interactionVisible(i)).map(i => i.id);
        this.renderer.render({
            area, player: this.player, hollow: this.hollow, objective: this.progress.objective(),
            ...(prompt ? { prompt } : {}), noiseRadiusMeters: this.player.noiseRadiusMeters, inventoryText: this.inventoryText(), blockedPortalIds, visibleInteractionIds, debug: this.debug
        });
    }
    currentArea() {
        const base = this.world.areas[this.areaId];
        if (this.areaId !== 'cabinA' || !this.progress.has('gateChecked'))
            return base;
        return { ...base, backgroundAssetId: 'bg.cabinA.visited', subtitle: '재방문 · 젖은 발자국과 열린 관리 기록', decorations: [...base.decorations, { rect: { x: 575, y: 475, w: 130, h: 18 }, fallback: '#151918', alpha: .72 }, { rect: { x: 760, y: 330, w: 42, h: 18 }, fallback: '#4b3a30', alpha: .8 }] };
    }
    handlePortal() {
        if (this.portalCooldown > 0)
            return;
        const portal = this.currentArea().portals.find(p => rectsOverlap(this.player.bounds(), p.rect));
        if (!portal)
            return;
        if (portal.requireFlag && !this.progress.has(portal.requireFlag)) {
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
        if (i.visibleWhen && !this.progress.has(i.visibleWhen))
            return false;
        if (i.hiddenWhen && this.progress.has(i.hiddenWhen))
            return false;
        const itemByAction = { 'woodcut.triangle': 'woodcutTriangle', 'woodcut.circle': 'woodcutCircle', 'woodcut.cross': 'woodcutCross' };
        const item = itemByAction[i.action];
        if (item && this.progress.owns(item))
            return false;
        return true;
    }
    async handleInteraction() {
        const interaction = this.nearestInteraction();
        if (!interaction)
            return;
        this.busy = true;
        try {
            const result = this.flow.interact(interaction.action);
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
                    this.saves.save(this.areaId, this.player, this.progress);
                }
            }
            if (result.sighting) {
                this.triggerSighting();
                this.saves.save(this.areaId, this.player, this.progress);
            }
            if (result.complete) {
                this.progress.set('chapterComplete');
                this.hollow.active = false;
                this.enterArea('ending', { x: 640, y: 360 }, false);
                this.saves.save(this.areaId, this.player, this.progress);
                await this.modal.showEnding();
                this.input.clearPressed();
            }
            else if (result.autosave)
                this.saves.save(this.areaId, this.player, this.progress);
        }
        finally {
            this.busy = false;
        }
    }
    triggerSighting() {
        // Scripted glimpse near the attic window (rect x:900,y:180,w:120,h:130) — Hollow never tracks the player.
        this.hollow.position = { x: 960, y: 230 };
        this.hollow.active = true;
        this.sightingTimer = GameController.SIGHTING_SECONDS;
        this.audio.pulse('hollow');
    }
    enterArea(target, spawn, autosave) {
        this.areaId = target;
        this.player.position = { ...spawn };
        this.audio.setAmbience(this.currentArea().ambience);
        this.hollow.active = false;
        if (autosave && ['cabinB1', 'cabinB2', 'attic'].includes(target))
            this.saves.save(this.areaId, this.player, this.progress);
    }
    restore(snapshot) {
        this.areaId = snapshot.areaId;
        this.player.position = { x: snapshot.playerX, y: snapshot.playerY };
        this.player.lanternOn = snapshot.lanternOn;
        snapshot.flags.forEach(f => this.progress.set(f));
        snapshot.items.forEach(i => this.progress.addItem(i));
    }
    inventoryText() {
        const icons = [];
        if (this.progress.owns('woodcutTriangle'))
            icons.push('△');
        if (this.progress.owns('woodcutCircle'))
            icons.push('○');
        if (this.progress.owns('woodcutCross'))
            icons.push('✠');
        if (this.progress.owns('rustedGateKey'))
            icons.push('녹슨 열쇠');
        if (this.progress.owns('truthTriangle'))
            icons.push('△ 진실 조각');
        return `소지품: ${icons.length ? icons.join(' · ') : '없음'}`;
    }
    async pauseInfo() {
        if (this.busy)
            return;
        this.busy = true;
        await this.modal.showMessage('PAUSE', `현재 목표: ${this.progress.objective()}\n저장은 봉헌 촛대 및 핵심 진행 시 자동으로 수행된다.`, 'Enter/Escape · 계속');
        this.input.clearPressed();
        this.busy = false;
    }
}
