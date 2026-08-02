/* Unrefuted leads · the list fills the column · striking cases get bigger type ·
   thumbnails beside each claim (mockup A) · plainer tooltip wording. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const must=(s,a,b,w)=>{if(!s.includes(a))throw new Error('MISSING '+w);return s.split(a).join(b)};

/* 1. Unrefuted first — the strongest material, not the institutional cases */
const OLDORD=`<div class="vwall vstack">\${col("admitted")}\${col("unrefuted")}\${col("contested")}\${col("answered")}</div>`;
const NEWORD=`<div class="vwall vstack">\${col("unrefuted")}\${col("admitted")}\${col("contested")}\${col("answered")}</div>`;

/* 2. fill the column right up to the preview rail */
const OLDW=`  .vwall.vstack{display:block;max-width:1180px}`;
const NEWW=`  .vwall.vstack{display:block;max-width:none}`;

/* 3+4. thumbnail beside each claim, and bigger type on the striking ones */
const OLDROW=`    const rows=shown.map(d=>\`<button class="vt \${state.sel===d.id?"sel":""}\${visible.has(d.id)?"":" dimmed"}" data-id="\${d.id}">
          <h5>\${esc(d.title)}</h5>
          <span class="m">\${d.avoid?'<span class="star avd">⚠ do not use</span>':d.featured?'<span class="star">★ strongest evidence</span>':isStrong(d)?'<span class="star s2">☆ strong evidence</span>':""}\${read.has(d.id)?'<span class="rd">✓ read</span>':""}</span>
        </button>\`).join("");`;
const NEWROW=`    const rows=shown.map(d=>{
      const im=IMGMAP[d.id];
      const thumb=im?\`<img class="vth" src="\${im.src.replace("width=520","width=160")}" alt="" loading="lazy">\`
        :\`<span class="vth ph">\${esc((d.title.match(/[A-Za-z]/)||["·"])[0])}</span>\`;
      return \`<button class="vt \${state.sel===d.id?"sel":""}\${visible.has(d.id)?"":" dimmed"}\${WOW.has(d.id)?" wow":""}" data-id="\${d.id}">
          \${thumb}<span class="vtx"><span class="h5">\${esc(d.title)}</span>
          <span class="m">\${d.avoid?'<span class="star avd">⚠ do not use</span>':d.featured?'<span class="star">★ strongest evidence</span>':isStrong(d)?'<span class="star s2">☆ strong evidence</span>':""}\${read.has(d.id)?'<span class="rd">✓ read</span>':""}</span></span>
        </button>\`;}).join("");`;

const ANCHOR=`  .showall{display:block;width:100%;text-align:left;background:none;border:0;border-top:1px solid var(--line);`;
const ADD=`  /* a picture beside every claim; a letter block where no image exists yet */
  .vwall.vstack .vt{display:flex;gap:14px;align-items:center;padding:10px 18px 10px 15px}
  .vth{width:62px;height:46px;flex:0 0 62px;border-radius:7px;object-fit:cover;border:1px solid var(--line2);background:var(--panel)}
  .vth.ph{display:grid;place-items:center;color:var(--dim);font-family:var(--serif);font-size:1.15rem}
  .vtx{display:block;min-width:0;flex:1}
  .vwall.vstack .vt .h5{font-family:var(--serif);font-weight:500;font-size:1.02rem;line-height:1.35;display:block}
  /* the genuinely striking ones carry more weight on the page */
  .vwall.vstack .vt.wow .h5{font-size:1.32rem;line-height:1.28}
  .vwall.vstack .vt.wow .vth{width:78px;height:58px;flex-basis:78px}
  @media (max-width:620px){.vwall.vstack .vt.wow .h5{font-size:1.12rem}}
`+ANCHOR;

/* 5. the tooltip the owner quoted */
const OLDTIP=`contested:"A serious rebuttal exists. Read both sides; the dispute is genuine."`;
const NEWTIP=`contested:"Scholars argue this one both ways, and both sides have a real case. Read both before you use it."`;
const OLDIMP=`  impact:"How serious the claim is, if true: MAJOR strikes at the foundation, MODERATE is significant, MINOR is a detail.",`;
const NEWIMP=`  impact:"If this claim is right, how much does it matter? MAJOR shakes the foundation of the faith. MODERATE matters but does not. MINOR is a detail worth knowing.",`;

for(const f of ['study.html','islam.html']){
  let s=fs.readFileSync(P(f),'utf8');
  s=must(s,OLDORD,NEWORD,f+' band order');
  s=must(s,OLDW,NEWW,f+' width');
  s=must(s,OLDROW,NEWROW,f+' row');
  s=must(s,ANCHOR,ADD,f+' thumb css');
  if(s.includes(OLDTIP))s=s.split(OLDTIP).join(NEWTIP);
  if(s.includes(OLDIMP))s=s.split(OLDIMP).join(NEWIMP);
  /* WOW is populated from wow-<slug>.json at build time; empty until then */
  if(!s.includes('const WOW='))
    s=s.replace('function renderOverview(){','const WOW=new Set(/*__WOW__*/[]);\nfunction renderOverview(){');
  fs.writeFileSync(P(f),s);
  console.log('patched '+f);
}
