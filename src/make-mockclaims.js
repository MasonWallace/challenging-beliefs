/* Five different answers to "119 cases in one list is overwhelming".
   Built from the real Mormonism data so the comparison is honest. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const D=JSON.parse('['+fs.readFileSync(P('index.html'),'utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']');
const shell=fs.readFileSync(P('study.html'),'utf8');
const SECMAP=JSON.parse(shell.match(/const SECMAP=(\{.*?\});/)[1]);
const CATDESC=JSON.parse(shell.match(/const CATDESC=(\{[\s\S]*?\});\n/)[1]);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const SECNAME={text:'The book’s text',doctrine:'The doctrine',history:'The history',peculiar:'Life inside the church'};
const SECBLURB={text:'Where the English of the Book of Mormon came from.',
  doctrine:'What the church teaches, set against the Bible.',
  history:'What happened, and what the ground and the documents show.',
  peculiar:'The temple, the rules, and what leaving costs.'};
const VNAME={admitted:'They admit this themselves',unrefuted:'No good answer has been given',
  contested:'Genuinely arguable, both ways',answered:'Answered — do not lead with these'};
const VBLURB={admitted:'Conceded in the church’s own published material. The strongest ground you have.',
  unrefuted:'Raised for a long time, never answered well. Use with care and without gloating.',
  contested:'Both sides hold something true. Expect a real conversation, not a win.',
  answered:'The church has a fair reply. Leading with these costs you credibility.'};
const VORDER=['admitted','unrefuted','contested','answered'];

D.forEach(d=>d.section=SECMAP[d.category]||'history');
const bySec={},byVer={},byCat={};
for(const d of D){(bySec[d.section]=bySec[d.section]||[]).push(d);(byVer[d.verdict]=byVer[d.verdict]||[]).push(d);(byCat[d.category]=byCat[d.category]||[]).push(d)}

const badge=d=>`<span class="vb ${d.verdict}">${d.verdict==='admitted'?'admitted':d.verdict==='unrefuted'?'unanswered':d.verdict==='contested'?'arguable':'answered'}</span>`;
const row=d=>`<div class="row">${badge(d)}<span class="rt">${esc(d.title)}</span>${d.severity==='high'?'<span class="sev">major</span>':''}</div>`;
const card=d=>`<div class="card">${badge(d)}<h4>${esc(d.title)}</h4></div>`;

/* ---- 1. grouped accordion ---- */
const m1=Object.keys(SECNAME).map((k,i)=>`
  <details class="acc"${i===0?' open':''}><summary><span class="an">${SECNAME[k]}</span><span class="ac">${bySec[k].length}</span></summary>
  <p class="ab">${SECBLURB[k]}</p>
  ${bySec[k].slice(0,i===0?6:4).map(row).join('')}
  <button class="more">Show all ${bySec[k].length} →</button></details>`).join('');

/* ---- 2. sorted by how useful it is to you ---- */
const m2=VORDER.map(v=>`
  <div class="vgroup ${v}"><div class="vh"><span class="vt">${VNAME[v]}</span><span class="ac">${(byVer[v]||[]).length}</span></div>
  <p class="ab">${VBLURB[v]}</p>
  ${(byVer[v]||[]).slice(0,4).map(row).join('')}
  <button class="more">Show all ${(byVer[v]||[]).length} →</button></div>`).join('');

/* ---- 3. start here, then filter ---- */
const pick=D.filter(d=>d.severity==='high'&&(d.verdict==='admitted'||d.verdict==='unrefuted')).slice(0,6);
const m3=`<div class="hero"><div class="hl">If you read six, read these</div>
  <p class="ab">The six that come up most and hold up best. Everything else is one click away.</p>
  <div class="cards">${pick.map(card).join('')}</div></div>
  <div class="filtbar"><span class="fl">Then narrow it:</span>
  <button class="chipf on">All 119</button><button class="chipf">The text 13</button><button class="chipf">Doctrine 38</button>
  <button class="chipf">History 40</button><button class="chipf">Life inside 28</button>
  <span class="fsep"></span><button class="chipf">They admit it 28</button><button class="chipf">Unanswered 30</button><button class="chipf">⚠ Stop using 9</button></div>
  <div class="dim">${D.slice(6,12).map(row).join('')}<div class="fade"></div></div>`;

/* ---- 4. two-pane browser ---- */
const cats=Object.entries(byCat).sort((a,b)=>b[1].length-a[1].length);
const m4=`<div class="two">
  <div class="rail">${Object.keys(SECNAME).map(k=>`<div class="rg">${SECNAME[k]}</div>`+
    cats.filter(([c])=>SECMAP[c]===k).slice(0,4).map(([c,v],i)=>
    `<div class="ri${k==='history'&&i===0?' on':''}">${esc(c.replace(/-/g,' '))}<span>${v.length}</span></div>`).join('')).join('')}</div>
  <div class="pane"><div class="ph">Institutional <span class="ac">11</span></div>
  <p class="ab">${esc(CATDESC['institutional']||'')}</p>
  ${(byCat['institutional']||[]).slice(0,7).map(row).join('')}</div></div>`;

