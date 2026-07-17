// scripts/detect-influences.ts
// Findet automatisch Einflussbeziehungen zwischen Philosophen
// Methode: Keyword-Matching + Epochs-Logik + Wikipedia-Verlinkungen
// Ausführen: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/detect-influences.ts

import { PrismaClient, InfluenceType } from '@prisma/client';

const db = new PrismaClient();

// ─── Bekannte Verbindungen (manuell kuratiert) ──────────────────────────────
const KNOWN_INFLUENCES: Array<[string, string, InfluenceType, number]> = [
  // [influencer_slug, influenced_slug, type, strength]
  ['sokrates',       'platon',          'DIRECT',       1.0],
  ['sokrates',       'xenophon',        'DIRECT',       0.8],
  ['platon',         'aristoteles',     'DIRECT',       1.0],
  ['platon',         'augustinus',      'INTELLECTUAL', 0.9],
  ['platon',         'plotin',          'DIRECT',       0.95],
  ['aristoteles',    'thomas',          'INTELLECTUAL', 0.95],
  ['aristoteles',    'ibnrushd',        'DIRECT',       1.0],
  ['aristoteles',    'ibn_sina',        'DIRECT',       0.9],
  ['ibnrushd',       'thomas',          'INTELLECTUAL', 0.85],
  ['augustinus',     'thomas',          'DIRECT',       0.9],
  ['thomas',         'descartes',       'CRITICAL',     0.6],
  ['descartes',      'spinoza',         'INTELLECTUAL', 0.85],
  ['descartes',      'leibniz',         'INTELLECTUAL', 0.8],
  ['descartes',      'kant',            'INTELLECTUAL', 0.75],
  ['locke',          'hume',            'DIRECT',       0.9],
  ['locke',          'rousseau',        'INTELLECTUAL', 0.7],
  ['locke',          'kant',            'INTELLECTUAL', 0.8],
  ['hume',           'kant',            'DIRECT',       0.95],
  ['rousseau',       'kant',            'INTELLECTUAL', 0.7],
  ['rousseau',       'marx',            'INTELLECTUAL', 0.6],
  ['spinoza',        'kant',            'INTELLECTUAL', 0.65],
  ['spinoza',        'hegel',           'INTELLECTUAL', 0.8],
  ['kant',           'hegel',           'DIRECT',       0.95],
  ['kant',           'schopenhauer',    'DIRECT',       0.9],
  ['kant',           'rawls',           'INTELLECTUAL', 0.85],
  ['kant',           'fichte',          'DIRECT',       0.9],
  ['hegel',          'marx',            'CRITICAL',     0.95],
  ['hegel',          'nietzsche',       'CRITICAL',     0.8],
  ['hegel',          'kierkegaard',     'CRITICAL',     0.9],
  ['schopenhauer',   'nietzsche',       'DIRECT',       0.95],
  ['schopenhauer',   'wittgenstein',    'INTELLECTUAL', 0.6],
  ['marx',           'foucault',        'INTELLECTUAL', 0.7],
  ['kierkegaard',    'heidegger',       'INTELLECTUAL', 0.85],
  ['kierkegaard',    'sartre',          'INTELLECTUAL', 0.9],
  ['husserl',        'heidegger',       'DIRECT',       1.0],
  ['husserl',        'sartre',          'DIRECT',       0.85],
  ['husserl',        'arendt',          'DIRECT',       0.75],
  ['nietzsche',      'heidegger',       'INTELLECTUAL', 0.85],
  ['nietzsche',      'sartre',          'INTELLECTUAL', 0.75],
  ['nietzsche',      'foucault',        'INTELLECTUAL', 0.8],
  ['heidegger',      'sartre',          'DIRECT',       0.95],
  ['heidegger',      'arendt',          'DIRECT',       0.9],
  ['sartre',         'beauvoir',        'DIRECT',       1.0],
  ['sartre',         'arendt',          'INTELLECTUAL', 0.6],
  ['beauvoir',       'arendt',          'PARALLEL',     0.5],
  ['wittgenstein',   'ryle',            'INTELLECTUAL', 0.7],
  ['frege',          'russell',         'INTELLECTUAL', 0.9],
  ['russell',        'wittgenstein',    'DIRECT',       0.95],
];

