const fs = require('fs');
const P = f => __dirname + '/' + f;
const build = require('./build-section.js');
const data = JSON.parse(fs.readFileSync(P('jw-data.json'), 'utf8'));

const CATS = {
  "nwt-translation": "The New World Translation", "chronology-607": "607 BC & 1914", "failed-dates": "Failed dates",
  "prophecy-authority": "Prophetic authority", "doctrine-of-god": "God, Christ & the Spirit",
  "two-class-salvation": "The 144,000 & two classes", "blood-doctrine": "The blood doctrine",
  "shunning-exit": "Shunning & leaving", "institutional": "The organization", "practice": "Daily practice"
};
const SECMAP = { "nwt-translation": "text", "chronology-607": "prophecy", "failed-dates": "prophecy", "prophecy-authority": "prophecy", "doctrine-of-god": "doctrine", "two-class-salvation": "doctrine", "blood-doctrine": "life", "shunning-exit": "life", "institutional": "life", "practice": "life" };
data.forEach(d => { d.section = SECMAP[d.category] || 'life'; });

const CATDESC = {
  "nwt-translation": "Verses the Watchtower's own Bible renders differently from every major translation — and why.",
  "chronology-607": "The date the entire 1914 doctrine rests on, and what the evidence says.",
  "failed-dates": "A century of published end-time predictions and what happened to them.",
  "prophecy-authority": "How the organization claims — and disclaims — the authority of God's channel.",
  "doctrine-of-god": "Who Jesus is, what the Spirit is, and what happens at death.",
  "two-class-salvation": "The doctrine that divides believers into a heavenly 144,000 and an earthly great crowd.",
  "blood-doctrine": "The transfusion ban: its 1945 origin, its shifting boundaries, and its cost.",
  "shunning-exit": "What happens to a Witness who doubts, resigns, or is expelled.",
  "institutional": "The organization's own conduct measured by the standard it applies to others.",
  "practice": "Holidays, education, and the shape of a Witness's week."
};
const WHYMAP = {
  "nwt-translation": "If a translation is edited to fit a doctrine, the doctrine can never be tested by the text — the ruler has been bent to match the board.",
  "chronology-607": "1914 is the foundation stone: no 607, no 1914; no 1914, no 1919 appointment; no appointment, no obligation to obey the Governing Body.",
  "failed-dates": "Deuteronomy 18:22 gives one test for a voice claiming to speak for God — and the record here is public, dated, and printed by the organization itself.",
  "prophecy-authority": "Everything a Witness believes arrives through one channel. Whether that channel is what it claims decides everything downstream.",
  "doctrine-of-god": "This is where salvation itself is at stake: a created archangel cannot bear the weight Scripture puts on the Son.",
  "two-class-salvation": "The New Testament knows one flock, one hope, one table — a system that tells most believers not to touch the bread and wine has no apostolic precedent.",
  "blood-doctrine": "This doctrine has a body count, and the line it draws has been redrawn repeatedly by committee.",
  "shunning-exit": "A message that is true does not need exit costs. This is the machinery that keeps every other question unexamined.",
  "institutional": "'By their fruits you will know them' applies to every tree — including the one claiming to be God's only channel.",
  "practice": "Where Scripture leaves liberty, binding every conscience organization-wide is what Jesus rebuked in the Pharisees."
};
const GLOSSARY = [
  { t: "the Governing Body", d: "The eight or so men at world headquarters who define all doctrine; since 2012 they identify themselves alone as the 'faithful and discreet slave' of Matthew 24:45." },
  { t: "the faithful and discreet slave", d: "Their name for the Governing Body, read out of Matthew 24:45 as a prophecy that Christ inspected all religions in 1919 and appointed them over his belongings." },
  { t: "NWT", d: "The New World Translation — the Watchtower's own Bible, produced by an anonymous committee, and the only translation used in their meetings and literature." },
  { t: "the anointed", d: "The 144,000 who go to heaven, are born again, are in the new covenant, and alone may take the Memorial bread and wine." },
  { t: "the great crowd", d: "Everyone else — roughly 99.9% of Witnesses — who hope to survive Armageddon and live forever on a paradise earth as God's 'friends' rather than his sons." },
  { t: "the Memorial", d: "Their one annual observance, on Nisan 14: the bread and wine are passed down the rows and nearly every person present declines them." },
  { t: "publisher", d: "A baptized or approved member who takes part in the preaching work and files a monthly activity report." },
  { t: "pioneer", d: "A publisher who commits to an hour quota in the ministry each month — the status held up to young Witnesses in place of university." },
  { t: "field service", d: "The door-to-door and cart witnessing work, usually organized in groups after a short meeting." },
  { t: "Kingdom Hall", d: "The local meeting place. Two meetings a week are held there; the building is deliberately plain and displays no cross." },
  { t: "disfellowshipped / removed", d: "Expelled after a judicial committee. Renamed 'removed from the congregation' in August 2024; other Witnesses, including family outside the household, cut off normal association." },
  { t: "disassociation", d: "Formally resigning — treated exactly like expulsion since 1981, which is why there is no neutral way to leave." },
  { t: "PIMO", d: "'Physically In, Mentally Out' — a member who no longer believes but keeps attending to avoid losing their family." },
  { t: "apostate", d: "Anyone who persistently disagrees with the Governing Body's teaching. A 2011 Watchtower called apostates 'mentally diseased' and told members to avoid their words entirely." },
  { t: "judicial committee", d: "Three elders meeting privately to decide a member's standing. No observers, no advocate, no recordings permitted." },
  { t: "Bethel", d: "A branch headquarters and the volunteer community that staffs it, under a vow of poverty — the organization's professional religious class, though it isn't called clergy." },
  { t: "the 1914 generation", d: "The teaching that people alive in 1914 would see Armageddon. Redefined in 1995, 2008, and again in 2010 as two 'overlapping' generations." },
  { t: "blood fractions", d: "Components-of-components (including hemoglobin) that individual conscience may accept, even though the whole blood they come from is forbidden." }
];
const has = new Set(data.map(d => d.id));
const pick = (...ids) => ids.filter(i => has.has(i));
const PATHS = [
  { id: "foundation", name: "The foundation: 1914 and the slave", desc: "Pull the one thread everything else hangs from", time: "≈ 25 min", items: pick("chron-607-vs-587", "dates-1874-1914-retrofit", "auth-fds-2012-governing-body", "auth-prophet-paradox") },
  { id: "jesus", name: "Who Jesus is", desc: "The archangel question, and what the NWT does to the verses", time: "≈ 20 min", items: pick("jesus-michael-archangel", "nwt-colossians-other-inserted", "nwt-john-1-1-a-god", "bodily-resurrection-denied") },
  { id: "gospel", name: "The gospel they were never offered", desc: "Two classes, one mediator, and a table almost nobody may touch", time: "≈ 20 min", items: pick("two-class-salvation-system", "memorial-passing-emblems", "mediator-only-144000", "1935-cutoff-abandoned") },
  { id: "cost", name: "What it costs", desc: "Blood, shunning, and the price of asking a question", time: "≈ 20 min", items: pick("blood-ban-1945-innovation", "blood-fractions-incoherence", "shunning-mechanics-family", "faders-pimo-exit-costs") },
  { id: "fair", name: "Where they're right", desc: "Popular criticisms that fail — read these before you talk", time: "≈ 12 min", items: data.filter(d => d.avoid).map(d => d.id).slice(0, 6) }
].filter(p => p.items.length);
const TLACTS = [
  { num: "I", range: "1879–1916", name: "Russell's Watch Tower", desc: "The founding chronology — and the dates that failed first", events: [
    { y: "1879", t: "Zion's Watch Tower founded", p: "Russell begins publishing; Christ's invisible presence is dated to 1874." },
    { y: "1889", side: "claim", crit: true, t: "1914 announced as the END", p: "'The battle of the great day of God Almighty… will end in A.D. 1914 with the complete overthrow of earth's present rulership.'", id: "dates-1874-1914-retrofit" },
    { y: "1878 / 1881", side: "record", t: "The first failures", p: "The saints were to be caught away bodily. They were not.", id: "dates-early-cluster-1878-1881-1918" },
    { y: "1914", side: "record", crit: true, t: "The world does not end", p: "War comes instead of Armageddon; the date is kept and its meaning replaced.", id: "dates-1874-1914-retrofit" }] },
  { num: "II", range: "1917–1975", name: "Rutherford and Knorr", desc: "New dates, new prohibitions, a new Bible", events: [
    { y: "1918", side: "record", t: "Prison and 'The Finished Mystery'", p: "Eight leaders jailed under the Espionage Act; the book's 1918 predictions fail.", id: "dates-early-cluster-1878-1881-1918" },
    { y: "1920–25", side: "claim", crit: true, t: "'Millions Now Living Will Never Die'", p: "Abraham, Isaac and Jacob expected by 1925; a San Diego mansion is deeded for them.", id: "dates-1925-beth-sarim" },
    { y: "1931", side: "record", t: "Vaccination forbidden", p: "'A direct violation of the everlasting covenant' — reversed in 1952.", id: "vaccination-ban-1931" },
    { y: "1945", side: "claim", crit: true, t: "Blood transfusion forbidden", p: "A prohibition the movement did not hold for its first 65 years.", id: "blood-ban-1945-innovation" },
    { y: "1950–61", side: "claim", t: "The New World Translation", p: "An anonymous committee publishes the organization's own Bible.", id: "nwt-committee-anonymity-credentials" },
    { y: "1954–64", side: "record", crit: true, t: "Worship of Jesus reversed", p: "Taught since 1898 and written into the charter — now called unscriptural.", id: "worship-of-jesus-flipflop" },
    { y: "1967", side: "claim", t: "Organ transplants = 'cannibalism'", p: "Reversed to a conscience matter in 1980, without apology.", id: "organ-transplants-cannibalism" },
    { y: "1975", side: "record", crit: true, t: "The 6,000 years end — and nothing happens", p: "Members sold homes; the organization later conceded its own publications built the expectation.", id: "dates-1975" }] },
  { num: "III", range: "1976–2026", name: "The modern reckonings", desc: "Redefinitions, exposures, and the courts", events: [
    { y: "1981", side: "record", crit: true, t: "Jonsson disfellowshipped", p: "The elder who checked the 607 math is expelled; his research has never been rebutted.", id: "chron-jonsson-gentile-times" },
    { y: "1992–2001", side: "record", crit: true, t: "UN NGO membership", p: "Nine years of association with the 'wild beast' — ended days after The Guardian exposed it.", id: "un-ngo-association" },
    { y: "1994", side: "record", t: "'Youths Who Put God First'", p: "Awake! celebrates 26 young people who died refusing blood.", id: "awake-1994-youths-died" },
    { y: "1995 → 2010", side: "claim", crit: true, t: "'This generation' redefined", p: "The masthead promise vanishes; by 2010 a 'generation' spans two overlapping lifetimes.", id: "dates-generation-1914-redefined" },
    { y: "2000", side: "claim", t: "Blood fractions permitted", p: "Hemoglobin becomes a conscience matter while red cells stay forbidden.", id: "blood-fractions-incoherence" },
    { y: "2011", side: "record", t: "'Mentally diseased'", p: "The Watchtower's term for former members who speak.", id: "apostates-mentally-diseased" },
    { y: "2012", side: "claim", crit: true, t: "The slave becomes the Governing Body", p: "Eight men reinterpret the proof-text of their own authority to mean themselves.", id: "auth-fds-2012-governing-body" },
    { y: "2015–16", side: "record", crit: true, t: "Australian Royal Commission", p: "1,006 alleged abusers in their own files; not one reported by the organization.", id: "arc-case-study-29" },
    { y: "2024", side: "record", t: "Shunning softened, not ended", p: "'Disfellowshipped' becomes 'removed'; a greeting is now allowed.", id: "shunning-mechanics-family" }] }
];
const RELATED = {};
data.forEach(d => { RELATED[d.id] = data.filter(x => x.category === d.category && x.id !== d.id && !x.avoid).slice(0, 3).map(x => x.id); });

