// src/types/index.ts

export type Language = 'de' | 'en' | 'ar';
export type View = 'tree' | 'mindmap' | 'timeline' | 'galaxy';

// ─── Database Entities ───────────────────────────────────

export interface Era {
  id: string;
  slug: string;
  name_de: string;
  name_en: string;
  name_ar?: string;
  colorHex: string;
  startYear: number;
  endYear?: number;
}

export interface Philosopher {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  life: string;
  birthYear: number;
  deathYear?: number;
  era: Era;
  treeX: number;
  treeY: number;
  colorHex: string;
  bio_de: string;
  bio_en: string;
  bio_ar?: string;
  wikiSlug?: string;
  imageUrl?: string;
  ideas: Idea[];
  quotes: Quote[];
  influencing: Influence[];
  influencedBy: Influence[];
}

export interface Idea {
  id: string;
  name_de: string;
  name_en: string;
  name_ar?: string;
  description?: string;
}

export interface Quote {
  id: string;
  text_de: string;
  text_en?: string;
  text_ar?: string;
  source?: string;
}

export interface Influence {
  id: string;
  influencer: Pick<Philosopher, 'id' | 'slug' | 'name' | 'colorHex'>;
  influenced: Pick<Philosopher, 'id' | 'slug' | 'name' | 'colorHex'>;
  strength: number;
  type: 'DIRECT' | 'INTELLECTUAL' | 'CRITICAL' | 'PARALLEL';
}

// ─── Ollama ─────────────────────────────────────────────

export interface OllamaConfig {
  url: string;
  model: string;
}

export interface OllamaStreamChunk {
  model: string;
  message: { role: string; content: string };
  done: boolean;
}

export interface OllamaModel {
  name: string;
  size: number;
  modified_at: string;
}

// ─── Tree Visual ─────────────────────────────────────────

export interface LeafCluster {
  cx: number;
  cy: number;
  r: number;
  col: string;
  leaves: Leaf[];
}

export interface Leaf {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  o: number;
}

export interface BranchPath {
  d: string;
  w: number;
}

// ─── UI State ────────────────────────────────────────────

export interface TreeStoreState {
  selectedId: string | null;
  view: View;
  language: Language;
  showParticles: boolean;
  favorites: string[];
  growKey: number;
  ollamaConfig: OllamaConfig;

  // Actions
  select: (id: string | null) => void;
  setView: (view: View) => void;
  setLanguage: (lang: Language) => void;
  toggleParticles: () => void;
  toggleFavorite: (id: string) => void;
  triggerGrow: () => void;
  setOllamaConfig: (config: OllamaConfig) => void;
}

// ─── API Responses ───────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface PhilosopherListItem {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  life: string;
  era: Pick<Era, 'name_de' | 'name_en' | 'colorHex'>;
  treeX: number;
  treeY: number;
  colorHex: string;
}
