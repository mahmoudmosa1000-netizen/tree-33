// src/stores/treeStore.ts
// Globaler App-State mit Persistenz (localStorage)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { TreeStoreState, View, Language, OllamaConfig } from '@/types';
import { DEFAULT_OLLAMA_CONFIG } from '@/lib/ollama';

export const useTreeStore = create<TreeStoreState>()(
  persist(
    (set) => ({
      // ─── State ──────────────────────────────────────────
      selectedId: null,
      view: 'tree',
      language: 'de',
      showParticles: false,
      favorites: [],
      growKey: 0,
      ollamaConfig: DEFAULT_OLLAMA_CONFIG,

      // ─── Actions ─────────────────────────────────────────
      select: (id) =>
        set({ selectedId: id }),

      setView: (view: View) =>
        set((s) => ({
          view,
          growKey: view === 'tree' ? s.growKey + 1 : s.growKey,
        })),

      setLanguage: (language: Language) =>
        set({ language }),

      toggleParticles: () =>
        set((s) => ({ showParticles: !s.showParticles })),

      toggleFavorite: (id: string) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),

      triggerGrow: () =>
        set((s) => ({ growKey: s.growKey + 1 })),

      setOllamaConfig: (config: OllamaConfig) =>
        set({ ollamaConfig: config }),
    }),
    {
      name: 'tree-of-knowledge-store',
      storage: createJSONStorage(() => localStorage),
      // Nur diese Keys persistieren:
      partialize: (state) => ({
        language: state.language,
        showParticles: state.showParticles,
        favorites: state.favorites,
        ollamaConfig: state.ollamaConfig,
      }),
    }
  )
);
