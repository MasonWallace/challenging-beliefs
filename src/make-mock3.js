/* Four ways to make the claims list pop. Real titles, real hooks, real images. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const D=JSON.parse('['+fs.readFileSync(P('index.html'),'utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']');
const shell=fs.readFileSync(P('study.html'),'utf8');
function grab(s,n){const i=s.search(new RegExp('const '+n+'\\s*=\\s*\\{'));if(i<0)return{};let j=s.indexOf('{',i),d=0,q=null;
  for(;j<s.length;j++){const c=s[j];if(q){if(c==='\\'){j++;continue}if(c===q)q=null;continue}
  if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='{')d++;else if(c==='}'&&--d===0)return Function('return '+s.slice(s.indexOf('{',i),j+1))();}return{}}
const IMG=grab(shell,'IMGMAP');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const VN={admitted:'Admitted',unrefuted:'Unrefuted',contested:'Contested',answered:'Answered'};
const VD={admitted:'Their own church publications admit these facts. You can make this point from LDS sources alone.',
 unrefuted:'No good counter-argument has been published by LDS scholars.',
 contested:'LDS scholars have a real answer here. Say so before your friend does.',
 answered:'The LDS answer holds up. Do not lead with this one.'};
const rank=d=>(d.featured?6:0)+(d.severity==='high'?2:d.severity==='medium'?1:0);
const band=v=>D.filter(d=>d.verdict===v).sort((a,b)=>rank(b)-rank(a));
/* the hook: first sentence of the first plain block */
const hook=d=>{const b=(d.plain||[])[0]; if(!b)return '';
  const s=b.d.replace(/<[^>]+>/g,'').split(/(?<=[.!?])\s+/)[0]; return s.length>112?s.slice(0,109)+'…':s};
const thumb=d=>IMG[d.id]?`<img class="th" src="${IMG[d.id].src}" alt="" loading="lazy">`
  :`<span class="th ph">${esc(d.title.replace(/[^A-Za-z]/g,'').slice(0,1)||'·')}</span>`;

/* A — thumbnail rail */
const A=['unrefuted','admitted'].map(v=>`<div class="bd ${v}"><div class="bh"><span class="n">${band(v).length}</span><span class="t">${VN[v]}</span><p>${VD[v]}</p></div>
 ${band(v).slice(0,4).map(d=>`<div class="rowA">${thumb(d)}<div><h5>${esc(d.title)}</h5><p class="hk">${esc(hook(d))}</p></div></div>`).join('')}
 <button class="more">Show all ${band(v).length} →</button></div>`).join('');

/* B — hook under a bigger title, no images */
const B=['unrefuted','admitted'].map(v=>`<div class="bd ${v}"><div class="bh"><span class="n">${band(v).length}</span><span class="t">${VN[v]}</span><p>${VD[v]}</p></div>
 ${band(v).slice(0,4).map(d=>`<div class="rowB"><h5>${esc(d.title)}</h5><p class="hk">${esc(hook(d))}</p></div>`).join('')}
 <button class="more">Show all ${band(v).length} →</button></div>`).join('');

/* C — ranked countdown, most striking first */
const C=['unrefuted','admitted'].map(v=>`<div class="bd ${v}"><div class="bh"><span class="n">${band(v).length}</span><span class="t">${VN[v]}</span><p>${VD[v]}</p></div>
 ${band(v).slice(0,4).map((d,i)=>`<div class="rowC"><span class="rk">${String(i+1).padStart(2,'0')}</span><div><h5>${esc(d.title)}</h5><p class="hk">${esc(hook(d))}</p></div></div>`).join('')}
 <button class="more">Show all ${band(v).length} →</button></div>`).join('');

/* D — editorial, large type, hairline rules */
const D4=['unrefuted','admitted'].map(v=>`<div class="bdD ${v}"><div class="bhD"><span class="t">${VN[v]}</span><span class="n">${band(v).length}</span></div><p class="dD">${VD[v]}</p>
 ${band(v).slice(0,4).map(d=>`<div class="rowD"><h5>${esc(d.title)}</h5><p class="hk">${esc(hook(d))}</p></div>`).join('')}
 <button class="more">Show all ${band(v).length} →</button></div>`).join('');

const OPT=[['A','A picture beside every claim',
 'A thumbnail turns a line of text into a thing you look at. The catch is real: only 41% of Mormonism cases and 40% of Islam cases have an image, and JW, Hebrew Israelites, Messiah and Case for God have <b>none at all</b>. The grey letter blocks below are what an image-less row looks like — that is 70 of 119 rows today.',A],
 ['B','One line of the story under each title',
 'No images needed. Each title gains a sentence lifted from the case itself, so a reader sees what the story <i>is</i> before deciding. Costs nothing but vertical space, and works identically in all six sections.',B],
 ['C','Numbered, most striking first',
 'The same list, counted down. A number implies an editor stood behind the order and says "this is the one to read first." Pairs naturally with putting Unrefuted at the top.',C],
 ['D','Editorial weight — bigger type, less furniture',
 'No thumbnails, no numbers, no badges inside the band. The title is set large in the serif, with a hairline rule and a lot of air. The claim itself does the work.',D4]];

