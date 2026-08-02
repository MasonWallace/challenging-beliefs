/* Option B: the four verdict groups stay, but stacked down the page instead of
   four columns side by side, and each shows five cases with a Show all. Nobody
   ever faces the full list unless they ask for it. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const must=(s,a,b,w)=>{if(!s.includes(a))throw new Error('MISSING '+w);return s.split(a).join(b)};
const LIMIT=5;

const OLDCOL=`  const col=v=>{
    const cls=v==="admitted"?"ad":v==="unrefuted"?"un":v==="contested"?"co":"an";
    const src=state.section==="all"?DATA:DATA.filter(d=>d.section===state.section);
    const groups=["high","medium","low"].map(s=>{
      const g=src.filter(d=>d.verdict===v&&d.severity===s).sort((a,b)=>((b.featured?2:isStrong(b)?1:0)-(a.featured?2:isStrong(a)?1:0)));
      if(!g.length)return "";
      return \`<div class="vgroup">\`+
        g.map(d=>\`<button class="vt \${state.sel===d.id?"sel":""}\${visible.has(d.id)?"":" dimmed"}" data-id="\${d.id}">
          <h5>\${esc(d.title)}</h5>
          <span class="m">\${d.avoid?'<span class="star avd">⚠ do not use</span>':d.featured?'<span class="star">★ strongest evidence</span>':isStrong(d)?'<span class="star s2">☆ strong evidence</span>':""}\${read.has(d.id)?'<span class="rd">✓ read</span>':""}</span>
        </button>\`).join("")+\`</div>\`;
    }).join("");
    const cnt=src.filter(d=>d.verdict===v).length;
    return \`<div class="vcol \${cls}"><header><span class="n">\${cnt}</span><span class="t">\${VLABEL[v]}</span><div class="d">\${VDESC[v]}</div></header>\${groups}</div>\`;
  };`;

const NEWCOL=`  const col=v=>{
    const cls=v==="admitted"?"ad":v==="unrefuted"?"un":v==="contested"?"co":"an";
    const src=state.section==="all"?DATA:DATA.filter(d=>d.section===state.section);
    /* one ordered list per verdict: most serious first, strongest evidence at the top of each */
    const all=["high","medium","low"].flatMap(s=>
      src.filter(d=>d.verdict===v&&d.severity===s)
         .sort((a,b)=>((b.featured?2:isStrong(b)?1:0)-(a.featured?2:isStrong(a)?1:0))));
    if(!all.length)return "";
    /* a filter or a search means the reader has already narrowed it — show everything */
    const open=state.open&&state.open[v], narrowed=!!(state.q||state.verdict||state.severity);
    const shown=(open||narrowed)?all:all.slice(0,${LIMIT});
    const rows=shown.map(d=>\`<button class="vt \${state.sel===d.id?"sel":""}\${visible.has(d.id)?"":" dimmed"}" data-id="\${d.id}">
          <h5>\${esc(d.title)}</h5>
          <span class="m">\${d.avoid?'<span class="star avd">⚠ do not use</span>':d.featured?'<span class="star">★ strongest evidence</span>':isStrong(d)?'<span class="star s2">☆ strong evidence</span>':""}\${read.has(d.id)?'<span class="rd">✓ read</span>':""}</span>
        </button>\`).join("");
    const more=(!narrowed&&all.length>${LIMIT})
      ? \`<button class="showall" data-v="\${v}">\${open?"Show fewer &uarr;":"Show all "+all.length+" &rarr;"}</button>\` : "";
    return \`<div class="vcol \${cls}"><header><span class="n">\${all.length}</span><span class="t">\${VLABEL[v]}</span><div class="d">\${VDESC[v]}</div></header><div class="vgroup">\${rows}</div>\${more}</div>\`;
  };`;

/* stacked, not four columns */
const OLDWALL=`<div class="vwall">`;
const NEWWALL=`<div class="vwall vstack">`;

const ANCHOR=`  .vcol header .d{font-size:.74rem;color:var(--muted);margin-top:4px}`;
const ADD=ANCHOR+`
  /* Option B: the four bands run down the page, five cases each */
  .vwall.vstack{display:block;max-width:900px}
  .vwall.vstack .vcol{margin:0 0 16px}
  .vwall.vstack .vcol header{padding:16px 18px 14px}
  .vwall.vstack .vcol header .n{font-size:2.1rem}
  .vwall.vstack .vcol header .t{font-size:.8rem;letter-spacing:.12em}
  .vwall.vstack .vcol header .d{font-size:.86rem;margin-top:6px;max-width:70ch;line-height:1.55}
  .vwall.vstack .vt{padding:11px 18px 11px 15px}
  .vwall.vstack .vt h5{font-size:.99rem}
  .showall{display:block;width:100%;text-align:left;background:none;border:0;border-top:1px solid var(--line);
    padding:11px 18px;cursor:pointer;color:var(--gold);font-family:inherit;font-size:.83rem;font-weight:600;letter-spacing:.02em}
  .showall:hover{background:color-mix(in srgb,var(--gold) 8%,transparent)}`;

const OLDBIND=`  document.querySelectorAll(".vt").forEach(c=>{
    c.addEventListener("mouseenter",()=>{state.sel=c.dataset.id;renderPreview();});
    c.addEventListener("click",()=>openCase(c.dataset.id));
  });
  const cf=$("#clearf");`;
const NEWBIND=`  document.querySelectorAll(".vt").forEach(c=>{
    c.addEventListener("mouseenter",()=>{state.sel=c.dataset.id;renderPreview();});
    c.addEventListener("click",()=>openCase(c.dataset.id));
  });
  document.querySelectorAll(".showall").forEach(b=>b.addEventListener("click",()=>{
    state.open=state.open||{}; state.open[b.dataset.v]=!state.open[b.dataset.v]; renderOverview();
  }));
  const cf=$("#clearf");`;

for(const f of ['study.html','islam.html']){
  let s=fs.readFileSync(P(f),'utf8');
  s=must(s,OLDCOL,NEWCOL,f+' col');
  s=must(s,OLDWALL,NEWWALL,f+' wall');
  s=must(s,ANCHOR,ADD,f+' css');
  s=must(s,OLDBIND,NEWBIND,f+' bind');
  fs.writeFileSync(P(f),s);
  console.log('patched '+f);
}
