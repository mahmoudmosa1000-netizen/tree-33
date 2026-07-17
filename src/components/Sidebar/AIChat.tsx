'use client';
import { useState, useRef, useEffect } from 'react';
import { useTreeStore } from '@/stores/treeStore';
import { askPhilosopher } from '@/lib/ollama';
import type { Philosopher, Language } from '@/types';

const SUGG: Record<Language,(p:Philosopher)=>string[]> = {
  de: p=>[`Was würde ${p.name} über KI denken?`,`Erkläre "${(p.ideas||[])[0]?.name_de}" einfach.`,`${p.name}s radikalste Idee?`],
  en: p=>[`What would ${p.name} think about AI?`,`Explain "${(p.ideas||[])[0]?.name_en}" simply.`,`${p.name}'s most radical idea?`],
  ar: p=>[`ماذا سيفكّر ${p.name} في الذكاء الاصطناعي؟`,`اشرح "${(p.ideas||[])[0]?.name_de}" ببساطة.`,`أكثر أفكار ${p.name} جذريةً؟`],
};
const LBL: Record<Language,{t:string;ph:string;think:(n:string)=>string}> = {
  de:{t:'KI-Philosoph',ph:'Eigene Frage…',think:n=>n+' denkt nach…'},
  en:{t:'AI Philosopher',ph:'Ask your question…',think:n=>n+' is thinking…'},
  ar:{t:'الفيلسوف الاصطناعي',ph:'اطرح سؤالك…',think:n=>n+' يفكّر…'},
};

export default function AIChat({ philosopher:p }: { philosopher:Philosopher }) {
  const { language, ollamaConfig } = useTreeStore();
  const [q, setQ]       = useState('');
  const [resp, setResp] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr]   = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const isRtl = language === 'ar';
  const lbl   = LBL[language];
  const sugg  = SUGG[language](p);

  useEffect(() => {
    if (scrollRef.current && resp) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [resp]);

  const ask = async (text: string) => {
    const tx = (text || q).trim();
    if (!tx || loading) return;
    setQ(tx); setLoading(true); setResp(''); setErr('');
    try {
      await askPhilosopher(
        { name: p.name, life: p.life,
          era: language==='en' ? p.era.name_en : p.era.name_de,
          ideas: (p.ideas||[]).map((i:any) => language==='en' ? i.name_en : i.name_de),
          quote: language==='en' ? (p.quotes?.[0]?.text_en || p.quotes?.[0]?.text_de || '') : (p.quotes?.[0]?.text_de || '') },
        tx, language,
        (t) => setResp(t)
      );
    } catch(e) { setErr(String(e)); }
    setLoading(false);
  };

  return (
    <div dir={isRtl?'rtl':'ltr'}>
      <div className="flex items-center gap-2 mb-3" style={{color:'#C9A227'}}>
        <span className="text-[10px] tracking-[2.5px] uppercase font-inter">◆ {lbl.t}</span>
      </div>
      <p className="text-[11px] font-inter mb-3" style={{color:'#1E3A20'}}>🦙 {ollamaConfig.model} · {ollamaConfig.url}</p>

      <div className="flex flex-col gap-1.5 mb-3">
        {sugg.map(s=>(
          <button key={s} onClick={()=>ask(s)} className="text-[12px] font-inter px-3 py-2 rounded-lg"
            style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.09)',
              color:'#6A8C6C',textAlign:isRtl?'right':'left',cursor:'pointer'}}>
            {s}
          </button>
        ))}
      </div>

      <div className={"flex gap-2 mb-3 "+(isRtl?'flex-row-reverse':'')}>
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask(q)}
          placeholder={lbl.ph} dir={isRtl?'rtl':'ltr'}
          className="flex-1 text-[13px] px-3 py-2.5 rounded-lg font-inter focus:outline-none"
          style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',color:'#F0E6D3'}}/>
        <button onClick={()=>ask(q)} disabled={loading}
          className="px-4 py-2.5 rounded-lg font-bold text-[15px] font-inter flex-shrink-0"
          style={{background:loading?'rgba(201,162,39,.3)':'#C9A227',color:'#06090A',minWidth:44,cursor:'pointer'}}>
          {loading ? '…' : isRtl ? '←' : '→'}
        </button>
      </div>

      {loading && !resp && (
        <p className="text-[12px] italic font-inter px-1" style={{color:'#3D5A3F'}}>{lbl.think(p.name)}</p>
      )}
      {(resp || err) && (
        <div ref={scrollRef} className="rounded-lg p-3.5 text-[13.5px] leading-relaxed font-inter max-h-64 overflow-y-auto"
          style={{background:'rgba(255,255,255,.04)',color:err?'#F87171':'#AECBAE',
            borderLeft:isRtl?'none':'3px solid '+p.colorHex+'55',
            borderRight:isRtl?'3px solid '+p.colorHex+'55':'none',
            whiteSpace:'pre-wrap'}}>
          {err || resp}
        </div>
      )}
    </div>
  );
}