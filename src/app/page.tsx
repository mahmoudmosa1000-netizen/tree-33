// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useTreeStore } from '@/stores/treeStore';
import type { Philosopher } from '@/types';

// Lazy imports für Code-Splitting
import dynamic from 'next/dynamic';

const TreeSVG      = dynamic(() => import('@/components/Tree/TreeSVG'),     { ssr: false });
const MindMapView  = dynamic(() => import('@/components/Views/MindMapView'), { ssr: false });
const TimelineView = dynamic(() => import('@/components/Views/TimelineView'),{ ssr: false });
const Sidebar      = dynamic(() => import('@/components/Sidebar/Sidebar'),   { ssr: false });
const Header       = dynamic(() => import('@/components/UI/Header'),         { ssr: false });

export default function HomePage() {
  const { selectedId, view, select } = useTreeStore();
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([]);
  const [loading, setLoading] = useState(true);

  // Philosophen aus der Datenbank laden
  useEffect(() => {
    fetch('/api/philosophers')
      .then((r) => r.json())
      .then(({ data }) => {
        setPhilosophers(data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selected = philosophers.find((p) => p.id === selectedId) ?? null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-4">🌳</div>
          <p className="text-[#2E4A30] font-inter text-sm tracking-widest uppercase">
            Baum wächst…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse 100% 70% at 50% 100%, #0D2212 0%, #060B08 58%)' }}>
      <Header philosophers={philosophers} />

      <main
        className="flex-1 overflow-hidden transition-all duration-300"
        style={{ paddingRight: selected ? 395 : 0 }}
      >
        {view === 'tree'     && <TreeSVG      philosophers={philosophers} />}
        {view === 'mindmap'  && <MindMapView  philosophers={philosophers} />}
        {view === 'timeline' && <TimelineView philosophers={philosophers} />}
      </main>

      {selected && (
        <Sidebar
          philosopher={selected}
          onClose={() => select(null)}
        />
      )}
    </div>
  );
}
