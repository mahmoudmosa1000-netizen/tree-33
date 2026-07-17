'use client';
import { useTreeStore } from '@/stores/treeStore';
import type { Philosopher } from '@/types';
import AIChat from './AIChat';

const L = {
  de:{ideas:'Schlüsselideen',bio:'Biografie',inf:'Beeinflusste'},
  en:{ideas:'Key Ideas',bio:'Biography',inf:'Influenced'},
  ar:{ideas:'الأفكار الرئيسية',bio:'السيرة الذاتية',inf:'أثّر في'},
};

export default function Sidebar({ philosopher:p, onClose }: { philosopher:Philosopher; onClose:()=>void }) {
  const { language, favorites, toggleFavorite } = useTreeStore();
  const isRtl = language === 'ar';
  const isFav = favorites.includes(p.id);
  const bio   = language==='en' ? p.bio_en : p.bio_de;
  const quote = language==='en' ? (p.quotes[0]?.text_en || p.quotes[0]?.text_de) : p.quotes[0]?.text_de;
  const era   = language==='en' ? p.era.name_en : p.era.name_de;
  const lbl   = L[language];

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[395px] overflow-y-auto z-[200]"
      style={{background:'rgba(4,8,5,.97)',borderLeft:'1px solid rgba(201,162,39,.18)',
        backdropFilter:'blur(24px)',direction:isRtl?'rtl':'ltr',
        animation:'sideIn .32s cubic-bezier(.25,.46,.45,.94) both'}}>
      <style>{"@keyframes sideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}"}</style>
      <div className="p-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-[10px] tracking-[3px] uppercase font-inter mb-1.5" style={{color:p.colorHex}}>{era}</p>
            <h2 className="font-playfair font-black text-[24px] leading-tight text-[#F0E6D3]">{p.name}</h2>
            <p className="text-[11px] font-inter mt-1" style={{color:'#3D5A3F'}}>{p.life}</p>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={()=>toggleFavorite(p.id)} className="text-xl" style={{color:isFav?'#C9A227':'#2E4A30',background:'none',border:'none',cursor:'pointer'}}>{isFav?'★':'☆'}</button>
            <button onClick={onClose} style={{background:'none',border:'none',color:'#3D5A3F',cursor:'pointer',fontSize:18,lineHeight:1}}>✕</button>
          </div>
        </div>

        {quote && (
          <div className="mb-5" style={{borderLeft:isRtl?'none':'3px solid '+p.colorHex,borderRight:isRtl?'3px solid '+p.colorHex:'none',paddingLeft:isRtl?0:14,paddingRight:isRtl?14:0}}>
            <p className="font-playfair italic text-[14px] leading-[1.65]" style={{color:'#C0AF90'}}>{"»"}{quote}{"«"}</p>
          </div>
        )}

        <div className="mb-5">
          <p className="text-[10px] tracking-[2.5px] uppercase font-inter mb-2.5" style={{color:'#2E4A30'}}>{lbl.ideas}</p>
          <div className="flex flex-wrap gap-1.5">
            {(p.ideas||[]).map((i:any)=>(
              <span key={i.id} className="text-[11.5px] px-2.5 py-1 rounded-full font-inter"
                style={{background:p.colorHex+'14',border:'1px solid '+p.colorHex+'40',color:p.colorHex}}>
                {language==='en'?i.name_en:i.name_de}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="text-[10px] tracking-[2.5px] uppercase font-inter mb-2.5" style={{color:'#2E4A30'}}>{lbl.bio}</p>
          <p className="text-[13.5px] leading-[1.72] font-inter" style={{color:'#8EA88F'}}>{bio}</p>
        </div>

        {(p.influencing||[]).length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] tracking-[2.5px] uppercase font-inter mb-2.5" style={{color:'#2E4A30'}}>{lbl.inf}</p>
            <div className="flex flex-wrap gap-1.5">
              {(p.influencing||[]).map((inf:any)=>(
                <span key={inf.id} className="text-[11.5px] px-2.5 py-1 rounded-full font-inter"
                  style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.12)',color:'#8AA08C'}}>
                  {inf.influenced?.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="h-px my-5" style={{background:'linear-gradient(to right,transparent,rgba(201,162,39,.25),transparent)'}}/>
        <AIChat philosopher={p}/>
      </div>
    </div>
  );
}