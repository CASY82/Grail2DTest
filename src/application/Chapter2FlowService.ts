import {Chapter2Progress} from '../domain/Chapter2.js'; import {SequencePuzzleService} from './SequencePuzzleService.js'; import type {ActionResult} from './Chapter1FlowService.js';
/** 본문 인용은 마스터 시나리오 `Grail 게임 시나리오.md` 705~1022행(4. 마을 Ashvale + 성문 석판·네 석상)을 그대로 옮긴 것이다. */
export class Chapter2FlowService {
 private wine=new SequencePuzzleService(['V','II','IV','I','III','VI']); private names=new SequencePuzzleService(['eleanor','isaac','martha','thomas']);
 private static readonly SLAB='석판 옆면에 작은 글씨가 보였다.\n\n‘진실은 자물쇠를 푼다.\n그러나 이름은 문을 연다.\n네 명의 증인들의 이름을.\n그들은 시청에 새겨져 있다.’';
 constructor(private readonly p:Chapter2Progress){}
 interact(a:string):ActionResult{
  if(a.startsWith('wine.shelf')){const n=a.slice(10);const f=this.wine.click(n);if(f.solved)this.p.set('wineOrderSolved');return{title:`와인 선반 ${n}`,body:f.solved?'딸깍. 마지막 VI번 선반 맨 위, 병이 아니라 뱀이 새겨진 작은 나무 상자가 돌아갈 준비를 마쳤다.':f.reset?'병이 깨지는 소리와 함께 장치가 처음으로 돌아간다. 위층의 발소리가 빨라진다.':`딸깍. ${f.progress}/6`,sighting:f.reset};}
  if(a.startsWith('civic.name.')){const n=a.slice(11);const f=this.names.click(n);if(f.solved){this.p.set('fourNamesKnown');this.p.addItem('truthCross');}return{title:'증인의 명패',body:f.solved?'엘리노어, 아이작, 마사, 토머스. 네 증인의 이름이 순서대로 이어지고, 명부 사이에서 ✠ 진실 조각이 떨어진다.':f.reset?'울음이 번지며 순서가 지워진다. 비문이 가리키는 차례부터 다시 짚어야 한다.':'이름 하나가 비문과 맞물렸다.'};}
  switch(a){
   case'square.candle':case'inn.candle':return{title:'봉헌 촛대',body:'불꽃을 바로 세웠다. 현재 여정이 저장된다.',autosave:true};
   case'square.statue':return{title:'목 꺾인 여인의 석상',body:'분수 위에 세워져 있던 여인의 석상은 목이 꺾인 채 바닥에 얼굴을 묻고 있다. 눈동자가 있어야 할 자리에는 이끼가 자라 있다.'};
   case'square.fountain':return{title:'마른 분수',body:'광장 한가운데의 분수는 말라 있다. 주변의 벤치들은 군데군데 부서져 있고, 어떤 벤치에는 검게 굳은 천 조각이 걸려 있다. 그 천 조각을 오래 보지 않았다. 그것이 무엇인지 알아차리는 순간, 몸이 먼저 거부했기 때문이었다.'};
   case'square.board':return{title:'낡은 게시판',body:'대부분은 찢겨 있었지만 한 장의 공고는 아직 붙어 있다.\n\n‘성문 통행은 영주의 허가 하에만 가능함.\n관문 열쇠는 시장 또는 여관주인이 관리함.\n— Ashvale 시청’\n\n시청, 혹은 여관. 선택지는 많지 않았다.',autosave:true};
   case'square.signNorth':return{title:'북쪽 표지판',body:'광장의 네 방향으로 길이 뻗어 있다. 북쪽 표지판에는 블랙우드 성, 동쪽에는 상점가, 서쪽에는 여관 거리, 남쪽에는 시청과 주거지라고 적혀 있다. 안개 너머 언덕 위에, 회색 성이 흐릿하게 모습을 드러내고 있다.\n\n‘저기다. 배달하고 돌아간다. 그뿐이야.’'};
   case'square.signEast':return{title:'동쪽 표지판',body:'동쪽에는 상점가라고 적혀 있다. 낯선 마을에서 무언가를 찾으려면, 사람들이 마지막으로 남긴 흔적부터 살피는 수밖에 없었다.'};
   case'square.signWest':return{title:'서쪽 표지판',body:'서쪽에는 여관 거리라고 적혀 있다. The Black Lamb은 서쪽 길 끝에 있다.'};
   case'square.signSouth':return{title:'남쪽 표지판',body:'남쪽에는 시청과 주거지라고 적혀 있다. 시청은 광장 남쪽 끝에 있다.'};
   case'market.shelf':return{title:'진열대와 선반',body:'빵집의 진열대에는 돌처럼 굳은 빵이 놓여 있고, 잡화점의 선반에는 양초와 기름, 녹슨 못들이 지나치게 가지런히 놓여 있다. 문에 달린 작은 종이 힘없이 울렸다.\n\n챙.\n\n그 소리에 저도 모르게 멈춰 섰다. 아무 일도 일어나지 않았다.'};
   case'market.ledger':this.p.set('blackLambClueKnown');return{title:'잡화점 장부',body:'계산대 위에 펼쳐진 장부의 마지막 페이지에 급히 휘갈긴 글씨가 남아 있다.\n\n‘오늘도 성에서 식량을 받으러 오지 않았다.\n열흘째다.\n앨리가 여관을 닫겠다고 했다.\n성문 열쇠를 내게 맡기려 했지만 나는 거절했다.\n그녀는 그것을 지하 저장고에 감추었다고 했다.\nThe Black Lamb. 와인 선반 뒤.’\n\n“여관 지하 저장고…”',autosave:true};
   case'alley.mirror':this.p.set('hollowSighted');return{title:'금 간 거울',body:'거울에 비친 상이 보였다. 그의 뒤, 서너 걸음 떨어진 곳에 사람의 형체가 서 있었다. 회색 피부, 축 늘어진 어깨, 그리고 눈동자 없이 텅 빈 눈. 그것은 아직 완전히 그를 알아차리지 못한 것처럼 보였다. 하지만 곧 그 고개가 천천히 돌아갔다. 정확히 그를 향해.',startPursuit:true};
   case'house.bar':return{title:'움푹 들어간 나무 문',body:'문 너머에서 낮고 일정한 숨소리가 새어 나온다.\n\n쉬이—\n쉬이—\n\n나무 문이 미세하게 움푹 들어간다.'};
   case'house.hide':this.p.set('hidSuccessfully');return{title:'빗장을 지른 문',body:'안으로 몸을 밀어 넣고 문을 닫은 뒤 빗장을 질렀다. 잠시 후, 그 발소리가 집 앞에서 멈췄다. 문 너머에서 숨소리가 들렸다. 쉬이— 쉬이— 입술을 깨물고 눈을 감았다. 피 맛이 났다. 한 시간이 지난 것 같은 일 분 뒤, 발소리는 천천히 멀어졌다.'};
   case'house.diary':this.p.set('diaryRead');this.p.set('blackLambClueKnown');this.p.addItem('truthCircle');return{title:'T. 모리스의 일기',body:'거실 서랍장 위의 가죽 일기장. 표지에는 ‘T. 모리스’라는 이름이 새겨져 있다. 중반으로 갈수록 글씨가 점점 거칠어진다.\n\n‘성에서 이상한 소리가 들리기 시작했다.\n레지널드 경이 무엇인가를 하고 있다.\n시장은 아무 말도 하지 말라고 했다.\n우리는 그의 땅에 살고 있으니까.’\n\n‘그들이 돌아왔다.\n그러나 그들은 더 이상 그들이 아니었다.\n회색 피부. 빈 눈.\n시장은 그것들을 VIRAX라고 불렀다.\n나는 딸을 지하실에 숨겼다.’\n\n‘앨리는 성문 열쇠를 The Black Lamb의 지하 저장고, 와인 선반 뒤에 숨겼다.\n그 열쇠가 다시 쓰이지 않기를 바란다.’\n\n일기장을 덮어 품속에 넣었다. 표지 안쪽에서 ○ 진실 조각을 얻었다.',autosave:true};
   case'inn.board':return{title:'검은 양의 간판과 카운터',body:'검은 양의 간판은 한쪽 고리만 남은 채 매달려 있다. 안은 어두웠으나, 구석에 촛불 하나가 켜져 있다. 퀴퀴한 술 냄새와 오래된 피 냄새가 섞여 들어온다. 카운터 뒤 벽에는 검붉은 얼룩이 말라붙어 있다.\n\n‘지하 저장고. 와인 선반 뒤.’'};
   case'wine.hint':this.p.set('wineHintRead');return{title:'저장고의 약도',body:'한쪽 탁자 위에 저장고의 약도와 짧은 문장이 적혀 있다.\n\n‘뒤를 따르라.\n북쪽의 별 — V\n남쪽의 그림자 — II\n서쪽의 불 — IV\n동쪽의 물 — I\n중앙의 심장 — III\n봉인된 뱀 — VI’\n\n순서대로 건드리라는 뜻이었다.'};
   case'wine.serpentBox':this.p.set('ironGateKeyTaken');this.p.addItem('ironGateKey');return{title:'뱀이 새겨진 나무 상자',body:'상자를 돌렸다.\n\n딸깍.\n\n중앙 선반 하나가 뒤로 밀려나며 벽이 열렸다. 그 안에는 주먹만 한 철 열쇠가 있었다. 손잡이 끝에는 블랙우드 가문의 문장이 새겨져 있었다.',autosave:true};
   case'escape.lamp':this.p.set('innFireStarted');return{title:'바닥에 내리친 램프',body:'열쇠를 움켜쥐는 순간, 지하 계단 입구에 그림자가 드리워졌다. 그것이 내려와 있었다. 싸울 생각은 없었다. 그는 램프를 바닥에 내리쳤다. 유리가 깨지고 기름이 번졌고, 불길이 바닥을 타고 올랐다. 그것이 비명을 지르는 사이, 저장고의 작은 통풍창이 눈에 들어왔다.',autosave:true};
   case'civic.thud':return{title:'빗장을 지른 정문',body:'시청 계단을 한 번에 뛰어올라 반쯤 열린 문 안으로 몸을 던지고, 뒤에서 빗장을 질렀다. 문 밖에서 곧장 충돌음이 들렸다.\n\n쾅.\n쾅.'};
   case'civic.pillars':return{title:'이름이 새겨진 네 기둥',body:'남은 기름이 묻은 횃불 받침에 불을 붙이고 벽을 따라 움직였다. 정면의 네 기둥에 이름이 새겨져 있다.\n\n‘엘리노어 블랙우드 — 그녀가 처음 쓰러졌다.’\n‘아이작 웰스 — 그가 처음 되살렸다.’\n‘마사 그리폰 — 그녀가 처음 입을 열었다.’\n‘토머스 모리스 — 그가 마지막으로 기록했다.’',autosave:true};
   case'civic.coal':return{title:'일기장의 빈 페이지와 숯',body:'폐가에서 가져온 일기장의 빈 페이지에 숯으로 네 이름을 적었다. 엘리노어, 아이작, 마사, 토머스. 문 밖의 빗장이 삐걱이며 버티는 소리가 점점 위태로워진다.'};
   case'civic.record':return{title:'붉은 줄의 기록',body:'붉은 줄이 그어진 명부에 네 명의 증인이 차례대로 올라 있다. 엘리노어 블랙우드, 아이작 웰스, 마사 그리폰, 토머스 모리스. 마지막 줄의 ‘T. 모리스’는 폐가에서 가져온 가죽 일기장 표지에 새겨져 있던 바로 그 이름이다.',autosave:true};
   case'gate2.statue.fallen':return this.statue('쓰러진 석상','하나는 쓰러져 있었다.','엘리노어','그녀가 처음 쓰러졌다');
   case'gate2.statue.kneeling':return this.statue('무릎 꿇은 석상','하나는 무릎을 꿇고 있었다.','아이작','그가 처음 되살렸다');
   case'gate2.statue.mouth':return this.statue('입을 벌린 석상','하나는 입을 벌리고 있었다.','마사','그녀가 처음 입을 열었다');
   case'gate2.statue.pen':return this.statue('펜을 쥔 석상','마지막 하나는 펜을 쥐고 있었다.','토머스','그가 마지막으로 기록했다');
   case'gate2.slot':{
    this.p.set('gateTried');
    if(!this.p.owns('ironGateKey')) return{title:'거대한 외성문',body:'문은 돌과 철로 만들어져 있고, 어른 주먹만 한 열쇠 구멍이 검은 입처럼 벌어져 있다. 숲 오두막에서 얻은 녹슨 열쇠를 꺼내 보았지만, 그 크기는 성문에 비하면 너무 작다.\n\n“다른 열쇠가 필요하다는 뜻이겠지.”',autosave:true};
    if(!(['truthTriangle','truthCircle','truthCross'] as const).every(x=>this.p.owns(x))) return{title:'세 진실의 석판',body:`주먹만 한 철 열쇠가 외성문을 밀어냈다. 그 안쪽, 녹청이 낀 청동 문 앞에 허리 높이의 석판이 놓여 있다. 석판 위에는 세 개의 홈이 있다. 삼각형, 원, 그리고 뱀이 감긴 십자. 아직 채우지 못한 홈이 남아 있다.\n\n${Chapter2FlowService.SLAB}`,autosave:true};
    this.p.set('truthSlotLit');
    if(!this.p.has('fourNamesKnown')) return{title:'빛나는 석판',body:`조각들을 홈에 끼우자 석판이 낮게 울었다. 푸른빛이 기호를 따라 번졌고, 연금술의 원이 잠깐 떠올랐다. 그러나 문은 열리지 않았다.\n\n${Chapter2FlowService.SLAB}`};
    this.p.set('nameSlotSolved');
    return{title:'열린 청동문',body:'숨을 몰아쉬며 네 석상의 명패에 이름을 새겼다. 엘리노어. 아이작. 마사. 토머스. 마지막 이름을 쓰는 순간 숯이 부러졌다. 그러나 이름은 남았다. 석판이 다시 울었다. 이번에는 붉은빛이었다. 세 개의 홈이 빛났고 네 석상의 빈 눈구멍에서도 작은 빛이 떠올랐다. 청동 문이 움직이기 시작한다.',autosave:true};
   }
   case'chase2.howl':return{title:'뒤에서 들리는 울부짖음',body:'마을 쪽에서 들려오는 울부짖음이 자꾸만 목덜미를 잡아당긴다. 하나가 아니었다. 여러 개였다. 여관의 불길을 보고, 마을의 것들이 깨어난 것이다.'};
   case'chase2.gate':this.p.set('chapter2Complete');return{title:'Blackwood 성문',body:'문이 열리자마자 틈으로 몸을 밀어 넣고, 안쪽 벽에 걸린 체인을 힘껏 당겼다. 문이 다시 닫혔다.\n\n쿠궁.',complete:true};
   default:return{title:'조사',body:'사라진 마을 사람들의 흔적만 남아 있다.'};
  }
 }
 /** 원문 1009~1022: 네 석상은 시청 기둥의 네 비문과 1:1로 대응하고, 마지막에 각 명패에 이름이 새겨진다. */
 private statue(title:string,pose:string,name:string,epitaph:string):ActionResult{
  if(this.p.has('nameSlotSolved')) return{title,body:`${pose} 명패에는 ${name}의 이름이 남았고, 빈 눈구멍에서 작은 빛이 떠오른다.`};
  if(this.p.has('fourNamesKnown')) return{title,body:`${pose} 발치의 빈 명패는 시청 기둥의 비문 ‘${epitaph}’와 짝이 맞는다. 여기에 새겨야 할 이름은 ${name}이다.`};
  return{title,body:`${pose} 발치에는 이름이 지워진 작은 명패가 붙어 있다. 시청에 새겨져 있다는 비문 하나와 짝이 맞을 것 같다.`};
 }
}
