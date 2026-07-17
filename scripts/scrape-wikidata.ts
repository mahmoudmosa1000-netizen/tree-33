// scripts/scrape-wikidata.ts
// Automatischer Philosoph-Scraper: Wikidata → Wikipedia → PostgreSQL
// Ausführen: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/scrape-wikidata.ts

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// ─── Wikidata SPARQL Query ──────────────────────────────────────────────────
const SPARQL_QUERY = `
SELECT DISTINCT
  ?philosopher
  ?philosopherLabel
  ?philosopherDesc
  ?birthYear ?deathYear
  ?image
  ?wikiTitle
WHERE {
  ?philosopher wdt:P31 wd:Q5 .
  ?philosopher wdt:P106/wdt:P279* wd:Q4964182 .
  
  OPTIONAL { ?philosopher wdt:P569 ?birth . BIND(YEAR(?birth) AS ?birthYear) }
  OPTIONAL { ?philosopher wdt:P570 ?death . BIND(YEAR(?death) AS ?deathYear) }
  OPTIONAL { ?philosopher wdt:P18 ?image }
  OPTIONAL {
    ?article schema:about ?philosopher ;
             schema:isPartOf <https://de.wikipedia.org/> ;
             schema:name ?wikiTitle .
  }
  
  FILTER(BOUND(?birthYear))
  FILTER(?birthYear > -700 && ?birthYear < 1970)
  FILTER(BOUND(?wikiTitle))
  
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "de,en".
  }
}
ORDER BY ?birthYear
LIMIT 400
`;

// ─── Era mapping by birth year ──────────────────────────────────────────────
function detectEra(birthYear: number, label: string): string {
  const l = label.toLowerCase();
  if (l.includes('konfuz') || l.includes('laozi') || l.includes('mengzi')) return 'Ostasien';
  if (l.includes('ibn') || l.includes('al-') || l.includes('averr') || l.includes('avicen')) return 'Islamische Phil.';
  if (birthYear < -400) return 'Vorsokratik';
  if (birthYear < 0)    return 'Antike';
  if (birthYear < 500)  return 'Spätantike';
  if (birthYear < 1300) return 'Mittelalter';
  if (birthYear < 1600) return 'Renaissance';
  if (birthYear < 1700) return 'Neuzeit';
  if (birthYear < 1790) return 'Aufklärung';
  if (birthYear < 1840) return 'Idealismus';
  if (birthYear < 1870) return 'Sozialphilosophie';
  if (birthYear < 1900) return 'Lebensphilosophie';
  if (birthYear < 1920) return 'Phänomenologie';
  if (birthYear < 1940) return 'Existenzialismus';
  if (birthYear < 1960) return 'Analytisch';
  return 'Zeitgenössisch';
}

// ─── Color by era ───────────────────────────────────────────────────────────
const ERA_COLORS: Record<string, string> = {
  'Vorsokratik':        '#F59E0B',
  'Antike':             '#F59E0B',
  'Spätantike':         '#FCD34D',
  'Ostasien':           '#FCD34D',
  'Islamische Phil.':   '#60A5FA',
  'Mittelalter':        '#60A5FA',
  'Renaissance':        '#A78BFA',
  'Neuzeit':            '#A78BFA',
  'Aufklärung':         '#34D399',
  'Idealismus':         '#34D399',
  'Sozialphilosophie':  '#FB923C',
  'Lebensphilosophie':  '#F87171',
  'Phänomenologie':     '#F87171',
  'Existenzialismus':   '#F87171',
  'Analytisch':         '#FB923C',
  'Zeitgenössisch':     '#E879F9',
};

// ─── Auto-position algorithm ────────────────────────────────────────────────
// X: era-based zones | Y: birth year mapped to tree height
const ERA_X_ZONES: Record<string, [number, number]> = {
  'Vorsokratik':        [60, 220],
  'Antike':             [80, 260],
  'Spätantike':         [180, 340],
  'Ostasien':           [20, 90],
  'Islamische Phil.':   [240, 380],
  'Mittelalter':        [200, 340],
  'Renaissance':        [380, 520],
  'Neuzeit':            [480, 640],
  'Aufklärung':         [520, 680],
  'Idealismus':         [420, 560],
  'Sozialphilosophie':  [480, 580],
  'Lebensphilosophie':  [360, 480],
  'Phänomenologie':     [160, 320],
  'Existenzialismus':   [200, 380],
  'Analytisch':         [580, 760],
  'Zeitgenössisch':     [300, 520],
};

function autoPosition(
  birthYear: number,
  era: string,
  occupied: Array<{x: number; y: number}>
): {x: number; y: number} {
  const Y_MIN = 55, Y_MAX = 650;
  const YEAR_MIN = -650, YEAR_MAX = 1970;
  const rawY = Y_MAX - ((birthYear - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * (Y_MAX - Y_MIN);
  const baseY = Math.max(Y_MIN, Math.min(Y_MAX, Math.round(rawY)));

  const [xMin, xMax] = ERA_X_ZONES[era] ?? [200, 600];
  const xRange = xMax - xMin;

  // Try multiple positions to avoid overlap
  for (let attempt = 0; attempt < 20; attempt++) {
    const jitterX = (Math.random() - 0.5) * xRange * 0.6;
    const jitterY = (Math.random() - 0.5) * 30;
    const x = Math.round(xMin + xRange / 2 + jitterX);
    const y = Math.round(baseY + jitterY);

    const tooClose = occupied.some(
      (p) => Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2)) < 45
    );
    if (!tooClose) return { x, y };
  }

  // Fallback: stack vertically
  return { x: Math.round(xMin + xRange / 2), y: Math.round(baseY + occupied.length * 5) };
}

