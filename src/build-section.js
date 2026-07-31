/* Generic new-section builder: clones islam.html shell and reconfigures it. */
const fs = require('fs');
const P = f => __dirname + '/' + f;
const J = o => JSON.stringify(o);

function replaceConst(s, name, lit) {
  const i = s.indexOf('const ' + name + '=');
  if (i < 0) throw new Error('missing const ' + name);
  const start = s.indexOf('=', i) + 1;
  let depth = 0, inStr = null, j = start;
  for (; j < s.length; j++) {
    const c = s[j], p = s[j - 1];
    if (inStr) { if (c === inStr && p !== '\\') inStr = null; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '{' || c === '[' || c === '(') depth++;
    else if (c === '}' || c === ']' || c === ')') { depth--; if (depth === 0) { j++; break; } }
    else if (depth === 0 && c === ';') break;
  }
  return s.slice(0, start) + lit + s.slice(j);
}
function must(s, a, b, label) { if (!s.includes(a)) throw new Error('anchor missing: ' + label); return s.split(a).join(b); }

module.exports = function buildSection(cfg) {
  let s = fs.readFileSync(P('islam.html'), 'utf8');
  const data = JSON.parse(fs.readFileSync(P(cfg.dataFile), 'utf8'));
  const comp = JSON.parse(fs.readFileSync(P(cfg.compFile), 'utf8'));

  /* --- map section-specific citation fields onto the shell's quran/hadith/bible slots --- */
  data.forEach(d => {
    const m = cfg.fieldMap;
    const src = {};
    for (const k of ['quran', 'hadith', 'bible']) src[k] = m[k] ? (d[m[k]] || []) : [];
    d.quran = src.quran; d.hadith = src.hadith; d.bible = src.bible;
  });
  fs.writeFileSync(P(cfg.slug + '-data.built.json'), J(data));

  /* --- rail labels --- */
  s = must(s, '<h6 class="h-bom">Quran</h6>', '<h6 class="h-bom">' + cfg.labels.quran + '</h6>', 'quran label');
  s = must(s, '<h6 class="h-bom" style="color:var(--amber)">Hadith</h6>', '<h6 class="h-bom" style="color:var(--amber)">' + cfg.labels.hadith + '</h6>', 'hadith label');
  s = must(s, '<h6 class="h-bib">Bible</h6>', '<h6 class="h-bib">' + cfg.labels.bible + '</h6>', 'bible label');
  s = must(s, 'click a Quran or Bible reference to read it in place (Quran: Pickthall; Bible: KJV); hadith open on sunnah.com.', cfg.railNote, 'rail note');

  /* --- external link fn for the middle column --- */
  const hu = s.indexOf('function hadithUrl');
  const huEnd = s.indexOf('\n}', hu) + 2;
  s = s.slice(0, hu) + (cfg.hadithUrlBody || 'function hadithUrl(h){return null;}\n') + s.slice(huEnd);

  /* --- data maps --- */
  const consts = {
    SECTIONS: cfg.SECTIONS, CATS: cfg.CATS, SECMAP: cfg.SECMAP, CATDESC: cfg.CATDESC,
    WHYMAP: cfg.WHYMAP, GLOSSARY: cfg.GLOSSARY, PATHS: cfg.PATHS, TLACTS: cfg.TLACTS,
    IMGMAP: {}, RELATED: cfg.RELATED,
    PROOFS: comp.proofs.map(p => ({ v: p.v, they: p.they, you: p.you, refs: Array.isArray(p.refs) ? p.refs.join(' · ') : p.refs })),
    THEYSAY: comp.theysay, LESSONS: comp.lessons.map(l => ({ ...l, what: Array.isArray(l.what) ? l.what : [l.what] })),
    KNOW: comp.know, DIALOG: comp.dialogs
  };
  if (cfg.VLABEL) { consts.VLABEL = cfg.VLABEL; consts.VDESC = cfg.VDESC; }
  for (const [k, v] of Object.entries(consts)) s = replaceConst(s, k, J(v));

  /* --- lessons page: `what` is an array in these sections --- */
  s = s.replace('<p class="pt">${L.what.map(w=>"• "+esc(w)).join("<br>")}</p>', '<p class="pt">${(Array.isArray(L.what)?L.what:[L.what]).map(w=>"• "+esc(w)).join("<br>")}</p>');

  /* --- branding + storage keys --- */
  s = must(s, cfg.oldBrand, cfg.newBrand, 'brand');
  s = must(s, '<title>', '<title>', 'title tag');
  s = s.replace(/wbi_/g, cfg.keyPrefix);
  for (const [a, b] of (cfg.textSwaps || [])) s = must(s, a, b, 'swap:' + a.slice(0, 30));

  fs.writeFileSync(P(cfg.slug + '.html'), s);
  console.log(cfg.slug + '.html written | cases:', data.length, '| theysay:', comp.theysay.length, '| dialogs:', Object.keys(comp.dialogs).length);
};
