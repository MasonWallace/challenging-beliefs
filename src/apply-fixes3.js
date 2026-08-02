/* Three fixes: the dead space beside the claims list, the order cases appear in
   each band, and the wall of white text on the missionaries page. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const must=(s,a,b,w)=>{if(!s.includes(a))throw new Error('MISSING '+w);return s.split(a).join(b)};

/* 1. the list was capped at 900px inside a column half again as wide */
const OLDW=`  .vwall.vstack{display:block;max-width:900px}`;
const NEWW=`  .vwall.vstack{display:block;max-width:1180px}`;

/* 2. most striking first — a marked case outranks an unmarked one of any severity */
const OLDSORT=`    const all=["high","medium","low"].flatMap(s=>
      src.filter(d=>d.verdict===v&&d.severity===s)
         .sort((a,b)=>((b.featured?2:isStrong(b)?1:0)-(a.featured?2:isStrong(a)?1:0))));`;
const NEWSORT=`    /* the five on show are the ones a reader should meet first: flagged evidence
       outranks severity, so a band never opens on its dullest case */
    const rank=d=>(d.featured?6:isStrong(d)?4:0)+(d.severity==="high"?2:d.severity==="medium"?1:0);
    const all=src.filter(d=>d.verdict===v).sort((a,b)=>rank(b)-rank(a));`;

/* 3. the missionaries page gets the same structure as a case page */
const OLDLES=`  LESSONS.map(L=>\`<div class="sa"><span class="tpx">\${esc(L.n)}</span><h4 class="sat">\${esc(L.t)}</h4><div class="who them">They will teach</div><p class="pt">\${L.what.map(w=>"• "+esc(w)).join("<br>")}</p>`;
const NEWLES=`  LESSONS.map(L=>\`<div class="sa lcard"><span class="tpx">\${esc(L.n)}</span><h4 class="sat">\${esc(L.t)}</h4><div class="lteach"><div class="who them">What they will teach you</div><p class="pt">\${L.what.map(w=>"• "+esc(w)).join("<br>")}</p></div>`;

const ANCHOR2=`  .pblk .plab.h-slate{color:var(--ink)}`;
const ADD2=ANCHOR2+`

  /* the missionaries page: give it the same shape as a case, not a page of white text */
  .lcard{border:1px solid var(--line);border-radius:12px;background:var(--panel2);padding:16px 18px 18px;margin:0 0 18px}
  .lcard .sat{font-size:1.28rem;margin:6px 0 12px;color:var(--ink)}
  .lcard .tpx{color:var(--gold)}
  .lteach{background:color-mix(in srgb,var(--red) 7%,var(--panel2));border-left:3px solid var(--red);
    border-radius:8px;padding:11px 14px 12px;margin:0 0 12px}
  .lteach .who.them{color:var(--red);font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;display:block}
  .lteach .pt{margin:0;color:var(--ink);line-height:1.85}
  .lcard .saybox{background:color-mix(in srgb,var(--green) 10%,var(--panel2));border-left:3px solid var(--green);border-radius:8px}
  .lcard .saybox .who{color:var(--green);font-size:.78rem}
  .lcard .relrow{margin-top:12px}

  /* headings on the reference pages were the same size as body copy */
  .viewhead h2{font-size:2.1rem}
  .sa .sat,.sh-list>li>b{font-size:1.15rem}
  .pb-h{font-size:1.02rem;letter-spacing:.04em}`;

for(const f of ['study.html','islam.html']){
  let s=fs.readFileSync(P(f),'utf8');
  s=must(s,OLDW,NEWW,f+' width');
  s=must(s,OLDSORT,NEWSORT,f+' sort');
  s=must(s,ANCHOR2,ADD2,f+' css');
  if(s.includes(OLDLES))s=s.split(OLDLES).join(NEWLES);   /* mormon only — islam has no LESSONS */
  fs.writeFileSync(P(f),s);
  console.log('patched '+f);
}