build({
  slug: 'jw', dataFile: 'jw-data.json', compFile: 'companion-jw.json',
  fieldMap: { quran: null, hadith: 'wt', bible: 'bible' },
  labels: { quran: 'Watchtower', hadith: 'Watchtower publications', bible: 'Bible' },
  railNote: "Every reference here is cited by this specific claim — click a Bible reference to read it in place. Watchtower citations are listed so a Witness can look them up in their own library.",
  SECTIONS: { text: "The translation", prophecy: "Dates & prophecy", doctrine: "The doctrine", life: "Organization & life" },
  CATS, SECMAP, CATDESC, WHYMAP, GLOSSARY, PATHS, TLACTS, RELATED,
  VLABEL: { admitted: "Admitted", unrefuted: "Unrefuted", contested: "Contested", answered: "Answered" },
  VDESC: {
    admitted: "The Watchtower's own publications concede these facts — cite them from their sources alone",
    unrefuted: "No adequate answer exists — or the best answers concede the point",
    contested: "A serious rebuttal exists; both sides are shown",
    answered: "The defense holds — included so nothing here is cherry-picked"
  },
  oldBrand: 'ISLAM · VS. THE BIBLE', newBrand: "JEHOVAH'S WITNESSES · VS. THE BIBLE",
  keyPrefix: 'wbjw_',
  textSwaps: [
    ['<title>Challenging Beliefs — Islam, Examined Against the Bible</title>', "<title>Challenging Beliefs — Jehovah's Witnesses, Examined Against the Bible</title>"],
    ['Sharing the gospel with Muslim friends', "Sharing the gospel with Jehovah's Witnesses"],
    ["Know your Muslim neighbor", "Know your Jehovah's Witness neighbor"],
    ["The da'wah script", "When they knock"],
    ["Muslim friend", "Witness at your door"]
  ]
});

