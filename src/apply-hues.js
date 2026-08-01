/* Colour is assigned per case, not per class, so two boxes in a row can never
   share a hue — including two blocks of the same kind ("The dating problem"
   followed by "Why that is a problem here", both of which are gaps).
   A block whose colour carries meaning keeps its hue; only repeats move. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const must=(s,a,b,w)=>{if(!s.includes(a))throw new Error('MISSING '+w);return s.split(a).join(b)};

/* --- 1. two-pass hue assignment in the renderer --- */
const OLDHEAD=`  let alt=0;
  return (d.plain||[]).map(b=>{`;
const NEWHEAD=`  const KINDOF=b=>{
    if(b.say)return "k-say";
    const t=b.t.toLowerCase();
    return KINDRE(t);
  };
  const SEMHUE={"k-claim":"red","k-text":"gold","k-def":"purp","k-gap":"amber","k-strength":"teal","k-say":"green","k-help":"slate"};
  const POOL=["gold","teal","amber","purp","red","slate"];
  const blocks=(d.plain||[]);
  const kinds=blocks.map(KINDOF);
  /* hues already spoken for by blocks whose colour means something */
  const claimed=new Set(kinds.filter(k=>k!=="k-plain").map(k=>SEMHUE[k]));
  let prevHue=null;
  const hues=kinds.map(k=>{
    let h=SEMHUE[k]||"slate";
    const free=()=>POOL.find(x=>x!==prevHue&&!claimed.has(x))||POOL.find(x=>x!==prevHue)||h;
    if(k==="k-plain"){ h=free(); claimed.add(h); }
    else if(h===prevHue&&k!=="k-say"){ h=free(); }
    prevHue=h; return h;
  });
  return blocks.map((b,bi)=>{`;

const OLDTAIL=`    const t=b.t.toLowerCase();
    const kind=b.say?"k-say"`;
const NEWTAIL=`    const kind=kinds[bi], hue="h-"+hues[bi];
    const _unusedKind=b.say?"k-say"`;

const OLDCLS=`    const cls=kind==="k-plain"?"k-plain a"+(alt++%3):kind;
    return \`<div class="pblk \${cls}\${b.say?" say":""}\${big}"><div class="plab \${cls}">\${esc(b.t)}</div>\${ps.join("")}</div>\`;`;
const NEWCLS=`    return \`<div class="pblk \${kind} \${hue}\${b.say?" say":""}\${big}"><div class="plab \${hue}">\${esc(b.t)}</div>\${ps.join("")}</div>\`;`;

/* --- 2. colour by hue class, not by kind --- */
const OLDCSS=`  .pblk.k-claim   {background:color-mix(in srgb,var(--red) 7%,var(--panel2));   border-left-color:var(--red)}
  .pblk.k-text    {background:color-mix(in srgb,var(--gold) 7%,var(--panel2));  border-left-color:var(--gold)}
  .pblk.k-def     {background:color-mix(in srgb,var(--purp) 8%,var(--panel2));  border-left-color:var(--purp)}
  .pblk.k-gap     {background:color-mix(in srgb,var(--amber) 8%,var(--panel2)); border-left-color:var(--amber)}
  .pblk.k-strength{background:color-mix(in srgb,var(--teal) 8%,var(--panel2));  border-left-color:var(--teal)}
  .pblk.k-help    {background:var(--panel);                                     border-left-color:var(--muted)}
  .pblk.k-plain   {background:var(--panel2);                                    border-left-color:var(--line2)}

  .pblk .plab.k-claim{color:var(--red)}
  .pblk .plab.k-text{color:var(--gold)}
  .pblk .plab.k-def{color:var(--purp)}
  .pblk .plab.k-gap{color:var(--amber)}
  .pblk .plab.k-strength{color:var(--teal)}
  .pblk .plab.k-help{color:var(--ink)}
  .pblk .plab.k-plain{color:var(--muted)}
  .pblk .plab.k-say{color:var(--green)}

  /* unnamed blocks rotate, so two in a row never read as one */
  .pblk.k-plain.a0{background:color-mix(in srgb,var(--gold) 5%,var(--panel2));  border-left-color:color-mix(in srgb,var(--gold) 65%,var(--line2))}
  .pblk.k-plain.a1{background:color-mix(in srgb,var(--teal) 5%,var(--panel2));  border-left-color:color-mix(in srgb,var(--teal) 65%,var(--line2))}
  .pblk.k-plain.a2{background:color-mix(in srgb,var(--amber) 5%,var(--panel2)); border-left-color:color-mix(in srgb,var(--amber) 65%,var(--line2))}
  .pblk .plab.k-plain.a0{color:var(--gold)}
  .pblk .plab.k-plain.a1{color:var(--teal)}
  .pblk .plab.k-plain.a2{color:var(--amber)}`;