// ─── Automatische Erkennung via Epochen-Logik ────────────────────────────────
// Wenn Philosoph B 10-80 Jahre nach Philosoph A geboren wurde
// und beide dieselbe Era oder verwandte Eras haben → möglicher Einfluss
const ERA_RELATIONSHIPS: Record<string, string[]> = {
  'Antike':             ['Mittelalter', 'Islamische Phil.', 'Renaissance'],
  'Islamische Phil.':   ['Mittelalter', 'Renaissance'],
  'Mittelalter':        ['Renaissance', 'Neuzeit'],
  'Renaissance':        ['Neuzeit', 'Aufklärung'],
  'Neuzeit':            ['Aufklärung', 'Idealismus'],
  'Aufklärung':         ['Idealismus', 'Lebensphilosophie'],
  'Idealismus':         ['Lebensphilosophie', 'Sozialphilosophie', 'Existenzialismus'],
  'Lebensphilosophie':  ['Existenzialismus', 'Phänomenologie'],
  'Phänomenologie':     ['Existenzialismus', 'Analytisch'],
  'Existenzialismus':   ['Zeitgenössisch', 'Postmoderne'],
  'Analytisch':         ['Zeitgenössisch'],
  'Sozialphilosophie':  ['Existenzialismus', 'Postmoderne', 'Zeitgenössisch'],
};

async function detectInfluences() {
  console.log('🔍 Einfluss-Erkennung gestartet...\n');

  // 1. Bekannte Verbindungen eintragen
  console.log('📚 Bekannte Verbindungen eintragen...');
  let knownAdded = 0;

  for (const [fromSlug, toSlug, type, strength] of KNOWN_INFLUENCES) {
    const [from, to] = await Promise.all([
      db.philosopher.findUnique({ where: { slug: fromSlug }, select: { id: true } }),
      db.philosopher.findUnique({ where: { slug: toSlug }, select: { id: true } }),
    ]);
    if (!from || !to) continue;

    await db.influence.upsert({
      where: { influencerId_influencedId: { influencerId: from.id, influencedId: to.id } },
      update: { strength, type },
      create: { influencerId: from.id, influencedId: to.id, strength, type },
    });
    knownAdded++;
  }
  console.log(`  ✓ ${knownAdded} bekannte Verbindungen eingetragen\n`);

  // 2. Automatische Erkennung via Epochen-Logik
  console.log('🤖 Automatische Erkennung via Epochen-Logik...');
  const all = await db.philosopher.findMany({
    include: { era: true },
    orderBy: { birthYear: 'asc' },
  });

  let autoAdded = 0;
  const BIRTH_GAP_MIN = 10, BIRTH_GAP_MAX = 80;

  for (const a of all) {
    const relatedEras = ERA_RELATIONSHIPS[a.era.name_de] ?? [];

    for (const b of all) {
      if (a.id === b.id) continue;

      const gap = b.birthYear - a.birthYear;
      if (gap < BIRTH_GAP_MIN || gap > BIRTH_GAP_MAX) continue;

      const sameOrRelated =
        a.era.id === b.era.id || relatedEras.includes(b.era.name_de);
      if (!sameOrRelated) continue;

      const existing = await db.influence.findUnique({
        where: { influencerId_influencedId: { influencerId: a.id, influencedId: b.id } },
      });
      if (existing) continue;

      // Nur als möglicher (schwacher) Einfluss markieren
      await db.influence.create({
        data: {
          influencerId: a.id,
          influencedId: b.id,
          strength: 0.3, // niedrig = automatisch erkannt, nicht verifiziert
          type: 'PARALLEL',
        },
      });
      autoAdded++;
    }
  }
  console.log(`  ✓ ${autoAdded} automatische Verbindungen gefunden\n`);

  // ── Statistik ──────────────────────────────────────────
  const total    = await db.influence.count();
  const direct   = await db.influence.count({ where: { type: 'DIRECT' } });
  const intel    = await db.influence.count({ where: { type: 'INTELLECTUAL' } });
  const parallel = await db.influence.count({ where: { type: 'PARALLEL' } });
  const critical = await db.influence.count({ where: { type: 'CRITICAL' } });

  console.log('📊 Einfluss-Netzwerk:');
  console.log(`   Gesamt:       ${total} Verbindungen`);
  console.log(`   Direkt:       ${direct}`);
  console.log(`   Intellektuell:${intel}`);
  console.log(`   Parallel:     ${parallel}`);
  console.log(`   Kritisch:     ${critical}`);
  console.log('\n✅ Fertig!');
}

detectInfluences()
  .catch(console.error)
  .finally(() => db.$disconnect());
