// src/app/api/philosophers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ─── GET /api/philosophers ───────────────────────────────
// Query params: ?slug=sokrates | ?era=antike | ?search=platon

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const eraSlug = searchParams.get('era');
    const search = searchParams.get('search');

    // Einzelner Philosoph mit allen Details
    if (slug) {
      const philosopher = await db.philosopher.findUnique({
        where: { slug },
        include: {
          era: true,
          ideas: true,
          quotes: { take: 3 },
          influencing: {
            include: { influenced: { select: { id: true, slug: true, name: true, colorHex: true } } },
          },
          influencedBy: {
            include: { influencer: { select: { id: true, slug: true, name: true, colorHex: true } } },
          },
        },
      });

      if (!philosopher) {
        return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
      }

      return NextResponse.json({ data: philosopher });
    }

    // Liste (für Baum-Rendering)
    const where: Record<string, unknown> = {};

    if (eraSlug) {
      where.era = { slug: eraSlug };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio_de: { contains: search, mode: 'insensitive' } },
      ];
    }

    const philosophers = await db.philosopher.findMany({
      where,
      include: {
        era: { select: { slug: true, name_de: true, name_en: true, colorHex: true } },
        ideas: { select: { id: true, name_de: true, name_en: true } },
        quotes: { take: 1, select: { text_de: true, text_en: true } },
        influencing: {
          select: { influenced: { select: { slug: true } } },
        },
      },
      orderBy: { birthYear: 'asc' },
    });

    return NextResponse.json({ data: philosophers });
  } catch (error) {
    console.error('[/api/philosophers]', error);
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}
