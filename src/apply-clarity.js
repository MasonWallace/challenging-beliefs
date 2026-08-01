/* Reader-reported fixes, applied everywhere:
   1. Bible references inside ordinary prose become live — hover/click opens the
      passage with context, same as the reference chips.
   2. The verdict badge carries its meaning in plain words, on the page, not in a tooltip.
   3. "The best defense" says WHOSE defense, per section. */
const fs = require('fs');
const P = f => __dirname + '/' + f;
const check = (l, ok) => { console.log((ok ? 'OK   ' : 'FAIL ') + l); if (!ok) process.exitCode = 1; };

const CSS = `
  .ref-bib,.ref-lds{cursor:default}
  .ref-bib.live,.ref-lds.live{cursor:pointer;border-bottom:1px dashed color-mix(in srgb,var(--gold) 55%,transparent)}
  .ref-bib.live:hover,.ref-lds.live:hover,.ref-bib.live.peek,.ref-bib.live.open{border-bottom-style:solid;background:color-mix(in srgb,var(--gold) 14%,transparent);border-radius:3px}
  .vmeaning{display:block;font-size:.82rem;line-height:1.6;color:var(--muted);margin:8px 0 0}
  .vbox .vmeaning{margin-top:6px}
  .verdictline{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}
`;

for (const sh of ['study.html', 'islam.html']) {
  let s = fs.readFileSync(P(sh), 'utf8');
  if (!s.includes('.ref-bib.live')) s = s.replace('</style>', CSS + '</style>');

  /* --- 1. make in-prose references live --- */
  if (!s.includes('LIVEREFS')) {
    const A = 'const canHover=window.matchMedia("(hover:hover)").matches;';
    check(sh + ' verse handler', s.includes(A));
    s = s.replace(A,
      '/* LIVEREFS: any reference printed inside prose that we can actually open */\n' +
      '  document.querySelectorAll("#main .ref-bib, #main .ref-lds").forEach(r=>{\n' +
      '    const key=r.textContent.replace(/\\s+/g," ").trim();\n' +
      '    const hit=VERSES[key]?key:Object.keys(VERSES).find(k=>k.replace(/[\\u2013\\u2014]/g,"-")===key.replace(/[\\u2013\\u2014]/g,"-"));\n' +
      '    if(!hit)return;\n' +
      '    r.classList.add("live","chip");r.dataset.cite=hit;\n' +
      '  });\n  ' + A);
  }

  /* --- 2. verdict meaning in plain sight --- */
  const VB = '<div class="vbox v-${d.verdict}"><b class="vb">${VLABEL[d.verdict]}</b>';
  if (s.includes(VB)) {
    s = s.replace(VB, '<div class="vbox v-${d.verdict}"><div class="verdictline"><b class="vb">${VLABEL[d.verdict]}</b><span class="vmeaning">${esc(VDESC[d.verdict]||"")}</span></div>');
    console.log(sh + ' verdict meaning shown inline');
  } else check(sh + ' verdict box (already applied?)', s.includes('verdictline'));

  /* --- 3. whose defense --- */
  const DL = '<div class="dlab blue" style="margin-top:0">The best defense, steelmanned</div>';
  check(sh + ' defense label', s.includes(DL));
  s = s.replace(DL, '<div class="dlab blue" style="margin-top:0">${DEFLABEL}</div>');
  if (!s.includes('const DEFLABEL')) {
    const lbl = sh === 'study.html'
      ? 'const DEFLABEL="How Latter-day Saints answer this — put at its strongest";'
      : 'const DEFLABEL="How Muslims answer this — put at its strongest";';
    s = s.replace('function plainHtml(d){', lbl + '\n' + 'function plainHtml(d){');
  }

  fs.writeFileSync(P(sh), s);
  console.log(sh + ' clarity fixes applied');
}

/* --- VDESC was declared inside a render function; the case view needs it too --- */
for (const sh of ['study.html', 'islam.html']) {
  let s = fs.readFileSync(P(sh), 'utf8');
  const i = s.indexOf('const VDESC=');
  if (i < 0) { check(sh + ' VDESC found', false); continue; }
  if (s.slice(0, i).lastIndexOf('\nconst VDESC=') === i - 1) { console.log(sh + ' VDESC already global'); continue; }
  const end = s.indexOf('};', i) + 2;
  const lit = s.slice(i, end);
  s = s.slice(0, i) + s.slice(end);
  s = s.replace('function plainHtml(d){', lit + '\n' + 'function plainHtml(d){');
  fs.writeFileSync(P(sh), s);
  console.log(sh + ' VDESC hoisted to top level');
}
