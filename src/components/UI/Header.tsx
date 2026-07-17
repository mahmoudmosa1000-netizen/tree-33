'use client';
import { useState } from 'react';
import { useTreeStore } from '@/stores/treeStore';
import OllamaModal from './OllamaModal';
import type { Philosopher } from '@/types';

const LL = { de:'DE', en:'EN', ar:'عر' } as const;
const VL = {
  de:['🌳 Baum','🕸 Mind Map','📅 Timeline'],
  en:['🌳 Tree','🕸 Mind Map','📅 Timeline'],
  ar:['🌳 الشجرة','🕸 خريطة','📅 الجدول'],
};
const TT = {
  de:{t:'Tree of Knowledge',s:'Philosophie als lebendiges Universum'},
  en:{t:'Tree of Knowledge',s:'Philosophy as a Living Universe'},
  ar:{t:'شجرة المعرفة',s:'الفلسفة كونٌ حيٌّ من الأفكار'},
};

export default function Header({ philosophers:_ }: { philosophers: Philosopher[] }) {
  const { language, setLanguage, view, setView, showParticles, toggleParticles } = useTreeStore();
  const [showOllama, setShowOllama] = useState(false);
  const tt = TT[language]; const vl = VL[language];
  const btn = (active: boolean) => ({
    background: active ? 'rgba(201,162,39,.18)' : 'none',
    border: active ? '1px solid rgba(201,162,39,.4)' : '1px solid transparent',
    color: active ? '#C9A227' : '#2E4A30',
  });
  return (
    <>
      <header className="flex items-center justify-between px-5 py-3 gap-3 flex-wrap sticky top-0 z-50"
        style={{ background:'rgba(4,8,5,.85)', borderBottom:'1px solid rgba(255,255,255,.05)', backdropFilter:'blur(12px)' }}>
        <div className="flex-shrink-0" dir={language==='ar'?'rtl':'ltr'}>
          <h1 className="font-playfair font-black text-[17px] tracking-[.5px] text-[#F0E6D3]">{tt.t}</h1>
          <p className="text-[10px] tracking-[2.5px] uppercase font-inter mt-0.5" style={{color:'#1A3A1C'}}>{tt.s}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button onClick={()=>setShowOllama(true)} className="text-[11px] font-inter px-3 py-1.5 rounded-lg"
            style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.1)',color:'#2E4A30'}}>
            ⚙ Ollama
          </button>
          <button onClick={toggleParticles} className="text-[11px] font-inter px-3 py-1.5 rounded-lg"
            style={{background:showParticles?'rgba(255,215,0,.1)':'none',
              border:showParticles?'1px solid rgba(255,215,0,.4)':'1px solid rgba(255,255,255,.1)',
              color:showParticles?'#FFD700':'#2E4A30'}}>
            ⬡ {language==='ar'?'جسيمات':language==='en'?'Particles':'Partikel'}
          </button>
          <nav className="flex gap-0.5 p-0.5 rounded-[10px]" style={{background:'rgba(255,255,255,.04)'}}>
            {(['tree','mindmap','timeline'] as const).map((v,i)=>(
              <button key={v} onClick={()=>setView(v)} className="text-[11px] font-inter px-3 py-1.5 rounded-[7px]" style={btn(view===v)}>{vl[i]}</button>
            ))}
          </nav>
          <div className="flex gap-0.5 p-0.5 rounded-[10px]" style={{background:'rgba(255,255,255,.04)'}}>
            {(['de','en','ar'] as const).map(l=>(
              <button key={l} onClick={()=>setLanguage(l)} className="font-inter px-3 py-1.5 rounded-[7px]"
                style={{...btn(language===l), fontSize:l==='ar'?13:11}}>{LL[l]}</button>
            ))}
          </div>
        </div>
      </header>
      {showOllama && <OllamaModal onClose={()=>setShowOllama(false)}/>}
    </>
  );
}