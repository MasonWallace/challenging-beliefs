/* Upgrade glossify() everywhere; merge the expanded glossaries into the two
   hand-maintained shells; add a "the story so far" primer to the word guide. */
const fs = require('fs');
const P = f => __dirname + '/' + f;
const G = require('./glossary-data.js');
const check = (l, ok) => { console.log((ok ? 'OK   ' : 'FAIL ') + l); if (!ok) process.exitCode = 1; };

/* ---------- 1. the new glossify: single pass, tag-safe, longest term first ---------- */
const NEW_GLOSSIFY = `function glossify(escapedText){
  if(!glossify._re){
    const ts=GLOSSARY.slice().sort((a,b)=>esc(b.t).length-esc(a.t).length);
    const alts=ts.map(g=>esc(g.t).replace(/[.*+?^\${}()|[\\]\\\\]/g,"\\\\$&")).join("|");
    glossify._re=new RegExp("(?<![\\\\w-])("+alts+")(?![\\\\w-])","gi");
    glossify._map={};GLOSSARY.forEach(g=>{glossify._map[esc(g.t).toLowerCase()]=g;});
  }
  const used=glossify.seen||(glossify.seen=new Set());
  return escapedText.replace(/(<[^>]*>)|([^<]+)/g,(m,tag,txt)=>{
    if(tag)return tag;
    return txt.replace(glossify._re,w=>{
      const g=glossify._map[w.toLowerCase()];
      if(!g||used.has(g.t))return w;
      used.add(g.t);
      return '<span class="g" tabindex="0">'+w+'<span class="gt"><b>'+esc(g.t)+'</b> — '+g.d+'</span></span>';
    });
  });
}`;

/* ---------- 2. the story primers ---------- */
const PRIMERS = {
  'study.html': {
    h: "New here? The story in ninety seconds",
    p: `<p><b>The Book of Mormon claims to be a history of ancient America.</b> Around 600 BC a prophet named <b>Lehi</b> flees Jerusalem before the Babylonians destroy it, crosses the wilderness with his family, and sails to the Americas. His sons divide: the righteous line follows <b>Nephi</b> and becomes the <b>Nephites</b>, the rebellious line follows Laman and becomes the <b>Lamanites</b>. An earlier group, the <b>Jaredites</b>, had crossed in sealed barges at the time of the Tower of Babel and destroyed themselves in a war of millions.</p>
    <p>The Nephites build cities, keep records on metal plates, and fight the Lamanites for a thousand years. After his resurrection, Jesus visits them. Eventually they fall away and are annihilated at the hill <b>Cumorah</b> around 400 AD. The last survivor, <b>Moroni</b> — son of the general <b>Mormon</b>, who had abridged the whole record — buries the plates.</p>
    <p><b>In 1823, Joseph Smith says that same Moroni appeared to him as an angel</b> and showed him where the plates were buried, in a hill near his home in upstate New York. He dictates the translation, largely by looking at a <b>seer stone</b> in his hat, and publishes the Book of Mormon in 1830. Later he produces the <b>Book of Abraham</b> from Egyptian papyri he bought from a travelling mummy exhibition, introduces temple ceremonies and plural marriage at <b>Nauvoo</b>, and is killed by a mob in 1844. <b>Brigham Young</b> leads most of the church to Utah.</p>
    <p>That is the picture every case on this site assumes. Names in dotted underline can be hovered anywhere on the site for a definition.</p>`
  },
  'islam.html': {
    h: "New here? The story in ninety seconds",
    p: `<p><b>In 610 AD a merchant named Muhammad, meditating in a cave outside Mecca, has a terrifying experience</b> he later identifies as the angel Gabriel. His wife <b>Khadija</b> comforts him and takes him to her Christian cousin <b>Waraqa</b>, who tells him the same being came to Moses. Over twenty-three years he receives the recitations collected as the <b>Quran</b> — 114 chapters, or <b>surah</b>s, arranged longest to shortest rather than in the order they were given.</p>
    <p>Rejected in Mecca, he emigrates to Medina in 622 — the start of the Islamic calendar — where he becomes a political and military leader. He returns to take Mecca in 630, cleanses the <b>Kaaba</b> of its idols, and dies in 632.</p>
    <p><b>The Quran is not the only authority.</b> Almost all Islamic practice comes from the <b>hadith</b> — reports of what Muhammad said and did, graded for reliability by their chain of narrators, the <b>isnad</b>. The two most authoritative collections are <b>Sahih al-Bukhari</b> and <b>Sahih Muslim</b>, and a fact recorded in them is not disputed by Sunni Muslims. That is why so much of this section is argued from those books rather than from Christian sources.</p>
    <p>The Quran repeatedly affirms the <b>Tawrat</b> (Torah), <b>Zabur</b> (Psalms) and <b>Injil</b> (Gospel) given before it — which sets up the argument the whole section turns on. Names in dotted underline can be hovered anywhere for a definition.</p>`
  }
};

