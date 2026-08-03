/* Emit a real, indexable HTML page per case. The app is hash-routed, so Google
   currently sees six pages instead of 318. Each page here stands on its own —
   full content, its own title and description — and links into the study tool. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const BASE=require('./site-url.js');           // one constant; swap when a domain lands
const OUT=P('prerendered');
const ANALYTICS=fs.existsSync(P('analytics-snippet.html'))?fs.readFileSync(P('analytics-snippet.html'),'utf8').trim():'';

const SECTIONS=[
 {key:'mormon', dir:'mormonism/',        built:'index.html',          name:'Mormonism'},
 {key:'islam',  dir:'islam/',            built:'islam-built.html',    name:'Islam'},
 {key:'jw',     dir:'jw/',               built:'jw-built.html',       name:"Jehovah's Witnesses"},
 {key:'bhi',    dir:'hebrew-israelites/',built:'bhi-built.html',      name:'Hebrew Israelites'},
 {key:'messiah',dir:'messiah/',          built:'messiah-built.html',  name:'The Messiah Case'},
 {key:'god',    dir:'god/',              built:'god-built.html',      name:'The Case for God'}];

const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const strip=s=>String(s==null?'':s).replace(/<[^>]+>/g,'');
const rich=s=>esc(s).replace(/&lt;(\/?)(b|i)&gt;/g,'<$1$2>');

/* pull a const out of a built page */
function grab(src,name,open,close){
  const i=src.search(new RegExp('const '+name+'\\s*=\\s*\\'+open));
  if(i<0)return null;
  let j=src.indexOf(open,i),d=0,q=null;
  for(;j<src.length;j++){const c=src[j];
    if(q){if(c==='\\'){j++;continue}if(c===q)q=null;continue}
    if(c==='"'||c==="'"||c==='`'){q=c;continue}
    if(c===open)d++;else if(c===close&&--d===0){
      try{return Function('return '+src.slice(src.indexOf(open,i),j+1))()}catch(e){return null}}}
  return null;
}

const CSS=`:root{--bg:#0f1116;--panel:#161a21;--panel2:#12151b;--line:#232833;--line2:#2b313d;--ink:#e7e9ec;--muted:#98a0ac;--dim:#565e6b;--gold:#82b1d8;--red:#e0736a;--amber:#cf9a45;--green:#7fb08d;--purp:#b394e0;--teal:#6cb6ad;--serif:'Iowan Old Style',Palatino,Georgia,serif;--sans:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
@media(prefers-color-scheme:light){:root{--bg:#f3f4f6;--panel:#fff;--panel2:#f7f8fa;--line:#dfe2e7;--line2:#cfd4db;--ink:#1b1e23;--muted:#5c6470;--dim:#9aa1ab;--gold:#2f6b9e;--red:#b03a31;--amber:#8a5f0e;--green:#3e7455;--purp:#6b4fa1;--teal:#26706a}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.75}
.wrap{max-width:760px;margin:0 auto;padding:30px 20px 70px}
a{color:var(--gold)}
.crumb{font-size:.8rem;color:var(--muted);margin-bottom:14px}
h1{font-family:var(--serif);font-size:2rem;line-height:1.22;margin:0 0 12px;font-weight:600}
.badge{display:inline-block;font-size:.66rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border-radius:20px;padding:3px 11px;margin-bottom:14px}
.b-admitted{color:var(--purp);background:color-mix(in srgb,var(--purp) 15%,transparent)}
.b-unrefuted{color:var(--red);background:color-mix(in srgb,var(--red) 15%,transparent)}
.b-contested{color:var(--amber);background:color-mix(in srgb,var(--amber) 15%,transparent)}
.b-answered{color:var(--muted);background:color-mix(in srgb,var(--muted) 14%,transparent)}
.vmean{font-size:.9rem;color:var(--muted);margin:0 0 22px}
.blk{padding:13px 16px;border-radius:10px;border:1px solid var(--line);border-left:3px solid var(--line2);background:var(--panel2);margin:0 0 12px}
.blk h2{font-size:.86rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin:0 0 8px;line-height:1.35}
.blk p{margin:0 0 9px}.blk p:last-child{margin:0}
.h-red{border-left-color:var(--red)}.h-red h2{color:var(--red)}
.h-gold{border-left-color:var(--gold)}.h-gold h2{color:var(--gold)}
.h-purp{border-left-color:var(--purp)}.h-purp h2{color:var(--purp)}
.h-amber{border-left-color:var(--amber)}.h-amber h2{color:var(--amber)}
.h-teal{border-left-color:var(--teal)}.h-teal h2{color:var(--teal)}
.h-green{border-left-color:var(--green);background:color-mix(in srgb,var(--green) 10%,var(--panel2))}.h-green h2{color:var(--green)}
.lead{font-family:var(--serif);font-size:1.08rem;font-weight:600;margin:0 0 10px;padding-bottom:9px;border-bottom:1px solid var(--line2)}
h3{font-size:.86rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink);margin:26px 0 10px}
figure{margin:16px 0}figure img{width:100%;height:auto;border-radius:9px;border:1px solid var(--line2)}
figcaption{font-size:.76rem;color:var(--muted);margin-top:6px}
ul{padding-left:18px}li{margin:0 0 7px;font-size:.92rem}
.cta{display:block;margin:26px 0;padding:14px 18px;border:1px solid var(--gold);border-radius:10px;text-align:center;font-weight:600;text-decoration:none}
.rel a{display:block;padding:8px 0;border-top:1px solid var(--line);font-size:.93rem;text-decoration:none}
footer{margin-top:36px;padding-top:18px;border-top:1px solid var(--line);font-size:.8rem;color:var(--dim)}`;

