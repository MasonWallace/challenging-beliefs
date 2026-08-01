/* Plain-English-first case view.
   A case with a `plain` array renders the plain blocks, with the full sourced case
   behind one expander. A case without one renders exactly as before, so sections can
   be converted one at a time without breaking anything.
   Runs on study.html + islam.html; the four generated sections inherit it. */
const fs = require('fs');
const P = f => __dirname + '/' + f;
const check = (l, ok) => { console.log((ok ? 'OK   ' : 'FAIL ') + l); if (!ok) process.exitCode = 1; };

const CSS = `
  /* --- plain-first case view --- */
  .pblk{margin:0 0 15px}
  .pblk .plab{font-size:.63rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:6px;color:var(--acc)}
  .pblk:nth-child(1) .plab{color:var(--red)}
  .pblk:nth-child(3) .plab{color:var(--amber)}
  .pblk:nth-child(4) .plab{color:var(--gold)}
  .pblk p{margin:0 0 9px;font-size:.97rem;line-height:1.8;color:var(--muted)}
  .pblk p:last-child{margin:0}
  .pblk p b{color:var(--ink)}
  .pblk.say{background:linear-gradient(90deg,color-mix(in srgb,var(--green) 11%,transparent),transparent 72%);
    border-left:3px solid var(--green);border-radius:0 10px 10px 0;padding:13px 17px;margin-top:18px}
  .pblk.say .plab{color:var(--green)}
  .pblk.say p{color:var(--ink);font-family:var(--serif);font-size:1.04rem;line-height:1.6}
  details.fullcase{margin-top:22px;border-top:1px solid var(--line);padding-top:14px}
  details.fullcase>summary{cursor:pointer;list-style:none;font-size:.74rem;font-weight:700;letter-spacing:.12em;
    text-transform:uppercase;color:var(--acc);padding:4px 0}
  details.fullcase>summary::-webkit-details-marker{display:none}
  details.fullcase>summary::after{content:" →";transition:margin-left .2s}
  details.fullcase[open]>summary::after{content:" ↓"}
  details.fullcase>summary:hover{color:var(--ink)}
  .quickback{font-size:.74rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--acc);
    background:none;border:0;cursor:pointer;padding:4px 0;margin-bottom:12px;font-family:inherit}
  .quickback:hover{color:var(--ink)}
`;

for (const sh of ['study.html', 'islam.html']) {
  let s = fs.readFileSync(P(sh), 'utf8');

  if (!s.includes('.pblk{')) s = s.replace('</style>', CSS + '</style>');

  /* 1. renderer for the plain blocks */
  if (!s.includes('function plainHtml')) {
    const A = 'function renderCase(';
    check(sh + ' renderCase', s.includes(A));
    s = s.replace(A, 'function plainHtml(d){\n' +
      '  return (d.plain||[]).map(b=>`<div class="pblk${b.say?" say":""}"><div class="plab">${esc(b.t)}</div>${paras(b.d,2)}</div>`).join("");\n' +
      '}\n' + A);
  }

  /* 2. the case body: plain first, full behind the expander */
  if (!s.includes('details class="fullcase"')) {
    const OLD_SIMPLE = '${(d.context&&store.simple)?`<div class="bgbox"><div class="bglab">Simplified <span class="bghint">— plain-English background, toggle in the sidebar</span></div>${paras(d.context,2)}</div>`:""}';
    check(sh + ' old simplified block', s.includes(OLD_SIMPLE));
    s = s.replace(OLD_SIMPLE, '${(d.plain&&d.plain.length&&!store.full)?`<div class="plainwrap">${plainHtml(d)}<details class="fullcase"><summary>Read the full case — sources, the defense in their own words, and the verdict</summary><div class="fullbody">`:(d.plain&&d.plain.length)?`<button class="quickback" id="toquick">← Show the quick summary</button>`:""}');

    /* close the expander at the very end of the case template */
    const ci = s.indexOf('<div class="case">');
    const srcIdx = s.indexOf('tabpane2" id="pane-src', ci);
    const endIdx = s.indexOf('`;', srcIdx);
    check(sh + ' case body end', srcIdx > 0 && endIdx > srcIdx);
    const tail = s.slice(srcIdx, endIdx);
    const anchor = '</div>\n    </div>';
    check(sh + ' case close anchor', tail.endsWith(anchor));
    s = s.slice(0, endIdx - anchor.length) + '</div>\n    ${(d.plain&&d.plain.length&&!store.full)?`</div></details></div>`:""}\n    </div>' + s.slice(endIdx);
  }

  /* 3. the quick/full preference replaces the old Simplified button */
  s = s.split('${store.simple?"◆":"◇"} Simplified <b>${store.simple?"on":"off"}</b>').join('${store.full?"◆":"◇"} ${store.full?"Full detail":"Quick read"}');
  s = s.split('title="Explains every case in plain, high-school-level English above the claim"')
    .join('title="Quick read opens each case in plain English; Full detail opens the sourced version. Both are always one click apart."');
  s = s.split('class="setbtn wide${store.simple?" on":""}"').join('class="setbtn wide${store.full?" on":""}"');
  s = s.split('store.simple=!store.simple;localStorage.setItem(KEY_SIMPLE,store.simple?"1":"0")')
    .join('store.full=!store.full;localStorage.setItem(KEY_FULL,store.full?"1":"0")');
  s = s.split('const KEY_SIMPLE="wbi_simple";').join('const KEY_FULL="wbi_full";');
  s = s.split('const store={simple:localStorage.getItem(KEY_SIMPLE)!=="0",')
    .join('const store={full:localStorage.getItem(KEY_FULL)==="1",');

  /* 4. "show the quick summary" button binding */
  if (!s.includes('toquick')) { /* nothing */ }
  if (!s.includes('#toquick")')) {
    const B = 'bindOpens();';
    const idx = s.indexOf(B, s.indexOf('function renderCase('));
    check(sh + ' case bind point', idx > 0);
    s = s.slice(0, idx) + 'const tq=$("#toquick");if(tq)tq.addEventListener("click",()=>{store.full=false;localStorage.setItem(KEY_FULL,"0");renderNav();render();});\n  ' + s.slice(idx);
  }

  fs.writeFileSync(P(sh), s);
  console.log(sh + ' plain-first view applied');
}
