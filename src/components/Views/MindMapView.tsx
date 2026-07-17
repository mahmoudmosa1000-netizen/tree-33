'use client';
import { useTreeStore } from '@/stores/treeStore';
import type { Philosopher } from '@/types';

const MM: Record<string,{x:number;y:number}> = {
  sokrates:{x:400,y:310},platon:{x:292,y:208},aristoteles:{x:292,y:415},
  augustinus:{x:218,y:308},thomas:{x:188,y:198},descartes:{x:508,y:185},
  spinoza:{x:548,y:235},locke:{x:658,y:295},rousseau:{x:460,y:340},
  kant:{x:592,y:290},hegel:{x:565,y:402},kierkegaard:{x:165,y:355},
  marx:{x:490,y:540},nietzsche:{x:455,y:480},heidegger:{x:305,y:488},
  sartre:{x:215,y:428},beauvoir:{x:155,y:490},wittgenstein:{x:665,y:185},
  arendt:{x:378,y:118},foucault:{x:530,y:115},
};

export default function MindMapView({ philosophers }: { philosophers: Philosopher[] }) {
  const { selectedId, select } = useTreeStore();
  const conns: {x1:number;y1:number;x2:number;y2:number;cx:number;cy:number;col:string}[] = [];
  philosophers.forEach(p => {
    (p.influencing || []).forEach((inf: any) => {
      const f = MM[p.slug], t = MM[inf.influenced?.slug];
      if (f && t) {
        const dx=t.x-f.x, dy=t.y-f.y, len=Math.sqrt(dx*dx+dy*dy)||1;
        conns.push({x1:f.x,y1:f.y,x2:t.x,y2:t.y,cx:(f.x+t.x)/2-(dy/len)*32,cy:(f.y+t.y)/2+(dx/len)*16,col:p.colorHex});
      }
    });
  });

  return (
    <svg viewBox="0 0 800 590" style={{width:'100%',height:'100%'}} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="gl2" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        {philosophers.map(p=>(
          <radialGradient key={p.id} id={"mm-"+p.id} cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor={p.colorHex} stopOpacity=".82"/>
            <stop offset="100%" stopColor={p.colorHex} stopOpacity=".05"/>
          </radialGradient>
        ))}
      </defs>
      {conns.map((c,i)=>(
        <path key={i} d={"M "+c.x1+" "+c.y1+" Q "+c.cx+" "+c.cy+" "+c.x2+" "+c.y2}
          fill="none" stroke={c.col} strokeWidth="1.2" opacity=".32" strokeDasharray="5 4" markerEnd="url(#arr)"/>
      ))}
      {philosophers.map(p=>{
        const pos=MM[p.slug]; if(!pos) return null;
        const s=selectedId===p.id; const r=s?14:12;
        return (
          <g key={p.id} style={{cursor:'pointer'}} onClick={()=>select(selectedId===p.id?null:p.id)}>
            <circle cx={pos.x} cy={pos.y} r={r+8} fill={p.colorHex} opacity={s?0.22:0.08}/>
            {s && <circle cx={pos.x} cy={pos.y} r={r+16} fill="none" stroke={p.colorHex} strokeWidth={1.5} opacity={.3}/>}
            <circle cx={pos.x} cy={pos.y} r={r} fill={"url(#mm-"+p.id+")"} stroke={p.colorHex} strokeWidth={s?2.2:1.2} filter="url(#gl2)"/>
            <circle cx={pos.x} cy={pos.y} r={3.5} fill={p.colorHex} opacity={.9}/>
            <text x={pos.x} y={pos.y+r+14} textAnchor="middle" fill={p.colorHex}
              fontSize={s?11:9.5} fontWeight={s?600:400} fontFamily="Inter,sans-serif" opacity={.92}>
              {p.shortName}
            </text>
          </g>
        );
      })}
    </svg>
  );
}