let total=0; const urls=[];
for(const S of SECTIONS){
  const src=fs.readFileSync(P(S.built),'utf8');
  const DATA=grab(src,'DATA','[',']')||[];
  const IMGMAP=grab(src,'IMGMAP','{','}')||{};
  const IMGS=grab(src,'IMGS','{','}')||{};
  const VLABEL=grab(src,'VLABEL','{','}')||{};
  const VDESC=grab(src,'VDESC','{','}')||{};
  const RELATED=grab(src,'RELATED','{','}')||{};
  const byId={};DATA.forEach(d=>byId[d.id]=d);

  for(const d of DATA){
    const url=BASE+S.dir+d.id+'/';
    const first=(d.plain&&d.plain[0])?strip(d.plain[0].d):strip(d.claim);
    /* two sentences reads better in a result snippet than one short one */
    const sents=first.split(/(?<=[.!?])\s+/);
    let desc=sents[0]||'';
    for(let i=1;i<sents.length&&(desc+' '+sents[i]).length<=158;i++)desc+=' '+sents[i];
    if(desc.length<60&&d.rationaleLead)desc=(desc+' '+strip(d.rationaleLead));
    if(desc.length>158)desc=desc.slice(0,155).replace(/\s+\S*$/,'')+'…';
    const depthFix=u=>String(u||'').replace(/^\.\.\/img\//,'../../img/');
    const absImg=u=>String(u||'').replace(/^(\.\.\/)+img\//, BASE+'img/');
    const img=IMGMAP[d.id]?absImg(IMGMAP[d.id].src):'';
    const HUE=['h-amber','h-gold','h-red','h-purp','h-teal','h-teal'];
    const blocks=(d.plain||[]).map((b,i)=>
      `<div class="blk ${b.say?'h-green':HUE[i%HUE.length]}"><h2>${esc(b.t)}</h2>`+
      strip(b.d).split(/(?<=[.!?])\s+/).reduce((a,s,j)=>{const k=Math.floor(j/2);a[k]=(a[k]||'')+' '+s;return a},[])
        .map(p=>`<p>${rich(p.trim())}</p>`).join('')+`</div>`).join('');
    const figs=(IMGS[d.id]||[]).slice(0,3).map(x=>
      `<figure><img src="${esc(depthFix(x.src))}" alt="${esc(x.cap)}" loading="lazy"><figcaption>${esc(x.cap)}</figcaption></figure>`).join('');
    const rel=(RELATED[d.id]||[]).filter(x=>byId[x]).slice(0,5)
      .map(x=>`<a href="${BASE}${S.dir}${x}/">${esc(byId[x].title)}</a>`).join('');
    const sources=(d.sources||[]).slice(0,12).map(s=>
      `<li>${s.url?`<a href="${esc(s.url)}" rel="nofollow noopener" target="_blank">${esc(s.name)}</a>`:esc(s.name)}</li>`).join('');

    const html=`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(d.title)} — ${esc(S.name)} | Challenging Beliefs</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(d.title)}">
<meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}">
${img?`<meta property="og:image" content="${esc(img)}">`:''}
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"Article",
 headline:d.title,description:desc,mainEntityOfPage:url,image:img||undefined,
 isPartOf:{"@type":"WebSite",name:"Challenging Beliefs",url:BASE}})}</script>
<style>${CSS}</style>${ANALYTICS}</head><body><div class="wrap">
<div class="crumb"><a href="${BASE}">Challenging Beliefs</a> › <a href="${BASE}${S.dir}">${esc(S.name)}</a></div>
<h1>${esc(d.title)}</h1>
<span class="badge b-${esc(d.verdict)}">${esc(VLABEL[d.verdict]||d.verdict)}</span>
<p class="vmean">${esc(VDESC[d.verdict]||'')}</p>
${blocks}${figs}
${d.response?`<h3>How they answer this — at its strongest</h3><div class="blk h-purp">${d.responseLead?`<p class="lead">${rich(strip(d.responseLead))}</p>`:''}${strip(d.response).split(/\n\n+/).map(p=>`<p>${rich(p)}</p>`).join('')}</div>`:''}
${d.rationale?`<h3>The verdict</h3><div class="blk h-teal">${d.rationaleLead?`<p class="lead">${rich(strip(d.rationaleLead))}</p>`:''}${strip(d.rationale).split(/\n\n+/).map(p=>`<p>${rich(p)}</p>`).join('')}</div>`:''}
<a class="cta" href="${BASE}${S.dir}#case/${d.id}">Open this case in the full study tool →</a>
${sources?`<h3>Sources</h3><ul>${sources}</ul>`:''}
${rel?`<h3>Related cases</h3><div class="rel">${rel}</div>`:''}
<footer>Part of <a href="${BASE}">Challenging Beliefs</a> — ${DATA.length} documented cases on ${esc(S.name)}, examined against the Bible.</footer>
</div></body></html>`;

    const dir=OUT+'/'+S.dir+d.id;
    fs.mkdirSync(dir,{recursive:true});
    fs.writeFileSync(dir+'/index.html',html);
    urls.push(url); total++;
  }
  console.log(S.key.padEnd(8)+DATA.length+' pages');
}

/* section + top-level URLs belong in the sitemap too */
const extra=[BASE,BASE+'about.html',BASE+'parallels.html',...SECTIONS.map(s=>BASE+s.dir)];
const all=[...extra,...urls];
fs.writeFileSync(OUT+'/sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`+
all.map(u=>`  <url><loc>${u}</loc></url>`).join('\n')+`\n</urlset>\n`);
fs.writeFileSync(OUT+'/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${BASE}sitemap.xml\n`);
console.log('\n'+total+' case pages + '+extra.length+' section pages = '+all.length+' URLs in sitemap.xml');
