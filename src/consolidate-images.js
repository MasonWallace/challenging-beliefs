/* The image agents split their work into part files and only some were merged
   back. Rebuild images2-<slug>.json from every part, minus anything already
   live in images-<slug>.json or the section's IMGMAP. */
const fs=require('fs'),P=f=>__dirname+'/'+f, PARTS='/tmp/imgparts/';
const SH={mormon:'study.html',islam:'islam.html',jw:'make-jw.js',bhi:'make-bhi.js',messiah:'make-messiah.js',god:'make-god.js'};
const RE={mormon:/const IMGMAP\s*=\s*\{/,islam:/const IMGMAP\s*=\s*\{/,jw:/\bIMGMAP\s*:\s*\{/,bhi:/\bIMGMAP\s*:\s*\{/,messiah:/\bIMGMAP\s*:\s*\{/,god:/\bIMGMAP\s*:\s*\{/};
const key=x=>String(x.file||x.url||'').trim();
function imgmap(slug){
  const s=fs.readFileSync(P(SH[slug]),'utf8'); const i=s.search(RE[slug]);
  let j=s.indexOf('{',i),d=0,q=null;
  for(;j<s.length;j++){const c=s[j];
    if(q){if(c==='\\'){j++;continue}if(c===q)q=null;continue}
    if(c==='"'||c==="'"||c==='`'){q=c;continue}
    if(c==='{')d++;else if(c==='}'&&--d===0)return Function('return '+s.slice(s.indexOf('{',i),j+1))();}
  return {};
}
for(const slug of Object.keys(SH)){
  const parts=fs.readdirSync(PARTS).filter(f=>new RegExp('^'+slug+'-[A-Z]\\.json$').test(f));
  if(!parts.length){console.log(slug.padEnd(8)+'no parts');continue}
  const M=imgmap(slug);
  const live=fs.existsSync(P('images-'+slug+'.json'))?JSON.parse(fs.readFileSync(P('images-'+slug+'.json'),'utf8')):{};
  /* everything already on the page, per case */
  const seen={};
  for(const [id,arr] of Object.entries(live)) seen[id]=new Set(arr.map(key));
  for(const [id,v] of Object.entries(M)){ (seen[id]=seen[id]||new Set()); 
    const m=decodeURIComponent(String(v.src||'')).split('FilePath/')[1]; if(m)seen[id].add(m.split('?')[0]); }
  const hasThumb=id=>!!M[id]||(live[id]||[]).some(x=>x.where==='list');
  const out={}; let added=0,thumbs=0;
  for(const pf of parts.sort()){
    const p=JSON.parse(fs.readFileSync(PARTS+pf,'utf8'));
    for(const [id,arr] of Object.entries(p)){
      if(!Array.isArray(arr))continue;
      for(const im of arr){
        const k=key(im); if(!k)continue;
        seen[id]=seen[id]||new Set();
        if(seen[id].has(k))continue;               /* already live */
        const isList=im.where==='list';
        if(isList){ if(hasThumb(id)||(out[id]||[]).some(x=>x.where==='list'))continue; thumbs++; }
        seen[id].add(k);
        (out[id]=out[id]||[]).push(im); added++;
      }
    }
  }
  fs.writeFileSync(P('images2-'+slug+'.json'),JSON.stringify(out,null,1));
  console.log(slug.padEnd(8)+parts.length+' parts → '+Object.keys(out).length+' cases, '+added+' new images ('+thumbs+' thumbnails)');
}