/* ---- 5. by the question a person actually asks ---- */
const Q=[['What they will say first',['Isaiah chapters reproduced verbatim in King James English','Horses (and chariots) in pre-Columbian America','Steel and an iron industry in the pre-Columbian New World']],
        ['Once you are past the surface',['Book of Mormon Isaiah variants cluster on KJV italicized words','Alma 12–13 structured on the Epistle to the Hebrews']],
        ['The ones that cost something',['Dark skin as a divine curse (and the modern text and heading edits)','Moroni quotes the disputed ‘long ending’ of Mark']]];
const QQ={'Isaiah chapters reproduced verbatim in King James English':'“Why does a book from 600 BC quote a 1611 English Bible?”',
 'Horses (and chariots) in pre-Columbian America':'“Were there horses in ancient America?”',
 'Steel and an iron industry in the pre-Columbian New World':'“Did anyone in ancient America make steel?”',
 'Book of Mormon Isaiah variants cluster on KJV italicized words':'“Why do the changes land on the italic words?”',
 'Alma 12–13 structured on the Epistle to the Hebrews':'“Why does Alma sound like Hebrews?”',
 'Dark skin as a divine curse (and the modern text and heading edits)':'“Did the church teach that dark skin was a curse?”',
 'Moroni quotes the disputed ‘long ending’ of Mark':'“Why quote a passage scholars say was added later?”'};
const m5=Q.map(([h,items])=>`<div class="qg"><div class="qh">${h}</div>
  ${items.map(t=>{const d=D.find(x=>x.title===t)||{verdict:'contested'};
    return `<div class="qrow">${badge(d)}<div><div class="qq">${esc(QQ[t]||t)}</div><div class="qs">${esc(t)}</div></div></div>`}).join('')}</div>`).join('');

const OPT=[['A','Grouped, and folded shut','Four big groups, everything collapsed until you open one. You see four things, not 119.',m1],
 ['B','Sorted by how useful it is to you','Not by topic — by whether the argument actually works. The reader wants ammunition, not a filing system.',m2],
 ['C','Start here, then filter','Six cases up front, everything else behind a filter bar. Nobody has to choose from 119 to begin.',m3],
 ['D','Two-pane browser','Topics on the left, claims on the right. Only ever about ten on screen. Feels like an app, not a list.',m4],
 ['E','By the question you will be asked','Each claim titled as the question a real person asks, grouped by where it comes up in a conversation.',m5]];