const NEWCSS=`  .pblk.h-red  {background:color-mix(in srgb,var(--red) 8%,var(--panel2));   border-left-color:var(--red)}
  .pblk.h-gold {background:color-mix(in srgb,var(--gold) 8%,var(--panel2));  border-left-color:var(--gold)}
  .pblk.h-purp {background:color-mix(in srgb,var(--purp) 9%,var(--panel2));  border-left-color:var(--purp)}
  .pblk.h-amber{background:color-mix(in srgb,var(--amber) 9%,var(--panel2)); border-left-color:var(--amber)}
  .pblk.h-teal {background:color-mix(in srgb,var(--teal) 9%,var(--panel2));  border-left-color:var(--teal)}
  .pblk.h-green{background:color-mix(in srgb,var(--green) 10%,var(--panel2));border-left-color:var(--green)}
  .pblk.h-slate{background:var(--panel);                                     border-left-color:var(--muted)}

  .pblk .plab.h-red{color:var(--red)}
  .pblk .plab.h-gold{color:var(--gold)}
  .pblk .plab.h-purp{color:var(--purp)}
  .pblk .plab.h-amber{color:var(--amber)}
  .pblk .plab.h-teal{color:var(--teal)}
  .pblk .plab.h-green{color:var(--green)}
  .pblk .plab.h-slate{color:var(--ink)}`;

/* --- 3. "What to say" becomes a solid box like the rest --- */
const OLDSAY=`  .pblk.say{background:linear-gradient(90deg,color-mix(in srgb,var(--green) 11%,transparent),transparent 72%);
    border-left:3px solid var(--green);border-radius:0 10px 10px 0;padding:13px 17px;margin-top:18px}
  .pblk.say .plab{color:var(--green)}`;
const NEWSAY=`  .pblk.say{background:color-mix(in srgb,var(--green) 10%,var(--panel2));
    border-left:3px solid var(--green);border-radius:10px;padding:13px 17px;margin-top:18px}
  .pblk.say .plab{color:var(--green)}`;

/* --- 4. every section heading on the case page, not just the plain blocks --- */
const OLDDLAB=`  .dlab{font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin:26px 0 10px}`;
const NEWDLAB=`  .dlab{font-size:.92rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--ink);margin:28px 0 11px;line-height:1.35}`;

for(const f of ['study.html','islam.html']){
  let s=fs.readFileSync(P(f),'utf8');
  /* lift the classifier out into a named function so both passes can use it */
  const m=s.match(/    const kind=b\.say\?"k-say"\n([\s\S]*?)\n      :"k-plain";/);
  if(!m)throw new Error(f+': classifier not found');
  const body=m[1].replace(/^\s+:/gm,'      :');
  s=s.replace(m[0],'');
  s=must(s,OLDHEAD,'  const KINDRE=t=>(true\n'+body+'\n      :"k-plain");\n'+NEWHEAD,f+' head');
  s=must(s,OLDCLS,NEWCLS,f+' cls');
  s=must(s,OLDCSS,NEWCSS,f+' hue css');
  s=must(s,OLDSAY,NEWSAY,f+' say box');
  s=must(s,OLDDLAB,NEWDLAB,f+' dlab');
  fs.writeFileSync(P(f),s);
  console.log('patched '+f);
}
