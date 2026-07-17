// prisma/seed.ts
import { PrismaClient, InfluenceType } from '@prisma/client';

const prisma = new PrismaClient();

const ERAS = [
  { slug: 'antike',        name_de: 'Antike',          name_en: 'Antiquity',       colorHex: '#F59E0B', startYear: -600, endYear: 400 },
  { slug: 'mittelalter',   name_de: 'Mittelalter',      name_en: 'Middle Ages',     colorHex: '#60A5FA', startYear: 400,  endYear: 1400 },
  { slug: 'neuzeit',       name_de: 'Neuzeit',          name_en: 'Early Modern',    colorHex: '#A78BFA', startYear: 1400, endYear: 1700 },
  { slug: 'aufklaerung',   name_de: 'Aufklärung',       name_en: 'Enlightenment',   colorHex: '#34D399', startYear: 1680, endYear: 1800 },
  { slug: 'idealismus',    name_de: 'Idealismus',       name_en: 'Idealism',        colorHex: '#34D399', startYear: 1780, endYear: 1850 },
  { slug: 'lebensphil',    name_de: 'Lebensphilosophie',name_en: 'Life Philosophy', colorHex: '#F87171', startYear: 1840, endYear: 1910 },
  { slug: 'existenz',      name_de: 'Existenzialismus', name_en: 'Existentialism',  colorHex: '#F87171', startYear: 1820, endYear: 1980 },
  { slug: 'analytisch',    name_de: 'Analytisch',       name_en: 'Analytic',        colorHex: '#FB923C', startYear: 1870, endYear: 1970 },
  { slug: 'sozialphil',    name_de: 'Sozialphilosophie',name_en: 'Social Phil.',    colorHex: '#FB923C', startYear: 1800, endYear: 1900 },
  { slug: 'feminismus',    name_de: 'Feminismus',       name_en: 'Feminism',        colorHex: '#E879F9', startYear: 1900, endYear: 2000 },
  { slug: 'postmoderne',   name_de: 'Postmoderne',      name_en: 'Postmodernism',   colorHex: '#E879F9', startYear: 1950, endYear: 2000 },
  { slug: 'zeitgenoessisch',name_de:'Zeitgenössisch',   name_en: 'Contemporary',    colorHex: '#E879F9', startYear: 1900, endYear: 2000 },
  { slug: 'rationalismus', name_de: 'Rationalismus',    name_en: 'Rationalism',     colorHex: '#A78BFA', startYear: 1600, endYear: 1700 },
];

