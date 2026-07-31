const fs = require('fs');
const path = __dirname;
const bom = require('./bom.json'), ot = require('./ot.json'), nt = require('./nt.json');
const dc = require('./dc.json'), pgp = require('./pgp.json');

const books = {};
[...bom.books, ...ot.books, ...nt.books, ...pgp.books].forEach(b => { books[b.book.toLowerCase()] = b; });
books['psalm'] = books['psalms'];
books['dandc'] = { book: 'D&C', chapters: dc.sections.map(s => ({ chapter: s.section, verses: s.verses })) };

const html = fs.readFileSync(path + '/index.html', 'utf8');
const m = html.match(/const DATA=\[([\s\S]*?)\n\];/);
const DATA = eval('[' + m[1] + ']');

const cites = new Set();
DATA.forEach(d => { (d.bom || []).forEach(c => cites.add(c)); (d.bible || []).forEach(c => cites.add(c)); });

const MAXV = 16;
const out = {}; const skipped = [];

function resolve(orig) {
  let c = orig.replace(/–/g, '-').replace(/—/g, '-');
  c = c.replace(/\s*\((KJV|Book of Mormon|Pearl of Great Price|1830\/1981 variants|variant pattern|structure|KJV, 1611)\)\s*/g, '').trim();
  if (/^(JST|Introduction|Title Page|Testimony|Official Declaration|.*1830 vs 1837.*)/i.test(c)) return null;
  c = c.replace(/^D&C\b/i, 'DandC');
  // Whole single chapter e.g. 'Mosiah 14' / 'Isaiah 53' -> embed if short
  const cm = c.match(/^([1-3]?\s?[A-Za-z ]+?)\s+(\d+)$/);
  if (cm) { const bk=books[cm[1].trim().toLowerCase()]; if(bk){
    if(bk.chapters.length===1){ const v=bk.chapters[0].verses[parseInt(cm[2],10)-1]; if(v) return {ref:bk.book+' 1',verses:[{v:parseInt(cm[2],10),t:v.text}]}; }
    const ch=bk.chapters[parseInt(cm[2],10)-1];
    if(ch && ch.verses.length<=MAXV) return {ref:bk.book+' '+ch.chapter,verses:ch.verses.map(v=>({v:v.verse,t:v.text}))};
    return null; } }
  // Book Chapter:verses  e.g. "Alma 34:32-35" / "3 Nephi 13:4,6,18" / "Romans 5:12, 18-19"
  const mm = c.match(/^([1-3]?\s?[A-Za-z ]+?)\s+(\d+):([\d,\-\s]+)$/);
  if (!mm) return null;
  const bname = mm[1].trim().toLowerCase();
  const book = books[bname];
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
  const verses = nums.map(n => {
    const v = chap.verses[n - 1];
    return v ? { v: n, t: v.text } : null;
  }).filter(Boolean);
  if (!verses.length) return null;
  return { ref: book.book + ' ' + chap.chapter, verses };
}

cites.forEach(c => {
  const r = resolve(c);
  if (r) out[c] = r; else skipped.push(c);
});

fs.writeFileSync(path + '/verses.json', JSON.stringify(out));
console.log('citations total:', cites.size);
console.log('resolved:', Object.keys(out).length);
console.log('skipped (will link out):', skipped.length);
console.log(skipped.slice(0, 40).join(' | '));
const size = fs.statSync(path + '/verses.json').size;
console.log('verses.json bytes:', size);
