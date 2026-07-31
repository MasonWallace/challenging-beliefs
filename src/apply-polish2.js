/* Runs on the two hand-maintained shells; the four generated sections inherit
   everything here by cloning islam.html. Order: apply-glossary -> apply-polish2 -> make-* -> build */
const fs = require('fs');
const P = f => __dirname + '/' + f;
const check = (l, ok) => { console.log((ok ? 'OK   ' : 'FAIL ') + l); if (!ok) process.exitCode = 1; };

const CSS = `
  /* --- the "heart of it" / share prose blocks (these had no styles at all) --- */
  .corebox{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:20px 24px 22px;margin:0 0 16px}
  .corebox h3{font-family:var(--serif);font-weight:500;font-size:1.18rem;color:var(--gold);margin:0 0 10px;line-height:1.25}
  .corebox p{font-size:.94rem;line-height:1.78;color:var(--muted);margin:0 0 13px;max-width:78ch}
  .corebox p:last-of-type{margin-bottom:0}
  .corebox p b{color:var(--ink);font-weight:600}
  .corebox p i{color:var(--ink);opacity:.85}
  .corebox .srcdet{margin-top:16px;border-top:1px solid var(--line);padding-top:10px}
  .corebox .pullq,.pullq{font-family:var(--serif);font-size:1.16rem;line-height:1.5;color:var(--ink);
    border-left:3px solid var(--gold);background:linear-gradient(90deg,color-mix(in srgb,var(--gold) 10%,transparent),transparent 72%);
    padding:14px 20px;border-radius:0 10px 10px 0;margin:16px 0;max-width:74ch}
  .sh-list{margin:8px 0 0;padding-left:20px}
  .sh-list li{font-size:.9rem;line-height:1.72;color:var(--muted);margin:0 0 12px}
  .sh-list li b{color:var(--ink)}
  .sh-list li i{color:var(--ink);opacity:.8}
  .sa .pd{font-size:.9rem;line-height:1.72}
  .corehero{margin:0 0 20px;border-radius:14px;overflow:hidden;border:1px solid var(--line);position:relative}
  .corehero img{display:block;width:100%;height:230px;object-fit:cover;filter:saturate(.86) contrast(1.03)}
  .corehero figcaption{position:absolute;left:0;right:0;bottom:0;padding:22px 18px 11px;font-size:.76rem;color:var(--ink);
    background:linear-gradient(transparent,rgba(0,0,0,.82))}
  @media (max-width:700px){.corehero img{height:160px}}

  /* --- verse reader: opens in the reading column, capped so it can't shove the page --- */
  #versebox:empty{display:none}
  .claimcol .versebox{margin-top:16px;max-height:440px;overflow-y:auto;scrollbar-width:thin}
  .claimcol .versebox .vtext{max-width:none}
`;

for (const sh of ['study.html', 'islam.html']) {
  let s = fs.readFileSync(P(sh), 'utf8');

  /* 1. missing styles */
  if (!s.includes('.corebox{')) s = s.replace('</style>', CSS + '</style>');

  /* 2. move the verse reader out of the 300px aside into the reading column */
  if (!s.includes('class="claimcol"')) {
    check(sh + ' versebox in aside', s.includes('<div id="versebox"></div>\n      </div></details>'));
    s = s.replace('<div id="versebox"></div>\n      </div></details>', '</div></details>');
    const OLD = '<div><div class="dlab red" style="margin-top:0">The claim</div><div class="claim">${paras(d.claim)}</div></div>';
    check(sh + ' claim column', s.includes(OLD));
    s = s.replace(OLD, '<div class="claimcol"><div class="dlab red" style="margin-top:0">The claim</div><div class="claim">${paras(d.claim)}</div><div id="versebox"></div></div>');
    // bring the opened passage into view instead of silently growing the page
    s = s.replace('box.innerHTML=`<div class="versebox">',
      'requestAnimationFrame(()=>box.scrollIntoView({behavior:"smooth",block:"nearest"}));box.innerHTML=`<div class="versebox">');
  }

  /* 3. Simplified mode: a persisted setting, sitting above Light mode / Replay tour */
  if (!s.includes('simplebtn')) {
    const A = '<button id="themebtn"';
    check(sh + ' settings anchor', s.includes(A));
    s = s.replace(A, '<button id="simplebtn" style="margin-top:14px;background:none;border:1px solid ${store.simple?"var(--acc)":"var(--line2)"};color:${store.simple?"var(--acc)":"var(--muted)"};border-radius:8px;padding:5px 12px;font-size:.72rem;cursor:pointer" title="Explains every case in plain, high-school-level English before the claim">◆ Simplified: ${store.simple?"on":"off"}</button> <button id="themebtn"');
    s = s.replace('$("#themebtn").addEventListener("click",()=>{',
      '$("#simplebtn").addEventListener("click",()=>{store.simple=!store.simple;localStorage.setItem(KEY_SIMPLE,store.simple?"1":"0");renderNav();render();});\n  $("#themebtn").addEventListener("click",()=>{');
    // store + key
    const S = 'const store={';
    check(sh + ' store', s.includes(S));
    s = s.replace(S, 'const KEY_SIMPLE=' + JSON.stringify(sh === 'study.html' ? 'wbi_simple' : 'wbi_simple') + ';\nconst store={simple:localStorage.getItem(KEY_SIMPLE)!=="0",');
  }

  /* 4. the panel: renamed, and gated on the setting */
  s = s.split('${d.context?`<div class="bgbox"><div class="bglab">The background — in plain English</div>')
    .join('${(d.context&&store.simple)?`<div class="bgbox"><div class="bglab">Simplified <span class="bghint">— plain-English background, toggle in the sidebar</span></div>');
  if (!s.includes('.bghint')) {
    s = s.replace('</style>', '  .bghint{font-weight:400;letter-spacing:.02em;text-transform:none;color:var(--dim);font-size:.68rem}\n</style>');
  }


  /* 5. an unresolved reference used to throw and blank the page */
  if (!s.includes('vmiss')) {
    const A = 'ch.classList.add("open");\n    const side=';
    check(sh + ' chip handler', s.includes(A));
    s = s.replace(A, 'ch.classList.add("open");\n    if(!v||!v.verses){box.innerHTML=`<div class="versebox vmiss"><div class="vr"><span>${esc(cite)}</span><button data-close>\u2715 close</button></div><div class="vwhy">This reference is cited by the claim but isn\'t in the built-in reader \u2014 open it in your own Bible.</div></div>`;const cb=box.querySelector("[data-close]");if(cb)cb.addEventListener("click",()=>{box.innerHTML="";ch.classList.remove("open");});return;}\n    const side=');
    s = s.replace('</style>', '  .versebox.vmiss{border-left-color:var(--line2);opacity:.85}\n</style>');
  }

  fs.writeFileSync(P(sh), s);
  console.log(sh + ' polished');
}
