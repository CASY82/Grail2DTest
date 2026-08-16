import type { AreaDefinition, InteractionDefinition, PortalDefinition } from '../domain/World.js';
import type { AreaId, ProgressFlag } from '../domain/Chapter1.js';
const walls=[{x:0,y:0,w:1280,h:20},{x:0,y:700,w:1280,h:20},{x:0,y:0,w:20,h:720},{x:1260,y:0,w:20,h:720}];
export const interaction=(id:string,x:number,y:number,label:string,action=id,visibleWhen?:ProgressFlag):InteractionDefinition=>({id,rect:{x,y,w:72,h:72},label,action,...(visibleWhen?{visibleWhen}:{} )});
export const portal=(id:string,x:number,y:number,target:AreaId,label:string,requireFlag?:ProgressFlag,spawn?:{x:number;y:number}):PortalDefinition=>({id,rect:{x,y,w:70,h:100},target,spawn:spawn??{x:x<640?1160:120,y:600},label,...(requireFlag?{requireFlag,denyMessage:'아직 이 길을 열 단서를 찾지 못했다.'}:{})});
export const room=(id:AreaId,title:string,bg:string,portals:PortalDefinition[],interactions:InteractionDefinition[],ambience:AreaDefinition['ambience']='silence',pursuit?:AreaDefinition['pursuit']):AreaDefinition=>({id,title,subtitle:'비와 침묵 사이',backgroundAssetId:bg,spawn:{x:120,y:600},walls,portals,interactions,decorations:[],ambience,...(pursuit?{pursuit}:{})});