/* ---------- 3. patch every shell's glossify ---------- */
const SHELLS = ['study.html', 'islam.html']; /* the four generated shells inherit this via build-section.js */
for (const sh of SHELLS) {
  let s = fs.readFileSync(P(sh), 'utf8');
  const i = s.indexOf('function glossify(');
  check(sh + ' has glossify', i >= 0);
  if (i < 0) continue;
  const end = s.indexOf('\n}', i) + 2;
  s = s.slice(0, i) + NEW_GLOSSIFY + '\n' + s.slice(end);
  fs.writeFileSync(P(sh), s);
}
for (const sh of SHELLS) {
  let t = fs.readFileSync(P(sh), 'utf8');
  const A = 'function render(){';
  check(sh + ' has render()', t.includes(A));
  if (t.includes(A) && !t.includes('glossify.seen=new Set()')) {
    t = t.replace(A, A + '\n  glossify.seen=new Set();');
    fs.writeFileSync(P(sh), t);
  }
}
console.log('glossify upgraded in ' + SHELLS.length + ' shells');

/* ---------- 4. merge glossaries into the two hand-maintained shells ---------- */
function mergeGloss(shell, extra) {
  let s = fs.readFileSync(P(shell), 'utf8');
  const i = s.indexOf('const GLOSSARY=');
  check(shell + ' has GLOSSARY', i >= 0);
  const start = s.indexOf('[', i);
  let depth = 0, inStr = null, j = start;
  for (; j < s.length; j++) {
    const c = s[j], p = s[j - 1];
    if (inStr) { if (c === inStr && p !== '\\') inStr = null; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') { depth--; if (depth === 0) { j++; break; } }
  }
  const existing = eval(s.slice(start, j)).filter(Boolean); /* trailing commas leave holes */
  const have = new Set(existing.map(g => g.t.toLowerCase()));
  const added = extra.filter(g => !have.has(g.t.toLowerCase()));
  const merged = existing.concat(added).filter(Boolean).sort((a, b) =>
    a.t.replace(/^the /i, '').toLowerCase().localeCompare(b.t.replace(/^the /i, '').toLowerCase()));
  s = s.slice(0, start) + JSON.stringify(merged) + s.slice(j);
  fs.writeFileSync(P(shell), s);
  console.log(shell + ': ' + existing.length + ' + ' + added.length + ' new = ' + merged.length + ' terms');
  return merged.length;
}
mergeGloss('study.html', G.SHARED.concat(G.MORMON));
mergeGloss('islam.html', G.SHARED.concat(G.ISLAM));

/* ---------- 5. the word-guide page: primer + count + definitions render rich ---------- */
for (const sh of SHELLS) {
  let s = fs.readFileSync(P(sh), 'utf8');
  const pr = PRIMERS[sh];
  const OLD = '<div class="viewhead"><h2>Terms explained</h2><p>The special terms this subject runs on, in plain English. They\'re also underlined with a dotted line throughout the case files — hover any of them for the definition right there.</p></div>';
  const NEW = '<div class="viewhead"><h2>Word guide</h2><p>${GLOSSARY.length} terms this subject runs on, in plain English — names, books, sources and technical vocabulary. Every one of them is underlined with a dotted line wherever it appears in a case; hover or tap it there for the definition without leaving the page.</p></div>' +
    (pr ? '<details class="primer" open><summary>' + pr.h + '</summary><div class="primerbody">' + pr.p + '</div></details>' : '');
  if (s.includes(OLD)) { s = s.split(OLD).join(NEW); }
  else check(sh + ' word-guide head (already applied)', s.includes('<h2>Word guide</h2>'));
  // definitions may contain <i> — render as HTML, not escaped
  s = s.split('<div class="gitem"><b>${esc(g.t)}</b><p>${esc(g.d)}</p></div>')
    .join('<div class="gitem"><b>${esc(g.t)}</b><p>${g.d}</p></div>');
  if (!s.includes('.primer{')) {
    s = s.replace('</style>', `  .primer{background:var(--panel);border:1px solid var(--gold);border-radius:12px;padding:0 18px;margin:0 0 22px}
  .primer>summary{cursor:pointer;list-style:none;padding:14px 0;font-family:var(--serif);font-size:1.02rem;color:var(--gold)}
  .primer>summary::-webkit-details-marker{display:none}
  .primer>summary::before{content:"▸ ";transition:transform .2s}
  .primer[open]>summary::before{content:"▾ "}
  .primerbody{padding:0 0 16px;border-top:1px solid var(--line2,var(--line));margin-top:2px}
  .primerbody p{font-size:.9rem;color:var(--muted);line-height:1.72;margin:14px 0 0}
  .primerbody b{color:var(--ink)}
</style>`);
  }
  fs.writeFileSync(P(sh), s);
}
console.log('word guide updated in ' + SHELLS.length + ' shells');

module.exports = { NEW_GLOSSIFY, WORDGUIDE_OLD:'<div class="viewhead"><h2>Terms explained</h2>' };
