'use client';
import { useState } from 'react';
import { useTreeStore } from '@/stores/treeStore';
import { AVAILABLE_MODELS } from '@/lib/ollama';

export default function OllamaModal({ onClose }: { onClose: () => void }) {
  const { ollamaConfig, setOllamaConfig } = useTreeStore();
  const [url, setUrl]     = useState(ollamaConfig.url);
  const [model, setModel] = useState(ollamaConfig.model);
  const [status, setStatus] = useState('');
  const [extra, setExtra]   = useState<string[]>([]);

  const test = async () => {
    setStatus('Verbinde…');
    try {
      const res = await fetch('/api/ai');
      const d = await res.json();
      if (d.models?.length) { setExtra(d.models); setStatus('✓ Verbunden · ' + d.models.length + ' Modell(e)'); }
      else setStatus(d.error ? '✗ ' + d.error : '✗ Keine Modelle gefunden');
    } catch { setStatus('✗ Verbindung fehlgeschlagen'); }
  };

  const IS: React.CSSProperties = {
    background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)',
    color:'#F0E6D3', borderRadius:8, padding:'10px 12px', width:'100%', fontFamily:'Inter,sans-serif', fontSize:13,
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{background:'rgba(0,0,0,.78)',backdropFilter:'blur(8px)'}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="w-[440px] max-w-[92vw] rounded-2xl p-7" style={{background:'#0A140C',border:'1px solid rgba(201,162,39,.28)'}}>
        <h3 className="font-playfair font-black text-xl text-[#F0E6D3] mb-1">🦙 Lokale KI — Ollama</h3>
        <p className="text-xs font-inter mb-6 leading-relaxed" style={{color:'#3D5A3F'}}>
          Kein API-Key. Kein Cloud. Deine KI läuft auf deinem Rechner.
        </p>
        <div className="mb-4">
          <label className="text-[10px] tracking-[2.5px] uppercase font-inter block mb-2" style={{color:'#3D5A3F'}}>URL</label>
          <input value={url} onChange={e=>setUrl(e.target.value)} style={IS}/>
        </div>
        <div className="mb-5">
          <label className="text-[10px] tracking-[2.5px] uppercase font-inter block mb-2" style={{color:'#3D5A3F'}}>Modell</label>
          <select value={model} onChange={e=>setModel(e.target.value)} style={IS}>
            {[...new Set([...AVAILABLE_MODELS,...extra])].map(m=>(
              <option key={m} value={m} style={{background:'#0A1A0C'}}>{m}</option>
            ))}
          </select>
        </div>
        {status && (
          <div className="text-xs font-inter px-3 py-2 rounded-lg mb-4"
            style={{background:'rgba(255,255,255,.04)',color:status.startsWith('✓')?'#4ADE80':'#F87171'}}>
            {status}
          </div>
        )}
        <div className="rounded-xl p-4 mb-5" style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)'}}>
          <p className="text-[10px] tracking-[2px] uppercase font-inter mb-3" style={{color:'#C9A227'}}>Terminal-Befehle</p>
          {['ollama pull llama3','OLLAMA_ORIGINS=* ollama serve'].map(cmd=>(
            <code key={cmd} className="block text-xs mb-2 px-3 py-2 rounded"
              style={{background:'rgba(255,255,255,.06)',color:'#7ABF52',fontFamily:'monospace'}}>{cmd}</code>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={test} className="flex-1 py-2.5 rounded-lg text-sm font-inter"
            style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.12)',color:'#A8C0AA'}}>
            Verbindung testen
          </button>
          <button onClick={()=>{setOllamaConfig({url,model});onClose();}} className="flex-1 py-2.5 rounded-lg text-sm font-bold font-inter"
            style={{background:'#C9A227',color:'#06090A'}}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}