const css=`
:root{--bg:#0f1116;--side:#0b0d11;--panel:#161a21;--panel2:#12151b;--line:#232833;--line2:#2b313d;
--ink:#e7e9ec;--muted:#98a0ac;--dim:#565e6b;--gold:#82b1d8;--red:#e0736a;--amber:#cf9a45;--green:#7fb08d;--purp:#b394e0;--teal:#6cb6ad;
--serif:'Iowan Old Style',Palatino,Georgia,serif;--sans:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.6}
.wrap{max-width:960px;margin:0 auto;padding:38px 22px 90px}
h1{font-family:var(--serif);font-size:1.9rem;margin:0 0 6px;font-weight:600}
.sub{color:var(--muted);margin:0 0 34px;max-width:60ch}
.opt{margin:0 0 46px;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--panel2)}
.oh{padding:16px 20px;background:var(--panel);border-bottom:1px solid var(--line)}
.ol{font-size:.68rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}
.ot{font-family:var(--serif);font-size:1.22rem;margin:3px 0 4px}
.od{color:var(--muted);font-size:.9rem;margin:0;max-width:64ch}
.ob{padding:18px 20px 22px}
.row{display:flex;gap:10px;align-items:baseline;padding:8px 0;border-top:1px solid var(--line)}
.row:first-of-type{border-top:none}
.rt{flex:1;font-size:.93rem}
.sev{font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:var(--amber);border:1px solid color-mix(in srgb,var(--amber) 45%,transparent);border-radius:20px;padding:1px 7px;flex:none}
.vb{flex:none;font-size:.6rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;border-radius:20px;padding:2px 9px;min-width:78px;text-align:center}
.vb.admitted{color:var(--green);background:color-mix(in srgb,var(--green) 15%,transparent)}
.vb.unrefuted{color:var(--red);background:color-mix(in srgb,var(--red) 15%,transparent)}
.vb.contested{color:var(--amber);background:color-mix(in srgb,var(--amber) 15%,transparent)}
.vb.answered{color:var(--muted);background:color-mix(in srgb,var(--muted) 14%,transparent)}
.ab{color:var(--muted);font-size:.85rem;margin:2px 0 10px;max-width:62ch}
.more{margin-top:10px;background:none;border:1px solid var(--line2);color:var(--gold);border-radius:8px;padding:5px 12px;font-size:.78rem;cursor:pointer;font-family:inherit}
.ac{font-size:.72rem;color:var(--dim);font-variant-numeric:tabular-nums}
details.acc{border:1px solid var(--line);border-radius:10px;margin:0 0 10px;background:var(--panel2)}
details.acc summary{cursor:pointer;padding:13px 16px;display:flex;justify-content:space-between;align-items:center;list-style:none}
details.acc summary::-webkit-details-marker{display:none}
details.acc summary::before{content:'▸ ';color:var(--dim)}
details.acc[open] summary::before{content:'▾ '}
.an{font-family:var(--serif);font-size:1.05rem;flex:1;margin-left:6px}
details.acc>*:not(summary){padding-left:16px;padding-right:16px}
details.acc>.more{margin-left:16px;margin-bottom:14px}
.vgroup{border-left:3px solid var(--line2);padding:2px 0 12px 15px;margin:0 0 18px}
.vgroup.admitted{border-left-color:var(--green)}.vgroup.unrefuted{border-left-color:var(--red)}
.vgroup.contested{border-left-color:var(--amber)}.vgroup.answered{border-left-color:var(--dim)}
.vh{display:flex;justify-content:space-between;align-items:baseline}
.vt{font-family:var(--serif);font-size:1.06rem}
.hero{border:1px solid var(--line2);border-radius:12px;padding:16px 18px;background:var(--panel);margin-bottom:16px}
.hl{font-family:var(--serif);font-size:1.1rem;margin-bottom:2px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin-top:12px}
.card{border:1px solid var(--line);border-radius:9px;padding:11px 12px;background:var(--panel2)}
.card h4{margin:7px 0 0;font-size:.88rem;font-weight:600;line-height:1.4}
.filtbar{display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin:0 0 12px}
.fl{font-size:.75rem;color:var(--dim);margin-right:4px}
.fsep{width:1px;height:18px;background:var(--line2);margin:0 4px}
.chipf{font-size:.76rem;border:1px solid var(--line2);background:var(--panel2);color:var(--muted);border-radius:20px;padding:4px 11px;cursor:pointer;font-family:inherit}
.chipf.on{border-color:var(--gold);color:var(--gold)}
.dim{position:relative;opacity:.5}
.fade{position:absolute;inset:auto 0 0 0;height:60px;background:linear-gradient(transparent,var(--panel2))}
.two{display:grid;grid-template-columns:minmax(0,190px) minmax(0,1fr);gap:0;border:1px solid var(--line);border-radius:10px;overflow:hidden}
.rail{background:var(--side);padding:12px 0;border-right:1px solid var(--line)}
.rg{font-size:.62rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);padding:12px 14px 5px}
.ri{display:flex;justify-content:space-between;padding:5px 14px;font-size:.83rem;color:var(--muted);cursor:pointer;text-transform:capitalize}
.ri span{color:var(--dim);font-size:.72rem}
.ri.on{background:var(--panel);color:var(--gold);box-shadow:inset 2px 0 0 var(--gold)}
.pane{padding:14px 16px}
.ph{font-family:var(--serif);font-size:1.06rem;display:flex;justify-content:space-between;align-items:baseline;text-transform:capitalize}
.qg{margin:0 0 20px}
.qh{font-size:.66rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--purp);margin-bottom:9px}
.qrow{display:flex;gap:11px;align-items:flex-start;padding:9px 0;border-top:1px solid var(--line)}
.qrow:first-of-type{border-top:none}
.qq{font-family:var(--serif);font-size:1rem;color:var(--ink)}
.qs{font-size:.76rem;color:var(--dim);margin-top:2px}
.note{border-left:3px solid var(--gold);background:var(--panel);padding:12px 16px;border-radius:0 8px 8px 0;margin:0 0 32px;color:var(--muted);font-size:.9rem}
.note b{color:var(--ink)}
@media(max-width:640px){.two{grid-template-columns:1fr}.rail{border-right:none;border-bottom:1px solid var(--line)}}
`;

const html=`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>All Claims — five ways to lay it out</title><style>${css}</style></head><body><div class="wrap">
<h1>All Claims — five ways to lay it out</h1>
<p class="sub">The problem: 119 cases in one flat list, sorted by nothing a reader recognises, with 27 sub-categories underneath. Five different answers below, each built with the real Mormonism data. They are genuinely different approaches, not five coats of paint.</p>
<div class="note"><b>Read them for the idea, not the pixels.</b> Each one is truncated — the real page would show every case. What matters is the first thing a reader sees, and how they decide where to go next.</div>
${OPT.map(([l,t,d,body])=>`<div class="opt"><div class="oh"><div class="ol">Option ${l}</div><div class="ot">${t}</div><p class="od">${d}</p></div><div class="ob">${body}</div></div>`).join('')}
</div></body></html>`;
fs.writeFileSync(P('mock-claims.html'),html);
console.log('mock-claims.html written · '+(html.length/1024|0)+'K');
