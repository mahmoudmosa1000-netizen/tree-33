// src/app/api/ai/route.ts
// Proxied Ollama-Zugriff → löst Browser-CORS & Mixed-Content-Probleme

import { NextRequest, NextResponse } from 'next/server';
import { buildSystemPrompt, DEFAULT_OLLAMA_CONFIG } from '@/lib/ollama';
import type { Language } from '@/types';

export const runtime = 'nodejs'; // Edge Runtime unterstützt kein fetch-Streaming zu localhost

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { philosopher, question, language = 'de' } = body as {
      philosopher: { name: string; life: string; era: string; ideas: string[]; quote: string };
      question: string;
      language: Language;
    };

    if (!philosopher || !question) {
      return NextResponse.json({ error: 'philosopher und question sind erforderlich' }, { status: 400 });
    }

    const ollamaUrl = process.env.OLLAMA_URL || DEFAULT_OLLAMA_CONFIG.url;
    const model = process.env.OLLAMA_MODEL || DEFAULT_OLLAMA_CONFIG.model;
    const systemPrompt = buildSystemPrompt(philosopher, language);

    // Ollama aufrufen (server-seitig → kein CORS)
    const ollamaRes = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
        stream: true,
        options: {
          temperature: 0.75,
          top_p: 0.9,
          num_predict: 250,
        },
      }),
    });

    if (!ollamaRes.ok) {
      const errText = await ollamaRes.text();
      console.error('[/api/ai] Ollama Fehler:', errText);
      return NextResponse.json(
        { error: `Ollama antwortet nicht (${ollamaRes.status}). Läuft Ollama lokal?` },
        { status: 502 }
      );
    }

    // Stream direkt an den Client weiterleiten
    return new NextResponse(ollamaRes.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('[/api/ai]', error);
    return NextResponse.json(
      { error: 'Ollama nicht erreichbar. Starte mit: OLLAMA_ORIGINS=* ollama serve' },
      { status: 503 }
    );
  }
}

// ─── GET /api/ai/models ──────────────────────────────────
// Verfügbare Modelle abrufen
export async function GET() {
  try {
    const ollamaUrl = process.env.OLLAMA_URL || DEFAULT_OLLAMA_CONFIG.url;
    const res = await fetch(`${ollamaUrl}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return NextResponse.json({ models: [] });
    const data = await res.json();
    const models = data.models?.map((m: { name: string }) => m.name.split(':')[0]) ?? [];
    return NextResponse.json({ models, currentModel: process.env.OLLAMA_MODEL });
  } catch {
    return NextResponse.json({ models: [], error: 'Ollama nicht erreichbar' });
  }
}
