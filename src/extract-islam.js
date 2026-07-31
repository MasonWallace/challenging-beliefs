// Resolves Quran + Bible citations for the Islam section into verses-islam.json
const fs = require('fs');
const path = __dirname;
const quran = require('./quran.json');
const ot = require('./ot.json'), nt = require('./nt.json');

const books = {};
[...ot.books, ...nt.books].forEach(b => { books[b.book.toLowerCase()] = b; });
books['psalm'] = books['psalms'];

const dataFile = process.argv[2] || 'islam-data.json';
const DATA = JSON.parse(fs.readFileSync(path + '/' + dataFile, 'utf8'));

const cites = new Set();
DATA.forEach(d => { (d.quran || []).forEach(c => cites.add(c)); (d.bible || []).forEach(c => cites.add(c)); });

const MAXV = 16;
const out = {}; const skipped = [];

function resolveQuran(c) {
  // "Quran 4:157" / "Quran 86:5-7" / "Quran 3:45, 47"
  const m = c.replace(/–/g, '-').match(/^Quran\s+(\d+):([\d,\-\s]+)$/i);
  if (!m) return null;
  const surah = quran.find(s => s.id === parseInt(m[1], 10));
  if (!surah) return null;
  const nums = [];
  m[2].split(',').forEach(part => {
    part = part.trim();
    const r = part.match(/^(\d+)-(\d+)$/);
    if (r) { for (let i = +r[1]; i <= +r[2]; i++) nums.push(i); }
    else if (/^\d+$/.test(part)) nums.push(+part);
  });
  if (!nums.length || nums.length > MAXV) return null;
  const verses = nums.map(n => {
    const v = surah.verses[n - 1];
    return v ? { v: n, t: v.translation } : null;
  }).filter(Boolean);
  if (!verses.length) return null;
  return { ref: 'Surah ' + surah.transliteration + ' (' + surah.id + ')', verses };
}

function resolveBible(orig) {
  let c = orig.replace(/–/g, '-').replace(/\s*\(.*\)\s*/g, '').trim();
  const cm = c.match(/^([1-3]?\s?[A-Za-z ]+?)\s+(\d+)$/);
  if (cm) {
    const bk = books[cm[1].trim().toLowerCase()];
    if (bk) {
      if (bk.chapters.length === 1) { const v = bk.chapters[0].verses[parseInt(cm[2], 10) - 1]; if (v) return { ref: bk.book + ' 1', verses: [{ v: parseInt(cm[2], 10), t: v.text }] }; }
      const ch = bk.chapters[parseInt(cm[2], 10) - 1];
      if (ch && ch.verses.length <= MAXV) return { ref: bk.book + ' ' + ch.chapter, verses: ch.verses.map(v => ({ v: v.verse, t: v.text })) };
      return null;
    }
  }
  const mm = c.match(/^([1-3]?\s?[A-Za-z ]+?)\s+(\d+):([\d,\-\s]+)$/);
  if (!mm) return null;
  const book = books[mm[1].trim().toLowerCase()];
  if (!book) return null;
  const chap = book.chapters[parseInt(mm[2], 10) - 1];
  if (!chap) return null;
  const nums = [];
  mm[3].split(',').forEach(part => {
    part = part.trim();
    const r = part.match(/^(\d+)-(\d+)$/);
    if (r) { for (let i = +r[1]; i <= +r[2]; i++) nums.push(i); }
    else if (/^\d+$/.test(part)) nums.push(+part);
  });
  if (!nums.length || nums.length > MAXV) return null;
  const verses = nums.map(n => { const v = chap.verses[n - 1]; return v ? { v: n, t: v.text } : null; }).filter(Boolean);
  if (!verses.length) return null;
  return { ref: book.book + ' ' + chap.chapter, verses };
}

cites.forEach(c => {
  const r = /^Quran/i.test(c) ? resolveQuran(c) : resolveBible(c);
  if (r) out[c] = r; else skipped.push(c);
});

fs.writeFileSync(path + '/verses-islam.json', JSON.stringify(out));
console.log('citations:', cites.size, '| resolved:', Object.keys(out).length, '| skipped:', skipped.length);
console.log(skipped.slice(0, 30).join(' | '));
console.log('bytes:', fs.statSync(path + '/verses-islam.json').size);
