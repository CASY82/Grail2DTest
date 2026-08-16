import type { ItemId, ProgressFlag } from './Chapter1.js';

export class Chapter2Progress {
  readonly flags=new Set<ProgressFlag>(['villageArrived']);
  readonly items=new Set<ItemId>(['truthTriangle']);
  has(f:ProgressFlag){return this.flags.has(f);} set(f:ProgressFlag){this.flags.add(f);}
  owns(i:ItemId){return this.items.has(i);} addItem(i:ItemId){this.items.add(i);}
  objective():string {
    if(this.has('chapter2Complete')) return 'CHAPTER 2 COMPLETE';
    if(this.has('nameSlotSolved')) return '깨어난 마을을 지나 Blackwood Castle로 달려라.';
    if(this.has('fourNamesKnown')&&this.owns('truthCircle')) return '세 진실과 네 이름을 성문 석판에 새겨라.';
    if(!this.owns('truthCircle')) return '상점가의 폐가에서 마을의 진실을 찾아라.';
    if(!this.has('wineOrderSolved')) return '검은 양 여관 지하의 와인 선반을 조사하라.';
    if(!this.has('fourNamesKnown')) return '시청 기록보관실에서 네 이름을 복원하라.';
    return '마을 성문으로 돌아가라.';
  }
}
