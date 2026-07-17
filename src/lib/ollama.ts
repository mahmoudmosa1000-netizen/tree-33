// src/lib/ollama.ts
// Vollständiger Ollama-Client mit Streaming, Typen und System-Prompts

import type { Language, OllamaConfig, OllamaModel, OllamaStreamChunk } from '@/types';

// ─── Standard-Konfiguration ──────────────────────────────

export const DEFAULT_OLLAMA_CONFIG: OllamaConfig = {
  url: process.env.OLLAMA_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'llama3',
};

export const AVAILABLE_MODELS = [
  'llama3', 'llama3.1', 'llama3.2',
  'mistral', 'mistral-nemo',
  'phi3', 'phi4',
  'gemma2',
  'qwen2.5', 'qwen2.5:14b',
  'deepseek-r1',
  'codellama',
];

// ─── Verbindungstest ─────────────────────────────────────

export async function testOllamaConnection(url: string): Promise<{
  ok: boolean;
  models: string[];
  error?: string;
}> {
  try {
    const res = await fetch(`${url}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { ok: false, models: [], error: `HTTP ${res.status}` };
    const data = await res.json();
    const models: string[] = (data.models as OllamaModel[])?.map(m => m.name.split(':')[0]) ?? [];
    return { ok: true, models };
  } catch (err) {
    return { ok: false, models: [], error: String(err) };
  }
}

// ─── System-Prompts ──────────────────────────────────────

interface PhilosopherContext {
  name: string;
  life: string;
  era: string;
  ideas: string[];
  quote: string;
}

export function buildSystemPrompt(philosopher: PhilosopherContext, language: Language): string {
  const name = philosopher.name;
  const ideas = philosopher.ideas.join(', ');

  const prompts: Record<Language, string> = {
    de: `Du bist ${name} (${philosopher.life}), Philosoph des ${philosopher.era}.
Antworte als ${name} in der Ich-Form auf Deutsch.
Deine zentralen Ideen: ${ideas}.
Dein bekanntestes Zitat: "${philosopher.quote}".
Antworte tiefgründig, charakteristisch für deinen Denkstil, und kompakt (max 120 Wörter).
Beginne direkt ohne deinen Namen zu nennen.`,

    en: `You are ${name} (${philosopher.life}), philosopher of ${philosopher.era}.
Answer as ${name} in first person in English.
Your central ideas: ${ideas}.
Your famous quote: "${philosopher.quote}".
Answer profoundly, true to your thinking style, and concisely (max 120 words).
Begin directly without mentioning your name.`,

    ar: `أنت ${name} (${philosopher.life})، فيلسوف من حقبة ${philosopher.era}.
أجب بوصفك ${name} بضمير المتكلم باللغة العربية.
أفكارك المحورية: ${ideas}.
اقتباسك الشهير: "${philosopher.quote}".
أجب بعمق، وفق أسلوبك الفكري الخاص، وبإيجاز (100 كلمة كحد أقصى).
ابدأ مباشرة دون ذكر اسمك.`,
  };

  return prompts[language];
}

// ─── Streaming Chat ──────────────────────────────────────

export async function streamOllamaResponse(
  config: OllamaConfig,
  systemPrompt: string,
  userMessage: string,
  onChunk: (text: string, full: string) => void,
  onDone: (full: string) => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const res = await fetch(`${config.url}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        stream: true,
        options: {
          temperature: 0.75,
          top_p: 0.9,
          num_predict: 200,
        },
      }),
    });

    if (!res.ok) {
      onError(`Ollama Fehler: HTTP ${res.status}`);
      return;
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split('\n').filter(Boolean)) {
        try {
          const parsed = JSON.parse(line) as OllamaStreamChunk;
          if (parsed.message?.content) {
            fullText += parsed.message.content;
            onChunk(parsed.message.content, fullText);
          }
          if (parsed.done) {
            onDone(fullText);
            return;
          }
        } catch {
          // Ungültige JSON-Zeile – überspringen
        }
      }
    }

    onDone(fullText);
  } catch (err) {
    onError(`Verbindung fehlgeschlagen. Läuft Ollama? (OLLAMA_ORIGINS=* ollama serve)\n${String(err)}`);
  }
}

// ─── Next.js API Route Proxy ─────────────────────────────
// Nutze /api/ai statt direkt Ollama anzusprechen (löst CORS + Mixed-Content)

export async function askPhilosopher(
  philosopher: PhilosopherContext,
  question: string,
  language: Language,
  onUpdate: (text: string) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ philosopher, question, language }),
      });

      if (!res.ok) {
        const err = await res.text();
        reject(new Error(err));
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n').filter(Boolean)) {
          try {
            const parsed = JSON.parse(line) as OllamaStreamChunk;
            if (parsed.message?.content) {
              fullText += parsed.message.content;
              onUpdate(fullText);
            }
          } catch {}
        }
      }

      resolve(fullText);
    } catch (err) {
      reject(err);
    }
  });
}
