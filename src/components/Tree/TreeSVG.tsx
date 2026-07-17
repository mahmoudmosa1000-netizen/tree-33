// src/components/Tree/TreeSVG.tsx
'use client';

import { useMemo } from 'react';
import { useTreeStore } from '@/stores/treeStore';
import type { Philosopher } from '@/types';

const LC = ['#1A4412','#22521A','#2D6B22','#38782C','#446F28','#1E5018'];

function genLeaves(cx: number, cy: number, r: number, seed: number, n = 16) {
  return Array.from({ length: n }, (_, i) => {
    const a = (seed * 0.618 + i * 137.508) * (Math.PI / 180);
    const d = Math.sqrt((i + 0.5) / n) * r;
    return { x: +(cx + Math.cos(a)*d).toFixed(1), y: +(cy + Math.sin(a)*d).toFixed(1), w: 5.5+((seed+i*7)%7), h: 3+((seed+i*5)%4), r: (seed*31+i*43)%360, o: 0.52+((seed+i*13)%6)*0.08 };
  });
}

const BRANCHES: [string, number][] = [
  ['M 400,675 C 395,578 405,488 398,398 C 394,348 401,298 400,278',22],
  ['M 400,658 C 360,654 315,663 275,680 C 248,692 222,706 198,722',11],
  ['M 400,658 C 440,654 485,663 525,680 C 552,692 578,706 602,722',11],
  ['M 397,663 C 372,667 345,677 318,696',7],['M 403,663 C 428,667 455,677 482,696',7],
  ['M 396,528 C 355,518 280,478 228,440 C 193,414 165,390 155,370',11],
  ['M 218,430 C 190,408 155,358 128,320 C 112,296 103,280 100,272',7],
  ['M 240,443 C 226,420 212,384 207,348 C 205,332 204,318 205,308',6],
  ['M 396,494 C 370,476 340,454 316,430 C 296,410 283,368 279,326 C 277,310 277,296 278,287',9],
  ['M 275,328 C 265,304 252,266 244,242 C 241,232 240,226 240,220',5],
  ['M 404,508 C 436,494 476,468 508,444 C 534,426 551,398 557,370 C 560,356 561,345 560,337',9],
  ['M 561,337 C 568,310 577,272 582,246 C 586,228 589,216 592,206',6],
  ['M 405,438 C 425,416 452,390 466,360 C 478,334 487,308 490,283 C 492,263 492,213 492,177',8],
  ['M 491,210 C 476,190 455,170 435,158 C 425,151 416,146 407,141',5],
  ['M 402,388 C 382,358 358,326 340,294 C 322,264 308,230 305,198 C 303,183 305,173 307,166',7],
  ['M 307,203 C 300,190 288,178 278,170 C 274,167 270,163 267,162',4],
  ['M 308,176 C 312,163 315,146 318,136 C 320,130 321,127 323,127',4],
  ['M 412,460 C 454,440 510,406 552,372 C 590,340 626,286 646,236 C 657,212 661,190 663,172',8],
  ['M 401,353 C 396,323 390,288 385,256 C 381,226 377,186 376,153 C 374,126 374,106 373,92',5],
  ['M 403,333 C 410,308 420,276 430,250 C 440,223 448,193 452,163 C 455,140 457,116 458,97',5],
  ['M 545,390 C 563,370 585,350 600,334 C 608,325 613,320 618,315',6],
  ['M 582,272 C 601,268 622,263 637,260 C 643,259 647,258 652,258',5],
  ['M 524,402 C 534,378 544,334 552,302 C 557,286 563,276 570,268',6],
  ['M 322,258 C 290,243 254,225 228,213 C 214,207 203,202 190,197',5],
  ['M 492,186 C 507,173 521,162 532,155 C 537,152 541,149 545,147',4],
  ['M 321,130 C 309,116 294,102 278,92 C 270,87 262,83 252,80',4],
];

const PRTPATHS = ['M 400,675 C 395,578 405,488 398,398','M 396,528 C 355,518 280,478 155,370','M 404,508 C 476,468 560,337','M 405,438 C 452,390 492,177','M 402,388 C 358,326 307,166','M 412,460 C 510,406 663,172','M 401,353 C 390,288 373,92'];

function Defs({ phs }: { phs: Philosopher[] }) {
  return (
    <defs>
      <style>{`
        @keyframes pulse{0%,100%{opacity:.78}50%{opacity:1}}
        @keyframes cSway{0%,100%{transform:rotate(-.4deg) translate(-.5px,.5px)}50%{transform:rotate(.4deg) translate(.5px,-.5px)}}
        @keyframes pFlow{to{stroke-dashoffset:-84}}
        @keyframes brIn{from{opacity:0}to{opacity:1}}
        .nd-glow{animation:pulse 3.5s ease-in-out infinite}
        .canopy{animation:cSway 10s ease-in-out infinite;transform-origin:400px 690px}
        .particle{stroke-dasharray:4 80;animation:pFlow 2.8s linear infinite}
        .br-in{animation:brIn .65s ease both}
      `}</style>
      <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id="gr-ground" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1A3A22" stopOpacity=".6"/><stop offset="100%" stopColor="#0A1810" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="top-glow" cx="50%" cy="20%" r="50%">
        <stop offset="0%" stopColor="#E879F9" stopOpacity=".06"/><stop offset="100%" stopColor="#E879F9" stopOpacity="0"/>
      </radialGradient>
      {phs.map(p => (
        <radialGradient key={p.id} id={`ap-${p.id}`} cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor={p.colorHex} stopOpacity=".82"/>
          <stop offset="55%" stopColor={p.colorHex} stopOpacity=".32"/>
          <stop offset="100%" stopColor={p.colorHex} stopOpacity=".05"/>
        </radialGradient>
      ))}
    </defs>
  );
}

