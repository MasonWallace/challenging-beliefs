/* Second round of reader-reported fixes, applied to every section:
   1. The passage opens next to the reference you hovered, not at the bottom of the column.
   2. The verse panel is much smaller — it was eating the screen.
   3. Plain-block headings are coloured, not white. */
const fs = require('fs');
const P = f => __dirname + '/' + f;
const check = (l, ok) => { console.log((ok ? 'OK   ' : 'FAIL ') + l); if (!ok) process.exitCode = 1; };

const CSS = `
  /* --- verse panel: compact, and it appears beside what you hovered --- */
  .claimcol .versebox,.pblk + .versebox{margin:10px 0 14px;max-height:210px;overflow-y:auto;scrollbar-width:thin}
  .versebox .vtext{font-size:.86rem;line-height:1.62;max-width:none}
  .versebox .vs{color:var(--dim)}
  .versebox .vs.hl{color:var(--ink)}
  .versebox .vwhy{font-size:.76rem;margin-top:8px;padding-top:7px}
  .versebox .vr{font-size:.66rem}
  #versebox{scroll-margin-top:80px}

  /* --- plain-block headings are labels, not body text --- */
  .pblk .plab{color:var(--acc) !important}
  .pblk.say .plab{color:var(--green) !important}
  .pblk .plab.warn{color:var(--amber) !important}
  .pblk .plab.strong{color:var(--gold) !important}
`;

for (const sh of ['study.html', 'islam.html']) {
  let s = fs.readFileSync(P(sh), 'utf8');
  if (!s.includes('.pblk + .versebox')) s = s.replace('</style>', CSS + '</style>');

  /* move the box next to whatever was hovered */
  const A = '    const cite=ch.dataset.cite,v=VERSES[cite],box=$("#versebox");\n    if(!box)return;';
  check(sh + ' showVerse head', s.includes(A));
  s = s.replace(A, A + `
    /* put the passage beside the thing that was hovered, not at the foot of the column */
    const host=ch.closest(".pblk")||ch.closest(".claim")||null;
    if(host&&host.parentNode)host.parentNode.insertBefore(box,host.nextSibling);
    else{const cc=document.querySelector("#main .claimcol");if(cc)cc.appendChild(box);}`);

  /* colour the two headings that carry a judgement */
  const PB = 'return \`<div class="pblk\${b.say?" say":""}"><div class="plab">\${esc(b.t)}</div>';
  check(sh + ' plainHtml block', s.includes(PB));
  s = s.replace(PB, 'const tone=/^how strong/i.test(b.t)?" strong":/(don\'t|do not|avoid|the rule|embarrass)/i.test(b.t)?" warn":"";\n    return \`<div class="pblk\${b.say?" say":""}"><div class="plab\${tone}">\${esc(b.t)}</div>');

  fs.writeFileSync(P(sh), s);
  console.log(sh + ' verse anchoring + heading colour applied');
}

/* --- glossary: terms we print in another language must be explained on hover --- */
const G = require('./glossary-data.js');
const ADD = {
  MESSIAH: [
    { t: "brit chadashah", d: "Hebrew for <i>new covenant</i> — <i>brit</i> is covenant, <i>chadashah</i> is new. It is the exact phrase Jeremiah uses in Jeremiah 31:31, which is the whole point: the words are Hebrew and Jewish, not a Christian translation choice." },
    { t: "counter-missionary", d: "The organised Jewish response to Christian outreach — teachers and groups whose work is specifically answering Christian claims about the Hebrew Bible. Tovia Singer and Jews for Judaism are the best known. Expect a prepared answer, not an improvised one." },
    { t: "Rashi", d: "Rabbi Shlomo Yitzchaki (1040–1105), a French rabbi and the most influential Jewish Bible commentator ever. He read Isaiah 53 as the nation of Israel, and that reading became standard after him — it was not standard before." },
    { t: "Nahal Hever", d: "A ravine near the Dead Sea where scroll fragments were found in the 1950s. One of them carries the reading 'they pierced' at Psalm 22:16, about a thousand years older than the standard Hebrew text." },
    { t: "Septuagint", d: "The Greek translation of the Hebrew Bible, made by Jewish scholars starting around 250 BC — often shortened to LXX. It matters constantly here because it is pre-Christian: when it renders a verse a certain way, no Christian could have influenced it." }
  ]
};
let added = 0;
for (const [key, list] of Object.entries(ADD)) {
  const have = new Set(G[key].map(g => g.t.toLowerCase()));
  for (const g of list) if (!have.has(g.t.toLowerCase())) { G[key].push(g); added++; }
}
if (added) {
  const out = fs.readFileSync(P('glossary-data.js'), 'utf8');
  const inject = ADD.MESSIAH.filter(g => !out.includes('"' + g.t + '"') && !out.includes("'" + g.t + "'"))
    .map(g => '  { t: ' + JSON.stringify(g.t) + ', d: ' + JSON.stringify(g.d) + ' },').join('\n');
  if (inject) {
    fs.writeFileSync(P('glossary-data.js'), out.replace('const MESSIAH = [', 'const MESSIAH = [\n' + inject));
    console.log('glossary: ' + inject.split('\n').length + ' terms added (brit chadashah, counter-missionary, Rashi, Nahal Hever, Septuagint)');
  }
}