const css=`:root{--bg:#0f1116;--panel:#161a21;--panel2:#12151b;--line:#232833;--line2:#2b313d;--ink:#e7e9ec;--muted:#98a0ac;--dim:#565e6b;
--gold:#82b1d8;--red:#e0736a;--amber:#cf9a45;--green:#7fb08d;--purp:#b394e0;
--serif:'Iowan Old Style',Palatino,Georgia,serif;--sans:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
@media (prefers-color-scheme:light){:root{--bg:#f3f4f6;--panel:#fff;--panel2:#f7f8fa;--line:#dfe2e7;--line2:#cfd4db;--ink:#1b1e23;--muted:#5c6470;--dim:#9aa1ab;--gold:#2f6b9e;--red:#b03a31;--amber:#8a5f0e;--green:#3e7455;--purp:#6b4fa1}}
:root[data-theme="dark"]{--bg:#0f1116;--panel:#161a21;--panel2:#12151b;--line:#232833;--ink:#e7e9ec;--muted:#98a0ac;--dim:#565e6b;--gold:#82b1d8;--red:#e0736a}
:root[data-theme="light"]{--bg:#f3f4f6;--panel:#fff;--panel2:#f7f8fa;--line:#dfe2e7;--ink:#1b1e23;--muted:#5c6470;--dim:#9aa1ab;--gold:#2f6b9e;--red:#b03a31}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.6}
.wrap{max-width:1000px;margin:0 auto;padding:36px 20px 80px}
h1{font-family:var(--serif);font-size:1.9rem;margin:0 0 6px}
.sub{color:var(--muted);max-width:64ch;margin:0 0 30px}
.opt{margin:0 0 44px;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--panel2)}
.oh{padding:16px 20px;background:var(--panel);border-bottom:1px solid var(--line)}
.ol{font-size:.66rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}
.ot{font-family:var(--serif);font-size:1.3rem;margin:3px 0 5px}
.od{color:var(--muted);font-size:.89rem;margin:0;max-width:70ch}
.ob{padding:18px 20px 22px}
.bd{border:1px solid var(--line);border-radius:12px;background:var(--panel2);margin:0 0 16px;overflow:hidden}
.bd.unrefuted .bh{border-bottom:2px solid var(--red)}.bd.admitted .bh{border-bottom:2px solid var(--purp)}
.bh{padding:15px 18px 13px}
.bh .n{font-family:var(--serif);font-size:2.1rem;line-height:1}
.bh .t{font-size:.8rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-left:9px}
.bd.unrefuted .bh .t{color:var(--red)}.bd.admitted .bh .t{color:var(--purp)}
.bh p{margin:6px 0 0;font-size:.86rem;color:var(--muted);max-width:70ch}
.rowA{display:flex;gap:14px;align-items:center;padding:11px 18px;border-top:1px solid var(--line)}
.th{width:64px;height:48px;flex:none;border-radius:7px;object-fit:cover;border:1px solid var(--line2)}
.th.ph{display:grid;place-items:center;background:var(--panel);color:var(--dim);font-family:var(--serif);font-size:1.2rem}
.rowA h5,.rowB h5,.rowC h5{font-family:var(--serif);font-weight:500;margin:0;font-size:1.02rem;line-height:1.35}
.hk{margin:3px 0 0;font-size:.83rem;color:var(--muted);line-height:1.5}
.rowB{padding:12px 18px;border-top:1px solid var(--line)}
.rowB h5{font-size:1.12rem}
.rowC{display:flex;gap:14px;align-items:baseline;padding:12px 18px;border-top:1px solid var(--line)}
.rk{font-family:var(--serif);font-size:1.5rem;color:var(--dim);flex:none;font-variant-numeric:tabular-nums;min-width:34px}
.rowC h5{font-size:1.1rem}
.more{display:block;width:100%;text-align:left;background:none;border:0;border-top:1px solid var(--line);padding:11px 18px;
  color:var(--gold);font-family:inherit;font-size:.83rem;font-weight:600;cursor:pointer}
.bdD{margin:0 0 30px}
.bhD{display:flex;align-items:baseline;gap:10px;border-bottom:1px solid var(--line2);padding-bottom:7px}
.bhD .t{font-family:var(--serif);font-size:1.32rem}
.bdD.unrefuted .bhD .t{color:var(--red)}.bdD.admitted .bhD .t{color:var(--purp)}
.bhD .n{color:var(--dim);font-size:.8rem;font-variant-numeric:tabular-nums}
.dD{color:var(--muted);font-size:.86rem;margin:8px 0 4px;max-width:70ch}
.rowD{padding:15px 0;border-bottom:1px solid var(--line)}
.rowD h5{font-family:var(--serif);font-weight:500;font-size:1.36rem;line-height:1.28;margin:0}
.note{border-left:3px solid var(--gold);background:var(--panel);padding:12px 16px;border-radius:0 8px 8px 0;margin:0 0 28px;color:var(--muted);font-size:.89rem}
.note b{color:var(--ink)}
@media(max-width:560px){.rowA{flex-wrap:wrap}.rowD h5{font-size:1.14rem}}`;

const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>All Claims — four ways to make the stories pop</title><style>${css}</style></head><body><div class="wrap">
<h1>Four ways to make the stories pop</h1>
<p class="sub">Same Option B bands, same real titles. What changes is how much weight each claim carries on the page. All four show <b>Unrefuted first</b> — the strongest material, rather than Admitted.</p>
<div class="note"><b>Truncated to two bands and four rows each.</b> The real page keeps all four bands and the Show all. Hooks are pulled from each case's own opening line, not written for the mockup.</div>
${OPT.map(([l,t,d,body])=>`<div class="opt"><div class="oh"><div class="ol">Option ${l}</div><div class="ot">${t}</div><p class="od">${d}</p></div><div class="ob">${body}</div></div>`).join('')}
</div></body></html>`;
fs.writeFileSync(P('mock-claims-3.html'),html);
console.log('mock-claims-3.html · '+(html.length/1024|0)+'K');
