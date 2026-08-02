/* Cases carry up to five images now, placed beside the part of the argument they
   serve. Kept small — a figure that supports the text, not a hero shot. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const must=(s,a,b,w)=>{if(!s.includes(a))throw new Error('MISSING '+w);return s.split(a).join(b)};

const HELPER=`const IMGS=/*__IMGS__*/{};
function figs(d,where){
  const a=(IMGS[d.id]||[]).filter(x=>x.where===where);
  if(!a.length)return "";
  return \`<div class="figrow\${a.length>1?" multi":""}">\`+a.map(x=>
    \`<figure class="cfig"><img src="\${x.src}" alt="\${esc(x.cap)}" loading="lazy">
      <button class="cimg-x" title="Expand" data-full="\${x.src.replace("width=520","width=1400")}" data-cap="\${esc(x.cap)}">⤢</button>
      <figcaption>\${esc(x.cap)}</figcaption></figure>\`).join("")+"</div>";
}
`;
const CSS=`  /* case figures: small, captioned, never a hero image */
  .figrow{display:flex;gap:12px;flex-wrap:wrap;margin:14px 0 6px}
  .cfig{position:relative;margin:0;flex:1 1 260px;max-width:340px}
  .figrow.multi .cfig{flex:1 1 210px;max-width:280px}
  .cfig img{width:100%;height:auto;border-radius:9px;border:1px solid var(--line2);display:block;background:var(--panel)}
  .cfig figcaption{font-size:.74rem;color:var(--muted);line-height:1.45;margin-top:6px}
  .cfig .cimg-x{position:absolute;top:7px;right:7px;background:rgba(0,0,0,.55);color:#fff;border:0;
    border-radius:6px;width:26px;height:26px;cursor:pointer;font-size:.8rem;line-height:1}
  @media (max-width:620px){.cfig,.figrow.multi .cfig{flex:1 1 100%;max-width:none}}
`;
for(const f of ['study.html','islam.html']){
  let s=fs.readFileSync(P(f),'utf8');
  if(!s.includes('const IMGS=')) s=must(s,'function plainHtml(d){',HELPER+'function plainHtml(d){',f+' helper');
  s=must(s,'  .figrow{',`  .figrow{`,f+' probe') // no-op guard
  if(!s.includes('.figrow{display:flex')) s=must(s,'  .donechip{display:inline-block',CSS+'  .donechip{display:inline-block',f+' css');
  fs.writeFileSync(P(f),s);
  console.log('helper+css → '+f);
}
