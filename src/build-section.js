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
    for (const k of ['quran', 'hadith', 'bible']) {
      const f = m[k];
      if (!f) { src[k] = []; continue; }
      src[k] = (Array.isArray(f) ? f : [f]).flatMap(name => d[name] || []);
    }
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
    IMGMAP: cfg.IMGMAP || {}, PATHIMG: cfg.PATHIMG || {}, RELATED: cfg.RELATED,
    TALK: cfg.TALK || {}, WHYTAIL: cfg.WHYTAIL, TIPS: cfg.TIPS, TOURSTEPS: cfg.TOURSTEPS,
    PROOFS: comp.proofs.map(p => ({ v: p.v, they: p.they, you: p.you, refs: Array.isArray(p.refs) ? p.refs.join(' · ') : p.refs })),
    THEYSAY: comp.theysay, LESSONS: comp.lessons.map(l => ({ ...l, what: Array.isArray(l.what) ? l.what : [l.what] })),
    KNOW: comp.know, DIALOG: comp.dialogs
  };
  if (cfg.VLABEL) { consts.VLABEL = cfg.VLABEL; consts.VDESC = cfg.VDESC; }
  for (const [k, v] of Object.entries(consts)) s = replaceConst(s, k, J(v));

  /* --- the "story in ninety seconds" primer on the word guide --- */
  {
    const a = s.indexOf('<details class="primer"');
    if (a < 0) throw new Error('primer anchor missing');
    const b = s.indexOf('</details>', a) + '</details>'.length;
    s = s.slice(0, a) + (cfg.primer
      ? '<details class="primer" open><summary>' + cfg.primer.h + '</summary><div class="primerbody">' + cfg.primer.p + '</div></details>'
      : '') + s.slice(b);
  }

  /* --- reference-highlighting regex for their own literature --- */
  s = replaceConst(s, 'LDSBOOKS', J(cfg.refRegex || '(?!x)x'));

  /* --- lessons page: `what` is an array in these sections --- */
  s = s.replace('<p class="pt">${L.what.map(w=>"• "+esc(w)).join("<br>")}</p>', '<p class="pt">${(Array.isArray(L.what)?L.what:[L.what]).map(w=>"• "+esc(w)).join("<br>")}</p>');

  /* --- the "heart of it" page --- */
  const ci = s.indexOf('function renderCore(){');
  if (ci < 0) throw new Error('renderCore missing');
  const cEnd = s.indexOf('\nfunction ', ci + 10);
  s = s.slice(0, ci) + 'function renderCore(){\n' +
    '  const link=id=>byId[id]?`<button class="corelink" data-open="${id}">${esc(byId[id].title)} →</button>`:"";\n' +
    '  $("#main").innerHTML=`<div class="viewhead"><h2>' + cfg.core.title + '</h2>\n' +
    '  <p>' + cfg.core.intro + '</p></div>' +
    (cfg.core.hero ? '<figure class="corehero"><img src="' + cfg.core.hero.src + '" loading="lazy" alt=""><figcaption>' + cfg.core.hero.cap + '</figcaption></figure>' : '') +
    cfg.core.html + '`;\n' +
    '  $("#main").querySelectorAll(".corelink").forEach(b=>{if(b.dataset.open)b.addEventListener("click",()=>openCase(b.dataset.open));});\n' +
    '  const g=$("#main").querySelector("[data-goto]");\n' +
    '  if(g)g.addEventListener("click",()=>{state.view="share";render();});\n}\n' + s.slice(cEnd + 1);

  /* --- the "Sharing Jesus" page --- */
  const si = s.indexOf('function renderShare(){');
  if (si < 0) throw new Error('renderShare missing');
  const sEnd = s.indexOf('bindOpens();\n}', si) + 'bindOpens();\n}'.length;
  s = s.slice(0, si) + 'function renderShare(){\n' +
    '  $("#main").innerHTML=`<div class="viewhead"><h2>' + cfg.share.title + '</h2>\n' +
    '  <p>' + cfg.share.intro + '</p></div>' + cfg.share.html +
    '${DATA.some(d=>d.avoid)?`<div class="pb-h" style="margin-top:30px">Arguments that will embarrass you — do not use these</div><p class="pd" style="font-size:.8rem;margin:0 0 10px">Popular claims that are false or overclaimed. Each links to the correction — repeating them hands the other side an easy win and discredits your true arguments.</p><div class="relrow">${DATA.filter(d=>d.avoid).map(d=>`<button data-open="${d.id}">⚠ ${esc(d.title)}</button>`).join("")}</div>`:""}`;\n' +
    '  const b=$("#main").querySelector("[data-goto-path]");\n' +
    '  if(b)b.addEventListener("click",()=>{const p=PATHS.find(x=>x.id===b.dataset.gotoPath);if(!p)return;state.pathId=p.id;const read=store.read;const next=p.items.find(i=>!read.has(i))||p.items[0];openCase(next,true);});\n' +
    '  bindOpens();\n}' + s.slice(sEnd);

  /* --- overview footnote + citation-role wording --- */
  s = must(s, 'Steelman rules: every claim carries the best published Muslim defense; weak criticisms are marked answered; facts conceded in sahih Islamic sources are marked admitted.',
    cfg.methodFoot, 'method foot');
  s = must(s, '"<b>Role:</b> this is the Quran passage the claim examines."', J(cfg.roleNote || '<b>Role:</b> this is the passage the claim rests on.'), 'role note');
  if (cfg.defLabel) s = must(s, 'const DEFLABEL="How Muslims answer this — put at its strongest";', 'const DEFLABEL=' + J(cfg.defLabel) + ';', 'defense label');
  s = must(s, '<h2>The record, in four acts</h2>', '<h2>${"The record, in "+["no","one","two","three","four","five","six"][Math.min(6,TLACTS.length)]+" act"+(TLACTS.length===1?"":"s")}</h2>', 'timeline head');
  s = must(s, 'What was claimed on the left; what the manuscripts and canon show on the right.', cfg.timelineIntro || 'What was claimed on the left; what the record shows on the right.', 'timeline intro');
  s = must(s, "Street da'wah follows a trained sequence — common ground, undermine the Bible, present the Quran, invite the shahada. Here is each stage, the one question to ask right then, and the cases behind it. Knowing the script lets you stay warm and unhurried.",
    cfg.lessonsIntro, 'lessons intro');

  /* --- nav entry for the core page --- */
  s = must(s,
    '["core","The heart of it","3","The three strongest cases and the foundation argument — read this first"]',
    J(['core', cfg.core.navLabel, cfg.core.navCount, cfg.core.navTip]).slice(1, -1).replace(/^/, '[') + ']',
    'core nav');

  /* --- branding + storage keys --- */
  s = must(s, cfg.oldBrand, cfg.newBrand, 'brand');
  s = s.replace(/wbi_/g, cfg.keyPrefix);
  for (const [a, b] of (cfg.textSwaps || [])) s = must(s, a, b, 'swap:' + a.slice(0, 30));

  /* --- leak check: no Islam-specific wording should survive outside data --- */
  const leaks = [];
  for (const w of ['Muhammad', 'Muslim', 'Quran', "Qur'an", "da'wah", 'sunnah.com', 'tahrif']) {
    const n = (s.match(new RegExp(w, 'g')) || []).length;
    if (n) leaks.push(w + '×' + n);
  }

  fs.writeFileSync(P(cfg.slug + '.html'), s);
  console.log(cfg.slug + '.html written | cases:', data.length, '| theysay:', comp.theysay.length,
    '| dialogs:', Object.keys(comp.dialogs).length, '| residual islam words:', leaks.join(' ') || 'none');
  return leaks;
};
