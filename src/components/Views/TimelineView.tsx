'use client';
import { useTreeStore } from '@/stores/treeStore';
import type { Philosopher } from '@/types';

export default function TimelineView({ philosophers }: { philosophers: Philosopher[] }) {
  const { selectedId, select, language } = useTreeStore();
  const sorted = [...philosophers].sort((a,b) => a.birthYear - b.birthYear);

  return (
    <div className="max-w-[680px] mx-auto px-4 py-4 h-full overflow-y-auto">
      <div className="relative pl-12">
        <div className="absolute left-5 top-2 bottom-2 w-px"
          style={{background:'linear-gradient(#0D1F0F,#2D5230 25%,#2D5230 75%,#0D1F0F)'}}/>
        {sorted.map(p => {
          const q = language==='en' ? (p.quotes[0]?.text_en || p.quotes[0]?.text_de) : p.quotes[0]?.text_de;
          const era = language==='en' ? p.era.name_en : p.era.name_de;
          const s = selectedId === p.id;
          return (
            <div key={p.id} onClick={()=>select(selectedId===p.id?null:p.id)}
              className="relative mb-3 px-3.5 py-3 rounded-xl cursor-pointer"
              style={{background:s?p.colorHex+'10':'rgba(255,255,255,.03)',
                border:'1px solid '+(s?p.colorHex+'45':'rgba(255,255,255,.07)')}}>
              <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                style={{background:p.colorHex,boxShadow:'0 0 8px '+p.colorHex+'88'}}/>
              <div className="flex justify-between items-center gap-3">
                <div>
                  <p className="text-[10px] tracking-[2px] uppercase font-inter" style={{color:p.colorHex}}>{era}</p>
                  <p className="font-playfair font-bold text-[16px] text-[#F0E6D3] mt-0.5">{p.name}</p>
                  <p className="text-[11px] font-inter mt-0.5" style={{color:'#3D5A3F'}}>{p.life}</p>
                </div>
                {q && (
                  <p className="text-[11px] font-playfair italic text-right leading-[1.4] max-w-[190px] flex-shrink-0"
                    style={{color:'#2D4A2F'}}>
                    {"»"}{q.length>65?q.slice(0,65)+'…':q}{"«"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}