const PHILOSOPHERS = [
  {
    slug: 'sokrates', name: 'Sokrates', shortName: 'Sokrates', life: '469–399 v.Chr.', birthYear: -469, deathYear: -399,
    eraSlug: 'antike', treeX: 155, treeY: 370, colorHex: '#F59E0B',
    bio_de: 'Sokrates hinterließ keine Schriften – sein Denken lebt durch Platon. Seine Methode des systematischen Fragens legte den Grundstein der westlichen Philosophie. Der erste Denker, der nicht nach der Natur, sondern nach dem Menschen fragte.',
    bio_en: 'Socrates left no writings — his thought lives through Plato. His method of systematic questioning laid the foundation of Western philosophy. The first thinker to turn from nature to humanity.',
    ideas: [{ de: 'Mäeutik', en: 'Maieutics' }, { de: 'Selbsterkenntnis', en: 'Self-Knowledge' }, { de: 'Tugendethik', en: 'Virtue Ethics' }, { de: 'Sokratischer Dialog', en: 'Socratic Dialogue' }],
    quote: { de: 'Ich weiß, dass ich nichts weiß.', en: 'I know that I know nothing.' },
    influences: ['platon'],
  },
  {
    slug: 'platon', name: 'Platon', shortName: 'Platon', life: '428–348 v.Chr.', birthYear: -428, deathYear: -348,
    eraSlug: 'antike', treeX: 100, treeY: 272, colorHex: '#F59E0B',
    bio_de: 'Platon gründete die Akademie – die erste Universität Europas. Seine Ideenlehre postuliert eine ewige Welt vollkommener Formen hinter der Erscheinungswelt. Die westliche Philosophie lässt sich als Reihe von Fußnoten zu Platon beschreiben.',
    bio_en: 'Plato founded the Academy — Europe\'s first university. His Theory of Forms posits an eternal world of perfect archetypes. All of Western philosophy can be described as footnotes to Plato.',
    ideas: [{ de: 'Ideenlehre', en: 'Theory of Forms' }, { de: 'Höhlengleichnis', en: 'Allegory of the Cave' }, { de: 'Politeia', en: 'The Republic' }, { de: 'Akademie', en: 'The Academy' }],
    quote: { de: 'Das Staunen ist der Anfang der Weisheit.', en: 'Wonder is the beginning of wisdom.' },
    influences: ['aristoteles', 'augustinus'],
  },
  {
    slug: 'aristoteles', name: 'Aristoteles', shortName: 'Aristoteles', life: '384–322 v.Chr.', birthYear: -384, deathYear: -322,
    eraSlug: 'antike', treeX: 206, treeY: 308, colorHex: '#F59E0B',
    bio_de: 'Aristoteles schuf das erste systematische Wissenssystem der Menschheit – von Logik über Biologie bis Ethik. Als Lehrer Alexanders des Großen verband er Denken und Macht auf einzigartige Weise.',
    bio_en: 'Aristotle created the first systematic body of knowledge in history — from logic to biology to ethics. As tutor to Alexander the Great, he uniquely combined thought and power.',
    ideas: [{ de: 'Logik', en: 'Logic' }, { de: 'Eudaimonia', en: 'Eudaimonia' }, { de: 'Metaphysik', en: 'Metaphysics' }, { de: 'Empirismus', en: 'Empiricism' }],
    quote: { de: 'Das Ziel des Menschen ist die Glückseligkeit.', en: 'The goal of man is happiness.' },
    influences: ['thomas'],
  },
  {
    slug: 'augustinus', name: 'Augustinus', shortName: 'Augustinus', life: '354–430 n.Chr.', birthYear: 354, deathYear: 430,
    eraSlug: 'mittelalter', treeX: 278, treeY: 287, colorHex: '#60A5FA',
    bio_de: 'Augustinus verband Platons Philosophie mit dem christlichen Glauben. Seine Confessiones sind das erste psychologische Selbstporträt der Weltliteratur – eine Suche nach Gott als Suche nach sich selbst.',
    bio_en: 'Augustine united Platonic philosophy with Christian faith. His Confessions are the world\'s first psychological self-portrait — a search for God as a search for the self.',
    ideas: [{ de: 'Gotteslehre', en: 'Theology' }, { de: 'Erbsünde', en: 'Original Sin' }, { de: 'Zeit & Ewigkeit', en: 'Time & Eternity' }, { de: 'Confessiones', en: 'Confessions' }],
    quote: { de: 'Unruhig ist unser Herz, bis es Ruhe findet in dir.', en: 'Our heart is restless until it rests in Thee.' },
    influences: ['thomas'],
  },
  {
    slug: 'thomas', name: 'Thomas v. Aquin', shortName: 'Thomas', life: '1225–1274', birthYear: 1225, deathYear: 1274,
    eraSlug: 'mittelalter', treeX: 240, treeY: 220, colorHex: '#60A5FA',
    bio_de: 'Thomas synthetisierte Aristoteles und christliche Theologie zur Scholastik. Seine Summa Theologica ist das umfassendste philosophisch-theologische System des Mittelalters – bis heute Grundlage katholischer Lehre.',
    bio_en: 'Thomas synthesized Aristotle and Christian theology into Scholasticism. His Summa Theologica remains the most comprehensive medieval philosophical-theological system.',
    ideas: [{ de: 'Gottesbeweis', en: 'Proof of God' }, { de: 'Scholastik', en: 'Scholasticism' }, { de: 'Natürliches Recht', en: 'Natural Law' }, { de: 'Vernunft & Glaube', en: 'Reason & Faith' }],
    quote: { de: 'Die Liebe trägt den Menschen über sich selbst hinaus.', en: 'Love carries man beyond himself.' },
    influences: ['descartes'],
  },
  {
    slug: 'descartes', name: 'René Descartes', shortName: 'Descartes', life: '1596–1650', birthYear: 1596, deathYear: 1650,
    eraSlug: 'neuzeit', treeX: 560, treeY: 337, colorHex: '#A78BFA',
    bio_de: 'Descartes begründete die neuzeitliche Philosophie durch radikalen Zweifel an allem Überlieferten. Sein Cogito ist der bekannteste Satz der Philosophiegeschichte – Startpunkt des modernen Denkens.',
    bio_en: 'Descartes founded modern philosophy through radical doubt. His Cogito ergo sum is the most famous sentence in philosophy — the starting point of modern thought.',
    ideas: [{ de: 'Cogito ergo sum', en: 'Cogito ergo sum' }, { de: 'Methodischer Zweifel', en: 'Methodic Doubt' }, { de: 'Geist-Körper-Dualismus', en: 'Mind-Body Dualism' }, { de: 'Rationalismus', en: 'Rationalism' }],
    quote: { de: 'Ich denke, also bin ich.', en: 'I think, therefore I am.' },
    influences: ['kant'],
  },
  {
    slug: 'spinoza', name: 'Baruch Spinoza', shortName: 'Spinoza', life: '1632–1677', birthYear: 1632, deathYear: 1677,
    eraSlug: 'rationalismus', treeX: 618, treeY: 315, colorHex: '#A78BFA',
    bio_de: 'Spinoza identifizierte Gott mit der Natur selbst. Seine Ethik beweist die Realität wie ein Mathematiker – aus Definitionen und Axiomen. Er war einer der kühnsten und konsequentesten Denker aller Zeiten.',
    bio_en: 'Spinoza identified God with Nature itself. His Ethics proves reality like a mathematician — from definitions and axioms. Among the most rigorous thinkers in history.',
    ideas: [{ de: 'Deus sive Natura', en: 'God or Nature' }, { de: 'Pantheismus', en: 'Pantheism' }, { de: 'Ethica', en: 'Ethics' }, { de: 'Determinismus', en: 'Determinism' }],
    quote: { de: 'Der freie Mensch denkt an nichts weniger als an den Tod.', en: 'The free man thinks least of all about death.' },
    influences: ['kant', 'hegel'],
  },
  {
    slug: 'locke', name: 'John Locke', shortName: 'Locke', life: '1632–1704', birthYear: 1632, deathYear: 1704,
    eraSlug: 'aufklaerung', treeX: 652, treeY: 258, colorHex: '#34D399',
    bio_de: 'Locke begründete den modernen Empirismus und entwickelte die Theorie der Naturrechte. Sein Einfluss auf die amerikanische Unabhängigkeitserklärung und das moderne Verfassungsrecht ist direkt.',
    bio_en: 'Locke founded modern empiricism and developed the theory of natural rights. His ideas directly influenced the American Declaration of Independence.',
    ideas: [{ de: 'Tabula Rasa', en: 'Tabula Rasa' }, { de: 'Empirismus', en: 'Empiricism' }, { de: 'Sozialvertrag', en: 'Social Contract' }, { de: 'Naturrechte', en: 'Natural Rights' }],
    quote: { de: 'Der Verstand ist ein unbeschriebenes Blatt.', en: 'The mind is a blank slate.' },
    influences: ['kant', 'rousseau'],
  },
  {
    slug: 'rousseau', name: 'J.-J. Rousseau', shortName: 'Rousseau', life: '1712–1778', birthYear: 1712, deathYear: 1778,
    eraSlug: 'aufklaerung', treeX: 570, treeY: 268, colorHex: '#34D399',
    bio_de: 'Rousseaus Gesellschaftsvertrag: Der Mensch ist von Natur aus gut – die Zivilisation verdirbt ihn. Seine Ideen entfachten die Französische Revolution und begründeten die moderne Pädagogik.',
    bio_en: 'Rousseau\'s Social Contract: humans are naturally good, corrupted by civilization. His ideas fueled the French Revolution and founded modern pedagogy.',
    ideas: [{ de: 'Gesellschaftsvertrag', en: 'Social Contract' }, { de: 'Naturzustand', en: 'State of Nature' }, { de: 'Allgemeiner Wille', en: 'General Will' }, { de: 'Émile', en: 'Émile' }],
    quote: { de: 'Der Mensch ist von Natur aus gut.', en: 'Man is naturally good.' },
    influences: ['kant', 'marx'],
  },
  {
    slug: 'kant', name: 'Immanuel Kant', shortName: 'Kant', life: '1724–1804', birthYear: 1724, deathYear: 1804,
    eraSlug: 'aufklaerung', treeX: 592, treeY: 206, colorHex: '#34D399',
    bio_de: 'Kant vollzog die Kopernikanische Wende der Philosophie. Sein kategorischer Imperativ ist die tiefste Begründung von Würde und Moral, die die westliche Philosophie hervorgebracht hat.',
    bio_en: 'Kant performed the Copernican revolution in philosophy. His categorical imperative is the deepest grounding of dignity and morality in Western thought.',
    ideas: [{ de: 'Kategorischer Imperativ', en: 'Categorical Imperative' }, { de: 'Kritik d. reinen Vernunft', en: 'Critique of Pure Reason' }, { de: 'Pflichtethik', en: 'Duty Ethics' }, { de: 'Autonomie', en: 'Autonomy' }],
    quote: { de: 'Habe Mut, dich deines eigenen Verstandes zu bedienen.', en: 'Dare to use your own reason.' },
    influences: ['hegel'],
  },
  {
    slug: 'hegel', name: 'Georg W.F. Hegel', shortName: 'Hegel', life: '1770–1831', birthYear: 1770, deathYear: 1831,
    eraSlug: 'idealismus', treeX: 492, treeY: 177, colorHex: '#34D399',
    bio_de: 'Hegels Dialektik revolutionierte das Denken über Geschichte und Geist. These–Antithese–Synthese wurde zum Grundrhythmus westlichen Denkens, von Marx bis zum Existenzialismus.',
    bio_en: 'Hegel\'s dialectic revolutionized thinking about history and spirit. Thesis–Antithesis–Synthesis became the basic rhythm of Western intellectual life.',
    ideas: [{ de: 'Dialektik', en: 'Dialectic' }, { de: 'Weltgeist', en: 'World Spirit' }, { de: 'Phänomenologie', en: 'Phenomenology' }, { de: 'Geschichtsphilosophie', en: 'Philosophy of History' }],
    quote: { de: 'Das Wahre ist das Ganze.', en: 'The true is the whole.' },
    influences: ['nietzsche', 'marx'],
  },
  {
    slug: 'kierkegaard', name: 'S. Kierkegaard', shortName: 'Kierkegaard', life: '1813–1855', birthYear: 1813, deathYear: 1855,
    eraSlug: 'existenz', treeX: 190, treeY: 197, colorHex: '#F87171',
    bio_de: 'Kierkegaard, der Vater des Existenzialismus, betonte die radikale individuelle Wahl. Angst ist der Schwindel der Freiheit – das Zeichen, dass wir wirklich frei sind.',
    bio_en: 'Kierkegaard, the father of existentialism, emphasized radical individual choice. Anxiety is the dizziness of freedom — the sign that we truly are free.',
    ideas: [{ de: 'Angst', en: 'Anxiety' }, { de: 'Entweder-Oder', en: 'Either/Or' }, { de: 'Subjektivität', en: 'Subjectivity' }, { de: 'Glaube', en: 'Faith' }],
    quote: { de: 'Das Leben muss rückwärts verstanden, vorwärts gelebt werden.', en: 'Life must be understood backwards, but lived forwards.' },
    influences: ['heidegger', 'sartre'],
  },
  {
    slug: 'marx', name: 'Karl Marx', shortName: 'Marx', life: '1818–1883', birthYear: 1818, deathYear: 1883,
    eraSlug: 'sozialphil', treeX: 545, treeY: 147, colorHex: '#FB923C',
    bio_de: 'Marx kehrte Hegels Idealismus um: Nicht Ideen, sondern materielle Verhältnisse treiben die Geschichte. Seine Analyse des Kapitalismus prägt Wirtschaft und Politik bis heute.',
    bio_en: 'Marx inverted Hegel\'s idealism: not ideas but material conditions drive history. His analysis of capitalism continues to shape economics and politics.',
    ideas: [{ de: 'Historischer Materialismus', en: 'Historical Materialism' }, { de: 'Kapital', en: 'Capital' }, { de: 'Klassenkampf', en: 'Class Struggle' }, { de: 'Entfremdung', en: 'Alienation' }],
    quote: { de: 'Die Philosophen haben die Welt nur verschieden interpretiert. Es kommt drauf an, sie zu verändern.', en: 'Philosophers have only interpreted the world. The point is to change it.' },
    influences: ['foucault'],
  },
  {
    slug: 'nietzsche', name: 'F. Nietzsche', shortName: 'Nietzsche', life: '1844–1900', birthYear: 1844, deathYear: 1900,
    eraSlug: 'lebensphil', treeX: 407, treeY: 141, colorHex: '#F87171',
    bio_de: 'Nietzsche philosophierte mit dem Hammer. Er hinterfragte alle moralischen Grundlagen der westlichen Welt und entwarf eine radikale Philosophie der Lebenskraft – bis heute subversiv und befreiend.',
    bio_en: 'Nietzsche philosophized with a hammer, challenging all moral foundations of the Western world. His philosophy of life-force remains subversive and liberating today.',
    ideas: [{ de: 'Übermensch', en: 'Übermensch' }, { de: 'Wille zur Macht', en: 'Will to Power' }, { de: 'Ewige Wiederkehr', en: 'Eternal Recurrence' }, { de: 'Tod Gottes', en: 'Death of God' }],
    quote: { de: 'Was mich nicht umbringt, macht mich stärker.', en: 'What does not kill me makes me stronger.' },
    influences: ['heidegger', 'sartre', 'foucault'],
  },
  {
    slug: 'heidegger', name: 'M. Heidegger', shortName: 'Heidegger', life: '1889–1976', birthYear: 1889, deathYear: 1976,
    eraSlug: 'existenz', treeX: 267, treeY: 162, colorHex: '#F87171',
    bio_de: 'Heidegger stellte die Grundfrage neu: Was bedeutet es überhaupt zu sein? Sein und Zeit ist das bedeutendste philosophische Werk des 20. Jahrhunderts.',
    bio_en: 'Heidegger posed the fundamental question: what does it mean to be at all? Being and Time is the most important philosophical work of the 20th century.',
    ideas: [{ de: 'Sein und Zeit', en: 'Being and Time' }, { de: 'Dasein', en: 'Dasein' }, { de: 'Geworfenheit', en: 'Thrownness' }, { de: 'Sein-zum-Tode', en: 'Being-towards-Death' }],
    quote: { de: 'Die Sprache ist das Haus des Seins.', en: 'Language is the house of Being.' },
    influences: ['sartre', 'arendt'],
  },
  {
    slug: 'sartre', name: 'Jean-Paul Sartre', shortName: 'Sartre', life: '1905–1980', birthYear: 1905, deathYear: 1980,
    eraSlug: 'existenz', treeX: 323, treeY: 127, colorHex: '#F87171',
    bio_de: 'Sartre machte den Existenzialismus zur prägendsten Philosophie des 20. Jahrhunderts. Freiheit ist die unausweichliche Bedingung und Last menschlicher Existenz.',
    bio_en: 'Sartre made existentialism the defining philosophy of the 20th century. Freedom is the inescapable condition and burden of human existence.',
    ideas: [{ de: 'Existenz vor Essenz', en: 'Existence before Essence' }, { de: 'Radikale Freiheit', en: 'Radical Freedom' }, { de: 'Mauvaise foi', en: 'Bad Faith' }, { de: 'Engagement', en: 'Commitment' }],
    quote: { de: 'Wir sind verurteilt, frei zu sein.', en: 'We are condemned to be free.' },
    influences: ['arendt', 'beauvoir'],
  },
  {
    slug: 'beauvoir', name: 'S. de Beauvoir', shortName: 'Beauvoir', life: '1908–1986', birthYear: 1908, deathYear: 1986,
    eraSlug: 'feminismus', treeX: 252, treeY: 80, colorHex: '#E879F9',
    bio_de: 'Beauvoirs Das andere Geschlecht begründete die moderne feministische Philosophie. Frau zu sein ist kein biologisches Schicksal, sondern eine gesellschaftliche Konstruktion.',
    bio_en: 'Beauvoir\'s The Second Sex founded modern feminist philosophy. Being a woman is not a biological destiny but a social construction.',
    ideas: [{ de: 'Das andere Geschlecht', en: 'The Second Sex' }, { de: 'Feminismus', en: 'Feminism' }, { de: 'Existenzialismus', en: 'Existentialism' }, { de: 'Freiheit', en: 'Freedom' }],
    quote: { de: 'Man wird nicht als Frau geboren, man wird dazu gemacht.', en: 'One is not born, but rather becomes, a woman.' },
    influences: ['arendt'],
  },
  {
    slug: 'wittgenstein', name: 'L. Wittgenstein', shortName: 'Wittgenstein', life: '1889–1951', birthYear: 1889, deathYear: 1951,
    eraSlug: 'analytisch', treeX: 663, treeY: 172, colorHex: '#FB923C',
    bio_de: 'Wittgenstein revolutionierte die Sprachphilosophie zweimal – oft gegen seine eigene frühere Position. Sprache ist für ihn nicht Abbild der Welt, sondern Form des Lebens.',
    bio_en: 'Wittgenstein revolutionized the philosophy of language twice — often against his own earlier position. Language is not a mirror of the world but a form of life.',
    ideas: [{ de: 'Sprachspiele', en: 'Language Games' }, { de: 'Tractatus', en: 'Tractatus' }, { de: 'Logischer Atomismus', en: 'Logical Atomism' }, { de: 'Bedeutung', en: 'Meaning as Use' }],
    quote: { de: 'Worüber man nicht sprechen kann, darüber muss man schweigen.', en: 'Whereof one cannot speak, thereof one must be silent.' },
    influences: [],
  },
  {
    slug: 'arendt', name: 'Hannah Arendt', shortName: 'Arendt', life: '1906–1975', birthYear: 1906, deathYear: 1975,
    eraSlug: 'zeitgenoessisch', treeX: 373, treeY: 92, colorHex: '#E879F9',
    bio_de: 'Arendt analysierte die politischen Katastrophen des 20. Jahrhunderts mit philosophischer Schärfe. Ihr Bericht über den Eichmann-Prozess prägte das Denken über moralische Verantwortung.',
    bio_en: 'Arendt analyzed the political catastrophes of the 20th century with philosophical precision. Her Eichmann report shaped thinking about moral responsibility and the nature of evil.',
    ideas: [{ de: 'Vita Activa', en: 'Vita Activa' }, { de: 'Banalität des Bösen', en: 'Banality of Evil' }, { de: 'Totalitarismus', en: 'Totalitarianism' }, { de: 'Öffentlichkeit', en: 'Public Realm' }],
    quote: { de: 'Denken wir, was wir tun.', en: 'Let us think what we are doing.' },
    influences: [],
  },
  {
    slug: 'foucault', name: 'Michel Foucault', shortName: 'Foucault', life: '1926–1984', birthYear: 1926, deathYear: 1984,
    eraSlug: 'postmoderne', treeX: 458, treeY: 97, colorHex: '#E879F9',
    bio_de: 'Foucault analysierte wie Macht, Wissen und Wahrheit zusammenhängen. Seine Genealogie zeigt: Geschichte ist immer Machtgeschichte – von der Klinik bis zum Gefängnis.',
    bio_en: 'Foucault analyzed how power, knowledge, and truth are intertwined. His genealogy shows that history is always a history of power — from the clinic to the prison.',
    ideas: [{ de: 'Macht-Wissen', en: 'Power-Knowledge' }, { de: 'Diskursanalyse', en: 'Discourse Analysis' }, { de: 'Genealogie', en: 'Genealogy' }, { de: 'Biopolitik', en: 'Biopolitics' }],
    quote: { de: 'Wo es Macht gibt, gibt es Widerstand.', en: 'Where there is power, there is resistance.' },
    influences: [],
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Eras anlegen
  for (const era of ERAS) {
    await prisma.era.upsert({
      where: { slug: era.slug },
      update: era,
      create: era,
    });
  }
  console.log(`✓ ${ERAS.length} Epochen angelegt`);

  // Philosophen anlegen (ohne Einfluss-Relationen)
  for (const ph of PHILOSOPHERS) {
    const { influences, ideas, quote, eraSlug, ...rest } = ph;
    const era = await prisma.era.findUniqueOrThrow({ where: { slug: eraSlug } });

    const philosopher = await prisma.philosopher.upsert({
      where: { slug: ph.slug },
      update: { ...rest, eraId: era.id },
      create: { ...rest, eraId: era.id },
    });

    // Ideen
    for (const idea of ideas) {
      await prisma.idea.create({
        data: { name_de: idea.de, name_en: idea.en, philosopherId: philosopher.id },
      }).catch(() => {}); // ignore duplicates on re-seed
    }

    // Hauptzitat
    await prisma.quote.create({
      data: { text_de: quote.de, text_en: quote.en, philosopherId: philosopher.id, source: 'Hauptzitat' },
    }).catch(() => {});
  }
  console.log(`✓ ${PHILOSOPHERS.length} Philosophen angelegt`);

  // Einfluss-Relationen
  for (const ph of PHILOSOPHERS) {
    const source = await prisma.philosopher.findUniqueOrThrow({ where: { slug: ph.slug } });
    for (const targetSlug of ph.influences) {
      const target = await prisma.philosopher.findUnique({ where: { slug: targetSlug } });
      if (!target) continue;
      await prisma.influence.upsert({
        where: { influencerId_influencedId: { influencerId: source.id, influencedId: target.id } },
        update: {},
        create: { influencerId: source.id, influencedId: target.id, strength: 1.0, type: InfluenceType.DIRECT },
      });
    }
  }
  console.log('✓ Einfluss-Netzwerk angelegt');
  console.log('🌳 Seed abgeschlossen!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