// ─── Wikipedia bio fetch ─────────────────────────────────────────────────────
async function fetchWikiBio(title: string): Promise<{ bio_de: string; bio_en: string } | null> {
  try {
    const [deRes, enRes] = await Promise.all([
      fetch(`https://de.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`),
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`),
    ]);
    const [de, en] = await Promise.all([
      deRes.ok ? deRes.json() : null,
      enRes.ok ? enRes.json() : null,
    ]);
    const bio_de = de?.extract?.slice(0, 400) ?? '';
    const bio_en = en?.extract?.slice(0, 400) ?? bio_de;
    return bio_de ? { bio_de, bio_en } : null;
  } catch {
    return null;
  }
}

// ─── Slug generation ────────────────────────────────────────────────────────
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 30);
}

// ─── Main scraper ────────────────────────────────────────────────────────────
async function scrape() {
  console.log('🌍 Wikidata-Scraper gestartet...');

  // 1. SPARQL query
  const response = await fetch(
    `https://query.wikidata.org/sparql?query=${encodeURIComponent(SPARQL_QUERY)}&format=json`,
    { headers: { 'User-Agent': 'TreeOfKnowledge/1.0 (philosophical-platform)' } }
  );
  const data = await response.json();
  const results = data.results.bindings as any[];
  console.log(`✓ ${results.length} Ergebnisse von Wikidata`);

  // 2. Deduplicate by name
  const seen = new Set<string>();
  const unique = results.filter((r) => {
    const name = r.philosopherLabel?.value;
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
  console.log(`✓ ${unique.length} einzigartige Philosophen`);

  // 3. Load existing positions to avoid overlaps
  const existing = await db.philosopher.findMany({ select: { treeX: true, treeY: true, slug: true } });
  const occupied = existing.map((p) => ({ x: p.treeX, y: p.treeY }));
  const existingSlugs = new Set(existing.map((p) => p.slug));

  // 4. Process each philosopher
  let added = 0, skipped = 0, errors = 0;

  for (const r of unique) {
    const name: string = r.philosopherLabel?.value ?? '';
    if (!name || name.startsWith('Q')) { skipped++; continue; }

    const slug = toSlug(name);
    if (existingSlugs.has(slug)) { skipped++; continue; }

    const birthYear = parseInt(r.birthYear?.value ?? '0');
    const deathYear = r.deathYear?.value ? parseInt(r.deathYear.value) : undefined;
    const wikiTitle: string = r.wikiTitle?.value ?? name;
    const era = detectEra(birthYear, name);
    const colorHex = ERA_COLORS[era] ?? '#A78BFA';
    const { x, y } = autoPosition(birthYear, era, occupied);
    const life = deathYear
      ? `${birthYear < 0 ? Math.abs(birthYear) + ' v.Chr.' : birthYear}–${deathYear}`
      : `*${birthYear < 0 ? Math.abs(birthYear) + ' v.Chr.' : birthYear}`;

    // Fetch Wikipedia bio
    const bios = await fetchWikiBio(wikiTitle);
    if (!bios) { skipped++; continue; }

    // Find or create era
    const eraRecord = await db.era.upsert({
      where: { slug: toSlug(era) },
      update: {},
      create: {
        slug: toSlug(era),
        name_de: era,
        name_en: era,
        colorHex,
        startYear: birthYear,
      },
    });

    try {
      await db.philosopher.create({
        data: {
          slug,
          name,
          shortName: name.split(' ').slice(-1)[0],
          life,
          birthYear,
          deathYear,
          eraId: eraRecord.id,
          treeX: x,
          treeY: y,
          colorHex,
          bio_de: bios.bio_de,
          bio_en: bios.bio_en,
          wikiSlug: wikiTitle,
          imageUrl: r.image?.value ?? null,
        },
      });

      occupied.push({ x, y });
      existingSlugs.add(slug);
      added++;

      process.stdout.write(`\r  ✓ ${added} hinzugefügt (${skipped} übersprungen)   `);

      // Rate limiting — Wikipedia erlaubt ~200 req/min
      await new Promise((r) => setTimeout(r, 350));
    } catch (e) {
      errors++;
    }
  }

  console.log(`\n\n🌳 Fertig!`);
  console.log(`   ✓ ${added} neue Philosophen hinzugefügt`);
  console.log(`   ⏭ ${skipped} übersprungen (doppelt oder ohne Bio)`);
  console.log(`   ✗ ${errors} Fehler`);
  console.log(`\nGesamtbestand: ${await db.philosopher.count()} Philosophen`);
}

scrape()
  .catch(console.error)
  .finally(() => db.$disconnect());