function AppleNode({ p, sel, onSel }: { p: Philosopher; sel: boolean; onSel: (id: string) => void }) {
  const r = sel ? 14 : 12;
  return (
    <g style={{ cursor: 'pointer' }} onClick={() => onSel(p.id)}>
      <circle className="nd-glow" cx={p.treeX} cy={p.treeY} r={r+8} fill={p.colorHex} opacity={sel?.22:.08}/>
      {sel && <circle cx={p.treeX} cy={p.treeY} r={r+16} fill="none" stroke={p.colorHex} strokeWidth={1.5} opacity={.3}/>}
      <circle cx={p.treeX} cy={p.treeY} r={r} fill={`url(#ap-${p.id})`} stroke={p.colorHex} strokeWidth={sel?2.2:1.2} filter="url(#glow)"/>
      <circle cx={p.treeX} cy={p.treeY} r={3.5} fill={p.colorHex} opacity={.9}/>
      <text x={p.treeX} y={p.treeY+r+14} textAnchor="middle" fill={p.colorHex} fontSize={sel?11:9.5} fontWeight={sel?600:400} fontFamily="Inter,system-ui,sans-serif" opacity={.92}>
        {p.shortName}
      </text>
    </g>
  );
}

export default function TreeSVG({ philosophers }: { philosophers: Philosopher[] }) {
  const { selectedId, select, showParticles, growKey } = useTreeStore();

  const leafClusters = useMemo(() => [
    ...philosophers.map((p,i) => ({ cx:p.treeX, cy:p.treeY-20, r:38+(i%6)*4, col:LC[i%LC.length], leaves:genLeaves(p.treeX,p.treeY-20,38+(i%6)*4,i*29,18) })),
    { cx:150, cy:305, r:34, col:'#1A4412', leaves:genLeaves(150,305,34,580,13) },
    { cx:168, cy:245, r:30, col:'#2D6B22', leaves:genLeaves(168,245,30,610,12) },
    { cx:305, cy:205, r:28, col:'#38782C', leaves:genLeaves(305,205,28,640,11) },
    { cx:450, cy:158, r:32, col:'#1E5018', leaves:genLeaves(450,158,32,670,12) },
    { cx:350, cy:182, r:30, col:'#22521A', leaves:genLeaves(350,182,30,700,12) },
    { cx:510, cy:205, r:28, col:'#2D6B22', leaves:genLeaves(510,205,28,730,11) },
    { cx:625, cy:202, r:32, col:'#1A4412', leaves:genLeaves(625,202,32,760,13) },
    { cx:355, cy:112, r:36, col:'#38782C', leaves:genLeaves(355,112,36,790,14) },
    { cx:452, cy:72,  r:34, col:'#22521A', leaves:genLeaves(452,72, 34,820,13) },
    { cx:280, cy:128, r:30, col:'#1E5018', leaves:genLeaves(280,128,30,850,12) },
  ], [philosophers]);

  return (
    <svg key={growKey} viewBox="0 0 800 760" style={{width:'100%',height:'100%'}} preserveAspectRatio="xMidYMid meet">
      <Defs phs={philosophers}/>
      <ellipse cx="400" cy="80"  rx="380" ry="120" fill="url(#top-glow)"/>
      <ellipse cx="400" cy="718" rx="310" ry="58"  fill="url(#gr-ground)"/>
      <ellipse cx="400" cy="712" rx="260" ry="34"  fill="#0C1A0E" opacity=".55"/>
      {BRANCHES.map(([d,w],i) => (
        <g key={i} className="br-in" style={{animationDelay:`${i*.038}s`}}>
          <path d={d} fill="none" stroke="#020100" strokeWidth={w+6} strokeLinecap="round" opacity={.6}/>
          <path d={d} fill="none" stroke="#281205" strokeWidth={w}   strokeLinecap="round"/>
          <path d={d} fill="none" stroke="#4A2010" strokeWidth={Math.max(1,w-6)} strokeLinecap="round" opacity={.28}/>
          <path d={d} fill="none" stroke="#6A3820" strokeWidth={Math.max(1,w-10)} strokeLinecap="round" opacity={.15}/>
        </g>
      ))}
      <g className="canopy">
        {leafClusters.map((lc,ci) => (
          <g key={ci}>
            {lc.leaves.map((l,li) => (
              <ellipse key={li} cx={l.x} cy={l.y} rx={l.w} ry={l.h} transform={`rotate(${l.r} ${l.x} ${l.y})`} fill={lc.col} opacity={l.o}/>
            ))}
          </g>
        ))}
      </g>
      {showParticles && PRTPATHS.map((d,i) => (
        <path key={i} className="particle" d={d} fill="none" stroke="#FFD700" strokeWidth="1.5" opacity=".6" style={{animationDuration:`${2.4+i*.75}s`,animationDelay:`${i*.35}s`}}/>
      ))}
      {philosophers.map(p => (
        <AppleNode key={p.id} p={p} sel={selectedId===p.id} onSel={id=>select(selectedId===id?null:id)}/>
      ))}
      <text x="400" y="753" textAnchor="middle" fill="#243E26" fontSize="9" fontFamily="Inter,sans-serif" letterSpacing="4" opacity=".6">WURZELN DES DENKENS</text>
    </svg>
  );
}