/* ---- verses: resolve Bible refs from KJV ---- */
const ot = require('./ot.json'), nt = require('./nt.json');
const books = {}; [...ot.books, ...nt.books].forEach(b => books[b.book.toLowerCase()] = b);
books['psalm'] = books['psalms'];
const built = JSON.parse(fs.readFileSync(P('jw-data.built.json'), 'utf8'));
const cites = new Set(); built.forEach(d => (d.bible || []).forEach(c => cites.add(c)));
const out = {}; let ok = 0;
cites.forEach(orig => {
  let c = orig.replace(/[–—]/g, '-').replace(/\s*\(.*?\)\s*/g, '').trim();
  const mm = c.match(/^([1-3]?\s?[A-Za-z ]+?)\s+(\d+):([\d,\-\s]+)$/);
  if (!mm) return;
  const bk = books[mm[1].trim().toLowerCase()]; if (!bk) return;
  const ch = bk.chapters[parseInt(mm[2], 10) - 1]; if (!ch) return;
  const nums = []; mm[3].split(',').forEach(part => { const r = part.trim().match(/^(\d+)\s*-\s*(\d+)$/); if (r) { for (let i = +r[1]; i <= +r[2]; i++) nums.push(i); } else if (/^\d+$/.test(part.trim())) nums.push(+part.trim()); });
  const verses = nums.map(n => { const v = ch.verses[n - 1]; return v ? { v: n, t: v.text } : null; }).filter(Boolean);
  if (verses.length && verses.length <= 16) { out[orig] = { ref: bk.book + ' ' + ch.chapter, verses }; ok++; }
});
fs.writeFileSync(P('verses-jw.json'), JSON.stringify(out));
console.log('verses-jw.json:', ok, 'of', cites.size, 'refs resolved');
