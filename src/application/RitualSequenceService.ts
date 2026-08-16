import type { Player } from '../domain/Player.js';
export class RitualSequenceService {
  private elapsed=0;
  update(player:Player,dt:number,active:boolean):void{
    if(!active){player.controlMultiplier=1;return;}
    this.elapsed+=dt; player.controlMultiplier=Math.max(0.12,1-this.elapsed/12);
  }
  get agencyLocked(){return this.elapsed>=4;}
}
